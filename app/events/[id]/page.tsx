// "use client";

// import { useEffect, useState } from "react";
// import { notFound, useParams, useRouter } from "next/navigation";
// import { Button, Card, Chip, Skeleton, toast } from "@heroui/react";
// import { LuArrowLeft, LuCalendarDays, LuCheck, LuLeaf, LuMapPin, LuSprout, LuUserRound } from "react-icons/lu";
// import { useSession } from "@/lib/auth-client";

// interface Event {
//   _id: string;
//   data: {
//     title: string;
//     description: string;
//     eventType: string;
//     thumbnailUrl: string;
//     location: string;
//     eventDate: string;
//     userId: string;
//     email: string;
//     name: string;
//   };
// }

// export default function EventDetailsPage() {
//   const { id } = useParams<{ id: string }>();
//   const router = useRouter();

//   const { data: session, isPending: isAuthLoading } = useSession();

//   const [event, setEvent] = useState<Event | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isJoining, setIsJoining] = useState(false);
//   const [isJoined, setIsJoined] = useState(false);
//   const [error, setError] = useState("");

//   const API_URL = process.env.NEXT_PUBLIC_API_URL;

//   const fetchEventDetails = async () => {
//     try {
//       setIsLoading(true);
//       setError("");

//       const response = await fetch(`${API_URL}/events/${id}`);

//       if (response.status === 404) {
//         setEvent(null);
//         setError("This event could not be found.");
//         return;
//       }

//       if (!response.ok) {
//         throw new Error("Failed to fetch event details.");
//       }

//       const result = await response.json();

//       const eventData: Event =
//         result.event ??
//         (result.data?._id ? result.data : result);

//       if (!eventData?._id || !eventData?.data) {
//         throw new Error("Invalid event data received.");
//       }

//       setEvent(eventData);
//     } catch (err) {
//       console.error("Error fetching event:", err);
//       setError("Unable to load event details. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (id) {
//       fetchEventDetails();
//     }
//   }, [id]);

//   const isEventExpired = (date: string) => {
//     const eventDate = new Date(`${date}T00:00:00`);
//     const today = new Date();

//     today.setHours(0, 0, 0, 0);

//     return eventDate < today;
//   };

//   const formatEventDate = (date: string) => {
//     return new Date(`${date}T00:00:00`).toLocaleDateString("en-BD", {
//       weekday: "long",
//       day: "numeric",
//       month: "long",
//       year: "numeric",
//     });
//   };

//   const handleJoinEvent = async () => {
//     if (isAuthLoading) return;

//     if (!session?.user) {
//       router.push(
//         `/login?callbackURL=${encodeURIComponent(`/events/${id}`)}`
//       );
//       return;
//     }

//     if (!event || isJoining || isJoined) return;

//     if (isEventExpired(event.data.eventDate)) {
//       toast.warning("This event has already ended.")
//       return;
//     }

//     try {
//       setIsJoining(true);
//       setError("");

//       const response = await fetch(`${API_URL}/events/${id}/join`, {
//         method: "POST",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       const result = await response.json();

//       if (response.status === 401 || response.status === 403) {
//         router.push(
//           `/login?callbackURL=${encodeURIComponent(`/events/${id}`)}`
//         );
//         return;
//       }

//       if (!response.ok) {
//         throw new Error(result.message || "Unable to join this event.");
//       }
//       setIsJoined(true);
//       toast.success("You have successfully joined this event!")

//     } catch (err) {
//       console.error("Error joining event:", err);
//       toast.danger("Unable to join event, something went wrong. Please try again.")

//     } finally {
//       setIsJoining(false);
//     }
//   };

//   // Loading State
//   if (isLoading) {
//     return (
//       <section className="min-h-screen bg-background">
//         <div className="mx-auto max-w-6xl px-5 py-16">
//           <Skeleton className="mb-8 h-80 w-full rounded-2xl" />

//           <div className="space-y-5">
//             <Skeleton className="h-10 w-2/3 rounded-lg" />
//             <Skeleton className="h-5 w-1/3 rounded-lg" />
//             <Skeleton className="h-5 w-1/2 rounded-lg" />
//             <Skeleton className="h-32 w-full rounded-lg" />
//             <Skeleton className="h-12 w-48 rounded-lg" />
//           </div>
//         </div>
//       </section>
//     );
//   }

//   // Error / Not Found State
//   if (error && !event) {
//     notFound();
//   }

//   if (!event) return null;

//   const { data } = event;
//   const expired = isEventExpired(data.eventDate);

//   return (
//     <section className="min-h-screen bg-background">
//       <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:py-16">

//         {/* Back Button */}
//         <Button
//           variant="ghost"
//           className="mb-8"
//           onPress={() => router.push("/events")}
//         >
//           <LuArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
//           Back to Events
//         </Button>

//         {/* Event Thumbnail */}
//         <div className="relative mb-10 h-64 overflow-hidden rounded-2xl bg-surface-secondary sm:h-96">
//           <img
//             src={data.thumbnailUrl || "/images/event-placeholder.jpg"}
//             alt={data.title}
//             className="h-full w-full object-cover"
//           />

//           <div className="absolute left-5 top-5">
//             <Chip color="success" variant="soft">
//               {data.eventType}
//             </Chip>
//           </div>

