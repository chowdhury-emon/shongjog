"use client";

import { Button } from "@heroui/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { LuMoon, LuSun } from "react-icons/lu";

export default function ThemeToggle({ children }: { children?: string }) {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div>
            <Button variant="outline" className={`${!children ? "aspect-square p-0" : "" } text-accent`}
                onPress={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
                {
                    theme === "dark"
                        ? <LuSun className="text-yellow-500" />
                        : <LuMoon className="text-slate-500" />
                }
                {
                    children
                }

            </Button>
        </div>
    );
}