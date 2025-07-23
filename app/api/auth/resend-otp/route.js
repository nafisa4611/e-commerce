import { catchError, generateRandomOtp, response } from "@/lib/helperFunctions";
import { sendEmail } from "@/lib/sendEmail";
import { zSchema } from "@/lib/zodSchema";
import OtpModel from "@/models/otp.model";
import UserModel from "@/models/user.model";
import { dbConnect } from "@/service/mongo";

export async function POST(request) {
    try {
        await dbConnect();


        const payload = await request.json();
        const validationSchema = zSchema.pick({
            email: true,
        });

        const validatedData = validationSchema.safeParse(payload);
        if (!validatedData.success) {
            return response(false, 401, "Invalid input");
        }

        const { email } = validatedData.data;

        const getUser = await UserModel.findOne({ email });
        if (!getUser) {
            return response(false, 404, "User not found");
        }

        await OtpModel.deleteMany({ email }); // Clear previous OTPs for the email
        const otp = generateRandomOtp();
        const newOtpData = new OtpModel({
            email, otp
        }); 
        await newOtpData.save();
        const otpSendStatus = await sendEmail(
            email,
            "OTP for Login",
            `Your OTP for login is ${otp}. It is valid for 10 minutes.`
        );

        if (!otpSendStatus) {
            return response(false, 500, "Failed to resend OTP to email");
        }
        return response(true, 200, "OTP sent successfully");
    } catch(error) {
        return catchError(error);
    }
}