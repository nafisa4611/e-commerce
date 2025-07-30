import { catchError, response } from "@/lib/helperFunctions";
import { zSchema } from "@/lib/zodSchema";
import UserModel from "@/models/user.model";
import { dbConnect } from "@/service/mongo";

export async function PUT(request){
    try{
        await dbConnect();
        const payload = await request.json();
        const validationSchema = zSchema.pick({
            email: true,
            password: true,
        })

        const validatedData = validationSchema.safeParse(payload);
        if(!validatedData.success) {
            return response(false, 401, "Invalid input", validatedData.error);
        }

        const { email, password } = validatedData.data;

        const getUser = await UserModel.findOne({ deletedAt: null, email }).select("+password");
        if(!getUser) {
            return response(false, 404, "User not found");
        }

        getUser.password = password;
        await getUser.save();

        return response(true, 200, "Password updated successfully");


    }catch(error){
        return catchError(error);
    }
}