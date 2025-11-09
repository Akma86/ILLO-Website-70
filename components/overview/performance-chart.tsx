"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface Student {
  id: number
  name: string
  level: "Beginner" | "Intermediate" | "Advanced"
  lessonsCompleted: number
  audioHours: number
  progress: number
  status: "active" | "inactive"
  lessonsThisWeek: number
  averageScore: number
  weeklyScores: Array<{ week: string; score: number }>
}

export function PerformanceChart({ students = [] }: { students?: Student[] }) {
  const generateChartData = () => {
    if (students.length === 0) {
      return []
    }

    const weekCount = Math.min(students.length, 6)
    const chartData = []

    for (let i = 1; i <= weekCount; i++) {
      const baseScore = 50 + i * 5
      chartData.push({
        week: `Week ${i}`,
        pronunciation: Math.min(100, baseScore + 10),
        vocabulary: Math.min(100, baseScore + 5),
        fluency: Math.min(100, baseScore),
        listening: Math.min(100, baseScore + 8),
      })
    }

    return chartData
  }

  const data = generateChartData()

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Student Performance Trends</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
          <p>Add students to see performance trends</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Student Performance Trends ({students.length} student{students.length !== 1 ? "s" : ""})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="pronunciation" stroke="#3b82f6" strokeWidth={2} />
            <Line type="monotone" dataKey="vocabulary" stroke="#10b981" strokeWidth={2} />
            <Line type="monotone" dataKey="fluency" stroke="#f59e0b" strokeWidth={2} />
            <Line type="monotone" dataKey="listening" stroke="#8b5cf6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
