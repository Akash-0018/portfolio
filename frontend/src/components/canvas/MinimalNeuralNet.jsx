import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function MinimalNeuralNet() {
  const groupRef = useRef()
  const lineSegmentsRef = useRef()

  const nodeCount = 45
  const maxDistance = 6.5

  // Generate random node positions and velocities
  const nodes = useMemo(() => {
    const arr = []
    const champagneColor = new THREE.Color('#D9C8A3')
    const gunmetalColor = new THREE.Color('#718B9E') // Gunmetal/steel-blue accent
    
    for (let i = 0; i < nodeCount; i++) {
      arr.push({
        pos: new THREE.Vector3(
          (Math.random() - 0.5) * 22,
          (Math.random() - 0.5) * 16,
          (Math.random() - 0.5) * 16
        ),
        vel: new THREE.Vector3(
          (Math.random() - 0.5) * 0.015,
          (Math.random() - 0.5) * 0.015,
          (Math.random() - 0.5) * 0.015
        ),
        color: Math.random() > 0.4 ? champagneColor : gunmetalColor
      })
    }
    return arr
  }, [])

  // Create static positions and colors for point rendering
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(nodeCount * 3)
    const colors = new Float32Array(nodeCount * 3)
    nodes.forEach((n, idx) => {
      positions[idx * 3] = n.pos.x
      positions[idx * 3 + 1] = n.pos.y
      positions[idx * 3 + 2] = n.pos.z
      
      colors[idx * 3] = n.color.r
      colors[idx * 3 + 1] = n.color.g
      colors[idx * 3 + 2] = n.color.b
    })
    return { positions, colors }
  }, [nodes])

  useFrame((state) => {
    if (!groupRef.current) return

    // Slowly rotate the entire network
    const t = state.clock.getElapsedTime()
    groupRef.current.rotation.y = t * 0.012
    groupRef.current.rotation.x = Math.sin(t * 0.04) * 0.025

    // Update node positions
    nodes.forEach((n, idx) => {
      n.pos.add(n.vel)

      // Bounce constraints
      if (Math.abs(n.pos.x) > 11) n.vel.x *= -1
      if (Math.abs(n.pos.y) > 8) n.vel.y *= -1
      if (Math.abs(n.pos.z) > 8) n.vel.z *= -1

      // Update positions buffer
      positions[idx * 3] = n.pos.x
      positions[idx * 3 + 1] = n.pos.y
      positions[idx * 3 + 2] = n.pos.z
    })

    // Update point geometry attributes
    const pointsGeom = groupRef.current.children[0].geometry
    pointsGeom.attributes.position.needsUpdate = true

    // Dynamic line segments calculation
    const linePositions = []
    const lineColors = []

    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const p1 = nodes[i].pos
        const p2 = nodes[j].pos
        const dist = p1.distanceTo(p2)

        if (dist < maxDistance) {
          linePositions.push(p1.x, p1.y, p1.z)
          linePositions.push(p2.x, p2.y, p2.z)

          // Line opacity gets lower as distance gets larger
          const opacity = (1 - dist / maxDistance) * 0.18
          const color = nodes[i].color
          
          lineColors.push(color.r * opacity, color.g * opacity, color.b * opacity)
          lineColors.push(color.r * opacity, color.g * opacity, color.b * opacity)
        }
      }
    }

    if (lineSegmentsRef.current) {
      const lineGeom = lineSegmentsRef.current.geometry
      lineGeom.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3))
      lineGeom.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3))
      lineGeom.attributes.position.needsUpdate = true
      if (lineGeom.attributes.color) lineGeom.attributes.color.needsUpdate = true
    }
  })

  return (
    <group ref={groupRef}>
      {/* Nodes (Points) */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={positions}
            count={nodeCount}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            array={colors}
            count={nodeCount}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          vertexColors
          size={0.15}
          sizeAttenuation
          transparent
          opacity={0.7}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Dynamic line connections */}
      <lineSegments ref={lineSegmentsRef}>
        <bufferGeometry />
        <lineBasicMaterial
          vertexColors
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  )
}
