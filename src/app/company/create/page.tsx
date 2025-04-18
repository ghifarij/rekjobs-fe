// components/sub/create/JobForm.tsx
"use client";

import React, { useState } from "react";
import { useFormik, FormikProps } from "formik";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { jobAPI } from "@/services/job";
import {
  JobFormValues,
  validationSchema,
} from "@/components/sub/create/validationSchema";
import RichTextEditor from "@/components/sub/create/RichTextEditor";

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
      jobType: "FULL_TIME",
      experience: "",
      deadline: "",
    },
    validationSchema,
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
        await jobAPI.createJob(values);
        Swal.fire("Success", "Job created successfully!", "success");
        router.push(`/company/dashboard`);
      } catch (error) {
        Swal.fire(
          "Error",
          error instanceof Error ? error.message : "Failed to create job",
          "error"
        );
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create Job</h1>
      <form onSubmit={formik.handleSubmit} className="space-y-8">
        {/* Title */}
        <div>
          <label className="block text-gray-700">Job Title</label>
          <input
            type="text"
            {...formik.getFieldProps("title")}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
          {formik.touched.title && formik.errors.title && (
            <div className="text-red-500 text-sm">{formik.errors.title}</div>
          )}
        </div>

        {/* Description (Rich Text) */}
        <div>
          <label className="block text-gray-700 mb-1">Description</label>
          <RichTextEditor
            value={formik.values.description}
            onChange={(val) => formik.setFieldValue("description", val)}
            placeholder="Enter job description..."
          />
          {formik.touched.description && formik.errors.description && (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.description}
            </div>
          )}
        </div>

        {/* Location */}
        <div>
          <label className="block text-gray-700">Location</label>
          <input
            type="text"
            {...formik.getFieldProps("location")}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
          {formik.touched.location && formik.errors.location && (
            <div className="text-red-500 text-sm">{formik.errors.location}</div>
          )}
        </div>

        {/* Requirements (Rich Text) */}
        <div>
          <label className="block text-gray-700 mb-1">Requirements</label>
          <RichTextEditor
            value={formik.values.requirements}
            onChange={(val) => formik.setFieldValue("requirements", val)}
            placeholder="Enter job requirements..."
          />
          {formik.touched.requirements && formik.errors.requirements && (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.requirements}
            </div>
          )}
        </div>

        {/* Salary */}
        <div>
          <label className="block text-gray-700">Salary</label>
          <input
            type="text"
            {...formik.getFieldProps("salary")}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
          {formik.touched.salary && formik.errors.salary && (
            <div className="text-red-500 text-sm">{formik.errors.salary}</div>
          )}
        </div>

        {/* Job Type */}
        <div>
          <label className="block text-gray-700">Job Type</label>
          <select
            {...formik.getFieldProps("jobType")}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          >
            <option value="FULL_TIME">Full Time</option>
            <option value="PART_TIME">Part Time</option>
            <option value="CONTRACT">Contract</option>
            <option value="INTERNSHIP">Internship</option>
            <option value="REMOTE">Remote</option>
          </select>
        </div>

        {/* Experience */}
        <div>
          <label className="block text-gray-700">Experience</label>
          <input
            type="text"
            {...formik.getFieldProps("experience")}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
          {formik.touched.experience && formik.errors.experience && (
            <div className="text-red-500 text-sm">
              {formik.errors.experience}
            </div>
          )}
        </div>

        {/* Deadline */}
        <div>
          <label className="block text-gray-700">Deadline</label>
          <input
            type="date"
            {...formik.getFieldProps("deadline")}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
          {formik.touched.deadline && formik.errors.deadline && (
            <div className="text-red-500 text-sm">{formik.errors.deadline}</div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-sky-500 text-white py-4 px-6 rounded-lg text-lg font-semibold hover:bg-sky-700 disabled:bg-sky-400 transition-colors"
        >
          {loading ? "Creating Job..." : "Create Job"}
        </button>
      </form>
    </div>
  );
};

export default JobForm;
