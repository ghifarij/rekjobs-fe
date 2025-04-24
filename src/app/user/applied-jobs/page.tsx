"use client";

import { useState, useEffect } from "react";
import { userApplicationAPI } from "@/services/userApplication";
import { userInterviewAPI } from "@/services/userInterview";
import { FiMoreVertical, FiCheck, FiRefreshCw } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
import { Application } from "@/types/application";
import {
  formatCurrency,
  formatDate,
  formatDateTimeWIB,
} from "@/helpers/format";
import Swal from "sweetalert2";
import withAuthGuard from "@/hoc/withAuthGuard";

function AppliedJobsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const [withdrawing, setWithdrawing] = useState<number | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await userApplicationAPI.getUserApplications();
        setApplications(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || "Failed to load your applications");
        } else {
          setError("Failed to load your applications");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleWithdraw = async (applicationId: number) => {
    if (withdrawing === applicationId) return;

    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Anda tidak dapat mengembalikan lamaran setelah ditarik",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d32f2f",
      cancelButtonColor: "#374151",
      confirmButtonText: "Ya, tarik lamaran",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) {
      setActiveMenuId(null);
      return;
    }

    setWithdrawing(applicationId);
    try {
      await userApplicationAPI.deleteApplication(applicationId);
      setApplications(applications.filter((app) => app.id !== applicationId));
      await Swal.fire({
        icon: "success",
        title: "Lamaran Ditarik",
        text: "Lamaran Anda telah berhasil ditarik.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err: unknown) {
      console.error("Error withdrawing application:", err);
      const message =
        err instanceof Error ? err.message : "Gagal menarik lamaran";
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: message,
      });
    } finally {
      setWithdrawing(null);
      setActiveMenuId(null);
    }
  };

  const toggleMenu = (id: number) => {
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".menu-container")) {
        setActiveMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getInterviewStatus = (interviews: Application["interviews"]) => {
    if (!interviews || interviews.length === 0) {
      return { text: "No Interview", color: "underline text-gray-800" };
    }

    const latestInterview = interviews[interviews.length - 1];
    switch (latestInterview.status) {
      case "SCHEDULED":
        return {
          text: "Wawancara Sedang Dijadwalkan",
          color: "text-sky-800 underline",
        };
      case "COMPLETED":
        return {
          text: "Wawancara Berhasil Dijadwalkan",
          color: "text-green-800 underline",
        };
      case "CANCELLED":
        return {
          text: "Wawancara Dibatalkan",
          color: "underline text-red-800",
        };
      case "PENDING":
        return {
          text: "Menunggu Penjadwalan Ulang",
          color: "underline text-yellow-800",
        };
      case "RESCHEDULED":
        return {
          text: "Wawancara Dijadwalkan Ulang",
          color: "underline text-sky-800",
        };
      default:
        return {
          text: "Tidak ada wawancara yang ditemukan",
          color: "underline text-gray-800",
        };
    }
  };

  const handleAcceptInterview = async (interviewId: number) => {
    try {
      await userInterviewAPI.acceptInterview(interviewId);
      await Swal.fire({
        icon: "success",
        title: "Wawancara Diterima",
        text: "Anda telah menerima jadwal wawancara",
        timer: 2000,
        showConfirmButton: false,
      });
      // Refresh the applications list
      const data = await userApplicationAPI.getUserApplications();
      setApplications(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message || "Gagal menerima wawancara",
        });
      } else {
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: "Gagal menerima wawancara",
        });
      }
    }
  };

  const handleRescheduleRequest = async (interviewId: number) => {
    try {
      await userInterviewAPI.requestRescheduleInterview(interviewId);
      await Swal.fire({
        icon: "success",
        title: "Permintaan Penjadwalan Ulang Dikirim",
        text: "Permintaan Anda untuk menjadwalkan ulang wawancara telah dikirim",
        timer: 2000,
        showConfirmButton: false,
      });
      // Refresh the applications list
      const data = await userApplicationAPI.getUserApplications();
      setApplications(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message || "Gagal meminta penjadwalan ulang",
        });
      } else {
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: "Gagal meminta penjadwalan ulang",
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm sm:text-base">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 w-full sm:w-[70%]">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8">
        Lamaran Saya
      </h1>

      {applications.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-4 text-center border border-gray-200">
          <p className="text-sm sm:text-base text-gray-500 mb-4">
            Anda belum melamar ke pekerjaan apa pun.
          </p>
          <Link
            href="/jobs"
            className="text-sky-600 hover:text-sky-800 font-medium text-sm sm:text-base"
          >
            Cari lowongan pekerjaan
          </Link>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {applications.map((application) => {
            const interviewStatus = getInterviewStatus(application.interviews);
            const latestInterview =
              application.interviews[application.interviews.length - 1];

            return (
              <div
                key={application.id}
                className="bg-white rounded-lg shadow-md border border-gray-200"
              >
                {/* Title Section */}
                <div className="flex justify-between items-center px-3 sm:px-4 py-2 border-b border-gray-200">
                  <Link href={`/jobs/${application.job.slug}`}>
                    <h2 className="text-base sm:text-lg font-semibold hover:text-sky-600">
                      {application.job.title}
                    </h2>
                  </Link>
                  <div className="relative menu-container">
                    {application.status === "PENDING" && (
                      <button
                        onClick={() => toggleMenu(application.id)}
                        className="p-1 sm:p-2 rounded-full hover:bg-gray-100"
                      >
                        <FiMoreVertical className="text-gray-500" />
                      </button>
                    )}

                    {activeMenuId === application.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                        <div className="py-1">
                          <button
                            onClick={() => handleWithdraw(application.id)}
                            disabled={withdrawing === application.id}
                            className="w-full text-left px-4 py-2 text-xs sm:text-sm text-red-600 hover:bg-gray-100"
                          >
                            {withdrawing === application.id
                              ? "Withdrawing..."
                              : "Withdraw Application"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Two Cards Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                  {/* Left Card - Company Info */}
                  <div className="p-3 sm:p-4">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 mt-2 relative bg-gray-100 rounded-lg overflow-hidden">
                        {application.job.company.logo ? (
                          <Image
                            src={application.job.company.logo}
                            alt={application.job.company.name}
                            fill
                            className="object-cover object-center"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            {application.job.company.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-base sm:text-lg">
                          {application.job.company.name}
                        </h3>
                        <div className="mt-2 space-y-1">
                          <p className="text-xs sm:text-sm text-gray-600">
                            {application.job.location || "Not specified"}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600">
                            {application.job.salary
                              ? `${formatCurrency(
                                  application.job.salary
                                )} per bulan`
                              : "Not specified"}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600">
                            <span className="font-medium">Dilamar pada</span>{" "}
                            {formatDate(application.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Card - Interview Info */}
                  <div className="p-3 sm:p-4">
                    <div className="space-y-3 sm:space-y-4">
                      <div>
                        <div
                          className={`text-xs sm:text-sm ${interviewStatus.color}`}
                        >
                          {interviewStatus.text}
                        </div>
                      </div>

                      {latestInterview && (
                        <>
                          <div>
                            <p className="text-xs sm:text-sm text-gray-600">
                              <span className="font-medium">Date:</span>{" "}
                              {formatDateTimeWIB(latestInterview.scheduledAt)}
                            </p>
                            {latestInterview.notes && (
                              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                <span className="font-medium">Notes:</span>{" "}
                                {latestInterview.notes}
                              </p>
                            )}
                          </div>

                          {latestInterview.status === "SCHEDULED" ||
                            (latestInterview.status === "RESCHEDULED" && (
                              <div className="flex flex-col sm:flex-row gap-2">
                                <button
                                  onClick={() =>
                                    handleAcceptInterview(latestInterview.id)
                                  }
                                  className="flex items-center justify-center gap-1 px-3 py-1 text-xs sm:text-sm text-green-700 rounded border border-green-700 hover:bg-green-50"
                                >
                                  <FiCheck className="text-xs sm:text-sm" />
                                  Terima Wawancara
                                </button>
                                <button
                                  onClick={() =>
                                    handleRescheduleRequest(latestInterview.id)
                                  }
                                  className="flex items-center justify-center gap-1 px-3 py-1 text-xs sm:text-sm text-yellow-700 rounded border border-yellow-700 hover:bg-yellow-50"
                                >
                                  <FiRefreshCw className="text-xs sm:text-sm" />
                                  Ajukan Penjadwalan Ulang
                                </button>
                              </div>
                            ))}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default withAuthGuard(AppliedJobsPage, { requiredRole: "user" });
