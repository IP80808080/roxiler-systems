// This Project is originally created by Kamlesh Shrikant Kasambe, Proof of Work

import connectDB from "@/lib/db";
import Transaction from "@/models/Transcation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const searchParams = request.nextUrl.searchParams;
    const month = parseInt(searchParams.get("month") || "1");

    if (month < 1 || month > 12) {
      return NextResponse.json(
        {
          status: "error",
          message: "Month must be between 1 and 12",
        },
        { status: 400 }
      );
    }

    const startDate = new Date(2022, month - 1, 1);
    const endDate = new Date(2022, month, 0);

    const statistics = await Transaction.aggregate([
      {
        $match: {
          dateOfSale: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalSaleAmount: {
            $sum: {
              $cond: [{ $eq: ["$sold", true] }, "$price", 0],
            },
          },
          soldItems: {
            $sum: {
              $cond: [{ $eq: ["$sold", true] }, 1, 0],
            },
          },
          notSoldItems: {
            $sum: {
              $cond: [{ $eq: ["$sold", false] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalSaleAmount: { $round: ["$totalSaleAmount", 2] },
          soldItems: 1,
          notSoldItems: 1,
        },
      },
    ]);

    const stats = statistics[0] || {
      totalSaleAmount: 0,
      soldItems: 0,
      notSoldItems: 0,
    };

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
          number: month,
          name: monthNames[month - 1],
        },
        statistics: {
          totalSaleAmount: stats.totalSaleAmount,
          soldItems: stats.soldItems,
          notSoldItems: stats.notSoldItems,
        },
      },
    });
  } catch (error) {
    console.error("Statistics API error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to fetch statistics",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
