import { useRef, useMemo, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Text, Sphere } from '@react-three/drei'
import * as THREE from 'three'

const SKILLS = [
  // AI / ML Core
  { label: 'LLMs',          color: '#00d4ff', group: 0, pos: [0, 0, 0] },
  { label: 'RAG',           color: '#00d4ff', group: 0, pos: [2.5, 1, -1] },
  { label: 'Agentic AI',    color: '#00d4ff', group: 0, pos: [-2.5, 0.5, 0.5] },
  { label: 'Prompt Eng.',   color: '#00d4ff', group: 0, pos: [1.2, -2, 0.5] },
  { label: 'AI Agents',     color: '#00ff88', group: 0, pos: [-1, 2, -1] },
  { label: 'Gen AI',        color: '#00ff88', group: 0, pos: [3.2, -0.5, 1] },
  { label: 'Vector DBs',    color: '#00ff88', group: 0, pos: [-3, -1, 0] },
  { label: 'MCP',           color: '#00ff88', group: 1, pos: [0, 3, 1] },
  // Backend / Cloud
  { label: 'Python',        color: '#7c3aed', group: 1, pos: [4.5, 1.5, -2] },
  { label: 'FastAPI',       color: '#7c3aed', group: 1, pos: [5, -1, 0] },
  { label: 'Django',        color: '#a78bfa', group: 1, pos: [3.5, -3, -1] },
  { label: 'Flask',         color: '#a78bfa', group: 1, pos: [6, 0.5, 1] },
  { label: 'Node.js',       color: '#a78bfa', group: 1, pos: [4, 3, 0.5] },
  // Frontend
  { label: 'React.js',      color: '#f97316', group: 2, pos: [-4.5, 1.5, 1] },
  { label: 'JavaScript',    color: '#f97316', group: 2, pos: [-5, -1.5, 0] },
  // Data / Cloud
  { label: 'PostgreSQL',    color: '#22d3ee', group: 3, pos: [1, -4, -2] },
  { label: 'ChromaDB',      color: '#22d3ee', group: 3, pos: [-2, -4, 0] },
  { label: 'OpenAI API',    color: '#22d3ee', group: 3, pos: [0, -3, 2] },
  { label: 'Gemini',        color: '#4ade80', group: 3, pos: [-3, -3, -1] },
  { label: 'Ollama',        color: '#4ade80', group: 3, pos: [2, -5, 1] },
  { label: 'AWS',           color: '#4ade80', group: 3, pos: [5, 3, -1] },
  { label: 'Docker',        color: '#4ade80', group: 3, pos: [-5, 2.5, -1] },
]

// Edges: pairs of indices that should be connected
const EDGES = [
  [0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],
  [1,6],[2,7],[4,7],[5,6],
  [0,8],[8,9],[9,10],[9,11],[9,12],[8,13],[8,14],
  [0,15],[15,16],[15,17],[17,18],[17,19],
  [0,20],[0,21],
]

function NeuralEdge({ start, end, color = '#00d4ff', opacity = 0.18 }) {
  const ref = useRef()
  const geometry = useMemo(() => {
    const points = [
      new THREE.Vector3(...start),
      new THREE.Vector3(...end),
    ]
    return new THREE.BufferGeometry().setFromPoints(points)
  }, [start, end])

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.material.opacity =
        opacity + Math.sin(clock.getElapsedTime() * 1.5 + start[0]) * 0.08
    }
  })

  return (
    <line ref={ref} geometry={geometry}>
      <lineBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </line>
  )
}

function SkillNode({ skill, index, onHover, isHovered }) {
  const meshRef = useRef()
  const [clicked, setClicked] = useState(false)

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime() + index * 0.5
    meshRef.current.position.y = skill.pos[1] + Math.sin(t * 0.6) * 0.08
    const scale = isHovered ? 1.4 : (clicked ? 1.2 : 1)
    meshRef.current.scale.setScalar(
      THREE.MathUtils.lerp(meshRef.current.scale.x, scale, 0.12)
    )
  })

  const nodeSize = skill.group === 0 ? 0.18 : 0.12

  return (
    <group>
      <mesh
        ref={meshRef}
        position={skill.pos}
        onPointerOver={(e) => { e.stopPropagation(); onHover(skill.label) }}
        onPointerOut={() => onHover(null)}
        onClick={() => setClicked(!clicked)}
      >
        <sphereGeometry args={[nodeSize, 16, 16]} />
        <meshStandardMaterial
          color={skill.color}
          emissive={skill.color}
          emissiveIntensity={isHovered ? 3 : 1.2}
          roughness={0}
          metalness={0.2}
        />
      </mesh>

      {/* Outer glow ring */}
      <mesh position={skill.pos}>
        <sphereGeometry args={[nodeSize * 1.8, 12, 12]} />
        <meshBasicMaterial
          color={skill.color}
          transparent
          opacity={isHovered ? 0.15 : 0.05}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Label */}
      <Text
        position={[skill.pos[0], skill.pos[1] + nodeSize + 0.22, skill.pos[2]]}
        fontSize={0.14}
        color={isHovered ? '#ffffff' : skill.color}
        anchorX="center"
        anchorY="bottom"
        font="https://fonts.gstatic.com/s/spacegrotesk/v16/V8mDoQDjQSkFtoMM3T6r8E7mF71Q-gowFU.woff2"
        outlineWidth={0.008}
        outlineColor="#020208"
      >
        {skill.label}
      </Text>
    </group>
  )
}

export default function NeuralNodes({ visible = true }) {
  const [hoveredNode, setHoveredNode] = useState(null)
  const groupRef = useRef()

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.05) * 0.15
  })

  if (!visible) return null

  return (
    <group ref={groupRef} position={[0, 0, -10]}>
      {/* Edges */}
      {EDGES.map(([a, b], i) => (
        <NeuralEdge
          key={i}
          start={SKILLS[a].pos}
          end={SKILLS[b].pos}
          color={SKILLS[a].color}
        />
      ))}

      {/* Nodes */}
      {SKILLS.map((skill, i) => (
        <SkillNode
          key={skill.label}
          skill={skill}
          index={i}
          onHover={setHoveredNode}
          isHovered={hoveredNode === skill.label}
        />
      ))}

      {/* Ambient point lights */}
      <pointLight color="#00d4ff" intensity={0.5} distance={15} position={[0, 0, 2]} />
      <pointLight color="#7c3aed" intensity={0.3} distance={15} position={[5, 3, 0]} />
      <pointLight color="#00ff88" intensity={0.3} distance={15} position={[-4, -2, 0]} />
    </group>
  )
}
