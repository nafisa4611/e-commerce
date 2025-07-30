import { NextResponse } from "next/server";
import UserModel from "@/models/user.model";
import { dbConnect } from "@/service/mongo";

export async function GET() {
  try {
    await dbConnect();

    const email = "nafisa_mila@kau.ac.bd"; // 🔁 Replace with your test email
    const user = await UserModel.findOne({ email });

    console.log("✅ User found:", user);

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" });
    }

    return NextResponse.json({ success: true, user });
  } catch (err) {
    console.error("⛔ DB Error:", err);
    return NextResponse.json({ success: false, error: err.message });
  }
}
