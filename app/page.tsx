import { StatsCards } from "@/components/stats-cards"
import { TotalTokenValueChart } from "@/components/total-token-value-chart"
import { TokenIssuanceChart } from "@/components/token-issuance-chart"
import { TopHoldersTable } from "@/components/top-holders-table"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-[1600px] space-y-6">
        <StatsCards />

        <div className="grid gap-6 lg:grid-cols-[1fr_600px]">
          <div className="space-y-6">
            <TotalTokenValueChart />
            <TokenIssuanceChart />
          </div>

          <TopHoldersTable />
        </div>
      </div>
    </div>
  )
}
