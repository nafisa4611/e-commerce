"use client"

import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Card, CardContent } from "@/components/ui/card";
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
import { z } from "zod";
import { useState } from "react";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa6";
import Link from "next/link";
import axios from "axios";
import { showToast } from "@/lib/toast";
import { USER_DASHBOARD, WEBSITE_REGISTER, WEBSITE_RESETPASSWORD } from "@/routes/WebsiteRoute";
import OTPVerification from "@/components/ui/application/OTPVerification";
import { useDispatch } from "react-redux";
import { login } from "@/store/reducer/authReducer";
import { ADMIN_DASHBOARD } from "@/routes/AdminPanelRoute";

export default function LoginPage() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [otpVerificationLoading, setOtpVerificationLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false)
  const [otpEmail, setOtpEmail] = useState();

  const formSchema = zSchema.pick({
    email: true,
  }).extend({
    password: z.string().min(3, "Password must be at least 3 characters."),
  });


  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  })

  const handleLoginSubmit = async (values) => {
    try {
      setLoading(true);
      const { data: loginResponse } = await axios.post("/api/auth/login", values);
      if (!loginResponse.success) {
        throw new Error(loginResponse.message);
      }
      setOtpEmail(values.email);
      form.reset();
      showToast("Please check your Email", loginResponse.message);
      
    } catch (error) {
      showToast("There is some error", error.message);
    } finally {
      setLoading(false);
    }
  }

  const handleOtpVerification = async (values) => {
    try {
      setOtpVerificationLoading(true);
      const { data: otpResponse } = await axios.post("/api/auth/verify-otp", values);
      if (!otpResponse.success) {
        throw new Error(otpResponse.message);
      }

      dispatch(login(otpResponse.data));
      
      if(searchParams.has("callback")){
        router.push(searchParams.get("callback"));
      }else {
        otpResponse.data.role === "admin" ? router.push(ADMIN_DASHBOARD) : router.push(USER_DASHBOARD);
      }

      console.log("Role response", otpResponse.data.role);

      setOtpEmail("");
      showToast("Please check your Email", otpResponse.message);
    } catch (error) {
      showToast("There is some error", error.message);
    } finally {
      setOtpVerificationLoading(false);
    }
  }

  return (
    <Card className="w-[400px]">
      <CardContent>
        <div className="flex justify-center">
          <Image src={Logo.src} height={Logo.height} width={Logo.width} alt="logo" className="max-w-[150px]" />
        </div>
        {
          !otpEmail ?
            <>
              <div className="text-center">
                <h1 className="text-3xl font-bold">Login Into Account</h1>
                <p>Login into account by filling out the form below</p>
              </div>
              <div className="mt-5">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleLoginSubmit)}>
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
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={showPassword ? "text" : "password"}
                                  placeholder="******"
                                  {...field}
                                  className="pr-10"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPassword((prev) => !prev)}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                                  tabIndex={-1}
                                >
                                  {showPassword ? <FaRegEye size={18} /> : <FaRegEyeSlash size={18} />}
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="mt-5">
                      <ButtonLoading
                        type="submit"
                        text="Login"
                        loading={loading}
                        className="w-full cursor-pointer"
                      />
                    </div>
                    <div className="mt-3 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <p>Don't have account?</p>
                        <Link href={WEBSITE_REGISTER} className="text-primary underline">Create Account!</Link>
                      </div>
                      <div className="mt-2">
                        <Link href={WEBSITE_RESETPASSWORD} className="text-primary underline">Forget Password?</Link>
                      </div>
                    </div>
                  </form>
                </Form>
              </div>
            </>
            :
            <>
              <OTPVerification
                email={otpEmail}
                loading={otpVerificationLoading}
                onSubmit={handleOtpVerification} />
            </>
        }

      </CardContent>
    </Card>
  )
}
