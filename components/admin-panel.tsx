"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserPlus, Trash2, Check, X } from "lucide-react"
import { StudentFormModal } from "./students/student-form-modal"
import { ConfirmDialog } from "./confirm-dialog"

export function AdminPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Ahmed Hassan",
      email: "ahmed.hassan@example.com",
      level: "Intermediate",
      status: "active",
      joinDate: "2024-01-15",
      lessons: 15,
    },
    {
      id: 2,
      name: "Fatima Al-Rashid",
      email: "fatima.rashid@example.com",
      level: "Beginner",
      status: "active",
      joinDate: "2024-02-20",
      lessons: 8,
    },
    {
      id: 3,
      name: "Mohammed Saeed",
      email: "mohammed.saeed@example.com",
      level: "Advanced",
      status: "active",
      joinDate: "2024-01-10",
      lessons: 22,
    },
    {
      id: 4,
      name: "Layla Noor",
      email: "layla.noor@example.com",
      level: "Intermediate",
      status: "inactive",
      joinDate: "2023-12-05",
      lessons: 12,
    },
  ])

  const handleAddStudent = (data: any) => {
    const newStudent = {
      id: Math.max(...students.map((s) => s.id), 0) + 1,
      ...data,
      joinDate: new Date().toISOString().split("T")[0],
      lessons: 0,
    }
    setStudents([...students, newStudent])
    setIsOpen(false)
  }

  const handleDeleteStudent = (id: number) => {
    setStudents(students.filter((s) => s.id !== id))
    setDeleteConfirm(null)
  }

  const toggleStatus = (id: number) => {
    setStudents(
      students.map((s) => (s.id === id ? { ...s, status: s.status === "active" ? "inactive" : "active" } : s)),
    )
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

  const activeStudents = students.filter((s) => s.status === "active")
  const inactiveStudents = students.filter((s) => s.status === "inactive")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Student Management</h2>
        <Button onClick={() => setIsOpen(true)} className="gap-2">
          <UserPlus className="h-4 w-4" />
          Add Student
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Students</p>
            <p className="mt-2 text-2xl font-bold">{students.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Active</p>
            <p className="mt-2 text-2xl font-bold text-emerald-600">{activeStudents.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Inactive</p>
            <p className="mt-2 text-2xl font-bold text-gray-600">{inactiveStudents.length}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">Active Students ({activeStudents.length})</TabsTrigger>
          <TabsTrigger value="inactive">Inactive ({inactiveStudents.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <Card>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-4 py-3 text-left font-semibold text-foreground">Name</th>
                      <th className="px-4 py-3 text-left font-semibold text-foreground">Email</th>
                      <th className="px-4 py-3 text-left font-semibold text-foreground">Level</th>
                      <th className="px-4 py-3 text-left font-semibold text-foreground">Lessons</th>
                      <th className="px-4 py-3 text-right font-semibold text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeStudents.map((student) => (
                      <tr key={student.id} className="border-b border-border hover:bg-muted/50">
                        <td className="px-4 py-3 text-foreground font-medium">{student.name}</td>
                        <td className="px-4 py-3 text-foreground text-sm">{student.email}</td>
                        <td className="px-4 py-3">
                          <Badge className={getLevelColor(student.level)}>{student.level}</Badge>
                        </td>
                        <td className="px-4 py-3 text-foreground">{student.lessons}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => toggleStatus(student.id)}>
                              <X className="h-4 w-4 text-amber-600" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => setDeleteConfirm(student.id)}>
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inactive">
          <Card>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-4 py-3 text-left font-semibold text-foreground">Name</th>
                      <th className="px-4 py-3 text-left font-semibold text-foreground">Email</th>
                      <th className="px-4 py-3 text-left font-semibold text-foreground">Level</th>
                      <th className="px-4 py-3 text-left font-semibold text-foreground">Lessons</th>
                      <th className="px-4 py-3 text-right font-semibold text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inactiveStudents.map((student) => (
                      <tr key={student.id} className="border-b border-border hover:bg-muted/50 opacity-75">
                        <td className="px-4 py-3 text-foreground font-medium">{student.name}</td>
                        <td className="px-4 py-3 text-foreground text-sm">{student.email}</td>
                        <td className="px-4 py-3">
                          <Badge className={getLevelColor(student.level)}>{student.level}</Badge>
                        </td>
                        <td className="px-4 py-3 text-foreground">{student.lessons}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => toggleStatus(student.id)}>
                              <Check className="h-4 w-4 text-emerald-600" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => setDeleteConfirm(student.id)}>
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <StudentFormModal isOpen={isOpen} onClose={() => setIsOpen(false)} onSubmit={handleAddStudent} />

      <ConfirmDialog
        isOpen={deleteConfirm !== null}
        title="Delete Student"
        description="Are you sure you want to remove this student? This action cannot be undone."
        onConfirm={() => handleDeleteStudent(deleteConfirm!)}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  )
}
