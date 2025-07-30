"use client";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import Image from "next/image";
import Logo from "@/public/assets/images/logo-black.png";
import { zSchema } from "@/lib/zodSchema";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ButtonLoading } from "@/components/ui/application/ButtonLoading";
import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { showToast } from "@/lib/toast";
import { WEBSITE_LOGIN } from "@/routes/WebsiteRoute";
import OTPVerification from "@/components/ui/application/OTPVerification";
import UpdatePassword from "@/components/ui/application/UpdatePassword";


export default function ResetPasswordPage() {
    const [emailVerificationLoading, setEmailVerificationLoading] = useState(false);
    const [otpVerificationLoading, setOtpVerificationLoading] = useState(false);
    const [otpEmail, setOtpEmail] = useState();
    const [isOtpVerified, setIsOtpVerified] = useState(false);

    const formSchema = zSchema.pick({
        email: true,
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    })

    const handleEmailVerification = async (values) => {
        try {
            setEmailVerificationLoading(true);
            const { data: sendOtpResponse } = await axios.post("/api/auth/reset-password/send-otp", values);
            if (!sendOtpResponse.success) {
                throw new Error(sendOtpResponse.message);
            }
            setOtpEmail(values.email); // ✅ Set the correct email
            showToast("Please check your Email", sendOtpResponse.message);
        } catch (error) {
            showToast("There is some error", error.message);
        } finally {
            setEmailVerificationLoading(false); // ✅ Correct loading flag
        }
    };

    const handleOtpVerification = async (values) => {
        try {
            setOtpVerificationLoading(true);
            const { data: otpResponse } = await axios.post("/api/auth/reset-password/verify-otp", values);
            if (!otpResponse.success) {
                throw new Error(otpResponse.message);
            }
            showToast("Please check your Email", otpResponse.message);
            setIsOtpVerified(true);
        } catch (error) {
            showToast("There is some error", error.message);
        } finally {
            setOtpVerificationLoading(false);
        }
    }
    return (

        <div>
            <div className="flex justify-center">
                <Image src={Logo.src} height={Logo.height} width={Logo.width} alt="logo" className="max-w-[150px]" />
            </div>
            {
                !otpEmail ?
                    <>
                        <div className="text-center">
                            <h1 className="text-3xl font-bold">Reset Password</h1>
                            <p>Enter your email for password reset.</p>
                        </div>
                        <div className="mt-5">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(handleEmailVerification)}>
                                    <div className="mt-5">
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input type="email" placeholder="example@gmail.com" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="mt-5">
                                        <ButtonLoading
                                            type="submit"
                                            text="Send OTP"
                                            loading={emailVerificationLoading}
                                            className="w-full cursor-pointer"
                                        />
                                    </div>
                                    <div className="mt-3 text-center">
                                        <div className="flex justify-center items-center gap-2">
                                            <p>Don't have account?</p>
                                            <Link href={WEBSITE_LOGIN} className="text-primary underline">Back to Login</Link>
                                        </div>

                                    </div>
                                </form>
                            </Form>
                        </div>
                    </>
                    :
                    <>
                        {!isOtpVerified ?
                            <OTPVerification email={otpEmail} loading={otpVerificationLoading} onSubmit={handleOtpVerification} />
                            :
                            <UpdatePassword email={otpEmail} />
                        }
                    </>

            }

        </div>

    )
}
