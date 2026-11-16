
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { LuUsers, LuLoaderCircle } from "react-icons/lu";

interface JoinEventButtonProps {
    eventId: string;
    eventDate: string;
}

export default function JoinEventButton({
    eventId,
    eventDate,
}: JoinEventButtonProps) {
    const router = useRouter();

    const { data: session, isPending } = authClient.useSession();

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const isPastEvent = new Date(eventDate).getTime() <= Date.now();

    const handleJoinEvent = async () => {
        // Check authentication
        if (!session) {
            router.push("/login");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}/join`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({}),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to join event");
            }

            setIsSuccess(true);
            setMessage(data.message || "You successfully joined the event!");

            router.refresh();

        } catch (error) {
            setIsSuccess(false);
            setMessage(
                error instanceof Error
                    ? error.message
                    : "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button
                onClick={handleJoinEvent}
                disabled={loading || isPending || isPastEvent || isSuccess}
                className="button button--primary flex w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {loading || isPending ? (
                    <>
                        <LuLoaderCircle className="animate-spin" />
                        Please wait...
                    </>
                ) : isPastEvent ? (
                    "Event Ended"
                ) : isSuccess ? (
                    "Joined Successfully"
                ) : (
                    <>
                        <LuUsers />
                        Join Event
                    </>
                )}
            </button>

            {message && (
                <p
                    className={`mt-4 text-center text-sm ${
                        isSuccess ? "text-success" : "text-danger"
                    }`}
                >
                    {message}
                </p>
            )}
        </div>
    );
}
