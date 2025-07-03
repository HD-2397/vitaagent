/** @format */
"use client";

import { useSession } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.replace("/sign-in"); // redirect if not authenticated
    }
  }, [session, router]);

  if (!session) {
    return null; 
  }

  return <>{children}</>;
}
