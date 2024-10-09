import connectDB from "@/lib/db";
import Transaction from "@/models/Transcation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const perPage = parseInt(searchParams.get("perPage") || "10");
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * perPage;

    const query: any = {};

    if (search) {
      const searchNumber = !isNaN(Number(search)) ? Number(search) : null;

      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        ...(searchNumber !== null ? [{ price: searchNumber }] : []),
      ];
    }

    const total = await Transaction.countDocuments(query);

    const transactions = await Transaction.find(query)
      .sort({ dateOfSale: -1 })
      .skip(skip)
      .limit(perPage)
      .select("title description price category image sold dateOfSale");

    return NextResponse.json({
      status: "success",
      data: {
        transactions,
        pagination: {
          total,
          page,
          perPage,
          totalPages: Math.ceil(total / perPage),
        },
      },
    });
  } catch (error) {
    console.error("Transactions List API error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to fetch transactions",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
