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
        { status: "error", message: "Month must be between 1 and 12" },
        { status: 400 }
      );
    }

    const categories = await Transaction.aggregate([
      {
        $match: {
          $expr: {
            $eq: [{ $month: "$dateOfSale" }, month],
          },
        },
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          category: "$_id",
          count: 1,
          _id: 0,
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    return NextResponse.json({
      status: "success",
      data: {
        month,
        categories,
      },
    });
  } catch (error) {
    console.error("Categories API error:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch category statistics" },
      { status: 500 }
    );
  }
}
