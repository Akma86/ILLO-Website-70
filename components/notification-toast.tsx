"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Notification } from "@/hooks/use-notifications"

interface NotificationToastProps {
  notification: Notification
  onRemove: (id: string) => void
}

export function NotificationToast({ notification, onRemove }: NotificationToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => onRemove(notification.id), 300)
    }, 5000)

    return () => clearTimeout(timer)
  }, [notification.id, onRemove])

  if (!isVisible) return null

  const bgColor = {
    success: "bg-emerald-50 dark:bg-emerald-950 border-emerald-200",
    error: "bg-red-50 dark:bg-red-950 border-red-200",
    warning: "bg-amber-50 dark:bg-amber-950 border-amber-200",
    info: "bg-blue-50 dark:bg-blue-950 border-blue-200",
  }[notification.type]

  const textColor = {
    success: "text-emerald-800 dark:text-emerald-200",
    error: "text-red-800 dark:text-red-200",
    warning: "text-amber-800 dark:text-amber-200",
    info: "text-blue-800 dark:text-blue-200",
  }[notification.type]

  return (
    <div
      className={`fixed bottom-4 right-4 max-w-sm p-4 rounded-lg border ${bgColor} shadow-lg animate-in slide-in-from-bottom-4 fade-in z-50`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className={`font-semibold text-sm ${textColor}`}>{notification.title}</p>
          <p className={`text-sm ${textColor} opacity-90`}>{notification.message}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5"
          onClick={() => {
            setIsVisible(false)
            setTimeout(() => onRemove(notification.id), 300)
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
