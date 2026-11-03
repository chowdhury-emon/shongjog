
import Image from "next/image";
import Link from "next/link";
import { LuCalendarDays, LuCirclePlus } from "react-icons/lu";

export default function Hero() {
    return (
        <section className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:py-20">
            <div className="mx-auto max-w-3xl text-center">
                <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-accent/70">
                    Community · Action · Change
                </p>

                <h1 className="text-4xl font-semibold leading-tight text-foreground sm:text-5xl lg:text-6xl">
                    Good things happen when people show up.
                </h1>

                <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
                    Find local community events, join people who care, and take
                    part in work that matters. From cleaning up your neighbourhood
                    to distributing winter essentials, start with one small action.
                </p>

                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                    <Link
                        href="/upcoming-events"
                        className="button button--primary w-full sm:w-fit p-6 text-background"
                    >
                        <LuCalendarDays />
                        Explore events
                    </Link>

                    <Link
                        href="/create-event"
                        className="button button--outline w-full sm:w-fit p-6 text-accent border-accent"
                    >
                        <LuCirclePlus />
                        Organize an event
                    </Link>
                </div>

                <p className="mt-5 text-sm text-muted">
                    A little time. A real contribution.
                </p>
            </div>

            <div className="relative -mt-10 lg:-mt-30 xl:-mt-50 aspect-16/7 overflow-hidden rounded-2xl -z-1
            bg-[radial-gradient(circle_at_bottom,var(--accent)_0%,var(--accent)_0%,transparent_70%)]">
                <Image
                    src="/banner.png"
                    alt="Community members working together on a local service initiative"
                    fill
                    priority
                    sizes="(max-width: 1500px) 100vw, 1500px"
                    className="object-cover"
                />
            </div>
            <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                    { number: "120+", label: "Events Organized" },
                    { number: "850+", label: "People Connected" },
                    { number: "45+", label: "Communities Reached" },
                    { number: "2,400+", label: "Volunteer Hours" },
                ].map((stat) => (
                    <div
                        key={stat.label}
                        className="rounded-xl border border-border bg-background p-5 text-center transition-transform duration-200 hover:-translate-y-1"
                    >
                        <p className="text-2xl font-semibold text-warning/70 sm:text-3xl">
                            {stat.number}
                        </p>
                        <p className="mt-2 text-sm text-muted">{stat.label}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
