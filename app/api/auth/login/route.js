import { emailVerificationLink } from "@/email/emailVerificationLink";
import { otpEmail } from "@/email/otpEmail";
import { catchError, generateRandomOtp, response } from "@/lib/helperFunctions";
import { sendEmail } from "@/lib/sendEmail";
import { zSchema } from "@/lib/zodSchema";
import OtpModel from "@/models/otp.model";
import UserModel from "@/models/user.model";
import { dbConnect } from "@/service/mongo";
import { SignJWT } from "jose";
import z from "zod";

export async function POST(request) {
    try {
        await dbConnect();
        const payload = await request.json();

        const validationSchema = zSchema.pick({
            email: true,
        }).extend({
            password: z.string(),
        });
        const validatedData = validationSchema.safeParse(payload);

        if (!validatedData.success) {
            return response(false, 401, "Invalid input", validatedData.error);
        }

        const { email, password } = validatedData.data;

        const getUser = await UserModel.findOne({ deletedAt: null, email }).select("+password");
        if (!getUser) {
            return response(false, 400, "Invalid Login credentials");
        }

        if (!getUser.isEmailVerified) {
            const secret = new TextEncoder().encode(process.env.EMAIL_VERIFICATION_SECRET);
            const token = await new SignJWT({ userId: getUser._id.toString() })
                .setIssuedAt()
                .setExpirationTime("1h")
                .setProtectedHeader({ alg: "HS256" })
                .sign(secret);

            await sendEmail(
                email,
                "Email Verification",
                emailVerificationLink(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/verifyEmail/${token}`)
            );

            return response(false, 401, "Email not verified. Please check your email for verification.");
        }

        const isPasswordValid = await getUser.comparePassword(password);
        if (!isPasswordValid) {
            return response(false, 400, "Invalid Login credentials");
        }

        // OTP generation

        await OtpModel.deleteMany({ email }); // Clear previous OTPs for the email
        const otp = generateRandomOtp();

        //store OTP in the database
        const newOtp = new OtpModel({
            email,
            otp,
        });
        await newOtp.save();

        // Send OTP to user's email
        const otpStatus = await sendEmail(
            email,
            "Your Login Verification OTP",
            otpEmail(otp)
        )

        if(!otpStatus.success) {
            return response(false, 500, "Failed to send OTP");
        }

        return response(true, 200, "Please verify your email");

    } catch (error) {
        return catchError(error);
    }
}