"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { jobAPI } from "@/services/job";
import { userApplicationAPI } from "@/services/userApplication";
import { Job } from "@/types/job";
import { Application } from "@/types/application";
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

const jobTypeLabels: Record<string, string> = {
  FULL_TIME: "Full Time",
  PART_TIME: "Part Time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
  REMOTE: "Remote",
};

function JobsPage() {
  const router = useRouter();
  const params = useSearchParams();

  // read URL params
  const urlSearch = params.get("search") || "";
  const urlJobSlug = params.get("job") || "";

  // component state
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [tempSearch, setTempSearch] = useState(urlSearch);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Replace the debouncedFetchJobs with a regular fetch function
  const fetchJobs = useCallback(
    async (q: string) => {
      setLoading(true);
      try {
        // 1. Fetch *both* the applied apps and the raw job list together
        const [apps, list] = await Promise.all([
          userApplicationAPI.getUserApplications(), // returns Application[]
          jobAPI.getAllPublicJobs(q), // returns Job[]
        ]);

        // 2. Build a Set<number> of applied‐job IDs
        const appliedIds = new Set<number>(
          apps.map((a: Application) => a.job.id)
        );

        // 3. Filter out the ones already applied
        const available = list.filter((job) => !appliedIds.has(job.id));

        // 4. Now set the jobs and run your "select first or slug" logic
        setJobs(available);

        const found = available.find((j) => j.slug === urlJobSlug);
        if (found) {
          setSelectedJob(found);
        } else if (available.length) {
          const first = available[0];
          setSelectedJob(first);
          const searchParam = q ? `search=${encodeURIComponent(q)}&` : "";
          router.replace(`/jobs?${searchParam}job=${first.slug}`, {
            scroll: false,
          });
        } else {
          setSelectedJob(null);
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching jobs or applications:", err);
        setError("Failed to load jobs.");
      } finally {
        setLoading(false);
      }
    },
    [urlJobSlug, router]
  );

  // Handle search submission
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSearchQuery(tempSearch);
    fetchJobs(tempSearch);
  };

  // Add clear search handler
  const handleClearSearch = () => {
    setTempSearch("");
    setSearchQuery("");
    router.replace("/jobs", { scroll: false });
  };

  // Remove the applied jobs effect
  useEffect(() => {
    fetchJobs(searchQuery);
  }, [searchQuery, fetchJobs]);

  // Keep the original handleJobSelect function
  const handleJobSelect = (job: Job) => {
    setSelectedJob(job);
    router.push(
      `/jobs?search=${encodeURIComponent(searchQuery)}&job=${job.slug}`,
      { scroll: false }
    );
  };

  // Keep the search box in sync if someone navigates history
  useEffect(() => {
    setSearchQuery(urlSearch);
  }, [urlSearch]);

  // render states
  if (loading && jobs.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-12 w-12 rounded-full border-t-2 border-b-2 border-sky-500" />
      </div>
    );
  }
  if (error && jobs.length === 0) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="mb-4 sm:mb-6 max-w-md mx-auto flex flex-col sm:flex-row gap-2"
      >
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search jobs by title, location, keywords…"
            value={tempSearch}
            onChange={(e) => setTempSearch(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 pr-10 text-sm sm:text-base"
          />
          {tempSearch && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          )}
        </div>
        <button
          type="submit"
          className="w-full sm:w-auto font-semibold px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700 text-sm sm:text-base"
        >
          Cari
        </button>
      </form>

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        {/* Left: Job List */}
        <div className="w-full lg:w-1/3 bg-white">
          <div className="p-3 sm:p-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
              Lowongan Untukmu
            </h2>
          </div>
          <div className="overflow-y-auto max-h-[80vh] sm:max-h-[100vh]">
            {jobs.length === 0 ? (
              <div className="p-4 text-gray-500 text-center text-sm sm:text-base">
                Tidak ada lowongan yang ditemukan.
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {jobs.map((job) => (
                  <li
                    key={job.id}
                    className={`p-3 sm:p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedJob?.id === job.id
                        ? "border-l-4 border-sky-500 bg-sky-50"
                        : ""
                    }`}
                    onClick={() => handleJobSelect(job)}
                  >
                    <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                      {job.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {job.company.name}
                    </p>
                    <div className="text-xs sm:text-sm text-gray-500 mt-1">
                      {job.location || "—"}{" "}
                      {job.salary && <>• {formatCurrency(job.salary)}</>}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right: Job Details */}
        <div className="w-full lg:w-2/3 bg-white shadow rounded border border-gray-300 overflow-hidden">
          {!selectedJob ? (
            <div className="p-4 sm:p-6 text-gray-500 text-center text-sm sm:text-base">
              Pilih lowongan untuk melihat detail
            </div>
          ) : (
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Header */}
              <div className="flex items-center gap-3 sm:gap-4">
                {selectedJob.company.logo ? (
                  <div className="w-12 h-12 sm:w-16 sm:h-16 relative">
                    <Image
                      src={selectedJob.company.logo}
                      alt={selectedJob.company.name}
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
                  <h1 className="text-lg sm:text-2xl font-bold hover:text-sky-500">
                    {selectedJob.title}
                  </h1>
                  <p className="text-sm sm:text-lg text-gray-600">
                    {selectedJob.company.name}
                  </p>
                </div>
              </div>

              {/* Meta grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm sm:text-base text-gray-600">
                <div>
                  <FaMapMarkerAlt className="inline mr-1" />
                  {selectedJob.location || "—"}
                </div>
                <div>
                  <FaMoneyBillWave className="inline mr-1" />
                  {selectedJob.salary
                    ? formatCurrency(selectedJob.salary)
                    : "—"}
                </div>
                <div>
                  <FaBriefcase className="inline mr-1" />
                  {jobTypeLabels[selectedJob.jobType]}
                </div>
                <div>
                  <FaCalendarAlt className="inline mr-1" />
                  Dibuat pada {formatDate(selectedJob.createdAt)}
                </div>
                <div>
                  <FaClock className="inline mr-1" />
                  {selectedJob.deadline
                    ? formatDate(selectedJob.deadline)
                    : "Not set"}
                </div>
                {selectedJob.experience && (
                  <div>
                    <FaGraduationCap className="inline mr-1" />
                    {selectedJob.experience}
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
                  dangerouslySetInnerHTML={{
                    __html: selectedJob.description,
                  }}
                />
              </section>

              {/* Requirements */}
              <section>
                <h2 className="text-lg sm:text-xl font-semibold mb-2">
                  Persyaratan Pekerjaan
                </h2>
                <div
                  className="prose max-w-none text-sm sm:text-base"
                  dangerouslySetInnerHTML={{
                    __html: selectedJob.requirements,
                  }}
                />
              </section>

              {/* Apply button */}
              <div className="pt-4">
                <button
                  onClick={() => router.push(`/jobs/${selectedJob.slug}/apply`)}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-sky-600 text-white rounded hover:bg-sky-700 text-sm sm:text-base"
                >
                  Lamar Sekarang
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default withAuthGuard(JobsPage, {
  requiredRole: "user",
  redirectTo: "/auth/user/login",
});
