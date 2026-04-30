"use client";
import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PointMaterial, Points, Torus, Sphere, Box, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function ScanningBeam() {
  const beamRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (beamRef.current) {
      // Moves up and down to simulate scanning
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
    if (coreRef.current) {
      coreRef.current.rotation.y += 0.005;
    }
    if (shieldRef.current) {
      shieldRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.05);
    }
  });

  return (
    <group ref={coreRef}>
      {/* Central Lock Structure */}
      <Box args={[0.6, 0.8, 0.4]}>
        <meshStandardMaterial color="#4f46e5" emissive="#6366f1" emissiveIntensity={5} />
      </Box>
      <Torus args={[0.35, 0.1, 16, 32]} position={[0, 0.4, 0]}>
        <meshStandardMaterial color="#818cf8" emissive="#818cf8" emissiveIntensity={4} />
      </Torus>
      
      {/* Inner Glowing "V" symbol for Vote */}
      <mesh position={[0, 0, 0.25]}>
        <boxGeometry args={[0.1, 0.3, 0.05]} />
        <meshBasicMaterial color="#fbbf24" toneMapped={false} />
      </mesh>

      {/* Pulsing Energy Shield */}
      <Sphere ref={shieldRef} args={[1.5, 32, 32]}>
        <meshBasicMaterial color="#6366f1" transparent opacity={0.03} wireframe />
      </Sphere>

      {/* Dynamic Data Rings */}
      <Torus args={[2.5, 0.02, 16, 100]} rotation={[Math.PI / 2.5, 0, 0]}>
        <meshBasicMaterial color="#6366f1" transparent opacity={0.2} />
      </Torus>
      <Torus args={[2.8, 0.01, 16, 100]} rotation={[-Math.PI / 3, 0, 0]}>
        <meshBasicMaterial color="#818cf8" transparent opacity={0.15} />
      </Torus>
    </group>
  );
}

function DNAFlow({ count = 150 }) {
  const points = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const angle = (i / count) * Math.PI * 12;
      const y = (i / count) * 12 - 6;
      const x = Math.cos(angle) * 1.8;
      const z = Math.sin(angle) * 1.8;
      return new THREE.Vector3(x, y, z);
    });
  }, [count]);

  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.015;
    }
  });

  return (
    <group ref={groupRef}>
      {points.map((pos, i) => (
        <Sphere key={i} position={pos} args={[0.05, 8, 8]}>
          <meshBasicMaterial 
            color={i % 2 === 0 ? "#6366f1" : "#10b981"} 
            transparent 
            opacity={0.7} 
          />
        </Sphere>
      ))}
    </group>
  );
}

function GlobalBeams() {
  const beams = useMemo(() => {
    return Array.from({ length: 8 }).map(() => ({
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0] as [number, number, number],
      speed: 0.5 + Math.random()
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

function StarField({ count = 3000 }) {
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 25;
    }
    return pos;
  }, [count]);

  return (
    <Points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <PointMaterial
        size={0.012}
        color="#818cf8"
        transparent
        opacity={0.5}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

export default function Hologram() {
  return (
    <div className="w-full h-[680px] relative">
      <Canvas camera={{ position: [0, 0, 9], fov: 45 }} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={3} color="#6366f1" />
        <pointLight position={[-10, -10, -10]} intensity={1.5} color="#10b981" />
        <spotLight position={[0, 10, 0]} intensity={2} angle={0.5} penumbra={1} color="#ffffff" />
        
        <Float speed={2.5} rotationIntensity={0.3} floatIntensity={0.3}>
          <SecureCore />
          <DNAFlow count={180} />
          <ScanningBeam />
          <GlobalBeams />
        </Float>
        
        <StarField />
      </Canvas>
      
      {/* Dynamic HUD Overlays */}
      <div className="absolute top-10 left-10 pointer-events-none">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-success">Core Integrity: 100%</span>
          </div>
          <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="w-full h-full bg-success/40 animate-[shimmer_2s_infinite]" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 right-10 text-right pointer-events-none">
        <div className="space-y-1">
           <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/70">Quantum Encryption active</span>
           <div className="flex justify-end gap-1.5 opacity-50">
             {[...Array(6)].map((_, i) => (
               <div key={i} className="w-1 h-4 bg-primary rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
             ))}
           </div>
        </div>
      </div>

      {/* Central Flare Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.08),transparent_70%)] pointer-events-none" />
    </div>
  );
}
