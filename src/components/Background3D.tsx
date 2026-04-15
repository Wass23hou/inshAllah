'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

function Galaxy() {
  const pointsRef = useRef<THREE.Points>(null);
  
  // Réduction à 15000 pour garantir 60fps constants même sur mobile
  const particlesCount = 15000;
  
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    const cols = new Float32Array(particlesCount * 3);
    
    // Couleurs du thème "Gold / Islamic"
    const colorInside = new THREE.Color('#fcd34d'); // Or brillant au centre
    const colorOutside = new THREE.Color('#b45309'); // Ambre sombre sur les bords
    
    for (let i = 0; i < particlesCount; i++) {
        // Logique de la spirale (3 bras)
        const radius = Math.random() * 25;
        const spinAngle = radius * 0.4; // Force de la spirale
        const branchAngle = ((i % 3) / 3) * Math.PI * 2; // 3 bras galactiques
        
        // Dispersion aléatoire pour donner du volume (plus dense au centre)
        const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 3;
        const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 2;
        const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 3;
        
        // Position X, Y, Z
        pos[i * 3 + 0] = Math.cos(branchAngle + spinAngle) * radius + randomX;
        pos[i * 3 + 1] = randomY * (25 - radius) * 0.05; // Plus plat sur les bords
        pos[i * 3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;
        
        // Dégradé de couleur en fonction de la distance au centre
        const mixedColor = colorInside.clone().lerp(colorOutside, radius / 25);
        cols[i * 3 + 0] = mixedColor.r;
        cols[i * 3 + 1] = mixedColor.g;
        cols[i * 3 + 2] = mixedColor.b;
    }
    return [pos, cols];
  }, []);

  // Animation de rotation de la galaxie
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05; // Rotation principale
      pointsRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.1) * 0.05; // Oscillation subtile
    }
  });

  return (
    <points ref={pointsRef} position={[0, -2, -10]} rotation={[0.5, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesCount}
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particlesCount}
          args={[colors, 3]}
        />
      </bufferGeometry>
      {/* Material avec AdditiveBlending pour un effet de lumière / nébuleuse */}
      <pointsMaterial
        size={0.1}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors={true}
        transparent={true}
        opacity={0.8}
      />
    </points>
  );
}

export default function Background3D() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      {/* dpr={[1, 2]} bloque la résolution très haute des écrans retina pour éviter la surcharge GPU */}
      <Canvas dpr={[1, 2]} camera={{ position: [0, 2, 10], fov: 60 }}>
        {/* Fond d'étoiles optimisé */}
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
        
        {/* La Galaxie gérant son propre rendu et rotation */}
        <Galaxy />
      </Canvas>
    </div>
  );
}
