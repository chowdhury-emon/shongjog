"use client";
import Image from "next/image";
import UserMenu from "@/components/Navbar/UserMenu";
import { Popover } from "@heroui/react";
import { useSession } from "@/lib/auth-client";
import { useState } from "react";
import { LuChevronDown } from "react-icons/lu";

export default function UserPopover() {
    const { data } = useSession();
    const [isOpen, setIsOpen] = useState(false);

    if (!data?.user) return null;

    const { name, image } = data.user;
    const initial = name?.trim().charAt(0).toUpperCase() || "U";

    return (
        <div className="flex items-center gap-4">
            <Popover isOpen={isOpen} onOpenChange={setIsOpen}>
                <Popover.Trigger aria-label="User profile">
                    <div className="flex items-center gap-2">
                        <div className="relative size-12 shrink-0 overflow-hidden rounded-full border border-border md:size-10">
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

                        <LuChevronDown
                            className={`text-accent transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                                }`}
                        />
                    </div>
                </Popover.Trigger>

                <Popover.Content placement="bottom right" className="max-w-xs w-fit min-w-50 max-h-[80vh] overflow-y-auto border rounded-2xl">
                    <Popover.Dialog>
                        <UserMenu />
                    </Popover.Dialog>
                </Popover.Content>
            </Popover>
        </div>
    );
}
