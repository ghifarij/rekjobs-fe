// components/sub/create/JobForm.tsx
"use client";

import React, { useState } from "react";
import { useFormik, FormikProps } from "formik";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { jobAPI } from "@/services/job";
import { JobFormValues, jobValidationSchema } from "@/libs/jobValidationSchema";
import RichTextEditor from "@/components/rich-text-editor/RichTextEditor";
import withAuthGuard from "@/hoc/withAuthGuard";
import { JobType, ExperienceLevel } from "@/types/job";

const JobForm: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const formik: FormikProps<JobFormValues> = useFormik<JobFormValues>({
    initialValues: {
      title: "",
      description: "",
      location: "",
      requirements: "",
      salary: "",
      jobType: "FULL_TIME" as JobType,
      experience: "ENTRY" as ExperienceLevel,
      deadline: "",
    },
    validationSchema: jobValidationSchema,
    onSubmit: async (values) => {
      const confirmResult = await Swal.fire({
        title: "Apakah data sudah benar?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Ya, saya yakin",
        cancelButtonText: "Edit ulang",
      });

      if (!confirmResult.isConfirmed) return;

      setLoading(true);
      try {
        const formattedValues = {
          ...values,
          salary: values.salary || "Negotiable",
        };

        await jobAPI.createJob(formattedValues);
        Swal.fire("Berhasil", "Pekerjaan berhasil dibuat!", "success");
        router.push(`/company/dashboard`);
      } catch (error) {
        Swal.fire(
          "Error",
          error instanceof Error ? error.message : "Gagal membuat pekerjaan",
          "error"
        );
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
            Buat Lowongan
          </h1>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Job Title */}
              <div className="sm:col-span-2">
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
                  Judul Pekerjaan
                </label>
                <input
                  type="text"
                  {...formik.getFieldProps("title")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm sm:text-base"
                />
                {formik.touched.title && formik.errors.title && (
                  <div className="text-red-500 text-xs sm:text-sm mt-1">
                    {formik.errors.title}
                  </div>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
                  Lokasi (Kota / Kabupaten)
                </label>
                <input
                  type="text"
                  {...formik.getFieldProps("location")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm sm:text-base"
                />
                {formik.touched.location && formik.errors.location && (
                  <div className="text-red-500 text-xs sm:text-sm mt-1">
                    {formik.errors.location}
                  </div>
                )}
              </div>

              {/* Job Type */}
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
                  Jenis Pekerjaan
                </label>
                <select
                  {...formik.getFieldProps("jobType")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm sm:text-base"
                >
                  <option value="FULL_TIME">Full Time</option>
                  <option value="PART_TIME">Part Time</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="INTERNSHIP">Internship</option>
                  <option value="REMOTE">Remote</option>
                </select>
              </div>

              {/* Salary */}
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
                  Gaji
                </label>
                <input
                  type="text"
                  {...formik.getFieldProps("salary")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm sm:text-base"
                  placeholder="Enter salary (e.g., 5000000)"
                />
                <div className="mt-2 flex items-center">
                  <button
                    type="button"
                    onClick={() => {
                      const isHidden =
                        formik.values.salary === "Gaji disembunyikan";
                      formik.setFieldValue(
                        "salary",
                        isHidden ? "" : "Gaji disembunyikan"
                      );
                    }}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      formik.values.salary === "Gaji disembunyikan"
                        ? "bg-sky-500 border-sky-500"
                        : "border-gray-300"
                    }`}
                  >
                    {formik.values.salary === "Gaji disembunyikan" && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </button>
                  <span className="ml-2 text-sm text-gray-600">
                    Sembunyikan gaji
                  </span>
                </div>
                {formik.touched.salary && formik.errors.salary && (
                  <div className="text-red-500 text-xs sm:text-sm mt-1">
                    {formik.errors.salary}
                  </div>
                )}
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
                  Pengalaman
                </label>
                <select
                  {...formik.getFieldProps("experience")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm sm:text-base"
                >
                  <option value="ENTRY">Entry Level</option>
                  <option value="MID">Mid Level</option>
                  <option value="SENIOR">Senior Level</option>
                  <option value="EXPERT">Expert Level</option>
                </select>
              </div>

              {/* Deadline */}
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
                  Deadline
                </label>
                <input
                  type="date"
                  {...formik.getFieldProps("deadline")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm sm:text-base"
                />
                {formik.touched.deadline && formik.errors.deadline && (
                  <div className="text-red-500 text-xs sm:text-sm mt-1">
                    {formik.errors.deadline}
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
                Deskripsi Pekerjaan
              </label>
              <RichTextEditor
                value={formik.values.description}
                onChange={(val) => formik.setFieldValue("description", val)}
                placeholder="Deskripsi pekerjaan..."
              />
              {formik.touched.description && formik.errors.description && (
                <div className="text-red-500 text-xs sm:text-sm mt-1">
                  {formik.errors.description}
                </div>
              )}
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
                Persyaratan Pekerjaan
              </label>
              <RichTextEditor
                value={formik.values.requirements}
                onChange={(val) => formik.setFieldValue("requirements", val)}
                placeholder="Persyaratan pekerjaan..."
              />
              {formik.touched.requirements && formik.errors.requirements && (
                <div className="text-red-500 text-xs sm:text-sm mt-1">
                  {formik.errors.requirements}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Membuat...
                  </>
                ) : (
                  "Buat Pekerjaan"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default withAuthGuard(JobForm, { requiredRole: "company" });
