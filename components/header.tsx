"use client"

import { useState } from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NotificationCenter } from "./notification-center"
import { useNotifications } from "@/hooks/use-notifications"

export function Header() {
  const { notifications, removeNotification, markAsRead, clearAll } = useNotifications()

  const initializeNotifications = () => {
    return [
      {
        id: "1",
        type: "success",
        title: "Lesson Recorded",
        message: "Ahmed Hassan's pronunciation exercise has been recorded",
        timestamp: new Date(),
        read: false,
      },
      {
        id: "2",
        type: "info",
        title: "Analysis Complete",
        message: "AI analysis for Fatima Al-Rashid's vocabulary test is ready",
        timestamp: new Date(Date.now() - 300000),
        read: true,
      },
    ]
  }

  const [displayNotifications, setDisplayNotifications] = useState(initializeNotifications())

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
            ILLO
          </div>
          <div>
            <h1 className="font-bold text-lg text-foreground">ILLO Dashboard</h1>
            <p className="text-xs text-muted-foreground">Interactive Language Learning Observer</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <NotificationCenter
            notifications={displayNotifications}
            onRemove={(id) => setDisplayNotifications(displayNotifications.filter((n) => n.id !== id))}
            onMarkAsRead={(id) =>
              setDisplayNotifications(displayNotifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
            }
            onClearAll={() => setDisplayNotifications([])}
          />
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
