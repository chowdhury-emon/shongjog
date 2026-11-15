// app/events/page.tsx
import type { Event } from "@/types/event.type";
import { Chip } from "@heroui/react";
import Link from "next/link";
import { LuCirclePlus, LuMapPin, LuCalendarDays, LuArrowUpRight } from "react-icons/lu";


export default async function Page() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Failed to fetch events");
    }

    const data: Event[] = await res.json();

    // Only show upcoming events and sort by date
    const upcomingEvents = data
        .filter((event) => new Date(event.eventDate) > new Date())
        .sort(
            (a, b) =>
                new Date(a.eventDate).getTime() -
                new Date(b.eventDate).getTime()
        );

    return (
        <section className="min-h-screen bg-background">
            <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">

                {/* Page Heading */}
                <div className="mb-14 grid items-center gap-4 md:flex md:justify-between">
                    <div className="text-start">
                        <Chip
                            color="success"
                            variant="soft"
                            className="mb-5"
                        >
                            Make a Difference Together
                        </Chip>

                        <h1 className="mb-4">
                            Upcoming Events
                        </h1>

                        <p className="max-w-2xl text-muted">
                            Discover community events happening around you.
                            Join hands with others and make a positive impact
                            in your community.
                        </p>
                    </div>

                    <Link
                        href="/events/create"
                        className="button button--outline text-accent border-accent flex items-center gap-2"
                    >
                        <LuCirclePlus />
                        Create Event
                    </Link>
                </div>

                {/* Events Count */}
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">
                        Explore Events
                    </h2>

                    <p className="text-muted">
                        {upcomingEvents.length} Events Found
                    </p>
                </div>

                {/* Events Grid */}
                {upcomingEvents.length > 0 ? (
                    <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">

                        {upcomingEvents.map((event) => (
                            <article
                                key={event._id}
                                className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                            >
                                {/* Event Thumbnail */}
                                <div className="relative aspect-16/10 overflow-hidden">
                                    <img
                                        src={event.thumbnailUrl}
                                        alt={event.title}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />

                                    <Chip
                                        color="success"
                                        variant="soft"
                                        className="absolute left-4 top-4"
                                    >
                                        {event.eventType}
                                    </Chip>
                                </div>

                                {/* Event Information */}
                                <div className="flex flex-1 flex-col p-5">

                                    <h3 className="mb-3 text-xl font-semibold">
                                        {event.title}
                                    </h3>

                                    <p className="mb-5 line-clamp-2 text-sm text-muted">
                                        {event.description}
                                    </p>

                                    <div className="mb-5 mt-auto space-y-3 text-sm text-muted">

                                        <div className="flex items-center gap-2">
                                            <LuMapPin className="shrink-0 text-accent" />
                                            <span>{event.location}</span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <LuCalendarDays className="shrink-0 text-accent" />
                                            <span>
                                                {new Date(event.eventDate).toLocaleDateString(
                                                    "en-BD",
                                                    {
                                                        day: "numeric",
                                                        month: "long",
                                                        year: "numeric",
                                                        timeZone: "Asia/Dhaka",
                                                    }
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    {/* View Event Button */}
                                    <Link
                                        href={`/events/${event._id}`}
                                        className="button button--primary flex w-full items-center justify-center gap-2"
                                    >
                                        View Event
                                        <LuArrowUpRight />
                                    </Link>

                                </div>
                            </article>
                        ))}

                    </div>
                ) : (
                    /* Empty State */
                    <div className="rounded-xl border border-border bg-surface px-5 py-20 text-center">
                        <LuCalendarDays className="mx-auto mb-5 text-4xl text-muted" />

                        <h3 className="mb-3 text-2xl font-semibold">
                            No Upcoming Events
                        </h3>

                        <p className="mb-6 text-muted">
                            There are no upcoming events at the moment.
                            Be the first to organize one!
                        </p>

                        <Link
                            href="/events/create"
                            className="button button--primary inline-flex items-center gap-2"
                        >
                            <LuCirclePlus />
                            Create Event
                        </Link>
                    </div>
                )}

            </div>
        </section>
    );
}
