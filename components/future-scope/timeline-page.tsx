"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Scale, Sun, Moon, ChevronRight, Loader2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { ParticleBackground } from "./particle-background"

type PathType = "optimistic" | "realistic" | "cautious"

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

const mockPaths: Record<PathType, PathData> = {
  optimistic: {
    milestones: [
      { month: 6, title: "MVP Launch", description: "Successfully launched beta with 500 early users. Seed funding secured.", finance: 40, happiness: 85, stress: 60, elaboration: "The beta launch exceeded expectations with strong user engagement metrics. Your early adopters are providing valuable feedback that's shaping the product roadmap. The seed round closed at $500K, giving you 18 months of runway. Team morale is high, and you've attracted interest from two notable angel investors who want to participate in the next round." },
      { month: 12, title: "Series A", description: "Raised $2M, team expanded to 8 people. Product-market fit achieved.", finance: 65, happiness: 90, stress: 55, elaboration: "Product-market fit is evident from your 40% month-over-month growth and 85% retention rate. The Series A was led by a top-tier VC who brings valuable enterprise connections. Your team now includes experienced hires from Google and Stripe. Customer acquisition cost has dropped 60% as word-of-mouth referrals increase. You're featured in TechCrunch as a rising startup to watch." },
      { month: 18, title: "Rapid Growth", description: "10K users, revenue growing 20% MoM. Media coverage increasing.", finance: 80, happiness: 92, stress: 50, elaboration: "Your platform has become the go-to solution in your niche, with competitors starting to copy your key features. Revenue hit $100K MRR, and you're on track for $2M ARR. Three enterprise clients signed long-term contracts. Your team doubled to 16 people, and you moved into a proper office space. Work-life balance improved with proper systems in place." },
      { month: 24, title: "Market Leader", description: "Became category leader. Partnership with major enterprise.", finance: 90, happiness: 95, stress: 40, elaboration: "You've established yourself as the market leader with 35% market share. A Fortune 500 company signed a $500K annual contract and wants to expand the partnership. Your team of 30 includes a world-class engineering group. Revenue is at $5M ARR with healthy 75% gross margins. You've been invited to speak at major industry conferences." },
      { month: 36, title: "Exit Opportunity", description: "Acquisition offers received. Personal net worth $5M+.", finance: 95, happiness: 98, stress: 30, elaboration: "Three strategic acquirers have approached with offers ranging from $30M to $50M. Your 25% equity stake puts your personal net worth between $7.5M and $12.5M. Alternatively, you could raise a Series B and aim for a $200M+ exit in 3-5 years. Either path offers financial freedom. Your mental health is excellent with proper delegation and a strong leadership team." },
    ],
  },
  realistic: {
    milestones: [
      { month: 6, title: "Prototype Ready", description: "Working prototype, 100 beta users. Bootstrapping continues.", finance: 25, happiness: 70, stress: 70, elaboration: "Your prototype is functional but needs polish. The 100 beta users are providing mixed feedback—some love it, others find it confusing. You're still self-funding and watching your savings dwindle. Late nights are common, but you're learning fast. A few potential angel investors showed interest but want to see more traction before committing." },
      { month: 12, title: "First Revenue", description: "Reached $5K MRR. Considering small angel round.", finance: 45, happiness: 75, stress: 65, elaboration: "Hitting $5K MRR feels like a major milestone. You have 50 paying customers and a 10% monthly churn rate you're working to improve. An angel investor offered $150K for 15% equity—you're weighing whether to take it or keep bootstrapping. Your first customer success story is driving referrals. Stress is manageable but you're still doing everything yourself." },
      { month: 18, title: "Steady Growth", description: "2K users, $15K MRR. Hired first employee.", finance: 60, happiness: 78, stress: 60, elaboration: "Your first hire—a part-time developer—has been transformative. You can finally focus on sales and strategy while they handle bug fixes and small features. Revenue growth is steady at 12% MoM. Competitors are emerging but your head start and customer relationships are defensible. Work-life balance is improving as you learn to delegate." },
      { month: 24, title: "Profitability", description: "Break-even achieved. Sustainable growth path clear.", finance: 70, happiness: 82, stress: 55, elaboration: "Breaking even feels liberating—you're no longer burning through savings. Your team of 3 is efficient and aligned. Revenue hit $30K MRR with healthy unit economics. You've found a sustainable marketing channel and customer acquisition is predictable. For the first time, you took a real vacation without the business suffering." },
      { month: 36, title: "Established Business", description: "Solid $50K MRR business. Work-life balance improved.", finance: 80, happiness: 85, stress: 45, elaboration: "You've built a $600K ARR business that runs smoothly. Your team of 6 handles day-to-day operations, freeing you for strategic work. The business generates $15K+ monthly profit, providing financial security. You work 40-hour weeks and have hobbies again. While not a unicorn, you've achieved something rare—a profitable, sustainable business you enjoy running." },
    ],
  },
  cautious: {
    milestones: [
      { month: 6, title: "Side Project", description: "Building nights and weekends. Keeping job security.", finance: 50, happiness: 60, stress: 50, elaboration: "Progress is slow but steady. You spend 10-15 hours per week on the project while maintaining your day job's performance. The financial stability is comforting but the slow pace is frustrating. Your MVP is 60% complete. You've validated the idea with 20 potential customers who expressed interest. Energy management is the biggest challenge." },
      { month: 12, title: "Validation Phase", description: "50 paying users confirmed. Still employed full-time.", finance: 55, happiness: 65, stress: 55, elaboration: "Having 50 paying users while employed feels like a win. You're earning $2K MRR on the side—not life-changing but validating. Your employer doesn't know about your side project, which creates some anxiety. Customer support takes 5 hours weekly. You're learning what features matter and building confidence that this could work full-time." },
      { month: 18, title: "Decision Point", description: "Revenue covers 30% of salary. Considering transition.", finance: 58, happiness: 68, stress: 60, elaboration: "At $5K MRR, the startup covers 30% of your salary. The decision to go full-time is approaching but feels risky. Your manager offered a promotion that would make leaving harder financially. You calculated you need $10K MRR before making the leap. Stress is elevated as you balance competing demands. Your partner is supportive but anxious about stability." },
      { month: 24, title: "Part-time Leap", description: "Went part-time at job. Startup at $8K MRR.", finance: 62, happiness: 72, stress: 55, elaboration: "Negotiating part-time work was the right call. You kept 60% of your salary and benefits while freeing 20 extra hours weekly for the startup. Revenue jumped to $8K MRR with the additional focus. Your employer is surprisingly supportive—they might even become a customer. The hybrid approach reduces risk while accelerating growth." },
      { month: 36, title: "Gradual Transition", description: "Full-time founder. Modest but stable growth.", finance: 68, happiness: 78, stress: 50, elaboration: "You finally went full-time when revenue hit $15K MRR—enough to match your previous salary. The conservative approach meant slower growth but less stress and no debt. Your business serves 200 customers with excellent retention. While peers who took bigger risks achieved more, you built something sustainable without sacrificing your wellbeing or relationships." },
    ],
  },
}

