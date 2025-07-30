import loading from "@/public/assets/images/loading.svg";
import Image from "next/image";

export default function Loading() {
  return (
    <div className="h-screen w-screen flex justify-center items-start mt-12">
        <Image
            src={loading.src}
            alt="Loading"
            width={80}
            height={80}
        />
    </div>
  )
}
