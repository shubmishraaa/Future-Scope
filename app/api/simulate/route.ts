import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { situation, decision, priorities, riskAppetite, timeHorizon } = await request.json()

    const apiKey = process.env.GEMINI_API_KEY
    console.log("API Key starts with:", apiKey?.substring(0, 8))

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      )
    }

    // Determine milestones based on time horizon
    let milestoneMonths: number[]
    switch (timeHorizon) {
      case "1 Year":
        milestoneMonths = [3, 6, 9, 12]
        break
      case "5 Years":
        milestoneMonths = [6, 12, 18, 24, 30, 36, 48, 60]
        break
      case "3 Years":
      default:
        milestoneMonths = [6, 12, 18, 24, 30, 36]
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a life simulation engine. Generate 3 future timelines as raw JSON only.
No markdown, no backticks, just JSON.

Situation: ${situation}
Decision: ${decision}
Priorities: ${Array.isArray(priorities) ? priorities.join(", ") : priorities}
Risk appetite: ${riskAppetite}/100
Time horizon: ${timeHorizon}

Generate milestones for months: ${milestoneMonths.join(", ")}

Return this exact structure:
{
  "optimistic": {
    "milestones": [
      {
        "month": 6,
        "title": "Short title",
        "description": "1-2 sentence description",
        "finance": 75,
        "happiness": 85,
        "stress": 40,
        "elaboration": "Detailed paragraph about this milestone (3-5 sentences)"
      }
    ]
  },
  "realistic": { "milestones": [...] },
  "cautious": { "milestones": [...] }
}

Important:
- Each path must have exactly ${milestoneMonths.length} milestones at months: ${milestoneMonths.join(", ")}
- finance, happiness, stress are numbers 0-100
- optimistic shows best-case outcomes
- realistic shows likely outcomes  
- cautious shows conservative outcomes
- Make each path distinct and coherent`
            }]
          }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 8192,
          }
        })
      }
    )

    if (!response.ok) {
      console.error("Gemini API error:", await response.text())
      return NextResponse.json(
        { error: "Failed to generate simulation" },
        { status: response.status }
      )
    }

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!text) {
      return NextResponse.json(
        { error: "No content in response" },
        { status: 500 }
      )
    }

    // Clean and parse JSON
    const cleaned = text.replace(/```json|```/g, "").trim()
    const parsed = JSON.parse(cleaned)

    return NextResponse.json(parsed)

  } catch (error) {
    console.error("Simulate error:", error)
    return NextResponse.json(
      { error: "Failed to generate simulation" },
      { status: 500 }
    )
  }
}