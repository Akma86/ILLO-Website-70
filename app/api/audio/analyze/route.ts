import { generateText } from "ai"

export async function POST(request: Request) {
  try {
    const { audioName, duration, studentLevel } = await request.json()

    const { text: analysis } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `Analyze this English lesson audio recording for a ${studentLevel} student:
      
Recording Name: ${audioName}
Duration: ${duration} minutes

Provide a detailed analysis in JSON format with:
1. Pronunciation Score (0-100)
2. Vocabulary Assessment (0-100)
3. Fluency Score (0-100)
4. Listening Comprehension (0-100)
5. Key Strengths (2-3 bullet points)
6. Areas for Improvement (2-3 bullet points)
7. Recommended Next Lesson Focus
8. Overall Performance Summary

Format as valid JSON.`,
    })

    // Parse the AI response as JSON
    const parsed = JSON.parse(analysis)

    return Response.json({
      success: true,
      analysis: parsed,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Audio analysis error:", error)
    return Response.json({ error: "Failed to analyze audio" }, { status: 500 })
  }
}
