"use client";
//import { useState, useRef } from 'react'
//import { useGLTF } from '@react-three/drei'
//import { useFrame } from '@react-three/fiber'

import React, { useRef, useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";

export function Rabbit(props) {
  const rabbit = useGLTF('./rabbit.glb')

  const rabbitRef = useRef()
  const mouse = useRef({ x: 0, y: 0 })
  const cubesRef = useRef([])
  const cubes2Ref = useRef([])
  const cubes3Ref = useRef([])
  const paperRef = useRef([])
  const bgRef = useRef([])



  useEffect(() => {
    const handleMouseMove = (event) => {
      // Convert mouse position to normalized device coordinates (-1 to +1)
      mouse.current.x = event.clientX / window.innerWidth;
    };
    if (typeof window !== "undefined") {
      window.addEventListener("mousemove", handleMouseMove);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
      };
    }
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (rabbitRef.current) {
      rabbitRef.current.position.y = Math.sin(time) * 0.5 - 1.6;

      // Convert mouse position to 3D space
      const x = mouse.current.x
      const y = mouse.current.y 
      // Calculate angle to look at the mouse position


      rabbitRef.current.rotation.y = x*2+Math.PI/4


    }

    cubesRef.current.forEach((cube, index) => {
      if (cube) {

        cube.position.y += 0.005
      }
    })
  


    
    paperRef.current.position.y = (Math.sin(time)) * 0.9 - 3
    paperRef.current.rotation.y = Math.PI/4
    bgRef.current.rotation.y = Math.PI/4
    

    cubes2Ref.current.forEach((cube, index) => {
      if (cube) {
        const delay = index * 5
        cube.rotation.z = Math.PI/4
      }
    })
    cubes3Ref.current.forEach((cube, index) => {
      if (cube) {
        const delay = index * 5
        cube.rotation.z = -Math.PI/4
      }
    })

  })

  const leftBoxes = []
  const rightBoxes = []
  leftBoxes.push([-12,0,28])
  
  // leftBoxes.push([-14,0,28])
  // leftBoxes.push([-16,0,28])
  // leftBoxes.push([-18,0,28])
  // leftBoxes.push([-8,0,28])

  rightBoxes.push([-12,0,-28])
  const newPos = [-0.5,-4,0]
  const dPos = [-0.5, -4, 0]
  const posArray = []
  
  for (let i = 0; i< 10000; i++){
    posArray.push([(Math.random()-0.5)*20,(Math.random()-0.5)*1000,(Math.random()-0.5)*20])
  }

  return (
    <>
      <primitive ref={rabbitRef} object={rabbit.scene} {...props} />
      
      <mesh ref = {paperRef} position = {newPos}>
      <boxGeometry args={[3, 0, 3]} />
          <meshStandardMaterial color={'beige'} />
      </mesh>
      
      {posArray.map((pos, index) => (
        <mesh
          key={index}
          position={pos}
          ref={(el) => (cubesRef.current[index] = el)}
        >
          <boxGeometry args={[0.05, 0.05, 0.05]} />
          <meshStandardMaterial color={'grey'} />
        </mesh>
        
      ))}

      {leftBoxes.map((pos, index) => (
        <mesh
          key={index}
          position={pos}
          ref={el => (cubes2Ref.current[index] = el)}
        >
          <boxGeometry args={[10, 20, 20]} />
          <meshStandardMaterial color={'#ef9995'} />
        </mesh>
        
      ))}
      {rightBoxes.map((pos, index) => (
        <mesh
          key={index}
          position={pos}
          ref={el => (cubes3Ref.current[index] = el)}
        >
          <boxGeometry args={[10, 20, 20]} />
          <meshStandardMaterial color={'brown'} />
        </mesh>
        
      ))}
      <mesh  position = {dPos} ref = {bgRef}>
      <boxGeometry args={[10, 0.1, 10]} />
          <meshStandardMaterial color={'black'} />
      </mesh>
      

    </>
  );
}

export function RabbitRabbit(props) {
  const { scene } = useGLTF("./rabbit.glb");
  const rabbitRef = useRef();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      // Convert mouse position to normalized device coordinates (-1 to +1)
      mouse.current.x = event.clientX / window.innerWidth;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (rabbitRef.current) {
      rabbitRef.current.position.y = Math.sin(time) * 0.5 - 1.6;

      // Convert mouse position to 3D space
      const x = mouse.current.x;
      const y = mouse.current.y;
      // Calculate angle to look at the mouse position
      rabbitRef.current.rotation.y = x * 2 - Math.PI / 2;
    }

  
  })

  return <primitive ref={rabbitRef} object={scene} {...props} />;
}
