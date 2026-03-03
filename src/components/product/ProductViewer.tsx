"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, Float, ContactShadows } from "@react-three/drei";
import { Loader } from "lucide-react";

function SilverJewelryModel() {
    // Placeholder geometry - In a real app, use useGLTF to load a .glb model
    return (
        <mesh castShadow receiveShadow>
            <torusKnotGeometry args={[1, 0.3, 128, 32]} />
            <meshStandardMaterial
                color="#E8E8E8"
                metalness={1}
                roughness={0.1}
                envMapIntensity={1}
            />
        </mesh>
    );
}

export default function ProductViewer() {
    return (
        <div className="h-[400px] md:h-[600px] w-full bg-white/5 rounded-3xl overflow-hidden relative border border-white/10">
            <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-white/10 backdrop-blur rounded-full border border-white/20">
                <span className="text-xs text-white uppercase tracking-widest font-medium">3D View</span>
            </div>

            <Canvas shadows camera={{ position: [0, 0, 4], fov: 50 }}>
                <Suspense fallback={null}>
                    <Stage environment="city" intensity={0.6} castShadow={false}>
                        <Float
                            speed={2}
                            rotationIntensity={1}
                            floatIntensity={0.5}
                            floatingRange={[-0.1, 0.1]}
                        >
                            <SilverJewelryModel />
                        </Float>
                    </Stage>
                    <OrbitControls autoRotate autoRotateSpeed={4} enableZoom={false} />
                </Suspense>
            </Canvas>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/40 text-xs flex items-center gap-2 pointer-events-none">
                Drag to Rotate
            </div>
        </div>
    );
}
