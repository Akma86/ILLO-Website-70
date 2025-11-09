"use client"

import { Card, CardContent } from "@/components/ui/card"
import { BarChart3, Users, Headphones, TrendingUp } from "lucide-react"

export function StatsGrid({
  studentCount = 0,
  stats = { lessonsThisWeek: 0, totalAudioHours: "0h", avgImprovement: 0 },
}: {
  studentCount?: number
  stats?: { lessonsThisWeek: number; totalAudioHours: string; avgImprovement: number }
}) {
  const statsList = [
    {
      label: "Active Students",
      value: studentCount.toString(),
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950",
    },
    {
      label: "Lessons This Week",
      value: stats.lessonsThisWeek.toString(),
      icon: BarChart3,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-950",
    },
    {
      label: "Audio Hours",
      value: `${stats.totalAudioHours}h`,
      icon: Headphones,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950",
    },
    {
      label: "Avg Improvement",
      value: `+${stats.avgImprovement}%`,
      icon: TrendingUp,
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-950",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {statsList.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="mt-2 text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
                <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
