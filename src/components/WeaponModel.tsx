import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface WeaponModelProps {
  recoil: boolean;
}

export const WeaponModel = ({ recoil }: WeaponModelProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const targetPosition = useRef({ x: 0, y: 0, z: 0 });

  useFrame(() => {
    if (!groupRef.current) return;

    if (recoil) {
      targetPosition.current.z = 0.15;
      targetPosition.current.y = 0.05;
    } else {
      targetPosition.current.z = 0;
      targetPosition.current.y = 0;
    }

    groupRef.current.position.z += (targetPosition.current.z - groupRef.current.position.z) * 0.3;
    groupRef.current.position.y += (targetPosition.current.y - groupRef.current.position.y) * 0.3;
  });

  return (
    <group ref={groupRef} position={[0.4, -0.4, -0.8]} rotation={[0, Math.PI, 0]}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.08, 0.08, 0.6]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
      </mesh>

      <mesh position={[0, 0, 0.35]}>
        <boxGeometry args={[0.1, 0.1, 0.15]} />
        <meshStandardMaterial color="#2d2d2d" metalness={0.7} roughness={0.2} />
      </mesh>

      <mesh position={[0, -0.06, 0.15]}>
        <boxGeometry args={[0.08, 0.12, 0.25]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.15} />
      </mesh>

      <mesh position={[0, -0.1, -0.08]}>
        <boxGeometry args={[0.05, 0.04, 0.15]} />
        <meshStandardMaterial color="#8b4513" metalness={0.2} roughness={0.7} />
      </mesh>

      <mesh position={[0, -0.12, -0.2]}>
        <boxGeometry args={[0.06, 0.03, 0.2]} />
        <meshStandardMaterial color="#654321" metalness={0.1} roughness={0.8} />
      </mesh>

      <mesh position={[0, 0, -0.25]}>
        <cylinderGeometry args={[0.02, 0.02, 0.15, 12]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.95} roughness={0.05} />
      </mesh>

      <mesh position={[0.04, 0.02, 0.1]}>
        <boxGeometry args={[0.03, 0.03, 0.2]} />
        <meshStandardMaterial color="#4a4a4a" metalness={0.6} roughness={0.3} />
      </mesh>

      <mesh position={[-0.04, 0.02, 0.1]}>
        <boxGeometry args={[0.03, 0.03, 0.2]} />
        <meshStandardMaterial color="#4a4a4a" metalness={0.6} roughness={0.3} />
      </mesh>

      <mesh position={[0, 0.05, 0.2]}>
        <boxGeometry args={[0.06, 0.02, 0.1]} />
        <meshStandardMaterial color="#2d2d2d" metalness={0.7} roughness={0.2} />
      </mesh>

      <mesh position={[0, 0, 0.42]}>
        <cylinderGeometry args={[0.015, 0.015, 0.05, 8]} />
        <meshStandardMaterial color="#ff4444" emissive="#ff0000" emissiveIntensity={0.5} />
      </mesh>

      <pointLight position={[0, 0, 0.4]} intensity={0.3} distance={2} color="#f59e0b" />
    </group>
  );
};