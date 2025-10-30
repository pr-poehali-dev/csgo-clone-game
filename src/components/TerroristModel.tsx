import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface TerroristModelProps {
  position: [number, number, number];
  isAlive: boolean;
  isMoving?: boolean;
  isShooting?: boolean;
  rotation?: number;
}

export const TerroristModel = ({ 
  position, 
  isAlive, 
  isMoving = false, 
  isShooting = false,
  rotation = 0 
}: TerroristModelProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Mesh>(null);
  const rightLegRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);
  const gunRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!isAlive || !groupRef.current) return;

    const time = state.clock.getElapsedTime();
    
    if (isMoving && leftLegRef.current && rightLegRef.current) {
      leftLegRef.current.rotation.x = Math.sin(time * 8) * 0.5;
      rightLegRef.current.rotation.x = Math.sin(time * 8 + Math.PI) * 0.5;
      
      leftArmRef.current!.rotation.x = Math.sin(time * 8 + Math.PI) * 0.3;
      rightArmRef.current!.rotation.x = Math.sin(time * 8) * 0.3;
    } else {
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0;
    }

    if (isShooting && gunRef.current) {
      gunRef.current.position.z = Math.sin(time * 20) * 0.05 - 0.3;
    }
  });

  if (!isAlive) {
    return (
      <group position={position}>
        <mesh rotation={[Math.PI / 2, 0, rotation]} position={[0, 0.2, 0]}>
          <boxGeometry args={[0.4, 0.6, 0.2]} />
          <meshStandardMaterial color="#8b0000" />
        </mesh>
      </group>
    );
  }

  return (
    <group ref={groupRef} position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[0.4, 0.4, 0.4]} />
        <meshStandardMaterial color="#d4a574" />
      </mesh>

      <mesh position={[0, 0.3, 0.02]}>
        <boxGeometry args={[0.05, 0.08, 0.02]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[0.1, 0.3, 0.02]}>
        <boxGeometry args={[0.05, 0.08, 0.02]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      <mesh position={[0, 1.35, 0.15]}>
        <boxGeometry args={[0.3, 0.15, 0.1]} />
        <meshStandardMaterial color="#2d2d2d" />
      </mesh>

      <mesh position={[0, 1.0, 0]} castShadow>
        <boxGeometry args={[0.5, 0.7, 0.3]} />
        <meshStandardMaterial color="#4a4a4a" />
      </mesh>

      <group ref={leftArmRef} position={[-0.3, 1.1, 0]}>
        <mesh position={[0, -0.2, 0]} castShadow>
          <boxGeometry args={[0.15, 0.5, 0.15]} />
          <meshStandardMaterial color="#4a4a4a" />
        </mesh>
        <mesh position={[0, -0.5, 0]}>
          <boxGeometry args={[0.12, 0.3, 0.12]} />
          <meshStandardMaterial color="#d4a574" />
        </mesh>
      </group>

      <group ref={rightArmRef} position={[0.3, 1.1, 0]}>
        <mesh position={[0, -0.2, 0]} castShadow>
          <boxGeometry args={[0.15, 0.5, 0.15]} />
          <meshStandardMaterial color="#4a4a4a" />
        </mesh>
        <mesh position={[0, -0.5, 0]}>
          <boxGeometry args={[0.12, 0.3, 0.12]} />
          <meshStandardMaterial color="#d4a574" />
        </mesh>
      </group>

      <group ref={gunRef} position={[0.35, 0.9, -0.3]}>
        <mesh castShadow>
          <boxGeometry args={[0.08, 0.08, 0.6]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, -0.35]}>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshStandardMaterial color="#2d2d2d" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.05, 0.1]}>
          <boxGeometry args={[0.06, 0.15, 0.3]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      </group>

      <group ref={leftLegRef} position={[-0.12, 0.6, 0]}>
        <mesh position={[0, -0.3, 0]} castShadow>
          <boxGeometry args={[0.18, 0.6, 0.18]} />
          <meshStandardMaterial color="#2d2d2d" />
        </mesh>
        <mesh position={[0, -0.65, 0.05]}>
          <boxGeometry args={[0.2, 0.1, 0.25]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      </group>

      <group ref={rightLegRef} position={[0.12, 0.6, 0]}>
        <mesh position={[0, -0.3, 0]} castShadow>
          <boxGeometry args={[0.18, 0.6, 0.18]} />
          <meshStandardMaterial color="#2d2d2d" />
        </mesh>
        <mesh position={[0, -0.65, 0.05]}>
          <boxGeometry args={[0.2, 0.1, 0.25]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      </group>
    </group>
  );
};
