"use client";

import { signIn } from "@/lib/auth-client";
import {
  Button,
  FieldError,
  Form,
  Input,
  Label,
  Spinner,
  TextField,
  toast,
} from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const email = String(formData.get("email") ?? "");
      const password = String(formData.get("password") ?? "");

      const { data, error } = await signIn.email({
        email,
        password,
        callbackURL: "/",
      });

      if (error) {
        if (error.status === 401) {
          toast.danger("Incorrect email or password. Please try again.");
        } else {
          toast.danger(
            error.message || "Unable to sign in. Please try again.",
          );
        }
        console.error(error);
        return;
      }

      if (data) {
        toast.success("Welcome back! You've signed in successfully.");
        router.push("/");
      }
    } catch (error) {
      console.error(error);
      toast.danger("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = async (
    provider: "google" | "github",
  ) => {
    setIsLoading(true);

    try {
      const { error } = await signIn.social({
        provider,
        callbackURL: "/",
      });

      if (error) {
        toast.danger(
          error.message || "Unable to sign in. Please try again.",
        );
      }
    } catch (error) {
      console.error(error);
      toast.danger("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="container mx-auto my-10 grid place-items-center px-4 sm:my-16">
      <div className="grid w-full max-w-md gap-6">
        <div className="text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-accent">
            Welcome to Shongjog
          </p>

          <h2>Good to have you back.</h2>

          <p className="mt-3 text-sm leading-6 text-muted">
            Sign in to discover upcoming events, reconnect with your
            community, and keep track of the work you're part of.
          </p>
        </div>

        <Form
          className="flex w-full flex-col gap-5 rounded-2xl border border-border bg-surface p-5 sm:p-7"
          onSubmit={onSubmit}
        >
          <TextField
            isRequired
            name="email"
            type="email"
            validate={(value) => {
              if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
              ) {
                return "Please enter a valid email address.";
              }
              return null;
            }}
          >
            <Label>Email address</Label>
            <Input
              placeholder="you@example.com"
              autoComplete="email"
            />
            <FieldError />
          </TextField>

          <TextField
            isRequired
            minLength={6}
            name="password"
            type="password"
            validate={(value) => {
              if (value.length < 6) {
                return "Password must be at least 6 characters long.";
              }
              return null;
            }}
          >
            <Label>Password</Label>
            <Input
              placeholder="Enter your password"
              autoComplete="current-password"
            />
            <FieldError />
          </TextField>

          <div className="grid w-full gap-4">
            <Button
              type="submit"
              className="w-full"
              isDisabled={isLoading}
            >
              {isLoading && <Spinner className="text-white" />}
              Sign in
            </Button>

            <div className="my-2 grid place-items-center *:col-start-1 *:row-start-1">
              <hr className="w-full border-t border-border" />
              <span className="bg-surface px-4 text-xs text-muted">
                Or continue with
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                isDisabled={isLoading}
                onPress={() => handleSocialSignIn("google")}
              >
                <FcGoogle />
                Google
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                isDisabled={isLoading}
                onPress={() => handleSocialSignIn("github")}
              >
                <FaGithub />
                GitHub
              </Button>
            </div>

            <p className="mt-2 text-center text-sm text-muted">
              New to Shongjog?{" "}
              <Link
                href="/sign-up"
                className="font-medium text-accent underline-offset-4 hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        </Form>

        <Link
          href="/"
          className="text-center text-sm text-muted transition-colors hover:text-accent"
        >
          ← Back to home
        </Link>
      </div>
    </section>
  );
}
