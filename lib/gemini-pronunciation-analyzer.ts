export async function convertAudioToBase64(audioFile: File): Promise<{
  base64: string
  mimeType: string
}> {
  const supportedFormats = ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/webm']

  if (!supportedFormats.includes(audioFile.type)) {
    throw new Error(
      `Unsupported audio format: ${audioFile.type}. Supported: ${supportedFormats.join(', ')}`
    )
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1]
      resolve({
        base64: base64String,
        mimeType: audioFile.type,
      })
    }

    reader.onerror = () => {
      reject(new Error('Failed to read audio file'))
    }

    reader.readAsDataURL(audioFile)
  })
}

export async function analyzePronunciation(
  audioFile: File
): Promise<{
  transcription: string
  mistakes: string[]
  ipa_student: string
  ipa_correct: string
  feedback: string
}> {
  const { base64, mimeType } = await convertAudioToBase64(audioFile)

  const response = await fetch('/api/audio/analyze-pronunciation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      audioBase64: base64,
      audioMimeType: mimeType,
    }),
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`)
  }

  const data = await response.json()
  return data.analysis
}
