import { catchError, response } from "@/lib/helperFunctions";
import { zSchema } from "@/lib/zodSchema";
import OtpModel from "@/models/otp.model";
import UserModel from "@/models/user.model";
import { dbConnect } from "@/service/mongo";

export async function POST(request) {
  try {
    // Step 1: Connect to MongoDB
    await dbConnect();

    // Step 2: Get and validate input
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

    // Step 3: Check OTP
    const getOtpData = await OtpModel.findOne({ email, otp });
    if (!getOtpData) {
      return response(false, 400, "Invalid or expired OTP");
    }

    // Step 4: Get user
    const getUser = await UserModel.findOne({ email, deletedAt: null }).lean();
    if (!getUser) {
      return response(false, 404, "User not found");
    }

    // Debug log to confirm user data
    console.log("✅ OTP verification success response:", {
      role: getUser.role,
      name: getUser.name,
      email: getUser.email,
      _id: getUser._id
    });

    // Step 5: Clean up OTP after successful verification
    await getOtpData.deleteOne();

    // Step 6: Return success response
    return response(true, 200, "OTP verified successfully", {
      role: getUser.role,
      name: getUser.name,
      email: getUser.email,
      _id: getUser._id
    });

  } catch (error) {
    console.error("❌ OTP Server Error:", error);
    return catchError(error);
  }
}
