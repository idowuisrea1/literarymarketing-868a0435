import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { ShaderMaterial, SRGBColorSpace, TextureLoader, Vector2 } from "three";

/**
 * Categories 28 + 5 — Image displacement / ripple shader.
 * A single full-canvas plane renders an existing image with a pointer-driven
 * ripple and crossfades to a second existing image on hover. This module is
 * lazy-loaded by the caller, which also provides the CSS fallback for touch,
 * reduced motion and missing WebGL.
 */

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAG = /* glsl */ `
  uniform sampler2D uTex1;
  uniform sampler2D uTex2;
  uniform float uProgress;
  uniform vec2 uPointer;
  uniform float uStrength;
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    vec2 toPtr = uv - uPointer;
    float d = length(toPtr);
    float ripple = sin(d * 28.0 - uTime * 4.0) * exp(-d * 6.0) * uStrength;
    uv += normalize(toPtr + 0.0001) * ripple * 0.035;

    // crossfade with a slight directional wipe
    float wipe = smoothstep(uProgress - 0.25, uProgress + 0.25, uv.x + ripple);
    vec4 a = texture2D(uTex1, uv);
    vec4 b = texture2D(uTex2, uv);
    gl_FragColor = mix(b, a, wipe);
  }
`;

function RipplePlane({ src1, src2 }: { src1: string; src2: string }) {
  const [tex1, tex2] = useLoader(TextureLoader, [src1, src2]);
  const { viewport } = useThree();
  const target = useRef({ progress: 0, strength: 0, pointer: new Vector2(0.5, 0.5) });

  const material = useMemo(() => {
    tex1.colorSpace = SRGBColorSpace;
    tex2.colorSpace = SRGBColorSpace;
    return new ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms: {
        uTex1: { value: tex1 },
        uTex2: { value: tex2 },
        uProgress: { value: 0 },
        uPointer: { value: new Vector2(0.5, 0.5) },
        uStrength: { value: 0 },
        uTime: { value: 0 },
      },
    });
  }, [tex1, tex2]);

  useEffect(() => () => material.dispose(), [material]);

  useFrame((state, dt) => {
    const k = 1 - Math.exp(-6 * Math.min(dt, 0.05));
    const u = material.uniforms;
    u["uProgress"]!.value += (target.current.progress - (u["uProgress"]!.value as number)) * k;
    u["uStrength"]!.value += (target.current.strength - (u["uStrength"]!.value as number)) * k;
    (u["uPointer"]!.value as Vector2).lerp(target.current.pointer, k);
    u["uTime"]!.value = state.clock.elapsedTime;
  });

  return (
    <mesh
      scale={[viewport.width, viewport.height, 1]}
      material={material}
      onPointerMove={(e) => {
        if (e.uv) target.current.pointer.copy(e.uv);
        target.current.strength = 1;
      }}
      onPointerEnter={() => {
        target.current.progress = 1;
        target.current.strength = 1;
      }}
      onPointerLeave={() => {
        target.current.progress = 0;
        target.current.strength = 0;
      }}
    >
      <planeGeometry args={[1, 1]} />
    </mesh>
  );
}

export default function DisplacementImage({ src1, src2, label }: { src1: string; src2: string; label: string }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      orthographic
      camera={{ position: [0, 0, 1], zoom: 1 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      style={{ position: "absolute", inset: 0 }}
      role="img"
      aria-label={label}
    >
      <RipplePlane src1={src1} src2={src2} />
    </Canvas>
  );
}
