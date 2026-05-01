"use client";
import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Points, PointMaterial, Torus, Sphere, Box } from "@react-three/drei";
import * as THREE from "three";

function ScanningBeam() {
  const beamRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (beamRef.current) {
      beamRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 2;
    }
  });

  return (
    <mesh ref={beamRef} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[2.3, 2.35, 64]} />
      <meshBasicMaterial color="#6366f1" transparent opacity={0.6} side={THREE.DoubleSide} />
    </mesh>
  );
}

function SecureCore() {
  const coreRef = useRef<THREE.Group>(null);
  const shieldRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (coreRef.current) coreRef.current.rotation.y += 0.005;
    if (shieldRef.current) {
      shieldRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.05);
    }
  });

  return (
    <group ref={coreRef}>
      <Box args={[0.6, 0.8, 0.4]}>
        <meshStandardMaterial color="#4f46e5" emissive="#6366f1" emissiveIntensity={5} />
      </Box>
      <Torus args={[0.35, 0.1, 16, 32]} position={[0, 0.4, 0]}>
        <meshStandardMaterial color="#818cf8" emissive="#818cf8" emissiveIntensity={4} />
      </Torus>
      <mesh position={[0, 0, 0.25]}>
        <boxGeometry args={[0.1, 0.3, 0.05]} />
        <meshBasicMaterial color="#fbbf24" toneMapped={false} />
      </mesh>
      <Sphere ref={shieldRef} args={[1.5, 32, 32]}>
        <meshBasicMaterial color="#6366f1" transparent opacity={0.03} wireframe />
      </Sphere>
      <Torus args={[2.5, 0.02, 16, 100]} rotation={[Math.PI / 2.5, 0, 0]}>
        <meshBasicMaterial color="#6366f1" transparent opacity={0.2} />
      </Torus>
      <Torus args={[2.8, 0.01, 16, 100]} rotation={[-Math.PI / 3, 0, 0]}>
        <meshBasicMaterial color="#818cf8" transparent opacity={0.15} />
      </Torus>
    </group>
  );
}

// Optimized DNAFlow using InstancedMesh
function DNAFlow({ count = 200 }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const tempObject = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime * 0.5;
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 12 + time;
      const y = (i / count) * 12 - 6;
      const x = Math.cos(angle) * 1.8;
      const z = Math.sin(angle) * 1.8;
      
      tempObject.position.set(x, y, z);
      tempObject.updateMatrix();
      meshRef.current.setMatrixAt(i, tempObject.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    meshRef.current.rotation.y += 0.01;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.04, 8, 8]} />
      <meshBasicMaterial color="#6366f1" transparent opacity={0.6} />
    </instancedMesh>
  );
}

function GlobalBeams() {
  const beams = useMemo(() => {
    return Array.from({ length: 8 }).map(() => ({
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0] as [number, number, number],
    }));
  }, []);

  return (
    <group>
      {beams.map((beam, i) => (
        <mesh key={i} rotation={beam.rotation}>
          <cylinderGeometry args={[0.005, 0.005, 10, 8]} />
          <meshBasicMaterial color="#6366f1" transparent opacity={0.1} />
        </mesh>
      ))}
    </group>
  );
}

function StarField({ count = 2000 }) {
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    return pos;
  }, [count]);

  return (
    <Points positions={positions}>
      <PointMaterial
        size={0.015}
        color="#818cf8"
        transparent
        opacity={0.4}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

export default function Hologram() {
  return (
    <div className="w-full h-[680px] relative">
      <Canvas 
        camera={{ position: [0, 0, 9], fov: 45 }} 
        gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
        dpr={[1, 2]} // Optimize for high DPI screens
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={3} color="#6366f1" />
        <pointLight position={[-10, -10, -10]} intensity={1.5} color="#10b981" />
        
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
          <SecureCore />
          <DNAFlow count={200} />
          <ScanningBeam />
          <GlobalBeams />
        </Float>
        
        <StarField />
      </Canvas>
      
      {/* HUD Overlays */}
      <div className="absolute top-10 left-10 pointer-events-none">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-success">
            <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Core Integrity: 100%</span>
          </div>
          <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="w-full h-full bg-success/40" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 right-10 text-right pointer-events-none">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/70">Quantum Encryption active</span>
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.05),transparent_70%)] pointer-events-none" />
    </div>
  );
}
