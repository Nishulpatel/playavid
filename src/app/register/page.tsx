"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MagicCard } from "@/components/magicui/magic-card";
import { useTheme } from "next-themes";
import { signIn } from "next-auth/react";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { theme } = useTheme();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      router.push("/register");
  } catch (error) {
  if (error instanceof Error) {
    alert(error.message || "Something went wrong");
  } else {
    alert("Something went wrong");
  }
}
  }


    const handleGoogleLogin = async () => {
      try {
        await signIn("google");
      } catch (error) {
        console.error("Google sign-in error:", error);
        alert("Google sign-in failed.");
      }
    };



  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <Card className="p-0 max-w-sm w-full shadow-none border-none">
        <MagicCard
          gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
          className="p-0"
        >
          <CardHeader className="border-b border-border p-4">
            <CardTitle>Register</CardTitle>
            <CardDescription>Create your account below</CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="p-4 space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3 p-4 border-t border-border">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Registering..." : "Register"}
              </Button>

                  <Button
                variant="outline"
                type="button"
                onClick={handleGoogleLogin}
                className="w-full"
              >
                Register with Google
              </Button>

              <p className="text-sm text-center">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="text-blue-600 underline hover:no-underline"
                >
                  Login
                </button>

              </p>
            </CardFooter>
          </form>
        </MagicCard>
      </Card>
    </div>
  );
};

export default RegisterPage;
