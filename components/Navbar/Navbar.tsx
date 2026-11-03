"use client";

import { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import Image from "next/image";
import Link from "next/link";
import { LuCalendarDays, LuMenu, LuX } from "react-icons/lu";
import { useSession } from "@/lib/auth-client";
import UserMenu from "@/components/Navbar/UserMenu";
import UserPopover from "@/components/Navbar/UserPopover";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { data: session } = useSession();

    const upcommingEventButton = (
        <Link href={'/'}
            className="button button--outline text-accent"
            onClick={() => setIsMenuOpen(false)}
        >
            <LuCalendarDays />
            Upcomming Events
        </Link>
    );

    const signingButtons = (
        <>
            <Link href={"/sign-in"}
                className="button button--secondary text-accent"
                onClick={() => setIsMenuOpen(false)}
            >
                Sign In
            </Link>
            <Link href={"/sign-up"}
                className="button button--primary text-background"
                onClick={() => setIsMenuOpen(false)}

            >
                Sign Up
            </Link>
        </>
    )

    return (
        <div className="container relative mx-auto max-h-20 h-fit flex justify-between items-center px-2 sm:px-0">
            <Link href={"/"} className="flex w-fit items-center">
                <Image src={"/shongjog-logo.svg"}
                    height={500}
                    width={500}
                    alt="banner"
                    className="w-15 aspect-square object-contain" />
                <h2>Shongjog</h2>
            </Link>

            <div className="hidden md:flex md:items-center gap-2">
                {upcommingEventButton}
                <ThemeToggle></ThemeToggle>
            </div>

            <div className="hidden md:flex gap-2">
                {
                    session
                        ? <UserPopover />
                        : signingButtons
                }
            </div>


            {/* MOBILE MENU */}
            <div className="flex items-center gap-4 md:hidden">
                <button
                    className="aspect-square text-accent w-10 text-4xl active:scale-95"
                    aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                    aria-expanded={isMenuOpen}
                    aria-controls="mobile-navigation"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <LuX aria-hidden="true" /> : <LuMenu aria-hidden="true" />}
                </button>
            </div>

            <nav
                id="mobile-navigation"
                aria-label="Mobile navigation"
                hidden={!isMenuOpen}
                className="absolute right-4 top-full z-50 grid gap-2 w-fit border border-border rounded-2xl p-4 shadow-xl md:hidden bg-surface"
            >
                {session &&
                    <div className="grid gap-2 pb-4 border-b mb-4 *:w-full">
                        <UserMenu />
                    </div>
                }
                <div className="grid gap-2">
                    {upcommingEventButton}
                    <div className="flex items-center gap-2 text-accent">
                        <ThemeToggle label={true}></ThemeToggle>
                    </div>
                </div>
                {!session &&
                    <div className="grid gap-2 mt-8 *:w-full">
                        {signingButtons}
                    </div>
                }
            </nav>
        </div>
    )
}