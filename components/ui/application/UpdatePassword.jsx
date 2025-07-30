"use client";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Card, CardContent } from "@/components/ui/card";

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
import axios from "axios";
import { showToast } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { WEBSITE_LOGIN } from "@/routes/WebsiteRoute";

export default function UpdatePassword({ email}) {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false)

    const router = useRouter();

    const formSchema = zSchema.pick({
        email: true, password: true,
    }).extend({
        confirmPassword: z.string()
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });



    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: email,
            password: "",
            confirmPassword: ""
        }
    })

    const handlePasswordSubmit = async (values) => {
        try {
            setLoading(true);
            const { data: passwordUpdate } = await axios.put("/api/auth/reset-password/update-password", values);

            if (!passwordUpdate.success) {
                throw new Error(passwordUpdate.message);
            }
            form.reset();
            showToast("success", passwordUpdate.message);
            router.push(WEBSITE_LOGIN)
        } catch (error) {
            showToast("error", error.message);
        } finally {
            setLoading(false);
        }
    }
    return (
        <Card className="w-[400px]">
            <CardContent>
                <div className="text-center">
                    <h1 className="text-3xl font-bold">Update Password</h1>
                    <p>Create new Password.</p>
                </div>
                <div className="mt-5">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handlePasswordSubmit)}>
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
                                    text="Update Password"
                                    loading={loading}
                                    className="w-full cursor-pointer"
                                />
                            </div>
                        </form>
                    </Form>
                </div>
            </CardContent>
        </Card>
    )
}

