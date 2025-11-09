"use client"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { ExportReport } from "../export-report"

interface StudentDetailProps {
  studentId: number
  onBack: () => void
}

export function StudentDetail({ studentId, onBack }: StudentDetailProps) {
  const [student] = useState({
    id: studentId,
    name: "Ahmed Hassan",
    level: "Intermediate",
    joinDate: "January 15, 2024",
    lessonsCompleted: 15,
    audioHours: 4.5,
    overallProgress: 72,
    email: "ahmed.hassan@example.com",
  })

  const performanceData = [
    { week: "Week 1", pronunciation: 65, vocabulary: 58, fluency: 55 },
    { week: "Week 2", pronunciation: 70, vocabulary: 62, fluency: 58 },
    { week: "Week 3", pronunciation: 75, vocabulary: 68, fluency: 62 },
    { week: "Week 4", pronunciation: 78, vocabulary: 72, fluency: 68 },
    { week: "Week 5", pronunciation: 82, vocabulary: 76, fluency: 72 },
    { week: "Week 6", pronunciation: 85, vocabulary: 80, fluency: 76 },
  ]

  const skillsData = [
    { skill: "Pronunciation", score: 85 },
    { skill: "Vocabulary", score: 80 },
    { skill: "Grammar", score: 72 },
    { skill: "Listening", score: 78 },
    { skill: "Fluency", score: 76 },
  ]

  const exportData = {
    level: student.level,
    lessonsCompleted: student.lessonsCompleted,
    audioHours: student.audioHours,
    overallProgress: student.overallProgress,
    skills: skillsData,
    weeklyPerformance: performanceData,
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">{student.name}</h1>
          <p className="text-muted-foreground">{student.email}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Level</p>
            <p className="mt-2 text-2xl font-bold">{student.level}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Lessons Completed</p>
            <p className="mt-2 text-2xl font-bold">{student.lessonsCompleted}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Audio Hours</p>
            <p className="mt-2 text-2xl font-bold">{student.audioHours}h</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Overall Progress</p>
            <p className="mt-2 text-2xl font-bold">{student.overallProgress}%</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="skills">Skills Assessment</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Progress Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="pronunciation" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="vocabulary" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="fluency" stroke="#f59e0b" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Skill Assessment Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={skillsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="skill" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          <ExportReport studentName={student.name} data={exportData} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
