"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mic, Square, Trash2, Loader2, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Student {
  id: number
  name: string
  level: "Beginner" | "Intermediate" | "Advanced"
}

interface Recording {
  id: number
  name: string
  duration: string
  date: string
  analyzed: boolean
  analysis?: {
    pronunciationScore?: number
    vocabularyAssessment?: number
    fluencyScore?: number
    listeningComprehension?: number
    keyStrengths?: string[]
    areasForImprovement?: string[]
    recommendedNextLessonFocus?: string
    overallPerformanceSummary?: string
  }
}

export function RecordingsAndAnalysis({ students }: { students: Student[] }) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordings, setRecordings] = useState<Recording[]>([])
  const [analyzingIds, setAnalyzingIds] = useState<number[]>([])
  const [selectedAnalysis, setSelectedAnalysis] = useState<Recording | null>(null)

  const handleStartRecording = () => {
    setIsRecording(true)
  }

  const handleStopRecording = () => {
    setIsRecording(false)
    const newRecording: Recording = {
      id: recordings.length + 1,
      name: students.length > 0 ? `Lesson - ${students[0].name}` : "New Recording",
      duration: "0:00",
      date: "Today",
      analyzed: false,
    }
    setRecordings([...recordings, newRecording])
  }

  const handleDeleteRecording = (id: number) => {
    setRecordings(recordings.filter((r) => r.id !== id))
    if (selectedAnalysis?.id === id) {
      setSelectedAnalysis(null)
    }
  }

  const handleAnalyze = async (recording: Recording) => {
    setAnalyzingIds((prev) => [...prev, recording.id])
    try {
      const response = await fetch("/api/audio/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audioName: recording.name,
          duration: 3.5,
          studentLevel: students[0]?.level || "Intermediate",
        }),
      })

      const data = await response.json()
      if (data.success) {
        setRecordings((prev) =>
          prev.map((r) => (r.id === recording.id ? { ...r, analyzed: true, analysis: data.analysis } : r)),
        )
        setSelectedAnalysis({
          ...recording,
          analyzed: true,
          analysis: data.analysis,
        })
      }
    } catch (error) {
      console.error("[v0] Error analyzing audio:", error)
    } finally {
      setAnalyzingIds((prev) => prev.filter((id) => id !== recording.id))
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-50 dark:from-blue-950 dark:to-blue-900">
        <CardHeader>
          <CardTitle>Start New Recording</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className={`flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-blue-300 p-8 transition-all ${isRecording ? "bg-red-50 dark:bg-red-950" : "bg-white/50 dark:bg-black/20"}`}
          >
            <div
              className={`rounded-full p-4 ${isRecording ? "bg-red-200 dark:bg-red-900 animate-pulse" : "bg-blue-200 dark:bg-blue-800"}`}
            >
              <Mic className={`h-8 w-8 ${isRecording ? "text-red-600" : "text-blue-600"}`} />
            </div>
            <p className="text-center text-sm text-foreground">
              {isRecording ? "Recording in progress..." : "Click to start recording lesson audio"}
            </p>
            <div className="flex gap-3">
              {!isRecording ? (
                <Button onClick={handleStartRecording} className="gap-2">
                  <Mic className="h-4 w-4" />
                  Start Recording
                </Button>
              ) : (
                <Button onClick={handleStopRecording} variant="destructive" className="gap-2">
                  <Square className="h-4 w-4" />
                  Stop Recording
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recording Queue & Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              {recordings.length === 0 ? (
                <div className="flex items-center justify-center py-12 text-center">
                  <p className="text-muted-foreground">No recordings yet. Start recording to begin analyzing.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recordings.map((recording) => (
                    <div
                      key={recording.id}
                      className="flex items-center justify-between rounded-lg border border-border p-4 hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <Mic className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{recording.name}</p>
                          <p className="text-xs text-muted-foreground">{recording.date}</p>
                        </div>
                        <Badge variant="outline">{recording.duration}</Badge>
                        {recording.analyzed && (
                          <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900">✓ Analyzed</Badge>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleAnalyze(recording)}
                          disabled={analyzingIds.includes(recording.id)}
                        >
                          {analyzingIds.includes(recording.id) ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Zap className="h-4 w-4" />
                          )}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteRecording(recording.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {selectedAnalysis?.analysis && (
          <Card className="lg:col-span-1 h-fit">
            <CardHeader>
              <CardTitle className="text-base">Analysis Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedAnalysis.analysis.pronunciationScore && (
                <div className="rounded-lg border border-border p-3">
                  <p className="text-xs text-muted-foreground">Pronunciation</p>
                  <p className="text-xl font-bold">{selectedAnalysis.analysis.pronunciationScore}</p>
                </div>
              )}
              {selectedAnalysis.analysis.vocabularyAssessment && (
                <div className="rounded-lg border border-border p-3">
                  <p className="text-xs text-muted-foreground">Vocabulary</p>
                  <p className="text-xl font-bold">{selectedAnalysis.analysis.vocabularyAssessment}</p>
                </div>
              )}
              {selectedAnalysis.analysis.fluencyScore && (
                <div className="rounded-lg border border-border p-3">
                  <p className="text-xs text-muted-foreground">Fluency</p>
                  <p className="text-xl font-bold">{selectedAnalysis.analysis.fluencyScore}</p>
                </div>
              )}
              {selectedAnalysis.analysis.listeningComprehension && (
                <div className="rounded-lg border border-border p-3">
                  <p className="text-xs text-muted-foreground">Listening</p>
                  <p className="text-xl font-bold">{selectedAnalysis.analysis.listeningComprehension}</p>
                </div>
              )}
              {selectedAnalysis.analysis.keyStrengths && (
                <div>
                  <p className="text-xs font-semibold text-foreground mb-2">Strengths</p>
                  <ul className="space-y-1">
                    {selectedAnalysis.analysis.keyStrengths.slice(0, 2).map((strength, i) => (
                      <li key={i} className="text-xs text-muted-foreground">
                        <span className="text-emerald-600">+</span> {strength}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
