"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface LoadingScreenProps {
  darkMode: boolean
}

export function LoadingScreen({ darkMode }: LoadingScreenProps) {
  const [outcomes, setOutcomes] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setOutcomes((prev) => {
        const newValue = prev + Math.floor(Math.random() * 50) + 20
        return newValue > 847 ? 847 : newValue
      })
    }, 100)

    return () => clearInterval(interval)
  }, [])

  const bgColor = darkMode ? "#0a0a0f" : "#f8f7ff"
  const mutedColor = darkMode ? "#6b7280" : "#64748b"

  return (
    <div 
      className="flex min-h-screen items-center justify-center transition-colors duration-300"
      style={{ backgroundColor: bgColor }}
    >
      <div className="text-center">
        {/* Animated Branching Lines */}
        <svg
          viewBox="0 0 400 200"
          className="mx-auto mb-8 h-48 w-96"
        >
          <defs>
            <linearGradient id="line-gradient-1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
            <linearGradient id="line-gradient-2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
            <linearGradient id="line-gradient-3" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <filter id="glow-loading" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Starting node */}
          <motion.circle
            cx="50"
            cy="100"
            r="8"
            fill="#a855f7"
            filter="url(#glow-loading)"
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />

          {/* Top branch - S curve */}
          <motion.path
            d="M 50 100 C 100 100 120 50 200 50 L 350 50"
            fill="none"
            stroke="url(#line-gradient-1)"
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#glow-loading)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Middle branch - slight curve */}
          <motion.path
            d="M 50 100 C 100 100 150 100 200 100 L 350 100"
            fill="none"
            stroke="url(#line-gradient-2)"
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#glow-loading)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.3, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Bottom branch - S curve */}
          <motion.path
            d="M 50 100 C 100 100 120 150 200 150 L 350 150"
            fill="none"
            stroke="url(#line-gradient-3)"
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#glow-loading)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.6, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* End nodes */}
          <motion.circle
            cx="350"
            cy="50"
            r="6"
            fill="#10b981"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.circle
            cx="350"
            cy="100"
            r="6"
            fill="#f59e0b"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, delay: 0.3, repeat: Infinity }}
          />
          <motion.circle
            cx="350"
            cy="150"
            r="6"
            fill="#3b82f6"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, delay: 0.6, repeat: Infinity }}
          />
        </svg>

        {/* Text with typing animation */}
        <motion.h2
          className="mb-3 bg-gradient-to-r from-purple-500 to-cyan-400 bg-clip-text text-2xl font-bold text-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.span
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Simulating your futures...
          </motion.span>
        </motion.h2>

        <motion.p
          style={{ color: mutedColor }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Analyzing{" "}
          <span className="font-mono text-purple-400">{outcomes}</span>{" "}
          possible outcomes...
        </motion.p>
      </div>
    </div>
  )
}