const pathColors = {
  optimistic: { 
    main: "#10b981", 
    glow: "rgba(16, 185, 129, 0.6)", 
    bg: "rgba(16, 185, 129, 0.15)",
    lightBg: "rgba(16, 185, 129, 0.1)"
  },
  realistic: { 
    main: "#eab308", 
    glow: "rgba(234, 179, 8, 0.6)", 
    bg: "rgba(234, 179, 8, 0.15)",
    lightBg: "rgba(234, 179, 8, 0.12)"
  },
  cautious: { 
    main: "#3b82f6", 
    glow: "rgba(59, 130, 246, 0.6)", 
    bg: "rgba(59, 130, 246, 0.15)",
    lightBg: "rgba(59, 130, 246, 0.1)"
  },
}

function getStatusLabel(value: number, type: "finance" | "happiness" | "stress"): { label: string; color: string } {
  if (type === "stress") {
    if (value <= 30) return { label: "Low", color: "#10b981" }
    if (value <= 50) return { label: "Moderate", color: "#eab308" }
    if (value <= 70) return { label: "High", color: "#f97316" }
    return { label: "Critical", color: "#ef4444" }
  }
  if (value <= 20) return { label: "Poor", color: "#ef4444" }
  if (value <= 40) return { label: "Struggling", color: "#f97316" }
  if (value <= 60) return { label: "Stable", color: "#eab308" }
  if (value <= 80) return { label: "Good", color: "#84cc16" }
  return { label: "Thriving", color: "#10b981" }
}

