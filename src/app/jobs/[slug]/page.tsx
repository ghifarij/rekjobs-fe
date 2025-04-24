"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { jobAPI } from "@/services/job";
import { Job } from "@/types/job";
import { formatCurrency, formatDate } from "@/helpers/format";
import {
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaBriefcase,
  FaGraduationCap,
  FaCalendarAlt,
  FaClock,
} from "react-icons/fa";
import Image from "next/image";
import withAuthGuard from "@/hoc/withAuthGuard";
import { FiArrowLeft } from "react-icons/fi";

const jobTypeLabels: Record<string, string> = {
  FULL_TIME: "Full Time",
  PART_TIME: "Part Time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
  REMOTE: "Remote",
};

function JobDetailPage() {
  const router = useRouter();
  const { slug } = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1) fetch the job itself
  useEffect(() => {
    if (!slug) return;
    (async () => {
      try {
        const data = await jobAPI.getJobBySlug(slug as string);
        setJob(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching job:", err);
        setError("Failed to load job details.");
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-12 w-12 rounded-full border-t-2 border-b-2 border-sky-500" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="text-red-500 text-center py-8 text-sm sm:text-base">
          {error || "Job not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
      <button
        onClick={() => router.back()}
        className="text-sky-600 hover:text-sky-700 flex items-center gap-1 mb-4 sm:mb-6 text-sm sm:text-base"
      >
        <FiArrowLeft className="text-lg sm:text-xl" />
        <span className="hover:underline">Kembali</span>
      </button>

      <div className="p-4 sm:p-6 bg-white shadow rounded border border-gray-300 overflow-hidden">
        <div className="space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3 sm:gap-4">
            {job.company.logo ? (
              <div className="w-12 h-12 sm:w-16 sm:h-16 relative">
                <Image
                  src={job.company.logo}
                  alt={job.company.name}
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
            ) : (
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 flex items-center justify-center rounded-lg">
                <FaBriefcase className="text-gray-500 text-xl sm:text-2xl" />
              </div>
            )}
            <div>
              <h1 className="text-lg sm:text-2xl font-bold">{job.title}</h1>
              <p className="text-sm sm:text-lg text-gray-600">
                {job.company.name}
              </p>
            </div>
          </div>

          {/* Meta grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm sm:text-base text-gray-600">
            <div>
              <FaMapMarkerAlt className="inline mr-1" />
              {job.location || "—"}
            </div>
            <div>
              <FaMoneyBillWave className="inline mr-1" />
              {job.salary ? formatCurrency(job.salary) : "—"}
            </div>
            <div>
              <FaBriefcase className="inline mr-1" />
              {jobTypeLabels[job.jobType]}
            </div>
            <div>
              <FaCalendarAlt className="inline mr-1" />
              Dibuat pada {formatDate(job.createdAt)}
            </div>
            <div>
              <FaClock className="inline mr-1" />
              {job.deadline ? formatDate(job.deadline) : "Not set"}
            </div>
            {job.experience && (
              <div>
                <FaGraduationCap className="inline mr-1" />
                {job.experience}
              </div>
            )}
          </div>

          {/* Description */}
          <section>
            <h2 className="text-lg sm:text-xl font-semibold mb-2">
              Deskripsi Pekerjaan
            </h2>
            <div
              className="prose max-w-none text-sm sm:text-base"
              dangerouslySetInnerHTML={{ __html: job.description }}
            />
          </section>

          {/* Requirements */}
          <section>
            <h2 className="text-lg sm:text-xl font-semibold mb-2">
              Persyaratan Pekerjaan
            </h2>
            <div
              className="prose max-w-none text-sm sm:text-base"
              dangerouslySetInnerHTML={{ __html: job.requirements }}
            />
          </section>
        </div>
      </div>
    </div>
  );
}

export default withAuthGuard(JobDetailPage, {
  redirectTo: "/",
});
