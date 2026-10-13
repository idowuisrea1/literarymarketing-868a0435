import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import { useRef } from "react";
import type { Group } from "three";

const GOLD = "#D4AF37";

function Book() {
  const g = useRef<Group>(null);
  useFrame((state, dt) => {
    if (!g.current) return;
    g.current.rotation.y += dt * 0.15;
    g.current.rotation.x += (state.pointer.y * 0.25 - g.current.rotation.x) * 0.05;
    g.current.rotation.z += (-state.pointer.x * 0.15 - g.current.rotation.z) * 0.05;
  });
  return (
    <group ref={g}>
      {/* covers */}
      <mesh position={[-1.05, 0, 0]} rotation={[0, 0.35, 0]}>
        <boxGeometry args={[2, 2.8, 0.06]} />
        <meshStandardMaterial color="#14121c" metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh position={[1.05, 0, 0]} rotation={[0, -0.35, 0]}>
        <boxGeometry args={[2, 2.8, 0.06]} />
        <meshStandardMaterial color="#14121c" metalness={0.4} roughness={0.5} />
      </mesh>
      {/* pages */}
      <mesh position={[-0.98, 0, 0.1]} rotation={[0, 0.3, 0]}>
        <boxGeometry args={[1.85, 2.6, 0.14]} />
        <meshStandardMaterial color="#F5F1E8" roughness={0.9} />
      </mesh>
      <mesh position={[0.98, 0, 0.1]} rotation={[0, -0.3, 0]}>
        <boxGeometry args={[1.85, 2.6, 0.14]} />
        <meshStandardMaterial color="#F5F1E8" roughness={0.9} />
      </mesh>
      {/* gold edging */}
      <mesh position={[0, -1.42, 0.05]}>
        <boxGeometry args={[3.9, 0.04, 0.2]} />
        <meshStandardMaterial color={GOLD} metalness={1} roughness={0.25} emissive={GOLD} emissiveIntensity={0.25} />
      </mesh>
      {/* quill */}
      <group position={[0.35, 1.2, 0.6]} rotation={[0.2, 0, -0.5]}>
        <mesh>
          <coneGeometry args={[0.28, 2.4, 6]} />
          <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.3} emissive={GOLD} emissiveIntensity={0.35} />
        </mesh>
        <mesh position={[0, -1.35, 0]}>
          <cylinderGeometry args={[0.02, 0.05, 0.4, 6]} />
          <meshStandardMaterial color="#111" metalness={1} roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
}

export default function Book3D() {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0.3, 6.5], fov: 45 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[3, 3, 4]} intensity={40} color={GOLD} />
      <pointLight position={[-4, -2, 3]} intensity={25} color="#00F2FE" />
      <Float speed={1.6} rotationIntensity={0.3} floatIntensity={0.8}>
        <Book />
      </Float>
      <Sparkles count={60} scale={[7, 5, 3]} size={2.5} speed={0.35} color={GOLD} />
    </Canvas>
  );
}
