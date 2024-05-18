"use client"
import { useState, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'


function useHover() {
  const [hovered, hover] = useState(false)
  return [hovered, { onPointerOver: (e) => hover(true), onPointerOut: () => hover(false) }]
}


export function Rabbit(props) {
  const { scene } = useGLTF('./rabbit.glb')
  const rabbitRef = useRef()

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime()
    rabbitRef.current.position.y = Math.sin(time) * 0.5 -1.6 // Adjust the amplitude and frequency as needed
    const rotationY = (Math.sin(time) * Math.PI)/6 + Math.PI/2-Math.PI/4
    rabbitRef.current.rotation.y = rotationY
    //rabbitRef.current.rotation.y = -Math.PI/2
  })

  return <primitive ref={rabbitRef} object={scene} {...props} />
}

export function Tiger(props) {
  const { scene } = useGLTF('./tiger.glb')
  const tigerRef = useRef()

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime()
    tigerRef.current.position.y = Math.sin(time) * 0.5 -1.6 // Adjust the amplitude and frequency as needed
    const rotationY = (Math.sin(time) * Math.PI)/6 + Math.PI/2 - Math.PI/4
    tigerRef.current.rotation.y = rotationY
    //rabbitRef.current.rotation.y = -Math.PI/2
  })

  return <primitive ref={tigerRef} object={scene} {...props} />
}







