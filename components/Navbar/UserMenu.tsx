
"use client";

import { Button, toast } from "@heroui/react";
import { signOut, useSession } from "@/lib/auth-client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
    LuCirclePlus,
    LuCalendarCheck,
    LuCalendarCog,
} from "react-icons/lu";

export default function UserMenu() {
    const { data } = useSession();
    const router = useRouter();

    const eventLinks = [
        {
            link: "/events/create",
            label: "Create Event",
            icon: LuCirclePlus,
        },
        {
            link: "/events/manage",
            label: "Manage Event",
            icon: LuCalendarCog,
        },
        {
            link: "/events/joined",
            label: "Joined Event",
            icon: LuCalendarCheck,
        },
    ];

    if (!data?.user) return null;

    const { name, image, email } = data.user;
    const initial = name?.trim().charAt(0).toUpperCase() || "U";

    const handleSignOut = async () => {
        await signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/sign-in");
                    toast.success("User logged out successfully");
                },
            },
        });
    };

    return (
        <div className="grid items-center gap-2">

            <div className="relative size-25 shrink-0 overflow-hidden rounded-xl border border-border">
                {image ? (
                    <Image
                        src={image}
                        alt={`${name || "User"}'s profile picture`}
                        fill
                        sizes="100px"
                        className="object-cover"
                    />
                ) : (
                    <div className="grid size-full place-items-center bg-accent/10 text-lg font-bold text-accent">
                        {initial}
                    </div>
                )}
            </div>

            <span className="truncate text-sm font-medium text-foreground capitalize">
                {name || "User"}
            </span>

            <span className="truncate text-sm font-medium text-muted">
                {email}
            </span>

            <div className="border-t py-2 my-2 grid gap-2">
                {eventLinks.map((item) => {
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.link}
                            href={item.link}
                            className="button button--ghost text-accent flex justify-start items-center gap-2 w-full"
                        >
                            <Icon size={18} />
                            {item.label}
                        </Link>
                    );
                })}
            </div>

            <Button
                variant="danger-soft"
                onPress={handleSignOut}
            >
                Sign Out
            </Button>

        </div>
    );
}
