import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky, Environment } from '@react-three/drei';
import { WeaponModel } from './WeaponModel';
import { Suspense, useState, useEffect } from 'react';
import * as THREE from 'three';

interface Game3DSceneProps {
  playerPosition: { x: number; y: number };
  recoil: boolean;
}

const MapGeometry = () => {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial 
          color="#2d3748" 
          metalness={0.1} 
          roughness={0.9}
        />
      </mesh>

      <mesh position={[-10, 2, 0]} castShadow>
        <boxGeometry args={[2, 4, 10]} />
        <meshStandardMaterial color="#1a1f2c" metalness={0.3} roughness={0.7} />
      </mesh>

      <mesh position={[10, 2, 0]} castShadow>
        <boxGeometry args={[2, 4, 10]} />
        <meshStandardMaterial color="#1a1f2c" metalness={0.3} roughness={0.7} />
      </mesh>

      <mesh position={[0, 2, -10]} castShadow>
        <boxGeometry args={[20, 4, 2]} />
        <meshStandardMaterial color="#1a1f2c" metalness={0.3} roughness={0.7} />
      </mesh>

      <mesh position={[-5, 1.5, 5]} castShadow>
        <boxGeometry args={[3, 3, 3]} />
        <meshStandardMaterial color="#374151" metalness={0.2} roughness={0.8} />
      </mesh>

      <mesh position={[5, 1.5, 5]} castShadow>
        <boxGeometry args={[3, 3, 3]} />
        <meshStandardMaterial color="#374151" metalness={0.2} roughness={0.8} />
      </mesh>

      <mesh position={[0, 1, -5]} castShadow>
        <cylinderGeometry args={[1.5, 1.5, 2, 8]} />
        <meshStandardMaterial color="#4b5563" metalness={0.4} roughness={0.6} />
      </mesh>

      <mesh position={[-8, 0.5, 8]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#6b7280" metalness={0.3} roughness={0.7} />
      </mesh>

      <mesh position={[8, 0.5, 8]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#6b7280" metalness={0.3} roughness={0.7} />
      </mesh>

      {[...Array(5)].map((_, i) => (
        <mesh key={i} position={[-15 + i * 7, 0.2, 12]} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 0.4, 6]} />
          <meshStandardMaterial color="#9ca3af" metalness={0.5} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
};

const MuzzleFlash = ({ show }: { show: boolean }) => {
  if (!show) return null;

  return (
    <group position={[0.3, -0.3, -1]}>
      <pointLight intensity={3} distance={5} color="#ff6600" />
      <mesh>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshBasicMaterial color="#ff6600" />
      </mesh>
    </group>
  );
};

export const Game3DScene = ({ playerPosition, recoil }: Game3DSceneProps) => {
  const [showMuzzleFlash, setShowMuzzleFlash] = useState(false);

  useEffect(() => {
    if (recoil) {
      setShowMuzzleFlash(true);
      const timer = setTimeout(() => setShowMuzzleFlash(false), 50);
      return () => clearTimeout(timer);
    }
  }, [recoil]);

  return (
    <div className="fixed inset-0">
      <Canvas
        shadows
        camera={{ 
          position: [playerPosition.x, 1.7, playerPosition.y + 5], 
          fov: 75,
          near: 0.1,
          far: 1000
        }}
        gl={{ 
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2
        }}
      >
        <Suspense fallback={null}>
          <Sky
            distance={450000}
            sunPosition={[100, 20, 100]}
            inclination={0.6}
            azimuth={0.25}
          />
          
          <ambientLight intensity={0.3} />
          <directionalLight
            position={[10, 20, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={50}
            shadow-camera-left={-25}
            shadow-camera-right={25}
            shadow-camera-top={25}
            shadow-camera-bottom={-25}
          />
          
          <hemisphereLight
            color="#87ceeb"
            groundColor="#2d3748"
            intensity={0.5}
          />

          <MapGeometry />
          
          <WeaponModel recoil={recoil} />
          
          <MuzzleFlash show={showMuzzleFlash} />

          <Environment preset="sunset" />

          <fog attach="fog" args={['#1a1f2c', 10, 50]} />
        </Suspense>
      </Canvas>
    </div>
  );
};
