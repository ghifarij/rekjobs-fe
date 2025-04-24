"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { userApplicationAPI } from "@/services/userApplication";
import { jobAPI } from "@/services/job";
import { JobData } from "@/types/job";
import withAuthGuard from "@/hoc/withAuthGuard";
import { FiArrowLeft } from "react-icons/fi";

const MySwal = withReactContent(Swal);

function ApplyJobPage() {
  const router = useRouter();
  const { slug } = useParams();
  const [job, setJob] = useState<JobData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [includeCoverLetter, setIncludeCoverLetter] = useState(true);
  const [includeResume, setIncludeResume] = useState(true);
  const [coverLetter, setCoverLetter] = useState<File | null>(null);
  const [resume, setResume] = useState<File | null>(null);

  // Fetch the job once
  useEffect(() => {
    if (!slug) return;
    (async () => {
      try {
        const data = await jobAPI.getJobBySlug(slug as string);
        setJob(data);
      } catch {
        setError("Failed to load job. Please try again later.");
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  const handleCoverLetterChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setCoverLetter(e.target.files?.[0] ?? null);

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setResume(e.target.files?.[0] ?? null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (!job) throw new Error("Job not found");

      await userApplicationAPI.createApplication({
        jobId: job.id,
        coverLetterFile: includeCoverLetter
          ? coverLetter ?? undefined
          : undefined,
        resumeFile: includeResume ? resume ?? undefined : undefined,
      });

      await MySwal.fire({
        title: "Berhasil!",
        text: "Lamaran Anda telah dikirim.",
        icon: "success",
        confirmButtonText: "Lihat lamaran saya",
      });

      router.push("/user/applied-jobs");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Gagal mengirim lamaran.");
      } else {
        setError("Gagal mengirim lamaran.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm sm:text-base">
          Lowongan tidak ditemukan.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => router.back()}
          className="text-sky-600 hover:text-sky-700 flex items-center gap-1 mb-4 sm:mb-6 text-sm sm:text-base"
        >
          <FiArrowLeft className="text-lg sm:text-xl" />
          <span className="hover:underline">Kembali</span>
        </button>

        <h1 className="text-xl sm:text-3xl font-bold mb-3 sm:mb-6">
          Apply for {job.title}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
          at {job.company.name}
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 sm:mb-6 text-sm sm:text-base">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Cover Letter Toggle & Upload */}
          <div className="space-y-3 sm:space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={includeCoverLetter}
                onChange={(e) => setIncludeCoverLetter(e.target.checked)}
                className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-900">
                Sertakan Cover Letter
              </span>
            </label>
            {includeCoverLetter && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Unggah Cover Letter
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleCoverLetterChange}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-2 sm:file:mr-4 file:py-2 file:px-3 sm:file:px-4 file:rounded-full file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
                  required={includeCoverLetter}
                />
              </div>
            )}
          </div>

          {/* Resume Toggle & Upload */}
          <div className="space-y-3 sm:space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={includeResume}
                onChange={(e) => setIncludeResume(e.target.checked)}
                className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-900">Sertakan CV</span>
            </label>
            {includeResume && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Unggah CV
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeChange}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-2 sm:file:mr-4 file:py-2 file:px-3 sm:file:px-4 file:rounded-full file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
                  required={includeResume}
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex justify-center py-2 px-4 rounded-md shadow-sm text-sm sm:text-base text-white bg-sky-600 hover:bg-sky-700 disabled:opacity-50"
          >
            {submitting ? "Mengirim…" : "Kirim Lamaran"}
          </button>
        </form>
      </div>
    </div>
  );
}

// Wrap the component with auth guard, requiring user role
export default withAuthGuard(ApplyJobPage, {
  requiredRole: "user",
  redirectTo: "/auth/user/login",
});
