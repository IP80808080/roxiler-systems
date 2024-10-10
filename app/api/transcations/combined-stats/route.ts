// This Project is originally created by Kamlesh Shrikant Kasambe, Proof of Work

import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

async function fetchWithErrorHandling(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  await connectDB();
  try {
    const searchParams = request.nextUrl.searchParams;
    const month = searchParams.get("month") || "1";
    const baseUrl = new URL(request.url).origin;

    const [statistics, priceRanges, categories] = await Promise.all([
      fetchWithErrorHandling(
        `${baseUrl}/api/transactions/statistics?month=${month}`
      ),
      fetchWithErrorHandling(
        `${baseUrl}/api/transactions/price-ranges?month=${month}`
      ),
      fetchWithErrorHandling(
        `${baseUrl}/api/transactions/categories?month=${month}`
      ),
    ]);

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    return NextResponse.json({
      status: "success",
      data: {
        month: {
          number: parseInt(month),
          name: monthNames[parseInt(month) - 1],
        },
        statistics: statistics.data.statistics,
        priceRanges: priceRanges.data.priceRanges,
        categoryDistribution: categories.data.categories,
      },
    });
  } catch (error) {
    console.error("Combined Stats API error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to fetch combined statistics",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
