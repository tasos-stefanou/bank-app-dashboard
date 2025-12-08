"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ExternalLink, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Account {
  account_id: string
  customer_id: string
  balance: number
  reserved: number
  currency: string
}

interface HolderData {
  loanType: string
  amount: number
  accountNumber: string
  currency: string
}

const currencyToLoanType: Record<string, string> = {
  TK1: "Green Mortgages",
  TK2: "Sustainable Transport Initiatives",
  TK3: "Social & Community Projects",
  TK4: "Energy Efficient Loans",
}

export function TopHoldersTable() {
  const [activeTab, setActiveTab] = useState("0-100k")
  const [holders, setHolders] = useState<HolderData[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loanTypeFilter, setLoanTypeFilter] = useState("all")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/accounts")
        const data: Account[] = await response.json()

        const filteredData = data
          .filter((account) => account.currency !== "PTSB" && currencyToLoanType[account.currency])
          .map((account) => ({
            loanType: currencyToLoanType[account.currency],
            amount: account.reserved,
            accountNumber: account.account_id.padEnd(8, "0"),
            currency: account.currency,
          }))
          .sort((a, b) => b.amount - a.amount)

        setHolders(filteredData)
      } catch (error) {
        console.error("[v0] Error fetching accounts data:", error)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 3000)
    return () => clearInterval(interval)
  }, [])

  const filterByRange = (holders: HolderData[]) => {
    switch (activeTab) {
      case "0-100k":
        return holders.filter((h) => h.amount < 100000)
      case "100k-1m":
        return holders.filter((h) => h.amount >= 100000 && h.amount < 1000000)
      case "1m-10m":
        return holders.filter((h) => h.amount >= 1000000 && h.amount < 10000000)
      case "10m+":
        return holders.filter((h) => h.amount >= 10000000)
      default:
        return holders
    }
  }

  const filteredHolders = filterByRange(holders)
    .filter((holder) => {
      const matchesSearch = holder.accountNumber.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesLoanType = loanTypeFilter === "all" || holder.loanType === loanTypeFilter
      return matchesSearch && matchesLoanType
    })
    .sort((a, b) => {
      return sortOrder === "desc" ? b.amount - a.amount : a.amount - b.amount
    })

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Top Impact+ Deposit Holders</h3>
        <span className="text-sm text-muted-foreground">↕</span>
      </div>

      <div className="mb-4 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by account number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={loanTypeFilter} onValueChange={setLoanTypeFilter}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Filter by loan type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Loan Types</SelectItem>
            <SelectItem value="Green Mortgages">Green Mortgages</SelectItem>
            <SelectItem value="Sustainable Transport Initiatives">Sustainable Transport Initiatives</SelectItem>
            <SelectItem value="Social & Community Projects">Social & Community Projects</SelectItem>
            <SelectItem value="Energy Efficient Loans">Energy Efficient Loans</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="0-100k">€0 - €100k</TabsTrigger>
          <TabsTrigger value="100k-1m">€100k - €1M</TabsTrigger>
          <TabsTrigger value="1m-10m">€1M - €10M</TabsTrigger>
          <TabsTrigger value="10m+">🔒 €10M+</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-muted-foreground">
                  <th className="pb-3 font-medium">Loan Type</th>
                  <th
                    className="cursor-pointer pb-3 font-medium hover:text-foreground"
                    onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
                  >
                    EUR Amount {sortOrder === "desc" ? "▼" : "▲"}
                  </th>
                  <th className="pb-3 font-medium">Account Number</th>
                </tr>
              </thead>
              <tbody>
                {filteredHolders.length > 0 ? (
                  filteredHolders.map((holder, index) => (
                    <tr key={`${holder.accountNumber}-${index}`} className="border-b last:border-0">
                      <td className="py-3">
                        <span className="text-sm text-muted-foreground">{holder.loanType}</span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            €
                            {holder.amount.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                          <ExternalLink className="h-3 w-3 text-muted-foreground" />
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="text-sm font-mono text-muted-foreground">{holder.accountNumber}</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-sm text-muted-foreground">
                      No holders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
