// This Project is originally created by Kamlesh Shrikant Kasambe, Proof of Work

import connectDB from "@/lib/db";
import Transaction from "@/models/Transcation";
import { NextResponse } from "next/server";
import { Transaction as TransactionType } from "@/types/transcation";

export async function GET() {
  await connectDB();

  try {
    const response = await fetch(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );
    const transactions: TransactionType[] = await response.json();

    await Transaction.deleteMany({});
    const createdTransactions = await Transaction.insertMany(
      transactions.map(
        ({ title, price, description, category, image, sold, dateOfSale }) => ({
          title,
          price,
          description,
          category,
          image,
          sold,
          dateOfSale: new Date(dateOfSale),
        })
      )
    );

    return NextResponse.json({
      message: "Database seeded successfully",
      count: createdTransactions.length,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Failed to seed database" },
      { status: 500 }
    );
  }
}
