"use client"

import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import { use, useEffect, useState } from "react"
import verifiedImg from "@/public/assets/images/verified.gif"
import notVerifiedImg from "@/public/assets/images/verification-failed.gif"
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { WEBSITE_HOME } from "@/routes/WebsiteRoute";

export default function emailVerificationPage({params}) {
  const { token } = use(params);
  const [isVerified, setIsVerified] = useState(false);
  useEffect(() => {
    const verify = async () => {
        const {data: verificationResponse} = await axios.post('/api/auth/verifyEmail', {token})
        if(verificationResponse.success){
            setIsVerified(true);
        }
    }
    verify();
  }, [token])
  
  return (
    <div>
        <Card className="w-[400px]">
            <CardContent>
                {isVerified? 
                    <div>
                        <div className="flex justify-center items-center">
                            <Image 
                            src={verifiedImg} 
                            height={verifiedImg.height} 
                            width={verifiedImg.width}
                            className="height-[100px] w-auto"
                            alt="Verified Icon" />
                        </div>
                        <div className="text-center">
                            <h1 className="text-2xl font-bold my-5 text-green-500">Email verification successful.</h1>
                            <Button asChild>
                                <Link href={WEBSITE_HOME}>Continue Shopping</Link>
                            </Button>
                        </div>
                    </div> 
                    : 
                    <div>
                        <div className="flex justify-center items-center">
                            <Image 
                            src={notVerifiedImg} 
                            height={notVerifiedImg.height} 
                            width={notVerifiedImg.width}
                            className="height-[100px] w-auto"
                            alt="Not Verified Icon" />
                        </div>
                        <div className="text-center">
                            <h1 className="text-2xl font-bold my-5 text-red-500">Email verification Failed.</h1>
                            <Button asChild>
                                <Link href={WEBSITE_HOME}>Continue Shopping</Link>
                            </Button>
                        </div>
                        
                    </div>}
            </CardContent>
        </Card>
    </div>
  )
}
