"use client";

import { signUp } from "@/lib/auth-client";
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
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const route = useRouter();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const userData = Object.fromEntries(formData.entries());

      const { data, error } = await signUp.email({
        name: userData.name as string,
        email: userData.email as string,
        password: userData.password as string,
        callbackURL: "/",
      });

      if (data) {
        route.push("/")
        toast.success("Your account has been created successfully.");
      }

      if (error) {
        if (error.status === 422) {
          toast.danger("An account with this email already exists.");
        } else {
          toast.danger(error.message || "Unable to create your account. Please try again.");
        }
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
            Join Shongjog
          </p>

          <h2>Create your account</h2>

          <p className="mt-3 text-sm leading-6 text-muted">
            Find local initiatives, meet people who care, and get involved
            in your community.
          </p>
        </div>

        <Form
          className="flex w-full flex-col gap-5 rounded-2xl border border-border bg-surface p-5 sm:p-7"
          onSubmit={onSubmit}
        >
          <TextField
            isRequired
            name="name"
            validate={(value) => {
              if (value.trim().length < 3) {
                return "Name must be at least 3 characters long.";
              }
              return null;
            }}
          >
            <Label>Full name</Label>
            <Input
              placeholder="Enter your full name"
              autoComplete="name"
            />
            <FieldError />
          </TextField>

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
            minLength={8}
            name="password"
            type="password"
            onChange={setPassword}
            validate={(value) => {
              if (value.length < 8) {
                return "Password must be at least 8 characters long.";
              }
              return null;
            }}
          >
            <Label>Password</Label>
            <Input
              placeholder="Create a password"
              autoComplete="new-password"
            />
            <FieldError />
          </TextField>

          <TextField
            isRequired
            minLength={8}
            name="confirmPassword"
            type="password"
            validate={(value) => {
              if (value.length < 8) {
                return "Password must be at least 8 characters long.";
              }
              if (password !== value) {
                return "Passwords do not match.";
              }
              return null;
            }}
          >
            <Label>Confirm password</Label>
            <Input
              placeholder="Enter your password again"
              autoComplete="new-password"
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
              Create account
            </Button>

            <div className="grid place-items-center *:col-start-1 *:row-start-1">
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
              >
                <FcGoogle />
                Google
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
              >
                <FaGithub />
                GitHub
              </Button>
            </div>

            <p className="text-center text-sm text-muted">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="font-medium text-accent underline-offset-4 hover:underline"
              >
                Sign in
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
