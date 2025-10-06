import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

// 🔍 GET — Search products from MongoDB using text index
export async function GET(request) {
  const searchQuery = request.nextUrl.searchParams.get("query");
  const uri = "mongodb+srv://mongodb:92v8m1UHZ6H2tJd7@cluster0.od5ujcp.mongodb.net/";
  const client = new MongoClient(uri);

  try {
    await client.connect(); // explicitly connect
    const database = client.db("Kshitij");
    const inventory = database.collection("inventory");

    // 🔎 Perform text search using MongoDB’s $text operator
    const allProducts = await inventory
      .aggregate([
        {
          $match: {
            $text: { $search: searchQuery },
          },
        },
      ])
      .toArray();

    return NextResponse.json({ allProducts });
  } finally {
    await client.close();
  }
}
