"use client";
//import { useState, useRef } from 'react'
//import { useGLTF } from '@react-three/drei'
//import { useFrame } from '@react-three/fiber'

import React, { useRef, useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";

export function Rabbit(props) {
  const { scene } = useGLTF("./rabbit.glb");
  const rabbitRef = useRef();
  const mouse = useRef({ x: 0, y: 0 });
  const cubesRef = useRef([]);
  const cubesRef2 = useRef([]);

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
      const x = mouse.current.x;
      const y = mouse.current.y;
      // Calculate angle to look at the mouse position
      rabbitRef.current.rotation.y = x * 2 + Math.PI / 4;
    }
    cubesRef.current.forEach((cube) => {
      if (cube) {
        cube.rotation.x = Math.sin(time) / 40 + 0.5;
      }
    });
    cubesRef2.current.forEach((cube) => {
      if (cube) {
        cube.rotation.x = Math.sin(time) / 40 - 0.5;
      }
    });
  });
  const positions1 = useMemo(() => {
    const posArray = [];
    // for (let i = 0; i < 100; i++) {
    //   posArray.push([1 - 2, Math.random() * 4 - 2,( Math.random()-0.5)*100 - 2])
    // }
    posArray.push([-3, 1, 25]);
    posArray.push([-22, 1, 28]);
    posArray.push([-15, 1, 28]);

    // posArray.push([-10,1,-30])
    // posArray.push([-5,1,-26])
    // posArray.push([-15,1,-28])

    return posArray;
  }, []);
  const positions2 = useMemo(() => {
    const posArray = [];
    // for (let i = 0; i < 100; i++) {
    //   posArray.push([1 - 2, Math.random() * 4 - 2,( Math.random()-0.5)*100 - 2])
    // }
    // posArray.push([-20,-10,30])
    // posArray.push([-5,1,26])
    // posArray.push([-15,1,28])

    posArray.push([-10, 1, -25]);
    posArray.push([-22, 1, -28]);
    posArray.push([-15, 1, -28]);

    return posArray;
  }, []);

  return (
    <>
      <primitive ref={rabbitRef} object={scene} {...props} />
      {positions1.map((pos, index) => (
        <mesh
          key={index}
          position={pos}
          ref={(el) => (cubesRef.current[index] = el)}
        >
          <boxGeometry args={[0.1, 20, 20]} />
          <meshStandardMaterial color={"red"} />
        </mesh>
      ))}

      {positions2.map((pos, index) => (
        <mesh
          key={index}
          position={pos}
          ref={(el) => (cubesRef2.current[index] = el)}
        >
          <boxGeometry args={[0.1, 20, 20]} />
          <meshStandardMaterial color={"pink"} />
        </mesh>
      ))}
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
  });

  return <primitive ref={rabbitRef} object={scene} {...props} />;
}
