import { catchError, response } from "@/lib/helperFunctions";
import { zSchema } from "@/lib/zodSchema";
import OtpModel from "@/models/otp.model";
import UserModel from "@/models/user.model";
import { dbConnect } from "@/service/mongo";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

export async function POST(request) {
    try{
        await dbConnect();

        const payload = await request.json();
        const validationSchema = zSchema.pick({
            otp: true,
            email: true,
        });

        const validatedData = validationSchema.safeParse(payload);
        if (!validatedData.success) {
            return response(false, 401, "Invalid input", validatedData.error);
        }

        const { otp, email } = validatedData.data;
        const getOtpData = await OtpModel.findOne({ email, otp});
        if (!getOtpData) {
            return response(false, 400, "Invalid or expired OTP");
        }
        const getUser = await UserModel.findOne({ email, deletedAt: null }).lean();
        if (!getUser) {
            return response(false, 404, "User not found");
        }

        const loggedInUserData = {
            _id: getUser._id,
            role: getUser.role,
            name: getUser.name,
            avatar: getUser.avatar,
        }

       const secret = new TextEncoder().encode(process.env.EMAIL_VERIFICATION_SECRET);
        const token = await new SignJWT(loggedInUserData)
            .setIssuedAt()
            .setExpirationTime("1d")
            .setProtectedHeader({ alg: "HS256" })
            .sign(secret);

        
        const cookieStore = await cookies();
        cookieStore.set({
            name: "access_token",
            value: token,
            httpOnly: process.env.NODE_ENV === "production",
            path: "/",
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });
        // Delete the OTP after successful verification
        await getOtpData.deleteOne();

        return response(true, 200, "OTP verified successfully");

    }catch (error) {
        return catchError(error);

    }
}