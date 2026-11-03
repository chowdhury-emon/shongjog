import { getSession } from "better-auth/api";
import Link from "next/link";

export default function SigningButtons() {
    return (
        <>
            <Link href={"/sign-in"}
                className="button button--secondary text-accent"
            >
                Sign In
            </Link>
            <Link href={"/sign-up"}
                className="button button--primary text-background"
            >
                Sign Up
            </Link>
        </>
    )
}