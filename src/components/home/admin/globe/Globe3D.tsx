// Globe3D.tsx
import React, { useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { OrbitControls } from "@react-three/drei";

const Globe = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useLoader(TextureLoader, "/earth_texture.jpg");

  // Obracamy globus w pętli
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
  });

  return (
    <mesh ref={meshRef}>
      {/* Zwiększona sfera, aby wypełniała responsywnie kontener */}
      <sphereGeometry args={[5, 128, 128]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
};

export const Globe3D: React.FC = () => {
  return (
    // Kontener kwadratowy: szerokość = 100% rodzica, a wysokość wymuszona przez aspect-ratio: 1
    <div className="relative h-[600px] w-[600px]" style={{ aspectRatio: "1" }}>
      <Canvas
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "600px",
          height: "600px",
        }}
        camera={{ position: [0, 0, 10], fov: 70 }}
      >
        {/* Oświetlenie – podniesiona intensywność, by globus był dobrze widoczny */}
        <ambientLight intensity={1.2} />
        <hemisphereLight args={[0xffffff, 0x444444, 1.2]} />
        <directionalLight position={[5, 5, 5]} intensity={2.5} />
        <directionalLight position={[-5, -5, -5]} intensity={2} />
        <pointLight position={[0, 0, 10]} intensity={2.5} />
        <Globe />
        <OrbitControls enableZoom={false} makeDefault enablePan={false} />
      </Canvas>
    </div>
  );
};
