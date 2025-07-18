import { dbConnect } from "@/service/mongo";
import { NextResponse } from "next/server";

export async function GET() {
    await dbConnect();
    return NextResponse.json({
        message: "Test route is working",
        status: "success"
    })
}