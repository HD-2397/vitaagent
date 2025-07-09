/** @format */

// components/Header.tsx
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";

export default function Header() {
  const session = useSession();

  const supabase = useSupabaseClient();
  const router = useRouter();

  const handleLogout = async () => {
    // Example Supabase logout
    const { error } = await supabase.auth.signOut();
    if (!error) router.push("/sign-in");
  };
  if (!session || !session.user) return null; // Don't render header if not authenticated

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-[#111] px-4 py-3 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="text-lg font-semibold text-white tracking-tight">
          VitaAgent
          <span className="ml-2 text-sm text-gray-400 hidden sm:inline">
            AI Resume Critique & Match
          </span>
        </div>
        <Button
          variant="outline"
          className="text-white border-gray-600 hover:bg-gray-800"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </header>
  );
}
