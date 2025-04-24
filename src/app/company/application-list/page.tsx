// app/company/application-list/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiArrowRight, FiUser } from "react-icons/fi";
import Swal from "sweetalert2";
import Loading from "@/app/loading";
import { formatDate } from "@/helpers/format";
import { companyApplicationAPI } from "@/services/companyApplication";
import { Application } from "@/types/application";
import { getApplicationStatusLabel } from "@/helpers/applicationStatus";
import withAuthGuard from "@/hoc/withAuthGuard";

function ApplicationListPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    companyApplicationAPI
      .getCompanyApplications()
      .then((response) => {
        console.log(response.applications);
        setApplications(response.applications);
      })
      .catch((err) => {
        console.error("Error fetching applications:", err);
        Swal.fire("Error", "Gagal memuat data lamaran", "error");
      })
      .finally(() => setLoading(false));
  }, []);

  const getBadgeClass = (status: string) => {
    switch (status) {
      case "PENDING":
        return "text-yellow-800";
      case "PROCESSING":
        return "text-blue-800";
      case "ACCEPTED":
        return "text-green-800";
      case "REJECTED":
        return "text-red-800";
      default:
        return "text-gray-800";
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">
        Candidate Applications
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full table-fixed bg-white shadow rounded-lg border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Profil
              </th>
              <th className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Lowongan
              </th>
              <th className="hidden sm:table-cell px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Pelamar
              </th>
              <th className="hidden md:table-cell px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Tanggal Melamar
              </th>
              <th className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-3 sm:px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                Detail
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {applications?.map((app) => (
              <tr key={app.id} className="hover:bg-gray-50">
                {/* Profile */}
                <td className="p-2">
                  <div className="relative h-16 w-16 sm:h-24 sm:w-20 bg-gray-200 overflow-hidden">
                    {app.applicant.avatar ? (
                      <Image
                        src={app.applicant.avatar}
                        alt={app.applicant.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-500">
                        <FiUser className="h-6 w-6 sm:h-8 sm:w-8" />
                      </div>
                    )}
                  </div>
                </td>

                {/* Lowongan */}
                <td className="px-3 sm:px-4 py-4 whitespace-normal break-words text-sm text-gray-900">
                  <div className="font-medium">Job ID: {app.jobId}</div>
                  <div className="text-xs text-gray-500 sm:hidden">
                    {app.applicant.name}
                  </div>
                </td>

                {/* Detail Pelamar (hidden on mobile) */}
                <td className="hidden sm:table-cell px-4 py-4 whitespace-normal break-words text-sm text-gray-700">
                  <div className="font-medium">{app.applicant.name}</div>
                  <div className="text-xs text-gray-500">
                    {app.applicant.email}
                  </div>
                  {app.applicant.phone && (
                    <div className="text-xs text-gray-500">
                      {app.applicant.phone}
                    </div>
                  )}
                </td>

                {/* Tanggal Melamar (hidden on mobile) */}
                <td className="hidden md:table-cell px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                  {formatDate(app.createdAt)}
                </td>

                {/* Status */}
                <td className="px-3 sm:px-4 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeClass(
                      app.status
                    )} bg-opacity-10`}
                  >
                    {getApplicationStatusLabel(app.status)}
                  </span>
                </td>

                {/* Proses */}
                <td className="px-3 sm:px-4 py-4 whitespace-nowrap text-center">
                  <Link
                    href={`application-list/${app.id}`}
                    className="inline-flex items-center justify-center"
                  >
                    <div className="bg-sky-100 rounded-full p-1.5 hover:bg-sky-200 transition-colors">
                      <FiArrowRight className="text-lg sm:text-xl text-sky-600" />
                    </div>
                  </Link>
                </td>
              </tr>
            ))}

            {applications?.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  Tidak ada lowongan yang ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default withAuthGuard(ApplicationListPage, {
  requiredRole: "company",
});