//           {expired && (
//             <div className="absolute right-5 top-5">
//               <Chip color="danger" variant="primary">
//                 Event Ended
//               </Chip>
//             </div>
//           )}
//         </div>

//         {/* Event Details Layout */}
//         <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">

//           {/* Main Information */}
//           <div className="space-y-8 lg:col-span-2">

//             {/* Title and Description */}
//             <div>
//               <p className="mb-3 text-sm font-medium uppercase tracking-wider text-accent">
//                 Community Event
//               </p>

//               <h1 className="mb-5 text-3xl sm:text-4xl">
//                 {data.title}
//               </h1>

//               <p className="leading-8 text-muted">
//                 {data.description}
//               </p>
//             </div>

//             {/* Event Information */}
//             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

//               <Card className="border border-border bg-surface">
//                 <Card.Content className="flex flex-row items-center gap-4 p-5">
//                   <LuCalendarDays className="h-8 w-8 shrink-0 text-accent" aria-hidden="true" />

//                   <div>
//                     <p className="text-sm text-muted">
//                       Event Date
//                     </p>

//                     <p className="font-semibold text-foreground">
//                       {formatEventDate(data.eventDate)}
//                     </p>
//                   </div>
//                 </Card.Content>
//               </Card>

//               <Card className="border border-border bg-surface">
//                 <Card.Content className="flex flex-row items-center gap-4 p-5">
//                   <LuMapPin className="h-8 w-8 shrink-0 text-accent" aria-hidden="true" />

//                   <div>
//                     <p className="text-sm text-muted">
//                       Location
//                     </p>

//                     <p className="font-semibold text-foreground">
//                       {data.location}
//                     </p>
//                   </div>
//                 </Card.Content>
//               </Card>

//               <Card className="border border-border bg-surface">
//                 <Card.Content className="flex flex-row items-center gap-4 p-5">
//                   <LuSprout className="h-8 w-8 shrink-0 text-accent" aria-hidden="true" />

//                   <div>
//                     <p className="text-sm text-muted">
//                       Event Type
//                     </p>

//                     <p className="font-semibold text-foreground">
//                       {data.eventType}
//                     </p>
//                   </div>
//                 </Card.Content>
//               </Card>

//               <Card className="border border-border bg-surface">
//                 <Card.Content className="flex flex-row items-center gap-4 p-5">
//                   <LuUserRound className="h-8 w-8 shrink-0 text-accent" aria-hidden="true" />

//                   <div>
//                     <p className="text-sm text-muted">
//                       Organized By
//                     </p>

//                     <p className="font-semibold text-foreground capitalize">
//                       {data.name}
//                     </p>
//                   </div>
//                 </Card.Content>
//               </Card>

//             </div>

//             {/* Organizer Information */}
//             <div className="border-t border-border pt-7">
//               <h2 className="mb-4 text-2xl">
//                 Event Organizer
//               </h2>

//               <div className="flex items-center gap-4">
//                 <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-xl text-accent-foreground">
//                   {data.name?.charAt(0).toUpperCase()}
//                 </div>

//                 <div>
//                   <p className="font-semibold text-foreground capitalize">
//                     {data.name}
//                   </p>

//                   <p className="text-sm text-muted">
//                     Event Creator
//                   </p>
//                 </div>
//               </div>
//             </div>

//           </div>

//           {/* Join Event Sidebar */}
//           <aside>
//             <Card className="sticky top-24 border border-border bg-surface">
//               <Card.Content className="space-y-5 p-6">

//                 <h2 className="text-2xl">
//                   Be Part of It!
//                 </h2>

//                 <p className="text-sm leading-6 text-muted">
//                   Your participation can make a difference.
//                   Join this community initiative and help
//                   create a positive impact.
//                 </p>

//                 <div className="rounded-xl bg-surface-secondary p-4">
//                   <p className="mb-1 text-sm text-muted">
//                     Event Date
//                   </p>

//                   <p className="font-semibold text-foreground">
//                     {formatEventDate(data.eventDate)}
//                   </p>
//                 </div>

//                 <Button
//                   variant="primary"
//                   className="w-full font-semibold"
//                   isDisabled={
//                     isJoining ||
//                     isAuthLoading ||
//                     isJoined ||
//                     expired
//                   }
//                   onPress={handleJoinEvent}
//                 >
//                   {isJoining
//                     ? "Joining..."
//                     : isJoined
//                       ? <><LuCheck className="mr-2 h-4 w-4" aria-hidden="true" />Already Joined</>
//                       : expired
//                         ? "Event Ended"
//                         : "Join Event"}
//                 </Button>

//                 {!session?.user && !isAuthLoading && !expired && (
//                   <p className="text-center text-xs text-muted">
//                     You need to log in to join this event.
//                   </p>
//                 )}

//               </Card.Content>
//             </Card>
//           </aside>

//         </div>
//       </div>
//     </section>
//   );
// }

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
                <div className="relative mb-10 h-64 overflow-hidden rounded-2xl sm:h-96">
                    <img
                        src={post.thumbnailUrl}
                        alt={post.title}
                        className="h-full w-full object-cover"
                    />

                    <div className="absolute bottom-5 left-5">
                        <Chip color="success" variant="soft">
                            {post.eventType}
                        </Chip>
                    </div>
                </div>

                {/* Event Content */}
                <div className="grid gap-10 lg:grid-cols-[1fr_340px]">

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
