import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function ParticleField({ count = 3000 }) {
  const points = useRef()
  const time = useRef(0)

  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)

    const cyan   = new THREE.Color('#00d4ff')
    const purple = new THREE.Color('#7c3aed')
    const green  = new THREE.Color('#00ff88')
    const palette = [cyan, purple, green]

    for (let i = 0; i < count; i++) {
      // Spread across a wide volume
      positions[i * 3]     = (Math.random() - 0.5) * 80
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60

      const col = palette[Math.floor(Math.random() * palette.length)]
      const brightness = 0.3 + Math.random() * 0.7
      colors[i * 3]     = col.r * brightness
      colors[i * 3 + 1] = col.g * brightness
      colors[i * 3 + 2] = col.b * brightness

      sizes[i] = Math.random() * 2.5 + 0.5
    }

    return { positions, colors, sizes }
  }, [count])

  useFrame((_, delta) => {
    time.current += delta * 0.08
    if (!points.current) return
    points.current.rotation.y = time.current * 0.015
    points.current.rotation.x = Math.sin(time.current * 0.1) * 0.05
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          array={colors}
          count={colors.length / 3}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          array={sizes}
          count={sizes.length}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        transparent
        opacity={0.75}
        sizeAttenuation
        size={0.12}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
