/** @format */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const GUEST_EMAIL = process.env.NEXT_PUBLIC_GUEST_EMAIL!;
const GUEST_PASSWORD = process.env.NEXT_PUBLIC_GUEST_PASSWORD!;

export default function AuthForm() {
  const supabase = useSupabaseClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignIn, setIsSignIn] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      router.push("/");
    }
  };

  const handleGuestLogin = async () => {
    setEmail(GUEST_EMAIL);
    setPassword(GUEST_PASSWORD);
    await login(GUEST_EMAIL, GUEST_PASSWORD);
  };

  return (
    <Card className="max-w-md mx-auto mt-20">
      <CardContent className="p-6 space-y-6">
        <h2 className="text-2xl font-bold text-center">
          {isSignIn ? "Sign In" : "Create Account"}
        </h2>

        <form onSubmit={handleAuth} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Loading..." : isSignIn ? "Sign In" : "Sign Up"}
          </Button>
        </form>

        <Button
          variant="outline"
          className="w-full text-sm"
          onClick={handleGuestLogin}
          disabled={loading}
        >
          {loading ? "Signing in as Guest..." : "Sign in as Guest"}
        </Button>

        <p className="text-sm text-center">
          {isSignIn ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsSignIn(!isSignIn)}
            className="text-blue-500 underline"
          >
            {isSignIn ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </CardContent>
    </Card>
  );
}
