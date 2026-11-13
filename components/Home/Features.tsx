import Link from "next/link";
import {
  LuCalendarPlus,
  LuCompass,
  LuHandHeart,
  LuChartNoAxesCombined,
  LuArrowUpRight,
  LuCircleCheck,
} from "react-icons/lu";

const features = [
  {
    number: "01",
    icon: LuCalendarPlus,
    title: "Create an Event",
    description:
      "Bring your community together. Create social service events, share your ideas, and inspire others to make a difference.",
    points: ["Easy event creation", "Share with your community"],
  },
  {
    number: "02",
    icon: LuCompass,
    title: "Discover Events",
    description:
      "Find meaningful opportunities around you. Explore upcoming community events and discover causes worth supporting.",
    points: ["Explore upcoming events", "Find local opportunities"],
  },
  {
    number: "03",
    icon: LuHandHeart,
    title: "Join a Cause",
    description:
      "Turn good intentions into real action. Join events, connect with volunteers, and contribute to a better community.",
    points: ["Join events easily", "Make a real difference"],
  },
  {
    number: "04",
    icon: LuChartNoAxesCombined,
    title: "Track Your Impact",
    description:
      "Keep track of the events you organize and join. Stay connected with your activities and continue making an impact.",
    points: ["Manage your events", "Track joined activities"],
  },
];

export default function Features() {
  return (
    <section className="px-5 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm font-semibold text-accent">
            <span className="h-2 w-2 rounded-full bg-accent" />
            What We Offer
          </span>

          <h2 className="mb-5">
            Everything You Need to
            <span className="block text-accent">
              Make a Difference
            </span>
          </h2>

          <p className="mx-auto max-w-xl leading-7 text-muted">
            Making a positive impact starts with coming together. Discover
            simple ways to organize events, support causes, and build a
            stronger community.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.number}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface p-7 transition-all duration-300 hover:border-accent/50"
              >
                {/* Card Number */}
                <div className="mb-8 flex items-center justify-between">
                  <span className="text-sm font-semibold tracking-widest text-muted">
                    / {feature.number}
                  </span>

                  <LuArrowUpRight
                    size={20}
                    className="text-muted transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent"
                  />
                </div>

                {/* Icon */}
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-accent-foreground">
                  <Icon size={27} strokeWidth={1.8} />
                </div>

                {/* Content */}
                <h3 className="mb-3 text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>

                <p className="mb-7 flex-1 text-sm leading-7 text-muted">
                  {feature.description}
                </p>

                {/* Feature Points */}
                <div className="space-y-3 border-t border-border pt-5">
                  {feature.points.map((point) => (
                    <div
                      key={point}
                      className="flex items-center gap-2 text-sm text-foreground"
                    >
                      <LuCircleCheck
                        size={16}
                        className="shrink-0 text-accent"
                      />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 flex flex-col items-center justify-between gap-5 rounded-2xl bg-accent p-8 text-center sm:flex-row sm:px-10 sm:text-left">
          <div>
            <h3 className="mb-2 text-xl font-semibold text-accent-foreground">
              Ready to make a difference?
            </h3>

            <p className="text-sm leading-6 text-accent-foreground/80">
              Find your next opportunity to create a positive impact.
            </p>
          </div>

          <Link
            href="/events"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-background px-6 py-3 text-sm font-semibold text-accent transition-colors hover:bg-default"
          >
            Explore Events
            <LuArrowUpRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}
