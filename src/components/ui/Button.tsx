"use client";

import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "glass";
    size?: "sm" | "md" | "lg";
    magnetic?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", magnetic = false, children, ...props }, ref) => {
        const buttonRef = React.useRef<HTMLButtonElement>(null);
        const [position, setPosition] = React.useState({ x: 0, y: 0 });

        const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
            if (!magnetic || !buttonRef.current) return;
            const { clientX, clientY } = e;
            const { height, width, left, top } = buttonRef.current.getBoundingClientRect();
            const middleX = clientX - (left + width / 2);
            const middleY = clientY - (top + height / 2);
            setPosition({ x: middleX * 0.1, y: middleY * 0.1 });
        };

        const handleMouseLeave = () => {
            if (!magnetic) return;
            setPosition({ x: 0, y: 0 });
        };

        // Forward ref to internal ref
        React.useImperativeHandle(ref, () => buttonRef.current!);

        const variants = {
            primary: "bg-charcoal text-white hover:bg-black",
            secondary: "bg-silver text-charcoal hover:bg-gray-300",
            outline: "border border-charcoal text-charcoal hover:bg-charcoal hover:text-white",
            ghost: "hover:bg-black/5 text-charcoal",
            glass: "glass text-charcoal hover:bg-white/40",
        };

        const sizes = {
            sm: "h-9 px-4 text-sm",
            md: "h-11 px-6 text-base",
            lg: "h-14 px-8 text-lg",
        };

        return (
            <motion.button
                ref={buttonRef}
                className={cn(
                    "relative inline-flex items-center justify-center rounded-full font-medium transition-colors",
                    "disabled:pointer-events-none disabled:opacity-50",
                    "tracking-wide",
                    variants[variant],
                    sizes[size],
                    className
                )}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                animate={magnetic ? { x: position.x, y: position.y } : {}}
                transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
                whileTap={{ scale: 0.95 }}
                {...props}
            >
                {children}
            </motion.button>
        );
    }
);

Button.displayName = "Button";

export { Button };
