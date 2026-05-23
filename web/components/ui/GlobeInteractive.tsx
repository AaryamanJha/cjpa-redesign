"use client"

import { useEffect, useRef, useCallback } from "react"
import createGlobe from "cobe"

interface GlobeMarker {
  location: [number, number]
  size: number
  id?: string
}

interface GlobeInteractiveProps {
  className?: string
  speed?: number
}

const CJPA_MARKERS: GlobeMarker[] = [
  { location: [40.7128, -74.006], size: 0.052, id: "nyc" }, // New York City
  { location: [51.5, -0.12], size: 0.035 },   // London
  { location: [25.2, 55.27], size: 0.032 },   // Dubai
  { location: [1.35, 103.82], size: 0.03 },   // Singapore
  { location: [22.3, 114.17], size: 0.03 },   // Hong Kong
  { location: [46.2, 6.15], size: 0.028 },    // Geneva
  { location: [48.85, 2.35], size: 0.03 },    // Paris
  { location: [35.68, 139.65], size: 0.028 }, // Tokyo
]

const NYC_LOCATION: [number, number] = [40.7128, -74.006]

function locationToVector([lat, lng]: [number, number]) {
  const latRad = (lat * Math.PI) / 180
  const lngRad = (lng * Math.PI) / 180
  const radius = Math.cos(latRad)
  return [radius * Math.cos(lngRad), Math.sin(latRad), -radius * Math.sin(lngRad)]
}

function projectLocation(location: [number, number], phi: number, theta: number) {
  const [x, y, z] = locationToVector(location)
  const cosTheta = Math.cos(theta)
  const sinTheta = Math.sin(theta)
  const cosPhi = Math.cos(phi)
  const sinPhi = Math.sin(phi)
  const elevatedRadius = 0.85
  const px = x * elevatedRadius
  const py = y * elevatedRadius
  const pz = z * elevatedRadius

  const projectedX = cosPhi * px + sinPhi * pz
  const projectedY = sinPhi * sinTheta * px + cosTheta * py - cosPhi * sinTheta * pz
  const projectedZ = -sinPhi * cosTheta * px + sinTheta * py + cosPhi * cosTheta * pz

  return {
    x: ((projectedX + 1) / 2) * 100,
    y: ((-projectedY + 1) / 2) * 100,
    visible: projectedZ >= -0.06,
  }
}

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
  const pinRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)

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
    let phi = -0.9
    const handleContextLost = (event: Event) => {
      event.preventDefault()
      canvas.style.opacity = "0"
    }

    canvas.addEventListener("webglcontextlost", handleContextLost, false)

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
        phi: -0.9,
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
        const currentPhi = phi + phiOffsetRef.current + dragOffset.current.phi
        const currentTheta = 0.15 + thetaOffsetRef.current + dragOffset.current.theta
        globe?.update({
          phi: currentPhi,
          theta: currentTheta,
        })
        const nyc = projectLocation(NYC_LOCATION, currentPhi, currentTheta)
        const opacity = nyc.visible ? "1" : "0"
        if (pinRef.current) {
          pinRef.current.style.left = `${nyc.x}%`
          pinRef.current.style.top = `${nyc.y}%`
          pinRef.current.style.opacity = opacity
        }
        if (labelRef.current) {
          labelRef.current.style.left = `${nyc.x}%`
          labelRef.current.style.top = `${nyc.y}%`
          labelRef.current.style.opacity = opacity
        }
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
      canvas.removeEventListener("webglcontextlost", handleContextLost)
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

      <div className="absolute inset-[4%] rounded-full overflow-hidden border border-[#3B82F6]/10">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 52% 48%, rgba(59,130,246,0.14), rgba(7,11,20,0.18) 44%, rgba(7,11,20,0.95) 72%), radial-gradient(circle at 42% 50%, rgba(59,130,246,0.35) 0 1px, transparent 1.8px)",
            backgroundSize: "100% 100%, 9px 9px",
          }}
        />
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 18% 42%, rgba(200,169,106,0.9) 0 3px, transparent 3.5px), radial-gradient(circle at 48% 35%, rgba(200,169,106,0.85) 0 2.5px, transparent 3px), radial-gradient(circle at 68% 56%, rgba(200,169,106,0.75) 0 2px, transparent 2.5px)",
          }}
        />
      </div>

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

      <div ref={pinRef} className="cjpa-globe-pin" aria-hidden="true" />
      <div ref={labelRef} className="cjpa-globe-label" aria-hidden="true">
        <span className="cjpa-globe-label-line" />
        <span className="cjpa-globe-label-text">New York City</span>
      </div>
    </div>
  )
}
