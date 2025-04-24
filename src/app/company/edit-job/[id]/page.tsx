"use client";

import React, { useState, useEffect } from "react";
import { useFormik, FormikProps } from "formik";
import { useRouter, useParams } from "next/navigation";
import Swal from "sweetalert2";
import { jobAPI } from "@/services/job";
import { JobFormValues, validationSchema } from "@/libs/validationSchema";
import RichTextEditor from "@/components/rich-text-editor/RichTextEditor";
import Loading from "@/app/loading";
import withAuthGuard from "@/hoc/withAuthGuard";
import { ExperienceLevel } from "@/types/job";

const EditJob: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { id } = useParams();
  const jobId = Number(id);

  const formik: FormikProps<JobFormValues> = useFormik<JobFormValues>({
    initialValues: {
      title: "",
      description: "",
      location: "",
      requirements: "",
      salary: "",
      jobType: "FULL_TIME",
      experience: "",
      deadline: "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const confirmResult = await Swal.fire({
        title: "Apakah Anda yakin ingin memperbarui pekerjaan ini?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Ya, perbarui",
        cancelButtonText: "Batal",
      });

      if (!confirmResult.isConfirmed) {
        return;
      }

      setLoading(true);
      try {
        await jobAPI.updateJob(jobId, {
          ...values,
          experience: values.experience as ExperienceLevel,
        });
        Swal.fire({
          title: "Berhasil",
          text: "Pekerjaan berhasil diperbarui!",
          icon: "success",
        });
        router.push(`/company/dashboard`);
      } catch (error) {
        Swal.fire({
          title: "Error",
          text:
            error instanceof Error
              ? error.message
              : "Gagal memperbarui pekerjaan",
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    },
  });

  const { setValues } = formik;

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const jobData = await jobAPI.getJobById(jobId);
        setValues({
          title: jobData.title || "",
          description: jobData.description || "",
          location: jobData.location || "",
          requirements: jobData.requirements || "",
          salary: jobData.salary || "",
          jobType: jobData.jobType || "FULL_TIME",
          experience: jobData.experience || "ENTRY",
          deadline: jobData.deadline ? jobData.deadline.split("T")[0] : "",
        });
      } catch (error) {
        Swal.fire({
          title: "Error",
          text:
            error instanceof Error
              ? error.message
              : "Gagal mengambil detail pekerjaan.",
          icon: "error",
        });
      }
    };

    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId, setValues]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
            Edit Job
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
                  Lokasi
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
                />
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
                {formik.touched.experience && formik.errors.experience && (
                  <div className="text-red-500 text-xs sm:text-sm mt-1">
                    {formik.errors.experience}
                  </div>
                )}
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
                placeholder="Enter job description..."
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
                placeholder="Enter job requirements..."
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
                    Memperbarui...
                  </>
                ) : (
                  "Perbarui Pekerjaan"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default withAuthGuard(EditJob, { requiredRole: "company" });
