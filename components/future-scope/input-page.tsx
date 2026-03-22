"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ParticleBackground } from "./particle-background"
import { Sun, Moon } from "lucide-react"
import { cn } from "@/lib/utils"

const priorities = [
  { id: "money", label: "Money" },
  { id: "health", label: "Health" },
  { id: "relationships", label: "Relationships" },
  { id: "career", label: "Career" },
  { id: "mental-peace", label: "Mental Peace" },
  { id: "freedom", label: "Freedom" },
]

const timeHorizons = ["1 Year", "3 Years", "5 Years"]

const riskLabels = ["Safe", "Balanced", "Bold"]

interface InputPageProps {
  onSimulate: (data: FormData) => void
  darkMode: boolean
  onToggleDarkMode: () => void
  error?: string | null
}

interface FormData {
  situation: string
  decision: string
  priorities: string[]
  riskAppetite: number
  timeHorizon: string
}

export function InputPage({ onSimulate, darkMode, onToggleDarkMode, error }: InputPageProps) {
  const [situation, setSituation] = useState("")
  const [decision, setDecision] = useState("")
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([])
  const [riskAppetite, setRiskAppetite] = useState(50)
  const [timeHorizon, setTimeHorizon] = useState("3 Years")

  const togglePriority = (id: string) => {
    setSelectedPriorities((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  const getRiskLabel = () => {
    if (riskAppetite < 33) return riskLabels[0]
    if (riskAppetite < 66) return riskLabels[1]
    return riskLabels[2]
  }

  const handleSubmit = () => {
    onSimulate({
      situation,
      decision,
      priorities: selectedPriorities,
      riskAppetite,
      timeHorizon,
    })
  }

  // Color scheme matching timeline page
  const bgColor = darkMode ? "#0a0a0f" : "#f5f7fa"
  const textColor = darkMode ? "#f1f5f9" : "#1e293b"
  const mutedColor = darkMode ? "#94a3b8" : "#64748b"
  const inputBg = darkMode ? "rgba(148, 163, 184, 0.08)" : "#ffffff"
  const inputBorder = darkMode ? "rgba(148, 163, 184, 0.15)" : "rgba(100, 116, 139, 0.2)"
  const cardShadow = darkMode ? "none" : "0 2px 8px rgba(100, 116, 139, 0.1)"

  return (
    <div 
      className="relative min-h-screen w-full overflow-hidden transition-colors duration-300"
      style={{ backgroundColor: bgColor }}
    >
      {/* Particles */}
      <ParticleBackground darkMode={darkMode} />
      
      {/* Theme Toggle - Top Right */}
      <button
        onClick={onToggleDarkMode}
        className="fixed right-4 top-4 z-50 rounded-lg p-2.5 transition-all hover:opacity-80"
        style={{ 
          backgroundColor: darkMode ? "rgba(148, 163, 184, 0.1)" : "#ffffff",
          boxShadow: darkMode ? "none" : "0 2px 12px rgba(100, 116, 139, 0.12)",
          color: mutedColor 
        }}
      >
        {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>
      
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-2xl"
        >
          {/* Header */}
          <div className="mb-10 text-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-3 bg-gradient-to-r from-violet-500 to-cyan-400 bg-clip-text text-5xl font-bold tracking-tight text-transparent md:text-6xl"
            >
              FutureScope
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg"
              style={{ color: mutedColor }}
            >
              See your decisions before you make them
            </motion.p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center text-red-400"
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <div className="space-y-6">
            {/* Situation Textarea */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <label 
                className="mb-2 block text-sm font-medium"
                style={{ color: textColor }}
              >
                Describe your current situation
              </label>
              <textarea
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
                placeholder="I'm 21, in final year of college, have a startup idea..."
                className="min-h-[120px] w-full rounded-xl px-4 py-3 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                style={{
                  backgroundColor: inputBg,
                  border: `1px solid ${inputBorder}`,
                  color: textColor,
                  boxShadow: cardShadow,
                }}
              />
            </motion.div>

            {/* Decision Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <label 
                className="mb-2 block text-sm font-medium"
                style={{ color: textColor }}
              >
                What decision are you facing?
              </label>
              <input
                type="text"
                value={decision}
                onChange={(e) => setDecision(e.target.value)}
                placeholder="Should I drop out and pursue my startup?"
                className="w-full rounded-xl px-4 py-3 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                style={{
                  backgroundColor: inputBg,
                  border: `1px solid ${inputBorder}`,
                  color: textColor,
                  boxShadow: cardShadow,
                }}
              />
            </motion.div>

            {/* Priorities Pills */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <label 
                className="mb-3 block text-sm font-medium"
                style={{ color: textColor }}
              >
                What matters most to you?
              </label>
              <div className="flex flex-wrap gap-2">
                {priorities.map((priority) => {
                  const isSelected = selectedPriorities.includes(priority.id)
                  return (
                    <button
                      key={priority.id}
                      onClick={() => togglePriority(priority.id)}
                      className={cn(
                        "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200"
                      )}
                      style={{
                        backgroundColor: isSelected 
                          ? (darkMode ? "rgba(139, 92, 246, 0.2)" : "rgba(139, 92, 246, 0.12)")
                          : inputBg,
                        border: `1px solid ${isSelected 
                          ? "rgba(139, 92, 246, 0.5)"
                          : inputBorder}`,
                        color: isSelected 
                          ? "#8b5cf6"
                          : mutedColor,
                        boxShadow: isSelected 
                          ? "0 0 12px rgba(139, 92, 246, 0.25)"
                          : cardShadow,
                      }}
                    >
                      {priority.label}
                    </button>
                  )
                })}
              </div>
            </motion.div>

            {/* Risk Appetite Slider */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <label 
                className="mb-3 block text-sm font-medium"
                style={{ color: textColor }}
              >
                Your Risk Appetite
              </label>
              <div className="relative pt-8">
                {/* Risk Label Pill */}
                <div
                  className="absolute -top-1 transition-all duration-200"
                  style={{ left: `calc(${riskAppetite}% - 30px)` }}
                >
                  <span 
                    className="rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-3 py-1 text-xs font-semibold text-white"
                    style={{ 
                      boxShadow: "0 4px 12px rgba(139, 92, 246, 0.3)"
                    }}
                  >
                    {getRiskLabel()}
                  </span>
                </div>
                
                {/* Slider Track */}
                <div 
                  className="relative h-2 w-full rounded-full bg-gradient-to-r from-blue-500 via-amber-400 to-orange-500"
                  style={{ boxShadow: cardShadow }}
                >
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={riskAppetite}
                    onChange={(e) => setRiskAppetite(Number(e.target.value))}
                    className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md"
                  />
                </div>
                
                {/* Labels */}
                <div 
                  className="mt-3 flex justify-between text-xs"
                  style={{ color: mutedColor }}
                >
                  <span>Play it Safe</span>
                  <span>Go Bold</span>
                </div>
              </div>
            </motion.div>

            {/* Time Horizon */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <label 
                className="mb-3 block text-sm font-medium"
                style={{ color: textColor }}
              >
                Time Horizon
              </label>
              <div className="flex gap-2">
                {timeHorizons.map((horizon) => {
                  const isSelected = timeHorizon === horizon
                  return (
                    <button
                      key={horizon}
                      onClick={() => setTimeHorizon(horizon)}
                      className="flex-1 rounded-xl py-3 text-sm font-medium transition-all duration-200"
                      style={{
                        backgroundColor: isSelected 
                          ? (darkMode ? "rgba(34, 211, 238, 0.15)" : "rgba(20, 184, 166, 0.1)")
                          : inputBg,
                        border: `1px solid ${isSelected 
                          ? "rgba(20, 184, 166, 0.5)"
                          : inputBorder}`,
                        color: isSelected 
                          ? (darkMode ? "#22d3ee" : "#14b8a6")
                          : mutedColor,
                        boxShadow: cardShadow,
                      }}
                    >
                      {horizon}
                    </button>
                  )
                })}
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="pt-4"
            >
              <button
                onClick={handleSubmit}
                className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 py-4 text-lg font-semibold text-white transition-all duration-300 hover:brightness-110"
                style={{
                  boxShadow: "0 8px 24px rgba(139, 92, 246, 0.35)"
                }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Simulate My Futures
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-violet-700 to-cyan-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
