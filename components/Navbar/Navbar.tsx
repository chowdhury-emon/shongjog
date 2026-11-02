import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import { LuCalendarDays } from "react-icons/lu";

export default function Navbar() {
    return (
        <div className="container mx-auto max-h-20 h-fit flex justify-between items-center">

            <div className="flex w-fit items-center">
                <Image src={"/shongjog-logo.svg"} height={500} width={500} alt="banner" className="w-15 aspect-square object-contain" />
                <h2>Shongjog</h2>
            </div>

            <div className="flex gap-2">
                <Link href={'/'} className="button text-accent button--outline">
                    <LuCalendarDays />
                    Upcomming Events
                </Link>
                <ThemeToggle></ThemeToggle>
            </div>

            <div className="flex gap-2">
                <Button variant="ghost" className="text-accent">Sign In</Button>
                <Button variant="secondary">Sign Up</Button>
            </div>
        </div>
    )
}