interface SimulationData {
  optimistic: PathData
  realistic: PathData
  cautious: PathData
}

interface TimelinePageProps {
  onBack: () => void
  situation: string
  darkMode: boolean
  onToggleDarkMode: () => void
  timeHorizon: string
  simulationData: SimulationData
}

// Generate milestones based on time horizon
function generateMilestones(timeHorizon: string): { month: number; label: string }[] {
  switch (timeHorizon) {
    case "1 Year":
      return [
        { month: 3, label: "M3" },
        { month: 6, label: "M6" },
        { month: 9, label: "M9" },
        { month: 12, label: "M12" },
      ]
    case "5 Years":
      return [
        { month: 6, label: "M6" },
        { month: 12, label: "M12" },
        { month: 18, label: "M18" },
        { month: 24, label: "M24" },
        { month: 30, label: "M30" },
        { month: 36, label: "M36" },
        { month: 48, label: "M48" },
        { month: 60, label: "M60" },
      ]
    case "3 Years":
    default:
      return [
        { month: 6, label: "M6" },
        { month: 12, label: "M12" },
        { month: 18, label: "M18" },
        { month: 24, label: "M24" },
        { month: 30, label: "M30" },
        { month: 36, label: "M36" },
      ]
  }
}

// Get milestone data from simulation data
function getMilestoneData(pathsData: SimulationData, pathType: PathType, month: number): Milestone {
  const pathData = pathsData[pathType].milestones
  
  // Find exact match first
  const exactMatch = pathData.find(m => m.month === month)
  if (exactMatch) return exactMatch
  
  // Find closest milestone by month number
  let closestIndex = 0
  let closestDiff = Math.abs(pathData[0].month - month)
  
  for (let i = 1; i < pathData.length; i++) {
    const diff = Math.abs(pathData[i].month - month)
    if (diff < closestDiff) {
      closestDiff = diff
      closestIndex = i
    }
  }
  
  // Return a modified copy with the correct month number
  return {
    ...pathData[closestIndex],
    month: month
  }
}

