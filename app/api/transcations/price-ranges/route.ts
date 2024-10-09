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

    const ranges = [
      { min: 0, max: 100, label: "0-100" },
      { min: 101, max: 200, label: "101-200" },
      { min: 201, max: 300, label: "201-300" },
      { min: 301, max: 400, label: "301-400" },
      { min: 401, max: 500, label: "401-500" },
      { min: 501, max: 600, label: "501-600" },
      { min: 601, max: 700, label: "601-700" },
      { min: 701, max: 800, label: "701-800" },
      { min: 801, max: 900, label: "801-900" },
      { min: 901, max: Infinity, label: "901-above" },
    ];

    const result = await Transaction.aggregate([
      {
        $match: {
          $expr: {
            $eq: [{ $month: "$dateOfSale" }, month],
          },
        },
      },
      {
        $bucket: {
          groupBy: "$price",
          boundaries: [0, 101, 201, 301, 401, 501, 601, 701, 801, 901],
          default: "901-above",
          output: {
            count: { $sum: 1 },
          },
        },
      },
      {
        $project: {
          range: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ]);

    const formattedResult = ranges.map((range) => {
      const rangeData = result.find(
        (r) =>
          (typeof r.range === "number" && r.range === range.min) ||
          (typeof r.range === "string" && range.max === Infinity)
      );

      return {
        range: range.label,
        count: rangeData?.count || 0,
      };
    });

    return NextResponse.json({
      status: "success",
      data: {
        month,
        priceRanges: formattedResult,
      },
    });
  } catch (error) {
    console.error("Price Ranges API error:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch price ranges" },
      { status: 500 }
    );
  }
}
