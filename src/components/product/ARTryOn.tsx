"use client";

import React, { useRef, useEffect, useState } from "react";
import { X, Camera, RefreshCw } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { Environment, Float, ContactShadows } from "@react-three/drei";
import { Button } from "@/components/ui/Button";

// Reusing the simple model for the overlay
function SilverJewelryModelOverlay() {
    return (
        <mesh position={[0, -0.5, 0]} scale={0.8}>
            <torusKnotGeometry args={[1, 0.3, 128, 32]} />
            <meshStandardMaterial
                color="#E8E8E8"
                metalness={1}
                roughness={0.1}
                envMapIntensity={1.5}
            />
        </mesh>
    );
}

interface ARTryOnProps {
    onClose: () => void;
}

export default function ARTryOn({ onClose }: ARTryOnProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [permissionError, setPermissionError] = useState(false);

    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "user" }
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Error accessing camera:", err);
                setPermissionError(true);
            }
        };

        startCamera();

        return () => {
            // Cleanup stream
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    return (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-center bg-gradient-to-b from-deep-rose/80 to-transparent">
                <h3 className="text-white font-serif tracking-wide text-lg">AR Try-On</h3>
                <button onClick={onClose} className="p-2 bg-white/10 rounded-full text-white backdrop-blur-md hover:bg-white/20 transition-colors">
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Main AR View */}
            <div className="relative flex-1 bg-gray-900 overflow-hidden">
                {permissionError ? (
                    <div className="absolute inset-0 flex items-center justify-center text-white p-6 text-center">
                        <p>Camera access denied. Please enable camera permissions to use AR.</p>
                    </div>
                ) : (
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                )}

                {/* 3D Overlay Layer */}
                <div className="absolute inset-0 z-10 pointer-events-none">
                    <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                        <Environment preset="city" />
                        <ambientLight intensity={0.5} />
                        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                            <SilverJewelryModelOverlay />
                        </Float>
                    </Canvas>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="border-2 border-dashed border-white/30 rounded-full w-64 h-80 opacity-50" />
                        <p className="absolute mt-96 text-white/50 text-sm">Align face here</p>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="p-6 bg-gradient-to-t from-deep-rose to-transparent z-20 flex justify-around items-center pb-10">
                <button className="flex flex-col items-center gap-1 text-white/90 hover:text-rose-gold transition-colors">
                    <div className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm">
                        <RefreshCw className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-medium">Switch Item</span>
                </button>

                <button className="p-1 rounded-full border-4 border-rose-gold/30 hover:border-rose-gold/60 transition-colors">
                    <div className="bg-rose-gold w-16 h-16 rounded-full flex items-center justify-center hover:scale-95 transition-transform cursor-pointer shadow-[0_0_20px_rgba(242,215,161,0.3)]">
                        <Camera className="w-8 h-8 text-deep-rose" />
                    </div>
                </button>

                <div className="w-12" /> {/* Spacer for balance */}
            </div>
        </div>
    );
}
