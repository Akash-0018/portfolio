import * as THREE from 'three'
import { useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import MinimalNeuralNet from './MinimalNeuralNet'
import CosmosBackground from './CosmosBackground'
import usePortfolioStore from '../../store/portfolioStore'

function CameraRig() {
  const { camera } = useThree()
  const mouseX = usePortfolioStore((s) => s.mouseX)
  const mouseY = usePortfolioStore((s) => s.mouseY)

  useFrame(() => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouseX * 0.8, 0.03)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, mouseY * 0.5, 0.03)
  })

  return null
}

export default function NeuralCosmos() {
  return (
    <Canvas
      camera={{ position: [0, 0, 18], fov: 60, near: 0.1, far: 200 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: false }}
      style={{ background: '#121212' }}
    >
      <fog attach="fog" args={['#121212', 20, 80]} />
      <CosmosBackground />
      <MinimalNeuralNet />
      <CameraRig />
    </Canvas>
  )
}
