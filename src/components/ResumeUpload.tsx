/** @format */

"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ResumeUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null); // Add ref

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    setFile(uploaded ?? null);
    setMessage("");
  };

  const handleUpload = async () => {
    if (!file) return setMessage("Please select a file.");

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload-file", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (res.ok) {
      setMessage(`File uploaded successfully: ${data.fileName}`);
    } else {
      setMessage(`Upload failed: ${data.error || "Unknown error"}`);
    }
    setFile(null); // Clear file after upload/error
    if (inputRef.current) inputRef.current.value = ""; // Clear input value
    setUploading(false);
  };

  return (
    <div className="space-y-4">
      <Input
        ref={inputRef} // Attach ref
        type="file"
        accept=".pdf" //just accept PDF file for now, docx has issues parsing.
        onChange={handleFileChange}
      />
      {file && (
        <p className="text-sm text-muted-foreground">Selected: {file.name}</p>
      )}
      <Button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload Resume"}
      </Button>
      {message && <p className="text-sm">{message}</p>}
    </div>
  );
}
