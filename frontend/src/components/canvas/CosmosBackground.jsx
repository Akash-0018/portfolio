import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function CosmosBackground() {
  const meshRef = useRef(null)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (meshRef.current) {
      meshRef.current.rotation.z = t * 0.005
    }
  })

  return (
    <group>
      {/* Subtle blueprint grid atmosphere - minimal #121212 / #1E1E1E palette */}
      <mesh ref={meshRef} position={[0, 0, -40]}>
        <planeGeometry args={[120, 120]} />
        <meshBasicMaterial
          color="#1E1E1E"
          transparent
          opacity={0.06}
          depthWrite={false}
          wireframe
        />
      </mesh>
      <ambientLight intensity={0.2} color="#1E1E1E" />
    </group>
  )
}
