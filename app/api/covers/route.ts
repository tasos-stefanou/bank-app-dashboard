import { NextResponse } from "next/server"

export async function GET() {
  try {
    const response = await fetch("http://ec2-52-212-43-232.eu-west-1.compute.amazonaws.com/fetcher/covers", {
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
    console.error("[v0] API route: Error fetching covers:", error)

    const mockData = [
      {
    "loan_id": "9c37ec53",
    "account_id": "45",
    "amount": 87,
    "currency": "TK1",
    "timestamp": "2025-11-11T07:48:29.492635"
  },
  {
    "loan_id": "00c25a22",
    "account_id": "27",
    "amount": 227,
    "currency": "TK1",
    "timestamp": "2025-11-11T08:04:54.339556"
  },
  {
    "loan_id": "4c7b66de",
    "account_id": "46",
    "amount": 7714.58,
    "currency": "TK1",
    "timestamp": "2025-11-11T09:16:41.511555"
  },
  {
    "loan_id": "525eb519",
    "account_id": "8",
    "amount": 468.38,
    "currency": "TK1",
    "timestamp": "2025-11-11T00:09:12.283353"
  },
  {
    "loan_id": "4c7b66de",
    "account_id": "2",
    "amount": 4364.51,
    "currency": "TK1",
    "timestamp": "2025-11-11T09:21:20.737680"
  },
  {
    "loan_id": "9c37ec53",
    "account_id": "33",
    "amount": 77,
    "currency": "TK1",
    "timestamp": "2025-11-11T07:45:48.774426"
  },
    ]

    return NextResponse.json(mockData)
  }
}
