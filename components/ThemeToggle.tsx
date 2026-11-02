"use client";

import { Button } from "@heroui/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { LuMoon, LuSun } from "react-icons/lu";

export default function ThemeToggle() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div>
            <Button variant="outline" className="aspect-square w-10 h-auto"
                onPress={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
                {
                    theme === "dark"
                        ? <LuSun className="text-yellow-500" />
                        : <LuMoon className="text-blue-500" />
                }
            </Button>
        </div>
    );
}