export function TimelinePage({ onBack, darkMode, onToggleDarkMode, timeHorizon, simulationData }: TimelinePageProps) {
  const milestoneConfig = generateMilestones(timeHorizon)
  
  // Use simulation data instead of mock data
  const pathsData = simulationData
  const [activePath, setActivePath] = useState<PathType>("realistic")
  const [compareMode, setCompareMode] = useState(false)
  const [selectedMilestone, setSelectedMilestone] = useState<{
    path: PathType
    index: number
    month: number
  } | null>(null)
  const [animationComplete, setAnimationComplete] = useState(false)
  const [expandedMilestone, setExpandedMilestone] = useState<{
    path: PathType
    index: number
    month: number
  } | null>(null)
  const [loadingElaboration, setLoadingElaboration] = useState(false)
  const [hoveredNode, setHoveredNode] = useState<{
    path: PathType
    index: number
    month: number
    x: number
    y: number
  } | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setAnimationComplete(true), 2500)
    return () => clearTimeout(timer)
  }, [])

  // Close card when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (selectedMilestone && !target.closest('[data-milestone-card]') && !target.closest('[data-milestone-node]')) {
        setSelectedMilestone(null)
        setExpandedMilestone(null)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [selectedMilestone])

  const handleElaborate = (path: PathType, index: number, month: number) => {
    setLoadingElaboration(true)
    setTimeout(() => {
      setLoadingElaboration(false)
      setExpandedMilestone({ path, index, month })
    }, 1000)
  }

  const handleNodeClick = (path: PathType, index: number, month: number, e: React.MouseEvent<SVGCircleElement>) => {
    e.stopPropagation()
    
    if (selectedMilestone?.path === path && selectedMilestone?.index === index) {
      setSelectedMilestone(null)
      setExpandedMilestone(null)
    } else {
      setSelectedMilestone({ path, index, month })
      setExpandedMilestone(null)
    }
  }

  const closeCard = () => {
    setSelectedMilestone(null)
    setExpandedMilestone(null)
  }

  // Color scheme
  const bgColor = darkMode ? "#0a0a0f" : "#f5f7fa"
  const textColor = darkMode ? "#f1f5f9" : "#1e293b"
  const mutedColor = darkMode ? "#94a3b8" : "#64748b"
  const borderColor = darkMode ? "rgba(148, 163, 184, 0.1)" : "rgba(100, 116, 139, 0.15)"
  const cardBg = darkMode ? "rgba(15, 15, 22, 0.98)" : "#ffffff"
  const headerBg = darkMode ? "rgba(10, 10, 15, 0.9)" : "rgba(255, 255, 255, 0.95)"
  const surfaceBg = darkMode ? "rgba(148, 163, 184, 0.08)" : "rgba(100, 116, 139, 0.08)"

  return (
    <div 
      className="relative h-screen w-full overflow-hidden transition-colors duration-300"
      style={{ backgroundColor: bgColor }}
    >
      {/* Particle Background - same as input page */}
      <ParticleBackground darkMode={darkMode} />

      {/* Top Bar */}
      <div 
        className="fixed left-0 right-0 top-0 z-50 backdrop-blur-xl transition-colors duration-300"
        style={{ 
          borderBottom: `1px solid ${borderColor}`,
          backgroundColor: headerBg
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:opacity-80"
              style={{ 
                color: mutedColor,
                backgroundColor: surfaceBg
              }}
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </button>
            <h1 className="bg-gradient-to-r from-violet-500 to-cyan-400 bg-clip-text text-xl font-bold text-transparent">
              FutureScope
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Path Selectors */}
            <div 
              className="flex gap-1 rounded-xl p-1"
              style={{ backgroundColor: surfaceBg }}
            >
              {(["optimistic", "realistic", "cautious"] as PathType[]).map((path) => {
                const isActive = activePath === path && !compareMode
                return (
                  <button
                    key={path}
                    onClick={() => {
                      setActivePath(path)
                      setCompareMode(false)
                    }}
                    className="rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-all duration-200"
                    style={{
                      color: isActive ? pathColors[path].main : mutedColor,
                      backgroundColor: isActive ? (darkMode ? pathColors[path].bg : pathColors[path].lightBg) : "transparent",
                      boxShadow: isActive ? `0 0 16px ${pathColors[path].glow}` : "none",
                    }}
                  >
                    <span 
                      className="mr-1.5 inline-block h-2 w-2 rounded-full"
                      style={{ backgroundColor: pathColors[path].main }}
                    />
                    <span className="hidden sm:inline">{path}</span>
                  </button>
                )
              })}
            </div>

            {/* Compare Button */}
            <button
              onClick={() => setCompareMode(!compareMode)}
              className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200"
              style={{
                backgroundColor: compareMode ? "rgba(139, 92, 246, 0.15)" : surfaceBg,
                color: compareMode ? "#a78bfa" : mutedColor,
                boxShadow: compareMode ? "0 0 16px rgba(139,92,246,0.3)" : "none"
              }}
            >
              <Scale className="h-4 w-4" />
              <span className="hidden sm:inline">Compare</span>
            </button>

            {/* Dark/Light Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="rounded-lg p-2 transition-colors hover:opacity-80"
              style={{ 
                backgroundColor: surfaceBg,
                color: mutedColor 
              }}
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Timeline Visualization */}
      <div className="relative flex h-screen items-center pt-16">
        <div className="w-full px-8">
          <svg
            viewBox="0 0 1000 500"
            className="h-[calc(100vh-120px)] w-full"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Glow filters for each path */}
              {(["optimistic", "realistic", "cautious"] as PathType[]).map((path) => (
                <filter key={`filter-${path}`} id={`glow-${path}`} x="-100%" y="-100%" width="300%" height="300%">
                  <feGaussianBlur stdDeviation="6" result="blur1" />
                  <feGaussianBlur stdDeviation="10" result="blur2" />
                  <feMerge>
                    <feMergeNode in="blur2" />
                    <feMergeNode in="blur1" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              ))}
            </defs>

            {/* Today Node */}
            <g>
              <motion.circle
                cx="60"
                cy="250"
                r="18"
                fill={darkMode ? "#0a0a0f" : "#ffffff"}
                stroke="#a855f7"
                strokeWidth="2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              />
              <motion.circle
                cx="60"
                cy="250"
                r="10"
                fill="rgba(168, 85, 247, 0.3)"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              />
              <motion.text
                x="60"
                y="282"
                textAnchor="middle"
                fill="#a855f7"
                fontSize="11"
                fontWeight="600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Today
              </motion.text>
            </g>

            {/* Path Lines and Nodes */}
            {(["optimistic", "realistic", "cautious"] as PathType[]).map((pathType, pathIndex) => {
              const yPositions = { optimistic: 60, realistic: 250, cautious: 440 }
              const endY = yPositions[pathType]
              const startX = 60
              const startY = 250
              const endX = 940
              
              // Check if this path should be highlighted
              const isHighlighted = compareMode || activePath === pathType
              
              // Create an elegant curve that diverges immediately from the start
              // Using two cubic bezier segments for a more natural flowing curve
              // First control point pulls toward the target Y early to separate paths
              const midX = startX + (endX - startX) * 0.35
              const midY = endY // Reach target Y by midpoint
              
              // Control points for first half - diverge quickly
              const cp1x = startX + 60
              const cp1y = startY + (endY - startY) * 0.6 // Pull toward target Y quickly
              
              // Control points for second half - smooth continuation
              const cp2x = midX - 60
              const cp2y = endY
              const cp3x = midX + 100
              const cp3y = endY
              const cp4x = endX - 100
              const cp4y = endY
              
              // Two-segment bezier for elegant diverging curves
              const pathD = `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${midX} ${midY} C ${cp3x} ${cp3y}, ${cp4x} ${cp4y}, ${endX} ${endY}`

              // Calculate opacity: all start equal, then animate based on selection
              const pathOpacity = isHighlighted ? 1 : 0.25
              const nodeOpacity = isHighlighted ? 1 : 0.25
              const innerDotOpacity = isHighlighted ? 0.8 : 0.15

              return (
                <g key={pathType} style={{ opacity: pathOpacity, transition: "opacity 0.3s ease" }}>
                  {/* Path Line */}
                  <motion.path
                    d={pathD}
                    fill="none"
                    stroke={pathColors[pathType].main}
                    strokeWidth={isHighlighted ? 3.5 : 2}
                    strokeDasharray="10 6"
                    filter={isHighlighted ? `url(#glow-${pathType})` : undefined}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ 
                      pathLength: { duration: 1.8, delay: pathIndex * 0.25, ease: "easeOut" }
                    }}
                  />

                  {/* Milestone Nodes positioned along the curve */}
                  {milestoneConfig.map((milestoneInfo, index) => {
                    const totalNodes = milestoneConfig.length
                    // Spacing: available width / (number of nodes + 1)
                    const spacing = (endX - startX) / (totalNodes + 1)
                    const nodeX = startX + spacing * (index + 1)
                    
                    // Calculate Y position based on where we are on the curve
                    // The curve reaches endY by x = midX (35% of the way)
                    // After that it stays at endY
                    let nodeY: number
                    if (nodeX <= midX) {
                      // First segment: diverging from startY to endY
                      const segmentT = (nodeX - startX) / (midX - startX)
                      // Use eased transition for smooth curve feel
                      const easedT = 1 - Math.pow(1 - segmentT, 2)
                      nodeY = startY + (endY - startY) * easedT
                    } else {
                      // Second segment: stays at endY
                      nodeY = endY
                    }
                    
                    const isSelected = selectedMilestone?.path === pathType && selectedMilestone?.index === index
                    const nodeDelay = 0.25 + pathIndex * 0.25 + (index + 1) * 0.08

                    return (
                      <g key={`${pathType}-${index}-${milestoneInfo.month}`}>
                        {/* Node Circle */}
                        <motion.circle
                          data-milestone-node
                          r={isSelected ? 14 : 10}
                          fill={darkMode ? "#0a0a0f" : "#ffffff"}
                          stroke={pathColors[pathType].main}
                          strokeWidth={isHighlighted ? 3 : 2}
                          filter={isHighlighted ? `url(#glow-${pathType})` : undefined}
                          initial={{ scale: 0, cx: nodeX, cy: nodeY }}
                          animate={{ 
                            scale: animationComplete ? 1 : [0, 1.2, 1],
                            cx: nodeX,
                            cy: nodeY
                          }}
                          transition={{ 
                            scale: { delay: nodeDelay, duration: 0.35, ease: "backOut" },
                            cx: { duration: 0.5, ease: "easeInOut" },
                            cy: { duration: 0.5, ease: "easeInOut" }
                          }}
                          onClick={(e) => handleNodeClick(pathType, index, milestoneInfo.month, e)}
                          onMouseEnter={() => setHoveredNode({ path: pathType, index, month: milestoneInfo.month, x: nodeX, y: nodeY })}
                          onMouseLeave={() => setHoveredNode(null)}
                          style={{ cursor: "pointer" }}
                        />
                        
                        {/* Inner dot */}
                        <motion.circle
                          r="4"
                          fill={pathColors[pathType].main}
                          initial={{ scale: 0, cx: nodeX, cy: nodeY }}
                          animate={{ 
                            scale: 1,
                            cx: nodeX,
                            cy: nodeY
                          }}
                          transition={{ 
                            scale: { delay: nodeDelay + 0.08, duration: 0.25 },
                            cx: { duration: 0.5, ease: "easeInOut" },
                            cy: { duration: 0.5, ease: "easeInOut" }
                          }}
                          style={{ pointerEvents: "none" }}
                        />

                        {/* Month Label */}
                        <motion.text
                          textAnchor="middle"
                          fill={isHighlighted ? mutedColor : (darkMode ? "#4b5563" : "#94a3b8")}
                          fontSize="10"
                          fontWeight="500"
                          initial={{ x: nodeX, y: nodeY + 26 }}
                          animate={{ x: nodeX, y: nodeY + 26 }}
                          transition={{ duration: 0.5, ease: "easeInOut" }}
                        >
                          {milestoneInfo.label}
                        </motion.text>
                      </g>
                    )
                  })}
                </g>
              )
            })}
          </svg>

          {/* Month Tooltip on Hover */}
          <AnimatePresence>
            {hoveredNode && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.15 }}
                className="pointer-events-none fixed z-50 rounded-full px-3 py-1.5 text-xs font-semibold"
                style={{
                  left: `calc(${(hoveredNode.x / 1000) * 100}% + 0.5rem)`,
                  top: `calc(${(hoveredNode.y / 500) * (100 - 12)}% + 4rem - 45px)`,
                  transform: "translateX(-50%)",
                  backgroundColor: darkMode ? "#1a1a2e" : "#ffffff",
                  color: darkMode ? "#ffffff" : "#1e293b",
                  boxShadow: darkMode 
                    ? "0 4px 12px rgba(0, 0, 0, 0.4)" 
                    : "0 4px 12px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.05)"
                }}
              >
                Month {hoveredNode.month}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Milestone Card */}
          <AnimatePresence>
            {selectedMilestone && (
              <motion.div
                data-milestone-card
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="pointer-events-auto fixed left-1/2 top-1/2 z-50 w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-2xl p-6"
                style={{
                  maxHeight: "80vh",
                  overflowY: "auto",
                  backgroundColor: cardBg,
                  border: `1px solid ${pathColors[selectedMilestone.path].main}50`,
                  boxShadow: darkMode 
                    ? `0 0 40px ${pathColors[selectedMilestone.path].glow}, 0 20px 40px -12px rgba(0, 0, 0, 0.5)`
                    : `0 0 30px ${pathColors[selectedMilestone.path].glow}, 0 20px 40px -12px rgba(0, 0, 0, 0.15)`,
                }}
              >
                {/* Close button */}
                <button
                  onClick={closeCard}
                  className="absolute right-3 top-3 rounded-full p-1.5 transition-colors hover:opacity-70"
                  style={{ 
                    backgroundColor: surfaceBg,
                    color: mutedColor
                  }}
                >
                  <X className="h-4 w-4" />
                </button>

                {(() => {
                  const milestoneData = getMilestoneData(pathsData, selectedMilestone.path, selectedMilestone.month)
                  return (
                    <>
                      <h3 
                        className="mb-2 pr-8 text-xl font-bold"
                        style={{ color: textColor }}
                      >
                        {milestoneData.title}
                      </h3>
                      <p 
                        className="mb-5 text-sm leading-relaxed"
                        style={{ color: mutedColor }}
                      >
                        {milestoneData.description}
                      </p>
                      
                      <div className="space-y-3">
                        <LabeledStatBar
                          label="Finance"
                          value={milestoneData.finance}
                          type="finance"
                          darkMode={darkMode}
                        />
                        <LabeledStatBar
                          label="Happiness"
                          value={milestoneData.happiness}
                          type="happiness"
                          darkMode={darkMode}
                        />
                        <LabeledStatBar
                          label="Stress"
                          value={milestoneData.stress}
                          type="stress"
                          darkMode={darkMode}
                        />
                      </div>
                    </>
                  )
                })()}

                {/* Elaborate Button */}
                <button
                  onClick={() => handleElaborate(selectedMilestone.path, selectedMilestone.index, selectedMilestone.month)}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-all hover:brightness-110"
                  style={{
                    backgroundColor: darkMode ? pathColors[selectedMilestone.path].bg : pathColors[selectedMilestone.path].lightBg,
                    color: pathColors[selectedMilestone.path].main,
                    border: `1px solid ${pathColors[selectedMilestone.path].main}30`
                  }}
                >
                  {loadingElaboration ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      Elaborate
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                {/* Expanded Elaboration */}
                <AnimatePresence>
                  {expandedMilestone?.path === selectedMilestone.path && 
                   expandedMilestone?.index === selectedMilestone.index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div 
                        className="mt-4 rounded-xl p-4 text-sm leading-relaxed"
                        style={{ 
                          backgroundColor: surfaceBg,
                          color: mutedColor 
                        }}
                      >
                        {getMilestoneData(pathsData, selectedMilestone.path, selectedMilestone.month).elaboration}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Compare Panel */}
      <AnimatePresence>
        {compareMode && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-40 p-6 backdrop-blur-xl"
            style={{ 
              borderTop: `1px solid ${borderColor}`,
              backgroundColor: cardBg 
            }}
          >
            <h3 
              className="mb-4 text-center text-lg font-semibold"
              style={{ color: textColor }}
            >
              Path Comparison at Final Milestone
            </h3>
            <div className="mx-auto grid max-w-4xl grid-cols-3 gap-4">
              {(["optimistic", "realistic", "cautious"] as PathType[]).map((path) => {
                const finalMilestone = getMilestoneData(pathsData, path, milestoneConfig[milestoneConfig.length - 1].month)
                return (
                  <div
                    key={path}
                    className="rounded-xl p-4"
                    style={{
                      border: `1px solid ${pathColors[path].main}30`,
                      backgroundColor: darkMode ? pathColors[path].bg : pathColors[path].lightBg,
                    }}
                  >
                    <h4
                      className="mb-3 flex items-center justify-center gap-2 text-sm font-semibold capitalize"
                      style={{ color: pathColors[path].main }}
                    >
                      <span 
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: pathColors[path].main }}
                      />
                      {path}
                    </h4>
                    <div className="space-y-2">
                      <LabeledStatBar label="Finance" value={finalMilestone.finance} type="finance" darkMode={darkMode} compact />
                      <LabeledStatBar label="Happiness" value={finalMilestone.happiness} type="happiness" darkMode={darkMode} compact />
                      <LabeledStatBar label="Stress" value={finalMilestone.stress} type="stress" darkMode={darkMode} compact />
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function LabeledStatBar({ 
  label, 
  value, 
  type,
  darkMode,
  compact = false
}: { 
  label: string
  value: number
  type: "finance" | "happiness" | "stress"
  darkMode: boolean
  compact?: boolean
}) {
  const status = getStatusLabel(value, type)
  
  return (
    <div className={compact ? "space-y-1" : "space-y-1.5"}>
      <div className="flex items-center justify-between">
        <span 
          className={cn("font-medium", compact ? "text-xs" : "text-sm")}
          style={{ color: darkMode ? "#94a3b8" : "#64748b" }}
        >
          {label}
        </span>
        <span 
          className={cn("font-semibold", compact ? "text-xs" : "text-sm")}
          style={{ color: status.color }}
        >
          {status.label}
        </span>
      </div>
      <div 
        className={cn("overflow-hidden rounded-full", compact ? "h-1.5" : "h-2")}
        style={{ backgroundColor: darkMode ? "rgba(148, 163, 184, 0.15)" : "rgba(100, 116, 139, 0.12)" }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: status.color }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  )
}
