"use client"

import { useState } from "react"
import { InputPage } from "@/components/future-scope/input-page"
import { TimelinePage } from "@/components/future-scope/timeline-page"
import { LoadingScreen } from "@/components/future-scope/loading-screen"

type Screen = "input" | "loading" | "timeline"

interface FormData {
  situation: string
  decision: string
  priorities: string[]
  riskAppetite: number
  timeHorizon: string
}

interface Milestone {
  month: number
  title: string
  description: string
  finance: number
  happiness: number
  stress: number
  elaboration: string
}

interface PathData {
  milestones: Milestone[]
}

export interface SimulationData {
  optimistic: PathData
  realistic: PathData
  cautious: PathData
}

export default function FutureScopePage() {
  const [screen, setScreen] = useState<Screen>("input")
  const [formData, setFormData] = useState<FormData | null>(null)
  const [darkMode, setDarkMode] = useState(true)
  const [simulationData, setSimulationData] = useState<SimulationData | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSimulate = async (data: FormData) => {
    setFormData(data)
    setScreen("loading")
    setError(null)
    
    try {
      const response = await fetch("/api/simulate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to simulate")
      }

      const result = await response.json()
      setSimulationData(result)
      setScreen("timeline")
    } catch (err) {
      console.error("Simulation error:", err)
      setError(err instanceof Error ? err.message : "Failed to generate simulation")
      setScreen("input")
    }
  }

  const handleBack = () => {
    setScreen("input")
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  if (screen === "loading") {
    return <LoadingScreen darkMode={darkMode} />
  }

  if (screen === "timeline" && simulationData) {
    return (
      <TimelinePage
        onBack={handleBack}
        situation={formData?.situation || ""}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        timeHorizon={formData?.timeHorizon || "3 Years"}
        simulationData={simulationData}
      />
    )
  }

  return (
    <InputPage 
      onSimulate={handleSimulate} 
      darkMode={darkMode}
      onToggleDarkMode={toggleDarkMode}
      error={error}
    />
  )
}
