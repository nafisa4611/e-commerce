import { emailVerificationLink } from "@/email/emailVerificationLink";
import { catchError, response } from "@/lib/helperFunctions";
import { sendEmail } from "@/lib/sendEmail";
import { zSchema } from "@/lib/zodSchema";
import UserModel from "@/models/user.model";
import { dbConnect } from "@/service/mongo";
import { SignJWT } from "jose";


export async function POST(request) {
    try {
        await dbConnect();
        const validationSchema = zSchema.pick({
            name: true,
            email: true,
            password: true,
        });

        const payload = await request.json();
        const validatedData = validationSchema.safeParse(payload);

        if (!validatedData.success) {
            return response(false, 400, "Validation failed", validatedData.error);
        }

        const { name, email, password } = validatedData.data;

        const checkUser = await UserModel.exists({ email });
        if (checkUser) {
            return response(true, 409, "User already registered");
        }

        const newRegistration = new UserModel({
            name,
            email,
            password,
        })

        await newRegistration.save();

        const secret = new TextEncoder().encode(process.env.EMAIL_VERIFICATION_SECRET);
        const token = await new SignJWT({ userId: newRegistration._id.toString() })
            .setIssuedAt()
            .setExpirationTime("1h")
            .setProtectedHeader({ alg: "HS256" })
            .sign(secret);

        await sendEmail(
            email,
            "Email Verification",
            emailVerificationLink(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/verifyEmail/${token}`)
        );


        return response(true, 200, "User registered successfully, Please check your email for verification.")


    } catch (error) {
        catchError(error);
    }
}