"use client";

import { Button, toast } from "@heroui/react";
import { signOut, useSession } from "@/lib/auth-client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function UserMenu() {
    const { data } = useSession();
    const router = useRouter();

    if (!data?.user) return null;

    const { name, image, email } = data.user;
    const initial = name?.trim().charAt(0).toUpperCase() || "U";

    const handleSignOut = async () => {
        await signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/sign-in"); // redirect to login page
                    toast.success("User log out successfully")
                },
            },
        });
    }

    return (
        <div className="grid items-center gap-2">
            <div className="relative size-25 shrink-0 overflow-hidden rounded-xl border border-border">
                {image ? (
                    <Image
                        src={image}
                        alt={`${name || "User"}'s profile picture`}
                        fill
                        sizes="200px"
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

            <Button variant="danger-soft" onPress={() => handleSignOut()}>Sign Out</Button>
        </div>
    );
}