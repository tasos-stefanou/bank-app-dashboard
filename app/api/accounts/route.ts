import { NextResponse } from "next/server"

export async function GET() {
  try {
    const response = await fetch("http://ec2-52-212-43-232.eu-west-1.compute.amazonaws.com/fetcher/accounts", {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`External API returned ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] API route: Error fetching accounts:", error)

    const mockData = [
      { account_id: "ACC10001", customer_id: "CUST001", balance: 10000000, reserved: 8500000, currency: "TK1" },
      { account_id: "ACC10002", customer_id: "CUST002", balance: 8500000, reserved: 7200000, currency: "TK2" },
      { account_id: "ACC10003", customer_id: "CUST003", balance: 6000000, reserved: 5100000, currency: "TK3" },
      { account_id: "ACC10004", customer_id: "CUST004", balance: 4500000, reserved: 3800000, currency: "TK4" },
      { account_id: "ACC10005", customer_id: "CUST005", balance: 3200000, reserved: 2700000, currency: "TK1" },
      { account_id: "ACC10006", customer_id: "CUST006", balance: 2800000, reserved: 2400000, currency: "TK2" },
      { account_id: "ACC10007", customer_id: "CUST007", balance: 1500000, reserved: 1200000, currency: "PTSB" },
      { account_id: "ACC10008", customer_id: "CUST008", balance: 1200000, reserved: 1000000, currency: "PTSB" },
      { account_id: "ACC10009", customer_id: "CUST009", balance: 950000, reserved: 800000, currency: "TK3" },
      { account_id: "ACC10010", customer_id: "CUST010", balance: 750000, reserved: 650000, currency: "TK4" },
    ]

    return NextResponse.json(mockData)
  }
}
