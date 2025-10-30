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
    <group ref={groupRef} position={[0.3, -0.3, -0.5]} rotation={[0, Math.PI, 0]}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.05, 0.05, 0.4]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </mesh>

      <mesh position={[0, 0, 0.25]}>
        <boxGeometry args={[0.08, 0.08, 0.1]} />
        <meshStandardMaterial color="#2d2d2d" metalness={0.6} roughness={0.3} />
      </mesh>

      <mesh position={[0, -0.05, 0.1]}>
        <boxGeometry args={[0.06, 0.1, 0.2]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.2} />
      </mesh>

      <mesh position={[0, -0.08, -0.05]}>
        <boxGeometry args={[0.04, 0.03, 0.1]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.1} />
      </mesh>

      <mesh position={[0, 0, -0.15]}>
        <cylinderGeometry args={[0.015, 0.015, 0.1, 8]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
      </mesh>

      <mesh position={[0.03, 0, 0]}>
        <boxGeometry args={[0.02, 0.02, 0.15]} />
        <meshStandardMaterial color="#4a4a4a" metalness={0.5} roughness={0.4} />
      </mesh>

      <mesh position={[-0.03, 0, 0]}>
        <boxGeometry args={[0.02, 0.02, 0.15]} />
        <meshStandardMaterial color="#4a4a4a" metalness={0.5} roughness={0.4} />
      </mesh>

      <pointLight position={[0, 0, 0.3]} intensity={0.5} distance={2} color="#f59e0b" />
    </group>
  );
};
