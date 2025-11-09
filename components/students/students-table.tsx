"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

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

export function StudentsTable({
  students,
  setStudents,
  onSelectStudent,
}: {
  students: Student[]
  setStudents: (students: Student[]) => void
  onSelectStudent?: (id: number) => void
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({ name: "", level: "Beginner" })

  const handleAddStudent = () => {
    if (formData.name.trim()) {
      const newStudent: Student = {
        id: students.length + 1,
        name: formData.name,
        level: formData.level as "Beginner" | "Intermediate" | "Advanced",
        lessonsCompleted: 0,
        audioHours: 0,
        progress: Math.floor(Math.random() * 50) + 20,
        status: "active",
        lessonsThisWeek: 0,
        averageScore: 0,
        weeklyScores: [
          { week: "Week 1", score: 65 },
          { week: "Week 2", score: 70 },
          { week: "Week 3", score: 75 },
          { week: "Week 4", score: 78 },
          { week: "Week 5", score: 82 },
          { week: "Week 6", score: 85 },
        ],
      }
      setStudents([...students, newStudent])
      setFormData({ name: "", level: "Beginner" })
      setIsDialogOpen(false)
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "Intermediate":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
      case "Advanced":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
      default:
        return ""
    }
  }

  const getStatusColor = (status: string) => {
    return status === "active"
      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200"
      : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200"
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Student Overview</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium text-foreground">Student Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter student name"
                  className="mt-2 w-full rounded-lg border border-border px-3 py-2 text-sm text-foreground placeholder-muted-foreground"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Level</label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  className="mt-2 w-full rounded-lg border border-border px-3 py-2 text-sm text-foreground"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <Button onClick={handleAddStudent} className="w-full">
                Add Student
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {students.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground mb-4">No students added yet</p>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Your First Student
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Student</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Student Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter student name"
                      className="mt-2 w-full rounded-lg border border-border px-3 py-2 text-sm text-foreground placeholder-muted-foreground"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Level</label>
                    <select
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                      className="mt-2 w-full rounded-lg border border-border px-3 py-2 text-sm text-foreground"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                  <Button onClick={handleAddStudent} className="w-full">
                    Add Student
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Level</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Lessons</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Audio Hours</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Progress</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Status</th>
                  <th className="px-4 py-3 text-right font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border-b border-border hover:bg-muted/50">
                    <td className="px-4 py-3 text-foreground">{student.name}</td>
                    <td className="px-4 py-3">
                      <Badge className={getLevelColor(student.level)}>{student.level}</Badge>
                    </td>
                    <td className="px-4 py-3 text-foreground">{student.lessonsCompleted}</td>
                    <td className="px-4 py-3 text-foreground">{student.audioHours}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 rounded-full bg-muted">
                          <div className="h-2 rounded-full bg-primary" style={{ width: `${student.progress}%` }}></div>
                        </div>
                        <span className="text-xs font-medium text-foreground">{student.progress}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={getStatusColor(student.status)}>{student.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm" onClick={() => onSelectStudent?.(student.id)}>
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
