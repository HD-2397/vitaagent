/** @format */

import ProtectedRoute from "@/components/ProtectedRoute";
import ResumeUpload from "@/components/ResumeUpload";

export default function UploadPage() {
  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-4">Upload Resume</h1>
        <ResumeUpload />
      </div>
    </ProtectedRoute>
  );
}
