/** @format */

import ResumeUpload from "@/components/ResumeUpload";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Home() {
  return (
    <ProtectedRoute>
      <div className="w-full max-w-[1600px] px-8 py-10 mx-auto">
        <ResumeUpload />
      </div>
    </ProtectedRoute>
  );
}
