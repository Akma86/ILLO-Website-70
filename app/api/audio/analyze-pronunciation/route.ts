import { GoogleGenerativeAI } from '@google/generative-ai'

interface PronunciationAnalysis {
  transcription: string
  mistakes: string[]
  ipa_student: string
  ipa_correct: string
  feedback: string
}

export async function POST(request: Request) {
  try {
    const { audioBase64, audioMimeType } = await request.json()

    if (!audioBase64 || !audioMimeType) {
      return Response.json(
        { error: 'Missing audioBase64 or audioMimeType' },
        { status: 400 }
      )
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return Response.json(
        { error: 'GEMINI_API_KEY not configured' },
        { status: 500 }
      )
    }

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`

    const prompt = `You are an English pronunciation tutor. Analyze the student's audio and return the following fields in JSON format only (no other text):
{
  "transcription": "what the student actually pronounced",
  "mistakes": ["list", "of", "pronunciation errors"],
  "ipa_student": "IPA representation of what the student said",
  "ipa_correct": "IPA for the correct pronunciation",
  "feedback": "how the student can improve each mistake"
}

Important rules:
- Do NOT guess what the student intended to say.
- Only analyze what was actually spoken.
- Identify substituted, missing, or incorrect phonemes.
- Provide short, clear feedback.
- Return ONLY valid JSON, no additional text.`

    const requestBody = {
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType: audioMimeType,
                data: audioBase64,
              },
            },
            {
              text: prompt,
            },
          ],
        },
      ],
    }

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('[v0] Gemini API error:', errorData)
      return Response.json(
        { error: `Gemini API error: ${response.statusText}` },
        { status: response.status }
      )
    }

    const data = await response.json()

    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error('[v0] Unexpected Gemini response structure:', data)
      return Response.json(
        { error: 'Invalid response structure from Gemini API' },
        { status: 500 }
      )
    }

    const responseText = data.candidates[0].content.parts[0].text

    let analysis: PronunciationAnalysis
    try {
      analysis = JSON.parse(responseText)
    } catch (parseError) {
      console.error('[v0] Failed to parse Gemini response as JSON:', responseText)
      return Response.json(
        { error: 'Invalid JSON response from Gemini API' },
        { status: 500 }
      )
    }

    return Response.json({
      success: true,
      analysis,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[v0] Pronunciation analysis error:', error)
    return Response.json(
      { error: 'Failed to analyze pronunciation' },
      { status: 500 }
    )
  }
}
