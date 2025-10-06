import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

// 🧩 MongoDB Connection URI
const uri = "mongodb+srv://mongodb:92v8m1UHZ6H2tJd7@cluster0.od5ujcp.mongodb.net/";

// 🟢 GET — Fetch all products from the inventory
export async function GET(request) {
  const client = new MongoClient(uri);

  try {
    await client.connect(); // explicitly connect
    const database = client.db("Kshitij");
    const inventory = database.collection("inventory");

    const query = {};
    const allProducts = await inventory.find(query).toArray();

    console.log(allProducts);
    return NextResponse.json({ success: true, allProducts });
  } finally {
    await client.close();
  }
}

// 🔵 POST — Add a new product to the inventory
export async function POST(request) {
  const body = await request.json();
  console.log(body);

  const client = new MongoClient(uri);

  try {
    await client.connect(); // explicitly connect
    const database = client.db("Kshitij");
    const inventory = database.collection("inventory");

    const product = await inventory.insertOne(body);
    return NextResponse.json({ product, ok: true });
  } finally {
    await client.close();
  }
}
