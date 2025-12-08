"use client"

import { Card } from "@/components/ui/card"
import { ArrowUp } from "lucide-react"
import { useEffect, useState } from "react"

interface Loan {
  loan_id: string
  borrower_id: string
  loan_amount: number
  covered_amount: number
  remaining_amount: number
  currency: string
  status: string
  timestamp: string
}

interface Account {
  account_id: string
  customer_id: string
  type: string
  balance: number
  reserved: number
  currency: string
  timestamp: string
}

interface Cover {
  loan_id: string
  account_id: string
  amount: number
  currency: string
  timestamp: string
}

interface Metric {
  id: number
  currency: string
  total_covered: number
  total_remaining: number
  loan_count: number
  cover_count: number
  timestamp: string
}

const mockAccounts: Account[] = [
  {
    account_id: "1",
    customer_id: "5",
    type: "checking",
    balance: 10874,
    reserved: 2281,
    currency: "TK4",
    timestamp: "2025-11-09T18:28:13.382992",
  },
  {
    account_id: "2",
    customer_id: "5",
    type: "reward",
    balance: 118,
    reserved: 0,
    currency: "PTSB",
    timestamp: "2025-11-09T18:28:11.609289",
  },
  {
    account_id: "3",
    customer_id: "7",
    type: "checking",
    balance: 198,
    reserved: 2893,
    currency: "TK1",
    timestamp: "2025-11-09T18:28:13.382000",
  },
  {
    account_id: "4",
    customer_id: "5",
    type: "checking",
    balance: 11925,
    reserved: 2154,
    currency: "TK1",
    timestamp: "2025-11-09T18:28:13.406267",
  },
  {
    account_id: "5",
    customer_id: "5",
    type: "reward",
    balance: 146,
    reserved: 0,
    currency: "PTSB",
    timestamp: "2025-11-09T18:28:11.608054",
  },
  {
    account_id: "6",
    customer_id: "10",
    type: "reward",
    balance: 179,
    reserved: 0,
    currency: "PTSB",
    timestamp: "2025-11-09T18:28:11.626880",
  },
  {
    account_id: "7",
    customer_id: "7",
    type: "checking",
    balance: 275,
    reserved: 4488,
    currency: "TK3",
    timestamp: "2025-11-09T18:28:13.411808",
  },
  {
    account_id: "8",
    customer_id: "6",
    type: "checking",
    balance: 15995,
    reserved: 3234,
    currency: "TK3",
    timestamp: "2025-11-09T18:28:13.444879",
  },
  {
    account_id: "9",
    customer_id: "2",
    type: "checking",
    balance: 12084,
    reserved: 2473,
    currency: "TK2",
    timestamp: "2025-11-09T18:28:13.456423",
  },
  {
    account_id: "10",
    customer_id: "3",
    type: "reward",
    balance: 124,
    reserved: 0,
    currency: "PTSB",
    timestamp: "2025-11-09T18:28:11.695500",
  },
]

const mockLoans: Loan[] = [
  {
    loan_id: "1",
    borrower_id: "B001",
    loan_amount: 50000,
    covered_amount: 30000,
    remaining_amount: 20000,
    currency: "EUR",
    status: "active",
    timestamp: "2025-11-09T18:28:11.609289",
  },
  {
    loan_id: "2",
    borrower_id: "B002",
    loan_amount: 75000,
    covered_amount: 45000,
    remaining_amount: 30000,
    currency: "EUR",
    status: "active",
    timestamp: "2025-11-09T18:28:11.608054",
  },
  {
    loan_id: "3",
    borrower_id: "B003",
    loan_amount: 100000,
    covered_amount: 60000,
    remaining_amount: 40000,
    currency: "EUR",
    status: "active",
    timestamp: "2025-11-09T18:28:11.626880",
  },
]

const mockCovers: Cover[] = [
  {
    loan_id: "9c37ec53",
    account_id: "45",
    amount: 87,
    currency: "TK1",
    timestamp: "2025-11-11T07:48:29.492635",
  },
  {
    loan_id: "00c25a22",
    account_id: "27",
    amount: 227,
    currency: "TK1",
    timestamp: "2025-11-11T08:04:54.339556",
  },
  {
    loan_id: "4c7b66de",
    account_id: "46",
    amount: 7714.58,
    currency: "TK1",
    timestamp: "2025-11-11T09:16:41.511555",
  },
  {
    loan_id: "525eb519",
    account_id: "8",
    amount: 468.38,
    currency: "TK1",
    timestamp: "2025-11-11T00:09:12.283353",
  },
  {
    loan_id: "4c7b66de",
    account_id: "2",
    amount: 4364.51,
    currency: "TK1",
    timestamp: "2025-11-11T09:21:20.737680",
  },
]

