"use client"

import { Card } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useEffect, useState } from "react"

interface Metric {
  id: number
  currency: string
  total_covered: number
  total_remaining: number
  loan_count: number
  cover_count: number
  timestamp: string
}

const chartConfig = {
  value1: {
    label: "Green Mortgages",
    color: "hsl(142, 76%, 36%)",
    format: (value: number) => {
      if (value >= 1000000) {
        return `€${(value / 1000000).toFixed(1)}M`
      } else if (value >= 1000) {
        return `€${(value / 1000).toFixed(1)}K`
      } else {
        return `€${value.toFixed(0)}`
      }
    },
  },
  value2: {
    label: "Sustainable Transport Initiatives",
    color: "hsl(217, 91%, 60%)",
    format: (value: number) => {
      if (value >= 1000000) {
        return `€${(value / 1000000).toFixed(1)}M`
      } else if (value >= 1000) {
        return `€${(value / 1000).toFixed(1)}K`
      } else {
        return `€${value.toFixed(0)}`
      }
    },
  },
  value3: {
    label: "Social & Community Projects",
    color: "hsl(0, 84%, 60%)",
    format: (value: number) => {
      if (value >= 1000000) {
        return `€${(value / 1000000).toFixed(1)}M`
      } else if (value >= 1000) {
        return `€${(value / 1000).toFixed(1)}K`
      } else {
        return `€${value.toFixed(0)}`
      }
    },
  },
  value4: {
    label: "Energy Efficient Loans",
    color: "hsl(45, 93%, 47%)",
    format: (value: number) => {
      if (value >= 1000000) {
        return `€${(value / 1000000).toFixed(1)}M`
      } else if (value >= 1000) {
        return `€${(value / 1000).toFixed(1)}K`
      } else {
        return `€${value.toFixed(0)}`
      }
    },
  },
}

export function TokenIssuanceChart() {
  const [chartData, setChartData] = useState<
    Array<{
      date: string
      value1: number
      value2: number
      value3: number
      value4: number
    }>
  >([])

  const maxValue = Math.max(...chartData.map((d) => Math.max(d.value1, d.value2, d.value3, d.value4)), 1)
  const yAxisMax = Math.ceil(maxValue * 1.3)
  const tickCount = 5
  const tickInterval = Math.ceil(yAxisMax / (tickCount - 1))
  const yAxisTicks = Array.from({ length: tickCount }, (_, i) => i * tickInterval)

  const formatYAxis = (value: number) => {
    if (value === 0) return "€0"
    if (value >= 1000000) {
      return `€${(value / 1000000).toFixed(1)}M`
    } else if (value >= 1000) {
      return `€${(value / 1000).toFixed(1)}K`
    } else {
      return `€${value.toFixed(0)}`
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/metrics?limit=1000")
        const data: Metric[] = await response.json()

        const today = new Date()
        const startDate = new Date(today)
        startDate.setDate(today.getDate() - 4) // 5 days total (today + 4 previous days)

        const dateMap: { [key: string]: { value1: number; value2: number; value3: number; value4: number } } = {}

        // Create only last 5 days
        for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
          const month = d.getMonth() + 1
          const day = d.getDate()
          const year = d.getFullYear() % 100
          const dateStr = `${month}/${day}/${year}`
          dateMap[dateStr] = { value1: 0, value2: 0, value3: 0, value4: 0 }
        }

        // Populate with API data
        data.forEach((metric) => {
          if (["TK1", "TK2", "TK3", "TK4"].includes(metric.currency)) {
            const date = new Date(metric.timestamp)
            const dateStr = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear() % 100}`

            if (dateMap[dateStr]) {
              if (metric.currency === "TK1") dateMap[dateStr].value1 += metric.total_covered
              if (metric.currency === "TK2") dateMap[dateStr].value2 += metric.total_covered
              if (metric.currency === "TK3") dateMap[dateStr].value3 += metric.total_covered
              if (metric.currency === "TK4") dateMap[dateStr].value4 += metric.total_covered
            }
          }
        })

        const newChartData = Object.keys(dateMap).map((date) => ({
          date,
          ...dateMap[date],
        }))

        setChartData(newChartData)
      } catch (error) {
        console.error("[v0] Error fetching metrics data:", error)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Impact+ Deposits Matched</h3>
      </div>

      <ChartContainer config={chartConfig} className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickFormatter={formatYAxis}
              domain={[0, yAxisMax]}
              ticks={yAxisTicks}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="value1" fill={chartConfig.value1.color} radius={[4, 4, 0, 0]} />
            <Bar dataKey="value2" fill={chartConfig.value2.color} radius={[4, 4, 0, 0]} />
            <Bar dataKey="value3" fill={chartConfig.value3.color} radius={[4, 4, 0, 0]} />
            <Bar dataKey="value4" fill={chartConfig.value4.color} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </Card>
  )
}
