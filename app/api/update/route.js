import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

// 🔄 POST — Update product quantity (increment or decrement)
export async function POST(request) {
  const { action, name, initialQuantity } = await request.json();
  const uri = "mongodb+srv://mongodb:92v8m1UHZ6H2tJd7@cluster0.od5ujcp.mongodb.net/";
  const client = new MongoClient(uri);

  try {
    await client.connect(); // explicitly connect
    const database = client.db("Kshitij");
    const inventory = database.collection("inventory");

    // 🎯 Find product by name
    const filter = { name };

    // ➕➖ Compute new quantity based on action
    const newQuantity = action === "plus" ? parseInt(initialQuantity) + 1 : parseInt(initialQuantity) - 1;

    // 🧱 Prepare update document
    const updateDoc = {
      $set: { quantity: newQuantity },
    };

    // 📝 Update in MongoDB
    const result = await inventory.updateOne(filter, updateDoc);

    return NextResponse.json({
      success: true,
      message: `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
    });
  } finally {
    await client.close();
  }
}
