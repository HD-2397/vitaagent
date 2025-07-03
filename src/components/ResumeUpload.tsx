/** @format */

"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { fetchWithErrorHandling } from "@/lib/fetchWithErrorHandling";

export default function ResumeUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [critiqueLoading, setCritiqueLoading] = useState(false);
  const [critiqueResult, setCritiqueResult] = useState("");
  const [parsedResumeText, setParsedResumeText] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    setFile(uploaded ?? null);
    setMessage("");
  };

  const handleUpload = async () => {
    if (!file) return setMessage("⚠️ Please select a file.");
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const { data, error } = await fetchWithErrorHandling<{
      fileName: string;
      content: string; //parsed resume text
    }>("/api/upload-file", {
      method: "POST",
      body: formData,
    });

    if (error) {
      setMessage(`❌ Upload failed: ${error}`);
    } else {
      setMessage(`✅ File uploaded: ${data?.fileName}`);
      setParsedResumeText(data?.content || "");
    }

    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
    setUploading(false);
  };

  const handleRunCritique = async () => {
    if (!jobDescription.trim()) {
      setCritiqueResult("⚠️ Please enter a job description.");
      return;
    }

    setCritiqueLoading(true);
    setCritiqueResult("");

    const { data, error } = await fetchWithErrorHandling<{ critique: string }>(
      "/api/run-critique",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: parsedResumeText,
          jobDescription,
        }),
      }
    );

    if (error) {
      setCritiqueResult(`❌ Error: ${error}`);
    } else {
      setCritiqueResult(data?.critique || "No critique returned.");
    }

    setCritiqueLoading(false);
  };

  return (
    <div className="w-full max-w-[1600px] px-8 py-10 mx-auto">
      <h1 className="text-2xl font-semibold mb-6 text-center">
        VitaAgent – Resume Upload & Job Match Critique
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Left Section: Upload & JD */}
        <Card>
          <CardHeader>
            <CardTitle>📄 Upload Resume & Paste JD</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Resume Upload */}
            <div className="space-y-2">
              <Label htmlFor="resume">Resume (PDF only)</Label>
              <Input
                ref={inputRef}
                id="resume"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
              />
              {file && (
                <p className="text-sm text-muted-foreground">
                  📎 Selected: {file.name}
                </p>
              )}
              <Button onClick={handleUpload} disabled={uploading}>
                {uploading ? "Uploading..." : "Upload Resume"}
              </Button>
              {message && <p className="text-sm">{message}</p>}
            </div>

            {/* JD Input */}
            <div className="space-y-2">
              <Label htmlFor="jd">Job Description</Label>
              <Textarea
                id="jd"
                placeholder="Paste job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={6}
              />
              <Button
                onClick={handleRunCritique}
                disabled={critiqueLoading}
                className="w-full"
              >
                {critiqueLoading ? "Analyzing..." : "Run AI Resume Critique"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Right Section: Critique Result */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle>🤖 Critique Result</CardTitle>
          </CardHeader>
          <CardContent>
            {critiqueResult ? (
              <div className="text-sm whitespace-pre-wrap border rounded-md p-3 bg-muted max-h-[600px] overflow-y-auto">
                {critiqueResult}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                The AI&apos;s critique will appear here after analysis.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
