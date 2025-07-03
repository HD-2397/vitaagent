/** @format */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AuthForm() {
  //uses the Supabase client from the context provider
  const supabase = useSupabaseClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignIn, setIsSignIn] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let error;

    if (isSignIn) {
      ({ error } = await supabase.auth.signInWithPassword({
        email,
        password,
      }));
    } else {
      ({ error } = await supabase.auth.signUp({
        email,
        password,
      }));
    }

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      router.push("/");
    }
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
