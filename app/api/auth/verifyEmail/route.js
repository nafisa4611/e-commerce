import { catchError, response } from "@/lib/helperFunctions";
import UserModel from "@/models/user.model";
import { dbConnect } from "@/service/mongo";
import { jwtVerify } from "jose";
import { isValidObjectId } from "mongoose";

export async function POST(request) {
    try{
        await dbConnect();

        const { token } = await request.json();

        if(!token) {
            return response(false, 400, "Token is required for email verification");
        }

        const secret = new TextEncoder().encode(process.env.EMAIL_VERIFICATION_SECRET);

        const decoded = await jwtVerify(token, secret);
        const userId = decoded.payload.userId;

        
        const user = await UserModel.findById(userId);

        if(!user) {
            return response(false, 404, "User not found");
        }
        
        user.isEmailVerified = true;
        await user.save();
        return response(true, 200, "Email verified successfully");

    }catch (error) {
        return catchError(error);

    }
}