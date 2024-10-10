// This Project is originally created by Kamlesh Shrikant Kasambe, Proof of Work

import connectDB from "@/lib/db";
import TransactionModel from "@/models/Transcation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await connectDB();

  try {
    const { searchParams } = request.nextUrl;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const perPage = parseInt(searchParams.get("perPage") || "10", 10);
    const search = searchParams.get("search") || "";
    const month = parseInt(searchParams.get("month") || "0", 10);

    const skip = (page - 1) * perPage;

    const query: Record<string, unknown> = {};

    if (search) {
      query.$or = [
        { title: new RegExp(search, "i") },
        { description: new RegExp(search, "i") },
      ];
    }

    if (month) {
      const startDate = new Date(2022, month - 1, 1);
      console.log(startDate);
      const endDate = new Date(2022, month, 0);
      console.log(endDate);
      query.dateOfSale = { $gte: startDate, $lte: endDate };
    }

    const total = await TransactionModel.countDocuments(query);
    const transactions = await TransactionModel.find(query)
      .sort({ dateOfSale: -1 })
      .skip(skip)
      .limit(perPage);

    return NextResponse.json({ transactions, total, page, perPage });
  } catch (error) {
    console.error("Transactions API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
