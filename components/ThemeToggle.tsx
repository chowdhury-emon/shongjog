"use client";

import { Button } from "@heroui/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { LuMoon, LuSun } from "react-icons/lu";

export default function ThemeToggle({ label = false }: { label?: boolean }) {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();
    const themeLabel = theme === "dark" ? "Light Mode" : "Dark Mode";


    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <Button variant="outline" className={`${!label ? "aspect-square p-0" : "w-full"} text-accent capitalize`}
            onPress={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
            {
                theme === "dark"
                    ? <LuSun className="text-yellow-500" />
                    : <LuMoon className="text-slate-500" />
            }
            {
                label && themeLabel
            }

        </Button>
    );
}