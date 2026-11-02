
import Image from "next/image";
import Link from "next/link";
import { LuArrowLeft } from "react-icons/lu";

export default function NotFound() {
    return (
        <main className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
            <Image src={"/shongjog-logo.svg"}
                height={500}
                width={500}
                alt="banner"
                className="w-40 aspect-square object-contain saturate-0" />

            <h1 className="-mt-15 text-8xl/relaxed font-semibold tracking-tight text-accent">
                404
            </h1>

            <h2 className="mt-4 text-xl font-semibold text-foreground sm:text-3xl">
                Looks like you took a wrong turn.
            </h2>

            <p className="mt-4 max-w-md leading-7 text-muted">
                We couldn&apos;t find the page you&apos;re looking for.
                The event may have moved, or the link might be incorrect.
            </p>

            <div className="mt-8 flex flex-col gap-4">
                <Link
                    href="/"
                    className="button button--ghost animate-bounce"
                >
                    <LuArrowLeft />
                    Back to
                    <span className="text-sm font-semibold tracking-widest text-accent">
                        SHONGJOG
                    </span>
                </Link>

                <Link
                    href="/upcoming-events"
                    className="button button--outline mx-auto"
                >
                    Explore events
                </Link>
            </div>

        </main>
    );
}
