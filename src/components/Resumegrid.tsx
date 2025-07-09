/** @format */

// components/ResumeGrid.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { useSession } from "@supabase/auth-helpers-react";

type Resume = {
  id: string;
  file_name: string;
  uploaded_at: string;
};

export default function ResumeGrid({
  onSelectResume,
}: {
  onSelectResume: (resumeId: string, fileName: string) => void;
}) {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const session = useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    const fetchResumes = async () => {
      const res = await fetch(`/api/resumes?user_id=${userId}`);
      const data = await res.json();
      setResumes(data.resumes || []);
      setLoading(false);
    };
    fetchResumes();
  }, [userId]);

  if (loading)
    return <p className="text-sm text-muted-foreground">Loading resumes...</p>;
  if (!resumes.length)
    return <p className="text-sm text-muted-foreground">No resumes found.</p>;

  return (
    <div className="mb-10">
      <h2 className="text-lg font-semibold mb-4">
        📚 Select a Previously Uploaded Resume
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {resumes.map((resume) => (
          <Card
            key={resume.id}
            className="hover:border-primary transition border cursor-pointer"
            onClick={() => onSelectResume(resume.id, resume.file_name)}
          >
            <CardContent className="p-4">
              <div className="font-medium">{resume.file_name}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Uploaded {formatDistanceToNow(new Date(resume.uploaded_at))} ago
              </div>
              <Button size="sm" className="mt-2 w-full" variant="outline">
                Use This Resume
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
