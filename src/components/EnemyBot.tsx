import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface EnemyBotProps {
  position: [number, number, number];
  onHit: () => void;
  isAlive: boolean;
}

export const EnemyBot = ({ position, onHit, isAlive }: EnemyBotProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const targetPosition = useRef({ x: position[0], z: position[2] });
  const moveTimer = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomX = (Math.random() - 0.5) * 20;
      const randomZ = (Math.random() - 0.5) * 20;
      targetPosition.current = { x: randomX, z: randomZ };
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current || !isAlive) return;

    moveTimer.current += delta;

    groupRef.current.position.x += (targetPosition.current.x - groupRef.current.position.x) * 0.01;
    groupRef.current.position.z += (targetPosition.current.z - groupRef.current.position.z) * 0.01;

    groupRef.current.position.y = 1 + Math.sin(moveTimer.current * 5) * 0.05;

    const direction = new THREE.Vector3(
      targetPosition.current.x - groupRef.current.position.x,
      0,
      targetPosition.current.z - groupRef.current.position.z
    );
    if (direction.length() > 0.1) {
      const angle = Math.atan2(direction.x, direction.z);
      groupRef.current.rotation.y = angle;
    }
  });

  if (!isAlive) return null;

  return (
    <group ref={groupRef} position={position}>
      <mesh castShadow>
        <capsuleGeometry args={[0.3, 1, 8, 16]} />
        <meshStandardMaterial color="#ef4444" metalness={0.3} roughness={0.7} />
      </mesh>

      <mesh position={[0, 0.7, 0]} castShadow>
        <boxGeometry args={[0.4, 0.4, 0.4]} />
        <meshStandardMaterial color="#dc2626" metalness={0.4} roughness={0.6} />
      </mesh>

      <mesh position={[0.15, 0.75, 0]} castShadow>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#fef3c7" emissive="#fef3c7" emissiveIntensity={2} />
      </mesh>

      <mesh position={[-0.15, 0.75, 0]} castShadow>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#fef3c7" emissive="#fef3c7" emissiveIntensity={2} />
      </mesh>

      <mesh position={[0.25, 0, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
        <boxGeometry args={[0.15, 0.5, 0.15]} />
        <meshStandardMaterial color="#b91c1c" metalness={0.3} roughness={0.7} />
      </mesh>

      <mesh position={[-0.25, 0, 0]} rotation={[0, 0, -Math.PI / 4]} castShadow>
        <boxGeometry args={[0.15, 0.5, 0.15]} />
        <meshStandardMaterial color="#b91c1c" metalness={0.3} roughness={0.7} />
      </mesh>

      <mesh position={[0.15, 0.3, 0.25]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.4, 8]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </mesh>

      <pointLight position={[0, 1, 0]} intensity={0.5} distance={3} color="#ef4444" />

      <mesh position={[0, -0.8, 0]}>
        <ringGeometry args={[0.3, 0.4, 16]} />
        <meshBasicMaterial color="#ef4444" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};
