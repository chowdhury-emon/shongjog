"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Chip, Skeleton } from "@heroui/react";
import Link from "next/link";
import { LuCirclePlus } from "react-icons/lu";

interface Event {
    _id: string;
    data: {
        title: string;
        description: string;
        eventType: string;
        thumbnailUrl: string;
        location: string;
        eventDate: string;
        userId: string;
        email: string;
        name: string;
    };
}

export default function UpcomingEventsPage() {
    const router = useRouter();

    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch upcoming events
    const fetchUpcomingEvents = async () => {
        try {
            setIsLoading(true);
            setError("");

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/events`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch events.");
            }

            const result = await response.json();

            // Get events from API response
            const allEvents: Event[] = Array.isArray(result)
                ? result
                : result.events ?? result.data ?? [];

            // Filter upcoming events and sort by date
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const upcomingEvents = allEvents
                .filter((event) => {
                    const eventDate = new Date(
                        `${event.data.eventDate}T00:00:00`
                    );

                    return eventDate >= today;
                })
                .sort(
                    (a, b) =>
                        new Date(a.data.eventDate).getTime() -
                        new Date(b.data.eventDate).getTime()
                );

            setEvents(upcomingEvents);
        } catch (err) {
            console.error("Error fetching events:", err);
            setError("Unable to load events. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUpcomingEvents();
    }, []);

    // View Event handler
    const handleViewEvent = (eventId: string) => {
        router.push(`/events/${eventId}`);
    };

    // Format event date
    const formatEventDate = (date: string) => {
        return new Date(`${date}T00:00:00`).toLocaleDateString("en-BD", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    return (
        <section className="min-h-screen bg-background">
            <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">

                {/* Page Heading */}
                <div className="grid gap-4 md:flex md:justify-between items-center">
                    <div className="mb-12 text-start">
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
                        href={'/events/create'}
                        className="button button--outline text-accent border-accent flex items-center gap-2"
                    >
                        <LuCirclePlus />
                        Create Event
                    </Link>

                </div>

                {/* Events Count */}
                {!isLoading && !error && (
                    <div className="mb-7 flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-foreground">
                            Explore Events
                        </h2>

                        <span className="text-sm text-muted">
                            {events.length} {events.length === 1 ? "Event" : "Events"} Found
                        </span>
                    </div>
                )}

                {/* Loading Skeleton */}
                {isLoading && (
                    <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <Card key={index} className="overflow-hidden">
                                <Skeleton className="h-52 w-full rounded-none" />

                                <Card.Content className="space-y-4 p-5">
                                    <Skeleton className="h-5 w-3/4 rounded-lg" />
                                    <Skeleton className="h-4 w-1/2 rounded-lg" />
                                    <Skeleton className="h-4 w-2/3 rounded-lg" />
                                    <Skeleton className="h-10 w-full rounded-lg" />
                                </Card.Content>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Error State */}
                {!isLoading && error && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <p className="mb-5 text-danger">{error}</p>

                        <Button
                            onPress={fetchUpcomingEvents}
                        >
                            Try Again
                        </Button>
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && !error && events.length === 0 && (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border px-5 py-20 text-center">
                        <div className="mb-5 text-5xl">🌱</div>

                        <h2 className="mb-3 text-2xl">
                            No Upcoming Events
                        </h2>

                        <p className="max-w-md text-muted">
                            There are no upcoming events at the moment.
                            Check back later or create an event and
                            inspire your community.
                        </p>
                    </div>
                )}

                {/* Events Grid */}
                {!isLoading && !error && events.length > 0 && (
                    <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
                        {events.map((event) => (
                            <Card
                                key={event._id}
                                className="group flex h-full flex-col overflow-hidden border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                            >
                                {/* Event Thumbnail */}
                                <div className="relative h-56 w-full rounded-xl overflow-hidden bg-surface-secondary">
                                    <img
                                        src={
                                            event.data.thumbnailUrl ||
                                            "/images/event-placeholder.jpg"
                                        }
                                        alt={event.data.title}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />

                                    <div className="absolute left-4 top-4">
                                        <Chip
                                            color="success"
                                            variant="soft"
                                            className="bg-white/95 font-medium text-[#2D4A38]"
                                        >
                                            {event.data.eventType}
                                        </Chip>
                                    </div>
                                </div>

                                {/* Event Information */}
                                <Card.Content className="flex flex-1 flex-col gap-4 p-5">

                                    <h3 className="line-clamp-2 text-xl font-semibold text-foreground">
                                        {event.data.title}
                                    </h3>

                                    {/* Location */}
                                    <div className="flex items-center gap-3 text-sm text-muted">
                                        <span className="text-lg">📍</span>
                                        <span className="line-clamp-1">
                                            {event.data.location}
                                        </span>
                                    </div>

                                    {/* Event Date */}
                                    <div className="flex items-center gap-3 text-sm text-muted">
                                        <span className="text-lg">📅</span>
                                        <span>
                                            {formatEventDate(event.data.eventDate)}
                                        </span>
                                    </div>

                                </Card.Content>

                                {/* View Event Button */}
                                <Card.Footer className="p-5 pt-0">
                                    <Button
                                        variant="primary"
                                        className="w-full text-surface"
                                        onPress={() => handleViewEvent(event._id)}
                                    >
                                        View Event
                                    </Button>
                                </Card.Footer>
                            </Card>
                        ))}
                    </div>
                )}

            </div>
        </section>
    );
}
