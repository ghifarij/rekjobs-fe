"use client";

import React, { useEffect, useState } from "react";
import { jobAPI } from "@/services/job";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { formatDate } from "@/helpers/format";
import { MdDeleteForever, MdEditDocument } from "react-icons/md";
import Loading from "@/app/loading";
import { Job } from "@/types/job";
import withAuthGuard from "@/hoc/withAuthGuard";

const Dashboard: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const fetchedJobs = await jobAPI.getCompanyJobs();
        setJobs(fetchedJobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleEdit = (jobId: number) => {
    router.push(`/company/edit-job/${jobId}`);
  };

  const handleDelete = async (jobId: number) => {
    const confirmResult = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Aksi ini tidak dapat dibatalkan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (!confirmResult.isConfirmed) return;

    try {
      await jobAPI.deleteJob(jobId);
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
      Swal.fire("Dihapus!", "Pekerjaan Anda telah dihapus.", "success");
    } catch (error: unknown) {
      if (error instanceof Error) {
        Swal.fire(
          "Error!",
          error.message || "Gagal menghapus pekerjaan.",
          "error"
        );
      } else {
        Swal.fire("Error!", "Gagal menghapus pekerjaan.", "error");
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
        Dashboard Perusahaan
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full table-fixed bg-white shadow rounded-lg border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lowongan
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                Lokasi
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                Deadline
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                Dibuat Pada
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                Total Pelamar
              </th>
              <th className="px-4 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {jobs.map((job) => (
              <tr key={job.id} className="hover:bg-gray-50">
                <td className="px-4 sm:px-6 py-4 whitespace-normal break-words text-sm text-gray-900">
                  <div className="font-medium">{job.title}</div>
                  <div className="text-gray-500 sm:hidden mt-1">
                    {job.location}
                  </div>
                  <div className="text-gray-500 sm:hidden mt-1">
                    Deadline:{" "}
                    {job.deadline ? formatDate(job.deadline) : "Not set"}
                  </div>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden sm:table-cell">
                  {job.location}
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden sm:table-cell">
                  {job.deadline ? formatDate(job.deadline) : "Not set"}
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden md:table-cell">
                  {formatDate(job.createdAt)}
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden md:table-cell">
                  {job.applications?.length ?? 0}
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => handleEdit(job.id)}
                      className="text-blue-500 hover:text-blue-600 p-1"
                      title="Edit"
                    >
                      <MdEditDocument className="text-xl" />
                    </button>
                    <button
                      onClick={() => handleDelete(job.id)}
                      className="text-red-500 hover:text-red-600 p-1"
                      title="Delete"
                    >
                      <MdDeleteForever className="text-xl" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {jobs.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 sm:px-6 py-4 whitespace-nowrap text-center text-gray-500"
                >
                  Tidak ada pekerjaan yang ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default withAuthGuard(Dashboard, { requiredRole: "company" });
