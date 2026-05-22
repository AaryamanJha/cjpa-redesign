"use client"

import { useEffect, useRef, useCallback } from "react"
import createGlobe from "cobe"

interface GlobeMarker {
  location: [number, number]
  size: number
}

interface GlobeInteractiveProps {
  className?: string
  speed?: number
}

const CJPA_MARKERS: GlobeMarker[] = [
  { location: [38.9, -77.0], size: 0.04 },    // Washington DC
  { location: [51.5, -0.12], size: 0.035 },   // London
  { location: [25.2, 55.27], size: 0.032 },   // Dubai
  { location: [1.35, 103.82], size: 0.03 },   // Singapore
  { location: [22.3, 114.17], size: 0.03 },   // Hong Kong
  { location: [46.2, 6.15], size: 0.028 },    // Geneva
  { location: [48.85, 2.35], size: 0.03 },    // Paris
  { location: [35.68, 139.65], size: 0.028 }, // Tokyo
]

export function GlobeInteractive({
  className = "",
  speed = 0.0028,
}: GlobeInteractiveProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointerInteracting = useRef<{ x: number; y: number } | null>(null)
  const dragOffset = useRef({ phi: 0, theta: 0 })
  const phiOffsetRef = useRef(0)
  const thetaOffsetRef = useRef(0)
  const isPausedRef = useRef(false)

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerInteracting.current = { x: e.clientX, y: e.clientY }
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing"
    isPausedRef.current = true
  }, [])

  const handlePointerUp = useCallback(() => {
    if (pointerInteracting.current !== null) {
      phiOffsetRef.current += dragOffset.current.phi
      thetaOffsetRef.current += dragOffset.current.theta
      dragOffset.current = { phi: 0, theta: 0 }
    }
    pointerInteracting.current = null
    if (canvasRef.current) canvasRef.current.style.cursor = "grab"
    isPausedRef.current = false
  }, [])

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (pointerInteracting.current !== null) {
        dragOffset.current = {
          phi: (e.clientX - pointerInteracting.current.x) / 280,
          theta: (e.clientY - pointerInteracting.current.y) / 900,
        }
      }
    }
    window.addEventListener("pointermove", handlePointerMove, { passive: true })
    window.addEventListener("pointerup", handlePointerUp, { passive: true })
    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerup", handlePointerUp)
    }
  }, [handlePointerUp])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let globe: ReturnType<typeof createGlobe> | null = null
    let animationId: number
    let phi = 1.5

    function init() {
      if (!canvas || globe) return

      // Use getBoundingClientRect for reliable measurement in all layout contexts
      const rect = canvas.getBoundingClientRect()
      const width =
        Math.round(rect.width) ||
        canvas.offsetWidth ||
        (canvas.parentElement?.getBoundingClientRect().width ?? 480)

      if (width === 0) return

      globe = createGlobe(canvas, {
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        width,
        height: width,
        phi: 1.5,
        theta: 0.18,
        dark: 1,
        diffuse: 1.2,
        mapSamples: 16000,
        mapBrightness: 1.6,
        baseColor: [0.08, 0.13, 0.24],
        markerColor: [0.78, 0.663, 0.416],
        glowColor: [0.14, 0.2, 0.36],
        markers: CJPA_MARKERS,
      })

      const animate = () => {
        if (!isPausedRef.current) phi += speed
        globe?.update({
          phi: phi + phiOffsetRef.current + dragOffset.current.phi,
          theta: 0.15 + thetaOffsetRef.current + dragOffset.current.theta,
        })
        animationId = requestAnimationFrame(animate)
      }
      animate()

      // Double-RAF to ensure first paint is complete before showing
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (canvas) canvas.style.opacity = "1"
        })
      })
    }

    // Wait one animation frame so the CSS grid/flexbox layout has computed sizes
    const frameId = requestAnimationFrame(() => {
      const w = canvas.getBoundingClientRect().width || canvas.offsetWidth
      if (w > 0) {
        init()
      } else {
        const ro = new ResizeObserver((entries) => {
          if (entries[0]?.contentRect.width > 0) {
            ro.disconnect()
            init()
          }
        })
        ro.observe(canvas)
      }
    })

    return () => {
      cancelAnimationFrame(frameId)
      if (animationId) cancelAnimationFrame(animationId)
      if (globe) globe.destroy()
    }
  }, [speed])

  return (
    <div className={`relative aspect-square select-none ${className}`}>
      {/* Dark base so canvas never flashes white during load */}
      <div
        className="absolute inset-0 rounded-full"
        style={{ background: "#070B14" }}
      />

      {/* Subtle gold ambient glow */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(200,169,106,0.06) 0%, transparent 70%)",
          filter: "blur(24px)",
        }}
      />

      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          cursor: "grab",
          opacity: 0,
          transition: "opacity 1.4s ease",
          borderRadius: "50%",
          touchAction: "none",
        }}
        aria-label="Interactive globe showing CJPA global presence"
        role="img"
      />
    </div>
  )
}
