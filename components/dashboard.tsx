"use client"

import { useState } from "react"
import { Header } from "./header"
import { StatsGrid } from "./overview/stats-grid"
import { StudentsTable } from "./students/students-table"
import { PerformanceChart } from "./overview/performance-chart"
import { RecordingsAndAnalysis } from "./recordings/recordings-and-analysis"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StudentDetail } from "./students/student-detail"

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

export function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null)
  const [students, setStudents] = useState<Student[]>([])

  const calculateStats = () => {
    const activeStudents = students.filter((s) => s.status === "active")
    const lessonsThisWeek = activeStudents.reduce((sum, s) => sum + s.lessonsThisWeek, 0)
    const totalAudioHours = activeStudents.reduce((sum, s) => sum + s.audioHours, 0)
    const avgImprovement =
      activeStudents.length > 0
        ? Math.round(activeStudents.reduce((sum, s) => sum + s.progress, 0) / activeStudents.length)
        : 0

    return { lessonsThisWeek, totalAudioHours: totalAudioHours.toFixed(1), avgImprovement }
  }

  if (selectedStudent) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="flex-1">
          <StudentDetail studentId={selectedStudent} onBack={() => setSelectedStudent(null)} />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="recordings">Recordings & Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <StatsGrid studentCount={students.length} stats={calculateStats()} />
              <div className="grid gap-6 md:grid-cols-2">
                <PerformanceChart students={students} />
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm text-muted-foreground">
                      Start recording a lesson or review student progress using the sections below.
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="students" className="space-y-6">
              <StudentsTable students={students} setStudents={setStudents} onSelectStudent={setSelectedStudent} />
            </TabsContent>

            <TabsContent value="recordings" className="space-y-6">
              <RecordingsAndAnalysis students={students} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
