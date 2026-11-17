import type { Event } from "@/types/event.type";
import JoinEventButton from "./JoinEventButton";
import { Chip } from "@heroui/react";
import {
    LuMapPin,
    LuCalendarDays,
    LuUserRound,
    LuArrowLeft,
} from "react-icons/lu";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EventDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/events/${id}`,
        { cache: "no-store" }
    );

    if (res.status === 404) {
        notFound();
    }

    if (!res.ok) {
        throw new Error("Failed to fetch event details");
    }

    const post: Event = await res.json();

    const eventDate = new Date(post.eventDate);

    return (
        <section className="min-h-screen bg-background">
            <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:py-16">

                {/* Back Button */}
                <Link
                    href="/events"
                    className="mb-8 inline-flex items-center gap-2 text-muted transition-colors hover:text-accent"
                >
                    <LuArrowLeft />
                    Back to Events
                </Link>

                {/* Event Thumbnail */}
                <div className="mb-10 h-64 overflow-hidden rounded-2xl sm:h-96">
                    <img
                        src={post.thumbnailUrl}
                        alt={post.title}
                        className="h-full w-full object-cover"
                    />
                </div>

                {/* Event Content */}
                <div className="relative grid gap-10 lg:grid-cols-[1fr_340px]">
                    <div className="absolute -top-6">
                        <Chip color="success" variant="soft">
                            {post.eventType}
                        </Chip>
                    </div>

                    {/* Event Information */}
                    <div>
                        <h1 className="mb-5">
                            {post.title}
                        </h1>

                        <p className="mb-8 leading-relaxed text-muted">
                            {post.description}
                        </p>

                        <div className="mb-10 grid gap-5 sm:grid-cols-2">

                            {/* Event Location */}
                            <div className="flex items-start gap-4 rounded-xl border border-border bg-surface p-5">
                                <LuMapPin className="mt-1 text-xl text-accent" />

                                <div>
                                    <p className="mb-1 text-sm text-muted">
                                        Event Location
                                    </p>
                                    <p className="font-medium">
                                        {post.location}
                                    </p>
                                </div>
                            </div>

                            {/* Event Date */}
                            <div className="flex items-start gap-4 rounded-xl border border-border bg-surface p-5">
                                <LuCalendarDays className="mt-1 text-xl text-accent" />

                                <div>
                                    <p className="mb-1 text-sm text-muted">
                                        Event Date
                                    </p>
                                    <p className="font-medium">
                                        {eventDate.toLocaleDateString(
                                            "en-BD",
                                            {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                                timeZone: "Asia/Dhaka",
                                            }
                                        )}
                                    </p>
                                </div>
                            </div>

                        </div>

                        {/* Organizer Information */}
                        <div className="border-t border-border pt-8">
                            <h2 className="mb-5 text-2xl">
                                Event Organizer
                            </h2>

                            <div className="flex items-center gap-4">
                                <div className="flex size-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                                    <LuUserRound className="text-xl" />
                                </div>

                                <div>
                                    <p className="font-semibold">
                                        {post.name}
                                    </p>
                                    <p className="text-sm text-muted">
                                        {post.email}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Join Event Card */}
                    <aside className="h-fit rounded-2xl border border-border bg-surface p-6 lg:sticky lg:top-24">
                        <h3 className="mb-3 text-xl font-semibold">
                            Be Part of the Change
                        </h3>

                        <p className="mb-6 text-sm leading-relaxed text-muted">
                            Join this community initiative and work together
                            to make a positive difference.
                        </p>

                        <JoinEventButton
                            eventId={post._id}
                            eventDate={post.eventDate}
                        />

                        <p className="mt-4 text-center text-xs text-muted">
                            Make a difference, one action at a time.
                        </p>
                    </aside>

                </div>
            </div>
        </section>
    );
}
