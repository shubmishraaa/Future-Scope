"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  hue: number
}

interface ParticleBackgroundProps {
  darkMode?: boolean
}

export function ParticleBackground({ darkMode = true }: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const particles: Particle[] = []
    const particleCount = 60

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2.5 + 1,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.5 + 0.2,
        hue: Math.random() * 60 + 250, // Purple to cyan range (250-310)
      })
    }

    let animationFrameId: number

    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle, i) => {
        particle.x += particle.speedX
        particle.y += particle.speedY

        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        // Different colors for dark vs light mode
        let color: string
        let glowColor: string
        
        if (darkMode) {
          // Purple/cyan particles for dark mode
          color = `hsla(${particle.hue}, 80%, 65%, ${particle.opacity})`
          glowColor = `hsla(${particle.hue}, 80%, 65%, ${particle.opacity * 0.3})`
        } else {
          // Teal/blue particles for light mode - more visible
          const lightHue = particle.hue > 280 ? 200 : 180 // Shift to teal/blue range
          color = `hsla(${lightHue}, 70%, 45%, ${particle.opacity * 0.7})`
          glowColor = `hsla(${lightHue}, 70%, 45%, ${particle.opacity * 0.25})`
        }

        // Draw glow
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2)
        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.size * 3
        )
        gradient.addColorStop(0, glowColor)
        gradient.addColorStop(1, "transparent")
        ctx.fillStyle = gradient
        ctx.fill()

        // Draw particle core
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.fill()

        // Draw connections between nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[j].x - particle.x
          const dy = particles[j].y - particle.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < 120) {
            const lineOpacity = (1 - distance / 120) * (darkMode ? 0.15 : 0.08)
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = darkMode 
              ? `rgba(168, 85, 247, ${lineOpacity})`
              : `rgba(20, 184, 166, ${lineOpacity})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [darkMode])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0"
    />
  )
}
