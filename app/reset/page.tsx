"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"

export default function ResetPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleReset = async () => {
    setStatus("loading")
    setMessage("")

    try {
      const response = await fetch("/api/reset")
      const data = await response.json()

      if (response.ok) {
        setStatus("success")
        setMessage(data.message || "Reset successful")
      } else {
        setStatus("error")
        setMessage(data.error || "Reset failed")
      }
    } catch (error) {
      setStatus("error")
      setMessage("Network error: Unable to connect to reset endpoint")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>System Reset</CardTitle>
          <CardDescription>Reset dashboard data and cache</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleReset} disabled={status === "loading"} className="w-full" variant="destructive">
            {status === "loading" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {status === "loading" ? "Resetting..." : "Reset System"}
          </Button>

          {status === "success" && (
            <Alert className="border-green-500 bg-green-50 text-green-900">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {status === "error" && (
            <Alert className="border-red-500 bg-red-50 text-red-900">
              <XCircle className="h-4 w-4 text-red-600" />
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
