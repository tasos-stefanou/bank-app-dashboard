"use client"

import { Card } from "@/components/ui/card"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
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
  green: {
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
  transport: {
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
  social: {
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
  energy: {
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

export function TotalTokenValueChart() {
  const [chartData, setChartData] = useState<
    Array<{
      date: string
      green: number
      transport: number
      social: number
      energy: number
    }>
  >([])

  const maxValue = Math.max(...chartData.map((d) => d.green + d.transport + d.social + d.energy))
  const yAxisMax = Math.ceil(maxValue * 1.1) // 10% padding above max
  const yAxisTicks = Array.from({ length: 5 }, (_, i) => Math.round((yAxisMax / 4) * i))

  // Format values as K (thousands) or M (millions) based on magnitude
  const formatYAxis = (value: number) => {
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

        const startDate = new Date("2025-11-11")
        const today = new Date()
        const dateMap: { [key: string]: { green: number; transport: number; social: number; energy: number } } = {}

        for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
          const month = d.getMonth() + 1
          const day = d.getDate()
          const year = String(d.getFullYear()).slice(-2)
          const dateStr = `${month}/${day}/${year}`
          dateMap[dateStr] = { green: 0, transport: 0, social: 0, energy: 0 }
        }

        data.forEach((metric) => {
          if (["TK1", "TK2", "TK3", "TK4"].includes(metric.currency)) {
            const date = new Date(metric.timestamp)
            const dateStr = `${date.getMonth() + 1}/${date.getDate()}/${String(date.getFullYear()).slice(-2)}`

            if (dateMap[dateStr]) {
              if (metric.currency === "TK1") dateMap[dateStr].green += metric.total_covered
              if (metric.currency === "TK2") dateMap[dateStr].transport += metric.total_covered
              if (metric.currency === "TK3") dateMap[dateStr].social += metric.total_covered
              if (metric.currency === "TK4") dateMap[dateStr].energy += metric.total_covered
            }
          }
        })

        const sortedDates = Object.keys(dateMap).sort((a, b) => {
          const [monthA, dayA, yearA] = a.split("/").map(Number)
          const [monthB, dayB, yearB] = b.split("/").map(Number)
          const dateA = new Date(2000 + yearA, monthA - 1, dayA)
          const dateB = new Date(2000 + yearB, monthB - 1, dayB)
          return dateA.getTime() - dateB.getTime()
        })

        const cumulativeData: {
          [key: string]: { green: number; transport: number; social: number; energy: number }
        } = {}
        let cumulativeGreen = 0
        let cumulativeTransport = 0
        let cumulativeSocial = 0
        let cumulativeEnergy = 0

        sortedDates.forEach((date) => {
          cumulativeGreen += dateMap[date].green
          cumulativeTransport += dateMap[date].transport
          cumulativeSocial += dateMap[date].social
          cumulativeEnergy += dateMap[date].energy

          cumulativeData[date] = {
            green: cumulativeGreen,
            transport: cumulativeTransport,
            social: cumulativeSocial,
            energy: cumulativeEnergy,
          }
        })

        const newChartData = sortedDates.map((date) => ({
          date,
          ...cumulativeData[date],
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
        <h3 className="text-lg font-semibold">Cumulative Impact+ Deposits Matched</h3>
      </div>

      <ChartContainer config={chartConfig} className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="green" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartConfig.green.color} stopOpacity={0.8} />
                <stop offset="95%" stopColor={chartConfig.green.color} stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="transport" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartConfig.transport.color} stopOpacity={0.8} />
                <stop offset="95%" stopColor={chartConfig.transport.color} stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="social" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartConfig.social.color} stopOpacity={0.8} />
                <stop offset="95%" stopColor={chartConfig.social.color} stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="energy" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartConfig.energy.color} stopOpacity={0.8} />
                <stop offset="95%" stopColor={chartConfig.energy.color} stopOpacity={0.1} />
              </linearGradient>
            </defs>
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
            <Area type="monotone" dataKey="green" stackId="1" stroke={chartConfig.green.color} fill="url(#green)" />
            <Area
              type="monotone"
              dataKey="transport"
              stackId="1"
              stroke={chartConfig.transport.color}
              fill="url(#transport)"
            />
            <Area type="monotone" dataKey="social" stackId="1" stroke={chartConfig.social.color} fill="url(#social)" />
            <Area type="monotone" dataKey="energy" stackId="1" stroke={chartConfig.energy.color} fill="url(#energy)" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>

      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: chartConfig.green.color }} />
          <span className="text-muted-foreground">{chartConfig.green.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: chartConfig.transport.color }} />
          <span className="text-muted-foreground">{chartConfig.transport.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: chartConfig.social.color }} />
          <span className="text-muted-foreground">{chartConfig.social.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: chartConfig.energy.color }} />
          <span className="text-muted-foreground">{chartConfig.energy.label}</span>
        </div>
      </div>
    </Card>
  )
}
