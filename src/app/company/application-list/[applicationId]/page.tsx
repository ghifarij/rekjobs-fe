// src/app/company/application-list/[applicationId]/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Loading from "@/app/loading";
import {
  FiArrowLeft,
  FiCalendar,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import { companyApplicationAPI } from "@/services/companyApplication";
import {
  companyInterviewAPI,
  CreateInterviewPayload,
} from "@/services/companyInterview";
import { ApplicationDetails } from "@/types/application";
import { formatDate } from "@/helpers/format";
import Swal from "sweetalert2";
import { getApplicationStatusLabel } from "@/helpers/applicationStatus";
import withAuthGuard from "@/hoc/withAuthGuard";

function ApplicationDetailPage() {
  const router = useRouter();
  const { applicationId } = useParams();
  const [application, setApplication] = useState<ApplicationDetails | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchApplication = useCallback(async () => {
    setLoading(true);
    try {
      const data = await companyApplicationAPI.getApplicationById(
        Number(applicationId)
      );
      setApplication({
        ...data,
        user: data.applicant,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [applicationId]);

  useEffect(() => {
    fetchApplication();
  }, [applicationId, fetchApplication]);

  if (loading) return <Loading />;
  if (!application) {
    return (
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto text-center text-red-500">
          Lowongan tidak ditemukan
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-gray-200 rounded"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  const { status, interviews, user, coverLetter, resume } = application;
  const hasInterview = interviews.length > 0;

  const handleStatus = async (newStatus: "PROCESSING" | "REJECTED") => {
    try {
      setUpdating(true);
      await companyApplicationAPI.updateApplicationStatus(
        application.id,
        newStatus
      );

      const label = getApplicationStatusLabel(newStatus);

      // Show success message
      await Swal.fire({
        icon: "success",
        title: `Lamaran ${label.toLowerCase()}!`,
        text: `Berhasil mengubah status lamaran menjadi ${label.toLowerCase()}.`,
        timer: 2000,
        showConfirmButton: false,
      });

      if (newStatus === "REJECTED") {
        router.push("/company/application-list");
      } else {
        await fetchApplication();
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        // Show error message
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message || "Gagal mengubah status lamaran",
        });
      } else {
        // Show error message
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: "Gagal mengubah status lamaran. Silakan coba lagi.",
        });
      }
    } finally {
      setUpdating(false);
    }
  };

  // Now scheduling via SweetAlert2 instead of a full‐page modal
  const handleSchedule = async () => {
    const now = new Date();
    const tzOffsetMs = now.getTimezoneOffset() * 60 * 1000;
    const localISO = new Date(now.getTime() - tzOffsetMs)
      .toISOString()
      .slice(0, 16);

    const { value: formValues } = await Swal.fire<{
      newDate: string;
      notes: string;
    }>({
      title: "Schedule Interview",
      html:
        `<input id="swal-date" type="datetime-local" class="swal2-input" value="${localISO}">` +
        `<textarea id="swal-notes" class="swal2-textarea" placeholder="Notes (optional)"></textarea>`,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        const newDate = (
          document.getElementById("swal-date") as HTMLInputElement
        ).value;
        const notes = (
          document.getElementById("swal-notes") as HTMLTextAreaElement
        ).value;
        if (!newDate) {
          Swal.showValidationMessage("Silakan pilih tanggal dan waktu");
        }
        return { newDate, notes };
      },
    });

    if (!formValues) return; // user cancelled

    setUpdating(true);
    try {
      // 1) create interview
      const payload: CreateInterviewPayload = {
        applicationId: Number(applicationId),
        scheduledAt: new Date(formValues.newDate).toISOString(),
        notes: formValues.notes || undefined,
      };
      await companyInterviewAPI.createInterview(payload);

      // 2) update application status to ACCEPTED
      await companyApplicationAPI.updateApplicationStatus(
        Number(applicationId),
        "ACCEPTED"
      );

      await Swal.fire({
        icon: "success",
        title: "Interview Dijadwalkan",
        text: `Interview dijadwalkan untuk ${formatDate(formValues.newDate)}`,
        timer: 2000,
        showConfirmButton: false,
      });

      // 3) refresh details
      await fetchApplication();
    } catch (err: unknown) {
      if (err instanceof Error) {
        await Swal.fire("Error", err.message || "Gagal menjadwalkan", "error");
      } else {
        await Swal.fire("Error", "Gagal menjadwalkan", "error");
      }
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="text-sky-600 hover:text-sky-700 flex items-center gap-1 w-fit"
        >
          <FiArrowLeft className="text-xl" />
          <p className="hover:underline">Kembali</p>
        </button>
        <div className="flex flex-wrap gap-2">
          {status === "PENDING" && (
            <>
              <button
                onClick={() => handleStatus("REJECTED")}
                disabled={updating}
                className="flex gap-1 px-3 sm:px-4 py-2 text-red-700 rounded border-[1px] border-red-700 hover:bg-red-100 disabled:opacity-50 text-sm sm:text-base"
              >
                <FiXCircle className="m-1" />
                <p>Tolak</p>
              </button>
              <button
                onClick={() => handleStatus("PROCESSING")}
                disabled={updating}
                className="flex gap-1 px-3 sm:px-4 py-2 text-green-700 rounded border-[1px] border-green-700 hover:bg-green-100 disabled:opacity-50 text-sm sm:text-base"
              >
                <FiCheckCircle className="m-1" />
                <p>Terima</p>
              </button>
            </>
          )}

          {status === "PROCESSING" && !hasInterview && (
            <button
              onClick={handleSchedule}
              disabled={updating}
              className="flex gap-1 px-3 sm:px-4 py-2 text-yellow-700 border border-yellow-700 rounded hover:bg-yellow-100 disabled:opacity-50 text-sm sm:text-base"
            >
              <FiCalendar className="mt-0.5" />
              <span>Jadwalkan Interview</span>
            </button>
          )}

          {hasInterview && (
            <span className="px-3 sm:px-4 py-2 text-gray-800 underline text-sm sm:text-base">
              Interview Sudah Dijadwalkan
            </span>
          )}
        </div>
      </header>

      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div className="p-4 bg-gray-50">
          <span className="font-semibold">Status:</span>{" "}
          <span
            className={`text-sm ${
              status === "ACCEPTED"
                ? "text-green-700"
                : status === "REJECTED"
                ? "text-red-700"
                : "text-yellow-700"
            }`}
          >
            {getApplicationStatusLabel(status)}
          </span>
        </div>

        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border">
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">No Avatar</span>
                </div>
              )}
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold">{user.name}</h2>
              <p className="text-gray-600 text-sm sm:text-base">{user.email}</p>
              {user.phone && (
                <p className="text-gray-600 mt-1 text-sm sm:text-base">
                  {user.phone}
                </p>
              )}
            </div>
          </div>
        </div>

        <section className="p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-3">Tentang</h3>
          {user.bio ? (
            <div
              className="prose max-w-none text-sm sm:text-base"
              dangerouslySetInnerHTML={{ __html: user.bio }}
            />
          ) : (
            <p className="italic text-gray-500 text-sm sm:text-base">
              Tidak ada bio yang diberikan
            </p>
          )}
        </section>

        <section className="p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-3">Skills</h3>
          {user.skills?.length ? (
            <div className="flex flex-wrap gap-2">
              {user.skills.map((s) => (
                <span
                  key={s}
                  className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs sm:text-sm"
                >
                  {s}
                </span>
              ))}
            </div>
          ) : (
            <p className="italic text-gray-500 text-sm sm:text-base">
              Tidak ada skills yang diberikan
            </p>
          )}
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-6">
          <section>
            <h3 className="text-lg sm:text-xl font-semibold mb-3">
              Pengalaman Kerja
            </h3>
            {user.experience?.length ? (
              <div className="space-y-4">
                {user.experience.map((exp, i) => (
                  <div key={i} className="border-l-4 border-sky-500 pl-4">
                    <h4 className="font-semibold text-sm sm:text-base">
                      {exp.title}
                    </h4>
                    <p className="text-sm sm:text-base">{exp.company}</p>
                    {exp.location && (
                      <p className="text-gray-500 text-xs sm:text-sm">
                        {exp.location}
                      </p>
                    )}
                    <p className="text-xs sm:text-sm text-gray-500">
                      {formatDate(exp.startDate)} –{" "}
                      {exp.current ? "Present" : formatDate(exp.endDate!)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="italic text-gray-500 text-sm sm:text-base">
                Tidak ada pengalaman kerja yang diberikan
              </p>
            )}
          </section>

          <section>
            <h3 className="text-lg sm:text-xl font-semibold mb-3">
              Pendidikan
            </h3>
            {user.education?.length ? (
              <div className="space-y-4">
                {user.education.map((ed, i) => (
                  <div key={i} className="border-l-4 border-sky-500 pl-4">
                    <h4 className="font-semibold text-sm sm:text-base">
                      {ed.degree} in {ed.field}
                    </h4>
                    <p className="text-sm sm:text-base">{ed.school}</p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {formatDate(ed.startDate)} –{" "}
                      {ed.current ? "Present" : formatDate(ed.endDate!)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="italic text-gray-500 text-sm sm:text-base">
                Tidak ada riwayat pendidikan yang diberikan
              </p>
            )}
          </section>
        </div>

        <section className="p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-3">
            Dokumen Lamaran
          </h3>
          <div className="flex flex-wrap gap-2 sm:gap-4">
            {coverLetter ? (
              <a
                href={coverLetter}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 sm:px-4 py-2 bg-sky-500 text-white rounded text-sm sm:text-base"
              >
                Lihat Surat Lamaran
              </a>
            ) : null}
            {resume ? (
              <a
                href={resume}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 sm:px-4 py-2 bg-sky-500 text-white rounded text-sm sm:text-base"
              >
                Lihat CV
              </a>
            ) : null}
            {!coverLetter && !resume && (
              <p className="italic text-gray-500 text-sm sm:text-base">
                Tidak ada dokumen yang ditemukan
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default withAuthGuard(ApplicationDetailPage, {
  requiredRole: "company",
});
