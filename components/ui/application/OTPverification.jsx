import { useForm } from "react-hook-form";
import { zSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { ButtonLoading } from "./ButtonLoading";
import { useState } from "react";
import axios from "axios";
import { showToast } from "@/lib/toast";


export default function OTPVerification({ email, onSubmit, loading }) {
    const [resendingOtp, setResendingOtp] = useState(false);

    const formSchema = zSchema.pick({
        otp: true, email: true,
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            otp: "",
            email: email || "",
        },
    });

    const handleOtpVerification = async (values) => {
        onSubmit(values);
    }

    const handleResendOtp = async () => {
        try {
            setResendingOtp(true);
            const { data: registerResponse } = await axios.post("/api/auth/resend-otp", {email});
            if (!registerResponse.success) {
                throw new Error(registerResponse.message);
            }
            showToast("OTP send successfully", registerResponse.message);
        } catch (error) {
            showToast("There is some error", error.message);
        } finally {
            setResendingOtp(false);
        }
    }
    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleOtpVerification)}>
                    <div className="text-center">
                        <h1 className=" text-2xl font-bold mb-2">Please Complete verification.</h1>
                        <p className="text-md">We have sent an one-time password to your registered email address. Please confirm.</p>
                        <p className="text-md">The OTP will be valid for 10 minutes.</p>
                    </div>
                    <div className="mt-5 px-10 flex justify-center">
                        <FormField
                            control={form.control}
                            name="otp"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-bold text-2xl">One Time Password (OTP)</FormLabel>
                                    <FormControl>
                                        <InputOTP maxLength={6}>
                                            <InputOTPGroup>
                                                <InputOTPSlot index={0} />
                                                <InputOTPSlot index={1} />
                                                <InputOTPSlot index={2} />
                                            </InputOTPGroup>
                                            <InputOTPSeparator />
                                            <InputOTPGroup>
                                                <InputOTPSlot index={3} />
                                                <InputOTPSlot index={4} />
                                                <InputOTPSlot index={5} />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="mt-5">

                    </div>

                    <div className="mt-5">
                        <ButtonLoading
                            type="submit"
                            text="Verify OTP"
                            loading={loading}
                            className="w-full cursor-pointer"
                        />
                        {!resendingOtp ? (
                            <div className="mt-5 text-center">
                                <button
                                    onClick={handleResendOtp}
                                    type="button"
                                    className="text-blue-500 cursor-pointer hover:underline">Resend OTP
                                </button>
                            </div>
                        ) : (
                            <span
                                className="text-blue-500 cursor-pointer hover:underline">Resending OTP...
                            </span>
                        )}

                    </div>
                </form>
            </Form>
        </div>
    )
}
