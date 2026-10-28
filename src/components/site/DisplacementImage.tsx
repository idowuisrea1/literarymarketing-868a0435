import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import { TextureLoader, SRGBColorSpace, Vector2, type ShaderMaterial } from "three";
import { useLoader } from "@react-three/fiber";

/**
 * Categories 28 + 5 — Image displacement / ripple shader.
 * A single full-canvas plane renders an existing image with a pointer-driven
 * ripple and crossfades to a second existing image on hover. This module is
 * lazy-loaded by the caller, which also provides the CSS fallback for touch,
 * reduced motion and missing WebGL.
 */

const RippleMaterial = shaderMaterial(
  {
    uTex1: null,
    uTex2: null,
    uProgress: 0,
    uPointer: new Vector2(0.5, 0.5),
    uStrength: 0,
    uTime: 0,
  },
  /* vertex */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  /* fragment */ `
    uniform sampler2D uTex1;
    uniform sampler2D uTex2;
    uniform float uProgress;
    uniform vec2 uPointer;
    uniform float uStrength;
    uniform float uTime;
    varying vec2 vUv;

    void main() {
      vec2 uv = vUv;
      float d = distance(uv, uPointer);
      float ripple = sin(d * 28.0 - uTime * 4.0) * exp(-d * 6.0) * uStrength;
      uv += normalize(uv - uPointer + 0.0001) * ripple * 0.035;

      // crossfade with a slight directional wipe
      float wipe = smoothstep(uProgress - 0.25, uProgress + 0.25, uv.x + ripple);
      vec4 a = texture2D(uTex1, uv);
      vec4 b = texture2D(uTex2, uv);
      gl_FragColor = mix(b, a, wipe);
    }
  `,
);

function RipplePlane({ src1, src2 }: { src1: string; src2: string }) {
  const [tex1, tex2] = useLoader(TextureLoader, [src1, src2]);
  useMemo(() => {
    tex1.colorSpace = SRGBColorSpace;
    tex2.colorSpace = SRGBColorSpace;
  }, [tex1, tex2]);

  const mat = useRef<ShaderMaterial>(null);
  const target = useRef({ progress: 0, strength: 0, pointer: new Vector2(0.5, 0.5) });
  const { viewport, gl } = useThree();

  useFrame((state, dt) => {
    const m = mat.current as unknown as {
      uProgress: number; uStrength: number; uTime: number; uPointer: Vector2;
    } | null;
    if (!m) return;
    const k = 1 - Math.exp(-6 * Math.min(dt, 0.05));
    m.uProgress += (target.current.progress - m.uProgress) * k;
    m.uStrength += (target.current.strength - m.uStrength) * k;
    m.uPointer.lerp(target.current.pointer, k);
    m.uTime = state.clock.elapsedTime;
  });

  const onPointerMove = (e: { uv?: Vector2 }) => {
    if (e.uv) target.current.pointer.copy(e.uv);
    target.current.strength = 1;
  };

  return (
    <mesh
      scale={[viewport.width, viewport.height, 1]}
      onPointerMove={onPointerMove}
      onPointerEnter={() => { target.current.progress = 1; target.current.strength = 1; }}
      onPointerLeave={() => { target.current.progress = 0; target.current.strength = 0; }}
    >
      <planeGeometry args={[1, 1]} />
      {/* @ts-expect-error drei shaderMaterial JSX intrinsic */}
      <rippleMaterial key={RippleMaterial.key} ref={mat} uTex1={tex1} uTex2={tex2} />
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
      aria-label={label}
      role="img"
    >
      <RipplePlane src1={src1} src2={src2} />
    </Canvas>
  );
}