export function StatsCards() {
  const [loansData, setLoansData] = useState<Loan[]>(mockLoans)
  const [accountsData, setAccountsData] = useState<Account[]>(mockAccounts)
  const [coversData, setCoversData] = useState<Cover[]>(mockCovers)
  const [metricsData, setMetricsData] = useState<Metric[]>([])
  const [usingMockData, setUsingMockData] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [loansResponse, accountsResponse, coversResponse, metricsResponse] = await Promise.all([
          fetch("/api/loans").catch(() => null),
          fetch("/api/accounts").catch(() => null),
          fetch("/api/covers").catch(() => null),
          fetch("/api/metrics?limit=100").catch(() => null),
        ])

        let hasRealData = false

        if (loansResponse?.ok) {
          const loansData = await loansResponse.json()
          if (!loansData.error && Array.isArray(loansData)) {
            setLoansData(loansData)
            hasRealData = true
          }
        }

        if (accountsResponse?.ok) {
          const accountsData = await accountsResponse.json()
          if (!accountsData.error && Array.isArray(accountsData)) {
            setAccountsData(accountsData)
            hasRealData = true
          }
        }

        if (coversResponse?.ok) {
          const coversData = await coversResponse.json()
          if (!coversData.error && Array.isArray(coversData)) {
            setCoversData(coversData)
            hasRealData = true
          }
        }

        if (metricsResponse?.ok) {
          const metricsData = await metricsResponse.json()
          console.log("Metrics data", metricsData)
          if (!metricsData.error && Array.isArray(metricsData)) {
            setMetricsData(metricsData)
            hasRealData = true
          }
        }

        setUsingMockData(!hasRealData)
      } catch (error) {
        // Keep using mock data
        console.log("[v0] Using mock data in preview - real API will work in production")
      }
    }

    // Initial fetch
    fetchData()

    // Poll every 3 seconds
    const interval = setInterval(fetchData, 3000)

    return () => clearInterval(interval)
  }, [])

  const formatValue = (value: number, prefix = "€", suffix = "") => {
    if (value >= 1000000) {
      return `${prefix}${(value / 1000000).toFixed(2)}M${suffix}`
    } else if (value >= 1000) {
      return `${prefix}${(value / 1000).toFixed(2)}K${suffix}`
    }
    return `${prefix}${value.toLocaleString()}${suffix}`
  }

  const totalEcoImpactDeposits = formatValue(
    accountsData.filter((account) => account.currency !== "PTSB").reduce((sum, account) => sum + account.reserved, 0),
  )

  const totalDepositHolders = new Set(accountsData.map((account) => account.account_id)).size.toLocaleString()

  const today = new Date()
  const todayDateStr = today.toISOString().split("T")[0] // Get YYYY-MM-DD format

  const todaysMetrics = metricsData.filter((metric) => {
    const metricDate = metric.timestamp.split("T")[0] // Extract date from timestamp
    return metricDate === todayDateStr
  })

  const totalEcoImpactDepositsMatched = formatValue(
    todaysMetrics.filter((metric) => metric.currency !== "PTSB").reduce((sum, metric) => sum + metric.total_covered, 0),
  )

  const totalImpactPlusIssued = formatValue(
    accountsData.filter((account) => account.currency === "PTSB").reduce((sum, account) => sum + account.balance, 0),
    "",
    "",
  )

  const totalAvailableLoans = formatValue(loansData.reduce((sum, loan) => sum + loan.remaining_amount, 0))

  const totalAvailableLoanHolders = loansData.filter((loan) => loan.remaining_amount !== 0).length.toLocaleString()

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <Card className="p-6">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Total Impact+ Deposits</p>
          <p className="text-4xl font-bold">{totalEcoImpactDeposits}</p>
          <div className="flex items-center gap-1 text-sm text-green-600">
            <ArrowUp className="h-4 w-4" />
            <span className="font-medium">+10.46%</span>
            <span className="text-muted-foreground">from 30d ago</span>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Total Impact+ Deposit Holders</p>
          <p className="text-4xl font-bold">{totalDepositHolders}</p>
          <div className="flex items-center gap-1 text-sm text-green-600">
            <ArrowUp className="h-4 w-4" />
            <span className="font-medium">+6.71%</span>
            <span className="text-muted-foreground">from 30d ago</span>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Total Impact+ Deposits Matched</p>
          <p className="text-4xl font-bold">{totalEcoImpactDepositsMatched}</p>
        </div>
      </Card>

      <Card className="p-6">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Total Available Loans</p>
          <p className="text-4xl font-bold">{totalAvailableLoans}</p>
          <div className="flex items-center gap-1 text-sm text-green-600">
            <ArrowUp className="h-4 w-4" />
            <span className="font-medium">+3.70%</span>
            <span className="text-muted-foreground">from 30d ago</span>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Total Available Loan Holders</p>
          <p className="text-4xl font-bold">{totalAvailableLoanHolders}</p>
          <div className="flex items-center gap-1 text-sm text-green-600">
            <ArrowUp className="h-4 w-4" />
            <span className="font-medium">+2.16%</span>
            <span className="text-muted-foreground">from 30d ago</span>
          </div>
        </div>
      </Card>

      <Card className="p-6 text-white" style={{ backgroundColor: "#14191D" }}>
        <div className="space-y-2">
          <p className="text-sm opacity-80">Total Impact+ Issued</p>
          <p className="text-4xl font-bold text-orange-500">{totalImpactPlusIssued}</p>
        </div>
      </Card>
    </div>
  )
}
