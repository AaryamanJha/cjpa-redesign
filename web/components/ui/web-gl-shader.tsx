"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export function WebGLShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<{
    scene: THREE.Scene | null
    camera: THREE.OrthographicCamera | null
    renderer: THREE.WebGLRenderer | null
    mesh: THREE.Mesh | null
    uniforms: Record<string, { value: unknown }> | null
    animationId: number | null
  }>({
    scene: null,
    camera: null,
    renderer: null,
    mesh: null,
    uniforms: null,
    animationId: null,
  })

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const { current: refs } = sceneRef

    const vertexShader = `
      attribute vec3 position;
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `

    // CJPA-adapted: gold wave lines on navy instead of RGB chromatic aberration
    const fragmentShader = `
      precision highp float;
      uniform vec2 resolution;
      uniform float time;
      uniform float xScale;
      uniform float yScale;
      uniform float distortion;

      void main() {
        vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

        float wave1 = 0.035 / abs(p.y + sin((p.x + time * 0.5) * xScale) * yScale);
        float wave2 = 0.022 / abs(p.y + 0.18 + sin((p.x * 0.9 - time * 0.3) * xScale * 0.85) * yScale * 0.7);
        float wave3 = 0.012 / abs(p.y - 0.25 + sin((p.x * 1.15 + time * 0.2) * xScale * 1.1) * yScale * 0.5);

        // CJPA gold #C8A96A
        vec3 goldColor = vec3(0.784, 0.663, 0.416);
        // CJPA navy #070B14
        vec3 bgColor = vec3(0.027, 0.043, 0.078);

        float intensity = clamp((wave1 + wave2 + wave3) * 0.35, 0.0, 1.0);
        vec3 color = mix(bgColor, goldColor, intensity);
        gl_FragColor = vec4(color, 1.0);
      }
    `

    const getSize = () => {
      const parent = canvas.parentElement
      if (parent) {
        const rect = parent.getBoundingClientRect()
        return { width: rect.width || parent.clientWidth, height: rect.height || parent.clientHeight }
      }
      return { width: window.innerWidth, height: window.innerHeight }
    }

    const initScene = () => {
      const { width, height } = getSize()

      refs.scene = new THREE.Scene()
      refs.renderer = new THREE.WebGLRenderer({ canvas, antialias: false })
      refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      refs.renderer.setClearColor(new THREE.Color(0x070B14))
      refs.renderer.setSize(width, height, false)

      refs.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, -1)

      refs.uniforms = {
        resolution: { value: [width, height] },
        time: { value: 0.0 },
        xScale: { value: 1.0 },
        yScale: { value: 0.45 },
        distortion: { value: 0.05 },
      }

      const position = [
        -1.0, -1.0, 0.0,
         1.0, -1.0, 0.0,
        -1.0,  1.0, 0.0,
         1.0, -1.0, 0.0,
        -1.0,  1.0, 0.0,
         1.0,  1.0, 0.0,
      ]

      const positions = new THREE.BufferAttribute(new Float32Array(position), 3)
      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute("position", positions)

      const material = new THREE.RawShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: refs.uniforms,
        side: THREE.DoubleSide,
      })

      refs.mesh = new THREE.Mesh(geometry, material)
      refs.scene.add(refs.mesh)
    }

    const animate = () => {
      if (refs.uniforms) (refs.uniforms.time as { value: number }).value += 0.008
      if (refs.renderer && refs.scene && refs.camera) {
        refs.renderer.render(refs.scene, refs.camera)
      }
      refs.animationId = requestAnimationFrame(animate)
    }

    const handleResize = () => {
      if (!refs.renderer || !refs.uniforms) return
      const { width, height } = getSize()
      refs.renderer.setSize(width, height, false)
      ;(refs.uniforms.resolution as { value: number[] }).value = [width, height]
    }

    initScene()
    animate()

    const ro = new ResizeObserver(handleResize)
    if (canvas.parentElement) ro.observe(canvas.parentElement)

    return () => {
      if (refs.animationId) cancelAnimationFrame(refs.animationId)
      ro.disconnect()
      if (refs.mesh) {
        refs.scene?.remove(refs.mesh)
        refs.mesh.geometry.dispose()
        if (refs.mesh.material instanceof THREE.Material) refs.mesh.material.dispose()
      }
      refs.renderer?.dispose()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full block"
    />
  )
}
