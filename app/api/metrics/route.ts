import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = searchParams.get("limit") || "100"

    const response = await fetch(
      `http://ec2-52-212-43-232.eu-west-1.compute.amazonaws.com/fetcher/metrics/daily?limit=${limit}`,
      {
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      },
    )

    if (!response.ok) {
      throw new Error(`External API returned ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] API route: Error fetching loans:", error)

    const mockData = [
      {
        id: 3165,
        currency: "PTSB",
        total_covered: 0,
        total_remaining: 0,
        loan_count: 0,
        cover_count: 0,
        timestamp: "2025-11-11T09:58:24.893721",
      },
      {
        id: 3164,
        currency: "TK4",
        total_covered: 362165.89,
        total_remaining: 391748.62,
        loan_count: 27,
        cover_count: 42,
        timestamp: "2025-11-11T09:58:24.892750",
      },
      {
        id: 3163,
        currency: "TK3",
        total_covered: 422288,
        total_remaining: 710657.21,
        loan_count: 30,
        cover_count: 66,
        timestamp: "2025-11-11T09:58:24.891704",
      },
      {
        id: 3162,
        currency: "TK2",
        total_covered: 236822,
        total_remaining: 351440.93,
        loan_count: 12,
        cover_count: 21,
        timestamp: "2025-11-11T09:58:24.890654",
      },
      {
        id: 3161,
        currency: "TK1",
        total_covered: 540668,
        total_remaining: 761063.8,
        loan_count: 32,
        cover_count: 113,
        timestamp: "2025-11-11T09:58:24.889213",
      },
    ]

    return NextResponse.json(mockData)
  }
}
