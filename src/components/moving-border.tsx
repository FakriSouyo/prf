"use client"

import type React from "react"
import { motion, useAnimationFrame, useMotionTemplate, useMotionValue, useTransform } from "framer-motion"
import { useRef, useState } from "react"
import { cn } from "@/lib/utils"

export function MovingBorderCard({
  borderRadius = "15px",
  children,
  as: Component = "div",
  containerClassName,
  borderClassName,
  duration = 3000,
  className,
  ...otherProps
}: {
  borderRadius?: string
  children: React.ReactNode
  as?: any
  containerClassName?: string
  borderClassName?: string
  duration?: number
  className?: string
  [key: string]: any
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Component
      className={cn("relative overflow-hidden bg-transparent", containerClassName)}
      style={{
        borderRadius: borderRadius,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...otherProps}
    >
      {/* Moving border - only visible on hover */}
      <div
        className={cn("absolute inset-0 transition-opacity duration-300", isHovered ? "opacity-100" : "opacity-0")}
        style={{ borderRadius: borderRadius }}
      >
        <MovingBorder duration={duration} rx="30%" ry="30%">
          <div
            className={cn(
              "h-20 w-20 bg-[radial-gradient(#ff006e_40%,#8338ec_60%,transparent_80%)] opacity-[0.8]",
              borderClassName,
            )}
          />
        </MovingBorder>
      </div>

      {/* Static content */}
      <div
        className={cn(
          "relative h-full w-full bg-white dark:bg-zinc-950 border border-gray-200 dark:border-gray-800",
          className,
        )}
        style={{
          borderRadius: borderRadius,
        }}
      >
        {children}
      </div>
    </Component>
  )
}

export const MovingBorder = ({
  children,
  duration = 3000,
  rx,
  ry,
  ...otherProps
}: {
  children: React.ReactNode
  duration?: number
  rx?: string
  ry?: string
  [key: string]: any
}) => {
  const pathRef = useRef<any>()
  const progress = useMotionValue<number>(0)

  useAnimationFrame((time) => {
    const length = pathRef.current?.getTotalLength()
    if (length) {
      const pxPerMillisecond = length / duration
      progress.set((time * pxPerMillisecond) % length)
    }
  })

  const x = useTransform(progress, (val) => pathRef.current?.getPointAtLength(val).x)
  const y = useTransform(progress, (val) => pathRef.current?.getPointAtLength(val).y)
  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute h-full w-full"
        width="100%"
        height="100%"
        {...otherProps}
      >
        <rect fill="none" width="100%" height="100%" rx={rx} ry={ry} ref={pathRef} />
      </svg>
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          display: "inline-block",
          transform,
        }}
      >
        {children}
      </motion.div>
    </>
  )
}