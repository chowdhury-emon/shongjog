import Image from "next/image";

export default function Hero() {
    return (
        <div className="text-center">
            <p>A Social Development Event Platform</p>
            <Image src={"/banner.png"} height={3000} width={3000} alt="banner" className="w-full object-cover" />
        </div>
    )
}