"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileDown, Printer } from "lucide-react"
import "jspdf-autotable"

interface ExportReportProps {
  studentName: string
  data: {
    level: string
    lessonsCompleted: number
    audioHours: number
    overallProgress: number
    skills?: Array<{ skill: string; score: number }>
    weeklyPerformance?: Array<{ week: string; score: number }>
  }
}

export function ExportReport({ studentName, data }: ExportReportProps) {
  const [isExporting, setIsExporting] = useState(false)

  const exportToCSV = async () => {
    setIsExporting(true)
    try {
      const response = await fetch("/api/export/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentName, data }),
      })

      const result = await response.json()
      if (result.success) {
        const element = document.createElement("a")
        element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(result.csv))
        element.setAttribute("download", `${studentName}-report.csv`)
        element.style.display = "none"
        document.body.appendChild(element)
        element.click()
        document.body.removeChild(element)
      }
    } finally {
      setIsExporting(false)
    }
  }

  const exportToPDF = async () => {
    setIsExporting(true)
    try {
      const response = await fetch("/api/export/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentName, data }),
      })

      const result = await response.json()
      if (result.success && typeof window !== "undefined") {
        const printWindow = window.open("", "", "height=600,width=800")
        if (printWindow) {
          printWindow.document.write(result.html)
          printWindow.document.close()
          printWindow.print()
        }
      }
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Options</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          variant="outline"
          className="w-full justify-start gap-2 bg-transparent"
          onClick={exportToCSV}
          disabled={isExporting}
        >
          <FileDown className="h-4 w-4" />
          Download as CSV
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start gap-2 bg-transparent"
          onClick={exportToPDF}
          disabled={isExporting}
        >
          <Printer className="h-4 w-4" />
          Print / Save as PDF
        </Button>
      </CardContent>
    </Card>
  )
}
