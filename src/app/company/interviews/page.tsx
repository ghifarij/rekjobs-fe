// app/company/interviews/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { MdEditDocument } from "react-icons/md";
import Swal from "sweetalert2";
import Loading from "@/app/loading";
import { formatDate, formatDateTimeWIB } from "@/helpers/format";
import { companyInterviewAPI } from "@/services/companyInterview";
import { CompanyInterview } from "@/types/interview";
import withAuthGuard from "@/hoc/withAuthGuard";
import { FiAlertCircle } from "react-icons/fi";

function CompanyInterviewsPage() {
  const [interviews, setInterviews] = useState<CompanyInterview[]>([]);
  const [loading, setLoading] = useState(true);

  // 1) Extract all fetching into one function
  const fetchInterviews = async () => {
    setLoading(true);
    try {
      const data = await companyInterviewAPI.getCompanyInterviews();
      setInterviews(data);
    } catch (err) {
      console.error("Error fetching interviews:", err);
      Swal.fire("Error", "Gagal memuat jadwal wawancara", "error");
    } finally {
      setLoading(false);
    }
  };

  // 2) Call it on mount
  useEffect(() => {
    fetchInterviews();
  }, []);

  // 3) Reschedule handler now also re-fetches instead of letting a full page reload occur
  const handleReschedule = async (iv: CompanyInterview) => {
    const now = new Date();
    const tzOffsetMs = now.getTimezoneOffset() * 60 * 1000;
    const localISO = new Date(now.getTime() - tzOffsetMs)
      .toISOString()
      .slice(0, 16);

    const { value: formValues } = await Swal.fire<{
      newDate: string;
      notes: string;
    }>({
      title: "Ubah Jadwal Wawancara",
      html:
        `<input id="swal-input1" type="datetime-local" class="swal2-input" value="${localISO}">` +
        `<textarea id="swal-input2" class="swal2-textarea" placeholder="Update catatan">${
          iv.notes || ""
        }</textarea>`,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        const newDate = (
          document.getElementById("swal-input1") as HTMLInputElement
        ).value;
        const notes = (
          document.getElementById("swal-input2") as HTMLTextAreaElement
        ).value;
        if (!newDate)
          Swal.showValidationMessage("Silakan pilih tanggal dan waktu");
        return { newDate, notes };
      },
    });

    if (!formValues) return; // user cancelled

    try {
      await companyInterviewAPI.rescheduleInterview(iv.id, {
        scheduledAt: formValues.newDate,
        notes: formValues.notes,
      });
      await Swal.fire({
        icon: "success",
        title: "Dijadwalkan Ulang!",
        text: `Wawancara dipindahkan ke ${formatDate(formValues.newDate)}`,
        timer: 1500,
        showConfirmButton: false,
      });
      // instead of letting the page reload, just refresh our data
      await fetchInterviews();
    } catch (err) {
      console.error("Reschedule failed:", err);
      Swal.fire(
        "Error",
        err instanceof Error ? err.message : "Gagal menjadwalkan ulang",
        "error"
      );
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
        Jadwal Wawancara
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full table-fixed bg-white shadow rounded-lg border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lowongan
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                Pelamar
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tanggal Wawancara
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                Catatan
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jadwal Ulang
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {interviews.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 sm:px-6 py-4 whitespace-nowrap text-center text-gray-500"
                >
                  Belum ada jadwal wawancara.
                </td>
              </tr>
            ) : (
              interviews.map((iv) => {
                const { job, applicant } = iv.application!;
                return (
                  <tr key={iv.id} className="hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-4 whitespace-normal break-words text-sm text-gray-900">
                      <div className="font-medium">{job.title}</div>
                      <div className="text-gray-500 sm:hidden mt-1">
                        {applicant.name}
                      </div>
                      <div className="text-gray-500 sm:hidden mt-1">
                        {applicant.email}
                      </div>
                      {applicant.phone && (
                        <div className="text-gray-500 sm:hidden mt-1">
                          {applicant.phone}
                        </div>
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-normal break-words text-sm text-gray-700 hidden sm:table-cell">
                      <div>{applicant.name}</div>
                      <div className="text-gray-500">{applicant.email}</div>
                      {applicant.phone && (
                        <div className="text-gray-500">{applicant.phone}</div>
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-normal break-words text-sm text-gray-700">
                      {formatDateTimeWIB(iv.scheduledAt)}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-normal break-words text-sm text-gray-700 hidden md:table-cell">
                      {iv.notes ? (
                        iv.notes
                      ) : (
                        <span className="italic text-gray-400">–</span>
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-normal break-words">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          iv.status === "SCHEDULED"
                            ? "text-sky-800 underline"
                            : iv.status === "COMPLETED"
                            ? "text-green-800 underline"
                            : iv.status === "CANCELLED"
                            ? "text-red-800 underline"
                            : iv.status === "RESCHEDULED"
                            ? "text-sky-800 underline"
                            : iv.status === "PENDING"
                            ? "text-yellow-800 underline"
                            : "text-gray-800 underline"
                        }`}
                      >
                        {iv.status === "PENDING" ? (
                          <span className="flex items-center gap-1">
                            <FiAlertCircle className="text-yellow-600 text-3xl font-semibold" />
                            Pelamar ingin menjadwalkan ulang wawancara
                          </span>
                        ) : (
                          iv.status
                        )}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleReschedule(iv)}
                        className="text-blue-500 hover:text-blue-600 p-1"
                        title="Reschedule"
                      >
                        <MdEditDocument className="text-xl" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default withAuthGuard(CompanyInterviewsPage, {
  requiredRole: "company",
});
