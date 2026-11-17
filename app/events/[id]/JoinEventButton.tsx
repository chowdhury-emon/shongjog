"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { LuUsers, LuLoaderCircle, LuCheckCheck } from "react-icons/lu";
import { Button, toast } from "@heroui/react";

interface JoinEventButtonProps {
    eventId: string;
    eventDate: string;
}

export default function JoinEventButton({
    eventId,
    eventDate,
}: JoinEventButtonProps) {
    const router = useRouter();

    const { data: session, isPending } = useSession();

    const [loading, setLoading] = useState(false);
    const [isJoined, setIsJoined] = useState(false);
    const [joinedEventId, setJoinedEventId] = useState("");

    const isPastEvent = new Date(eventDate).getTime() <= Date.now();
    const joinedData = { eventId, userId: session?.user.id };

    const findJoinedEvent = async () => {
        try {
            // console.log("joined data: ", joinedData);
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/events/join-status`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(joinedData),
                }
            );

            const data = await res.json();
            console.log("Joined status: ", data);

            if (!res.ok) {
                throw new Error(data.message || "Failed to get events join-status");
            }

            if (data) {
                setJoinedEventId(data._id);
                setIsJoined(true);
            } else {
                setJoinedEventId("");
                setIsJoined(false);
            }

        } catch (error) {
            console.log(
                error instanceof Error
                    ? error.message
                    : "Something went wrong"
            );
        }
    }

    const handleJoinEvent = async () => {
        // Check authentication
        if (!session) {
            router.push("/login");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/events/join`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(joinedData),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to join event");
            }

            setIsJoined(true);
            toast.success(data.message || "You successfully joined the event!");

            router.refresh();

        } catch (error) {
            setIsJoined(false);
            toast.danger(
                error instanceof Error
                    ? error.message
                    : "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleLeaveJoinEvent = async () => {
        // Check authentication
        if (!session) {
            router.push("/login");
            return;
        }

        setLoading(true);
        console.log("delete id: ", joinedEventId);

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/events/join/${joinedEventId}`,
                {
                    method: "DELETE",
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to leave event");
            }

            setIsJoined(false);
            toast.success(data.message || "You successfully leave the event!");

            router.refresh();

        } catch (error) {
            toast.danger(
                error instanceof Error
                    ? error.message
                    : "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (session?.user.id){
            findJoinedEvent();
        }
    }, [session?.user.id]);

    return (
        <div>
            <Button
                onClick={isJoined ? handleLeaveJoinEvent : handleJoinEvent}
                isDisabled={loading || isPending || isPastEvent}
                className={`w-full ${isJoined? "bg-success":""} disabled:cursor-not-allowed disabled:opacity-50`}
            >
                {loading || isPending ? (
                    <>
                        <LuLoaderCircle className="animate-spin" />
                        Please wait...
                    </>
                ) : isPastEvent ? (
                    "Event Ended"
                ) : isJoined ? (
                    <> <LuCheckCheck /> Joined</>
                ) : (
                    <>
                        <LuUsers />
                        Join Event
                    </>
                )}
            </Button>
            {
                isJoined &&
                <p className="text-xs text-center text-muted">Click again to leave event</p>
            }
        </div>
    );
}
