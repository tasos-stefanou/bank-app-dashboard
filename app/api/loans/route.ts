import { NextResponse } from "next/server"

export async function GET() {
  try {
    const response = await fetch("http://ec2-52-212-43-232.eu-west-1.compute.amazonaws.com/fetcher/loans", {
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
    console.error("[v0] API route: Error fetching loans:", error)

    const mockData = [
      {
        loan_id: "LOAN001",
        customer_id: "CUST001",
        type: "Green Mortgages",
        principal_amount: 500000,
        remaining_amount: 450000,
        interest_rate: 3.5,
        start_date: "2024-01-15",
        maturity_date: "2044-01-15",
      },
      {
        loan_id: "LOAN002",
        customer_id: "CUST002",
        type: "Affordable Housing Loans",
        principal_amount: 300000,
        remaining_amount: 280000,
        interest_rate: 2.8,
        start_date: "2024-02-20",
        maturity_date: "2044-02-20",
      },
      {
        loan_id: "LOAN003",
        customer_id: "CUST003",
        type: "Community Social Projects",
        principal_amount: 200000,
        remaining_amount: 190000,
        interest_rate: 3.0,
        start_date: "2024-03-10",
        maturity_date: "2034-03-10",
      },
      {
        loan_id: "LOAN004",
        customer_id: "CUST004",
        type: "Green / Energy-Efficiency Loans",
        principal_amount: 150000,
        remaining_amount: 145000,
        interest_rate: 2.5,
        start_date: "2024-04-05",
        maturity_date: "2039-04-05",
      },
      {
        loan_id: "LOAN005",
        customer_id: "CUST005",
        type: "Green Mortgages",
        principal_amount: 400000,
        remaining_amount: 380000,
        interest_rate: 3.2,
        start_date: "2024-05-12",
        maturity_date: "2044-05-12",
      },
    ]

    return NextResponse.json(mockData)
  }
}
