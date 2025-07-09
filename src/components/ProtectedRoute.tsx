/** @format */

"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { session, isLoading } = useSessionContext();

  useEffect(() => {
    // Wait until loading finishes
    if (!isLoading && !session) {
      router.replace("/sign-in");
    }
  }, [session, isLoading, router]);

  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return <>{children}</>;
}
