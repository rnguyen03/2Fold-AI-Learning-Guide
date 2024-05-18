"use client"
//import { useState, useRef } from 'react'
//import { useGLTF } from '@react-three/drei'
//import { useFrame } from '@react-three/fiber'


import React, { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'

export function Rabbit(props) {
  const { scene } = useGLTF('./rabbit.glb')
  const rabbitRef = useRef()
  const { viewport } = useThree()
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    
    const handleMouseMove = (event) => {
      // Convert mouse position to normalized device coordinates (-1 to +1)
      mouse.current.x = (event.clientX / window.innerWidth)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (rabbitRef.current) {
      rabbitRef.current.position.y = Math.sin(time) * 0.5 - 1.6

      // Convert mouse position to 3D space
      const x = mouse.current.x
      const y = mouse.current.y
      console.log(x,rabbitRef.current.rotation.z,y)
      // Calculate angle to look at the mouse position
      rabbitRef.current.rotation.y = x*2+Math.PI/4
    }
  })

  return <primitive ref={rabbitRef} object={scene} {...props} />
}

// export function Rabbit(props) {
//   const { scene } = useGLTF('./rabbit.glb')
//   const rabbitRef = useRef()

//   useFrame((state, delta) => {
//     const time = state.clock.getElapsedTime()
//     rabbitRef.current.position.y = Math.sin(time) * 0.5 -1.6 // Adjust the amplitude and frequency as needed
//     const rotationY = (Math.sin(time) * Math.PI)/6 + Math.PI/2-Math.PI/4
//     rabbitRef.current.rotation.y = rotationY
//     //rabbitRef.current.rotation.y = -Math.PI/2
//   })

//   return <primitive ref={rabbitRef} object={scene} {...props} />
// }

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







