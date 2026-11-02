"use client";

import { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import Image from "next/image";
import Link from "next/link";
import { LuCalendarDays, LuMenu, LuX } from "react-icons/lu";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="container relative mx-auto max-h-20 h-fit flex justify-between items-center px-4 sm:px-0">
            <div className="flex w-fit items-center">
                <Image src={"/shongjog-logo.svg"} height={500} width={500} alt="banner" className="w-15 aspect-square object-contain" />
                <h2>Shongjog</h2>
            </div>

            <div className="hidden md:flex gap-2">
                <Link href={'/'} className="button text-accent button--outline">
                    <LuCalendarDays />
                    Upcomming Events
                </Link>
                <ThemeToggle></ThemeToggle>
            </div>

            <div className="hidden md:flex gap-2">
                <Link href={"/"} className="button button--ghost text-accent">Sign In</Link>
                <Link href={"/"} className="button button--secondary">Sign Up</Link>
            </div>

            <div className="flex items-center gap-4 md:hidden">
                <ThemeToggle></ThemeToggle>
                <button
                    className="aspect-square text-accent w-10 text-4xl"
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
                className="absolute right-4 top-full z-50 grid gap-2 w-fit border border-border rounded-2xl bg-background p-4 shadow-xl md:hidden"
            >
                <Link
                    href="/"
                    className="button button--outline justify-center text-accent m-8"
                    onClick={() => setIsMenuOpen(false)}
                >
                    <LuCalendarDays aria-hidden="true" />
                    Upcomming Events
                </Link>
                <Link href={"/"}
                    className="w-full text-accent button button--secondary"
                    onClick={() => setIsMenuOpen(false)}
                >
                    Sign In
                </Link>
                <Link href={"/"}
                    className="w-full button button--primary text-background"
                    onClick={() => setIsMenuOpen(false)}
                >
                    Sign Up
                </Link>
            </nav>
        </div>
    )
}