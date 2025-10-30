import { Canvas } from '@react-three/fiber';
import { Sky, Environment } from '@react-three/drei';
import { WeaponModel } from './WeaponModel';
import { TerroristModel } from './TerroristModel';
import { FirstPersonControls } from './FirstPersonControls';
import { Suspense, useState, useEffect } from 'react';
import * as THREE from 'three';
import { BotState } from '@/lib/botAI';

interface Game3DSceneProps {
  playerPosition: { x: number; y: number };
  recoil: boolean;
  enemies: BotState[];
  onEnemyHit: (id: number) => void;
  onMove: (direction: 'forward' | 'backward' | 'left' | 'right') => void;
  espEnabled?: boolean;
}

const MapGeometry = () => {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial 
          color="#2d3748" 
          metalness={0.1} 
          roughness={0.9}
        />
      </mesh>

      <mesh position={[-15, 3, 0]} castShadow>
        <boxGeometry args={[3, 6, 15]} />
        <meshStandardMaterial color="#8b4513" metalness={0.1} roughness={0.9} />
      </mesh>

      <mesh position={[15, 3, 0]} castShadow>
        <boxGeometry args={[3, 6, 15]} />
        <meshStandardMaterial color="#8b4513" metalness={0.1} roughness={0.9} />
      </mesh>

      <mesh position={[0, 3, -20]} castShadow>
        <boxGeometry args={[30, 6, 3]} />
        <meshStandardMaterial color="#8b4513" metalness={0.1} roughness={0.9} />
      </mesh>

      <mesh position={[0, 3, 20]} castShadow>
        <boxGeometry args={[30, 6, 3]} />
        <meshStandardMaterial color="#8b4513" metalness={0.1} roughness={0.9} />
      </mesh>

      <mesh position={[-7, 2, -5]} castShadow>
        <boxGeometry args={[4, 4, 4]} />
        <meshStandardMaterial color="#654321" metalness={0.2} roughness={0.8} />
      </mesh>

      <mesh position={[7, 2, -5]} castShadow>
        <boxGeometry args={[4, 4, 4]} />
        <meshStandardMaterial color="#654321" metalness={0.2} roughness={0.8} />
      </mesh>

      <mesh position={[-7, 2, 8]} castShadow>
        <boxGeometry args={[4, 4, 4]} />
        <meshStandardMaterial color="#654321" metalness={0.2} roughness={0.8} />
      </mesh>

      <mesh position={[7, 2, 8]} castShadow>
        <boxGeometry args={[4, 4, 4]} />
        <meshStandardMaterial color="#654321" metalness={0.2} roughness={0.8} />
      </mesh>

      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[2, 2, 3, 12]} />
        <meshStandardMaterial color="#696969" metalness={0.4} roughness={0.6} />
      </mesh>

      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 25;
        return (
          <mesh 
            key={i} 
            position={[Math.cos(angle) * radius, 0.5, Math.sin(angle) * radius]} 
            castShadow
          >
            <cylinderGeometry args={[0.5, 0.5, 1, 8]} />
            <meshStandardMaterial color="#556b2f" metalness={0.3} roughness={0.7} />
          </mesh>
        );
      })}

      <mesh position={[-10, 1, 10]} castShadow>
        <boxGeometry args={[2, 2, 6]} />
        <meshStandardMaterial color="#8b7355" metalness={0.2} roughness={0.8} />
      </mesh>

      <mesh position={[10, 1, 10]} castShadow>
        <boxGeometry args={[2, 2, 6]} />
        <meshStandardMaterial color="#8b7355" metalness={0.2} roughness={0.8} />
      </mesh>
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

export const Game3DScene = ({ playerPosition, recoil, enemies, onEnemyHit, onMove, espEnabled = false }: Game3DSceneProps) => {
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
        onCreated={(state) => {
          state.gl.setClearColor('#1a1f2c');
        }}
      >
        <Suspense fallback={
          <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color="#f59e0b" />
          </mesh>
        }>
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
          
          <FirstPersonControls onMove={onMove} />
          
          {enemies.map(enemy => (
            <group key={enemy.id}>
              <TerroristModel
                position={enemy.position}
                isAlive={enemy.isAlive}
                isMoving={enemy.isMoving}
                isShooting={enemy.isShooting}
                rotation={enemy.rotation}
              />
              {espEnabled && enemy.isAlive && (
                <mesh position={[enemy.position[0], enemy.position[1] + 2, enemy.position[2]]}>
                  <sphereGeometry args={[0.2]} />
                  <meshBasicMaterial color="#ff0000" transparent opacity={0.8} />
                </mesh>
              )}
            </group>
          ))}
          
          <WeaponModel recoil={recoil} />
          
          <MuzzleFlash show={showMuzzleFlash} />

          <Environment preset="sunset" />

          <fog attach="fog" args={['#1a1f2c', 20, 100]} />
        </Suspense>
      </Canvas>
    </div>
  );
};
