"use client"

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
import { WEBSITE_LOGIN } from "@/routes/websiteRoute";
import axios from "axios";
import fi from "zod/v4/locales/fi.cjs";

export default function registrationPage() {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false)

    const formSchema = zSchema.pick({
        name: true, email: true, password: true,
    }).extend({
        confirmPassword: z.string()
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });



    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: ""
        }
    })

    const handleLoginSubmit = async (values) => {
        try {
            setLoading(true);
            const {data: registerResponse} = await axios.post("/api/auth/register", values);
            if(!registerResponse.success) {
                throw new Error(registerResponse.message);
            }
            form.reset();
            alert(registerResponse.message);
        }catch (error) {
            alert(error.message);
        }finally {
            setLoading(false);
        }
    }
    return (
        <Card className="w-[400px]">
            <CardContent>
                <div className="flex justify-center">
                    <Image src={Logo.src} height={Logo.height} width={Logo.width} alt="logo" className="max-w-[150px]" />
                </div>
                <div className="text-center">
                    <h1 className="text-3xl font-bold">Create Account</h1>
                    <p>Create new account by filling out the form below</p>
                </div>
                <div className="mt-5">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleLoginSubmit)}>
                            <div className="mt-5">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Name</FormLabel>
                                            <FormControl>
                                                <Input type="text" placeholder="Please type your full name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
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
                                                        type="password"
                                                        placeholder="******"
                                                        {...field}
                                                        className="pr-10"
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="mt-5">
                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Confirm Password</FormLabel>
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
                                    text="Create Account"
                                    loading={loading}
                                    className="w-full cursor-pointer"
                                />
                            </div>
                            <div className="mt-3 text-center">
                                <div className="flex justify-center items-center gap-2">
                                    <p>Already have account?</p>
                                    <Link href={WEBSITE_LOGIN} className="text-primary underline">Login</Link>
                                </div>
                            </div>
                        </form>
                    </Form>
                </div>
            </CardContent>
        </Card>
    )
}

