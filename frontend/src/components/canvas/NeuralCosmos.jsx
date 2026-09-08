import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import MinimalNeuralNet from './MinimalNeuralNet'
import CosmosBackground from './CosmosBackground'
import usePortfolioStore from '../../store/portfolioStore'

function CameraRig() {
  const { camera } = useThree()

  useFrame(() => {
    // Read imperatively: subscribing to mouseX/mouseY would re-render this
    // component on every mousemove, and useFrame already runs each frame.
    const { mouseX, mouseY } = usePortfolioStore.getState()
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouseX * 0.8, 0.03)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, mouseY * 0.5, 0.03)
  })

  return null
}

export default function NeuralCosmos() {
  // The canvas is transparent so the page background shows through; an opaque
  // #121212 clear colour used to wash the light theme's cream ground grey.
  // Fog still needs a concrete colour, so track the active theme.
  const theme = usePortfolioStore((s) => s.theme)
  const fogColor = theme === 'light' ? '#F4F3EF' : '#121212'

  return (
    <Canvas
      camera={{ position: [0, 0, 18], fov: 60, near: 0.1, far: 200 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <fog attach="fog" args={[fogColor, 20, 80]} />
      <CosmosBackground />
      <MinimalNeuralNet />
      <CameraRig />
    </Canvas>
  )
}
