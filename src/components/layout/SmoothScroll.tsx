"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const lenis = useLenis();

    useEffect(() => {
        if (lenis) {
            // Reset scroll to top on route change
            lenis.scrollTo(0, { immediate: true });
            // Re-calculate dimensions
            lenis.resize();
        }
    }, [pathname, lenis]);

    return (
        <ReactLenis 
            root 
            options={{ 
                lerp: 0.1, // Slightly faster lerp for better responsiveness
                duration: 1.5, 
                smoothWheel: true,
                wheelMultiplier: 1,
                touchMultiplier: 1.5,
                infinite: false,
            }}
        >
            {children}
        </ReactLenis>
    );
}

