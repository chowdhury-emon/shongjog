"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import {
    LuCalendarDays,
    LuMapPin,
    LuPlus,
    LuSparkles,
} from "react-icons/lu";

type EventItem = {
    id: string;
    title: string;
    location: string;
    eventType: string;
    eventDate: string;
    thumbnailUrl: string;
};

function getString(value: unknown): string | null {
    return typeof value === "string" && value.trim() ? value : null;
}

function parseEvent(value: unknown): EventItem | null {
    if (typeof value !== "object" || value === null) return null;

    const record = value as Record<string, unknown>;
    const eventData =
        typeof record.data === "object" && record.data !== null
            ? (record.data as Record<string, unknown>)
            : record;

    const id = getString(record._id) ?? getString(record.id);
    const title = getString(eventData.title);
    const location = getString(eventData.location);
    const eventType = getString(eventData.eventType);
    const eventDate = getString(eventData.eventDate);

    if (
        !id ||
        !title ||
        !location ||
        !eventType ||
        !eventDate ||
        !getEventDateKey(eventDate)
    ) {
        return null;
    }

    return {
        id,
        title,
        location,
        eventType,
        eventDate,
        thumbnailUrl: getString(eventData.thumbnailUrl) ?? "/banner.png",
    };
}

function getLocalDateKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function getEventDateKey(eventDate: string): string | null {
    const dateKey = eventDate.slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) return null;
    return Number.isNaN(Date.parse(`${dateKey}T00:00:00`)) ? null : dateKey;
}

function formatEventDate(eventDate: string): string {
    const dateKey = getEventDateKey(eventDate);
    if (!dateKey) return eventDate;

    return new Intl.DateTimeFormat(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(`${dateKey}T00:00:00`));
}

export default function UpcomingEventsPage() {
    const router = useRouter();
    const [events, setEvents] = useState<EventItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        const controller = new AbortController();

        async function loadEvents() {
            setIsLoading(true);
            setError(false);

            try {
                const response = await fetch("http://localhost:5000/events", {
                    cache: "no-store",
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error(`Events request failed (${response.status})`);
                }

                const result: unknown = await response.json();
                if (!Array.isArray(result)) {
                    throw new Error("Events response was not a list");
                }

                const parsedEvents = result.map(parseEvent);
                const invalidCount = parsedEvents.filter(
                    (event) => event === null,
                ).length;
                if (invalidCount > 0) {
                    console.error(
                        `Skipped ${invalidCount} event record(s) with invalid data.`,
                    );
                }

                const today = getLocalDateKey(new Date());
                const upcomingEvents = parsedEvents
                    .filter((event): event is EventItem => event !== null)
                    .filter((event) => {
                        const dateKey = getEventDateKey(event.eventDate);
                        return dateKey !== null && dateKey >= today;
                    })
                    .sort((first, second) =>
                        (getEventDateKey(first.eventDate) ?? "").localeCompare(
                            getEventDateKey(second.eventDate) ?? "",
                        ),
                    );

                setEvents(upcomingEvents);
            } catch (loadError) {
                if (!controller.signal.aborted) {
                    console.error("Failed to load upcoming events:", loadError);
                    setError(true);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        }

        void loadEvents();
        return () => controller.abort();
    }, [reloadKey]);

    const handleViewEvent = (eventId: string) => {
        router.push(`/events/${encodeURIComponent(eventId)}`);
    };

    return (
        <section className="min-h-screen bg-background px-4 py-12 text-foreground sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <header className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <div className="max-w-2xl">
                        <p className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-accent">
                            <LuSparkles aria-hidden="true" />
                            Find your next way to help
                        </p>
                        <h1>Upcoming Events</h1>
                        <p className="mt-4 leading-7 text-muted">
                            Meet your community, take action, and make a
                            difference together. Explore what&apos;s happening
                            near you.
                        </p>
                    </div>

                    <Link
                        href="/events/create"
                        className="button button--outline w-full shrink-0 border-accent text-accent sm:w-fit"
                    >
                        <LuPlus aria-hidden="true" />
                        Create an event
                    </Link>
                </header>

                {isLoading ? (
                    <div
                        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                        role="status"
                        aria-label="Loading upcoming events"
                    >
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="overflow-hidden rounded-2xl border border-border bg-surface"
                            >
                                <div className="aspect-16/10 animate-pulse bg-surface-secondary" />
                                <div className="space-y-4 p-5">
                                    <div className="h-5 w-2/3 animate-pulse rounded bg-surface-secondary" />
                                    <div className="h-4 w-1/2 animate-pulse rounded bg-surface-secondary" />
                                    <div className="h-10 animate-pulse rounded bg-surface-secondary" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="rounded-2xl border border-border bg-surface px-6 py-12 text-center">
                        <h2 className="text-2xl">Events couldn&apos;t load</h2>
                        <p className="mt-3 text-muted">
                            Please check your connection and try again.
                        </p>
                        <Button
                            className="button button--primary mt-6 text-background"
                            onPress={() => setReloadKey((key) => key + 1)}
                        >
                            Try again
                        </Button>
                    </div>
                ) : events.length === 0 ? (
                    <div className="rounded-2xl border border-border bg-surface px-6 py-12 text-center">
                        <LuCalendarDays
                            className="mx-auto size-10 text-accent"
                            aria-hidden="true"
                        />
                        <h2 className="mt-4 text-2xl">No upcoming events yet</h2>
                        <p className="mt-3 text-muted">
                            Be the first to bring your community together.
                        </p>
                        <Link
                            href="/events/create"
                            className="button button--primary mt-6 text-background"
                        >
                            <LuPlus aria-hidden="true" />
                            Create an event
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {events.map((event) => (
                            <article
                                key={event.id}
                                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition duration-200 hover:shadow-xl"
                            >
                                <div className="relative aspect-16/10 overflow-hidden bg-surface-secondary">
                                    <Image
                                        src={event.thumbnailUrl}
                                        alt={event.title}
                                        fill
                                        unoptimized
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        className="object-cover transition duration-300 group-hover:scale-105"
                                    />
                                    <span className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-accent shadow-sm backdrop-blur">
                                        {event.eventType}
                                    </span>
                                </div>

                                <div className="flex flex-1 flex-col p-5">
                                    <h2 className="line-clamp-2 text-2xl">
                                        {event.title}
                                    </h2>
                                    <div className="mt-4 grid gap-3 text-sm text-muted">
                                        <p className="flex items-center gap-2">
                                            <LuMapPin
                                                className="size-4 shrink-0 text-accent"
                                                aria-hidden="true"
                                            />
                                            <span className="line-clamp-1">
                                                {event.location}
                                            </span>
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <LuCalendarDays
                                                className="size-4 shrink-0 text-accent"
                                                aria-hidden="true"
                                            />
                                            {formatEventDate(event.eventDate)}
                                        </p>
                                    </div>
                                    <Button
                                        className="button button--primary mt-6 w-full text-background"
                                        onPress={() => handleViewEvent(event.id)}
                                    >
                                        View Event
                                    </Button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
