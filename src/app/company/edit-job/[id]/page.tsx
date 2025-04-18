"use client";

import React, { useState, useEffect } from "react";
import { useFormik, FormikProps } from "formik";
import { useRouter, useParams } from "next/navigation";
import Swal from "sweetalert2";
import { jobAPI } from "@/services/job";
import {
  JobFormValues,
  validationSchema,
} from "@/components/sub/create/validationSchema";

const EditJob: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { id } = useParams();
  const jobId = Number(id);

  const formik: FormikProps<JobFormValues> = useFormik<JobFormValues>({
    // Set blank initial values; these will be updated once the data is fetched
    initialValues: {
      title: "",
      description: "",
      location: "",
      requirements: "",
      salary: "",
      jobType: "FULL_TIME", // Default job type
      experience: "",
      deadline: "",
    },
    validationSchema,
    enableReinitialize: true, // This allows the form to update its values when they are fetched
    onSubmit: async (values) => {
      const confirmResult = await Swal.fire({
        title: "Are you sure you want to update this job?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, update it",
        cancelButtonText: "Cancel",
      });

      if (!confirmResult.isConfirmed) {
        return;
      }

      setLoading(true);
      try {
        await jobAPI.updateJob(jobId, values);
        Swal.fire({
          title: "Success",
          text: "Job updated successfully!",
          icon: "success",
        });
        router.push(`/company/dashboard`);
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: error instanceof Error ? error.message : "Failed to update job",
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    },
  });

  // Fetch job details on component mount and prepopulate form fields
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const jobData = await jobAPI.getJobById(jobId);
        // Update form values with the job data from the database
        formik.setValues({
          title: jobData.title || "",
          description: jobData.description || "",
          location: jobData.location || "",
          requirements: jobData.requirements || "",
          salary: jobData.salary || "",
          jobType: jobData.jobType || "FULL_TIME",
          experience: jobData.experience || "",
          // Adjust deadline if needed; assuming jobData.deadline is an ISO string, we use only the date portion
          deadline: jobData.deadline ? jobData.deadline.split("T")[0] : "",
        });
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Failed to fetch job details.",
          icon: "error",
        });
      }
    };

    if (jobId) {
      fetchJobDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Job</h1>
      <form onSubmit={formik.handleSubmit} className="space-y-8">
        {/* Job Title */}
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

        {/* Description */}
        <div>
          <label className="block text-gray-700">Description</label>
          <textarea
            {...formik.getFieldProps("description")}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
          {formik.touched.description && formik.errors.description && (
            <div className="text-red-500 text-sm">
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

        {/* Requirements */}
        <div>
          <label className="block text-gray-700">Requirements</label>
          <textarea
            {...formik.getFieldProps("requirements")}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
          {formik.touched.requirements && formik.errors.requirements && (
            <div className="text-red-500 text-sm">
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

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-sky-500 text-white py-4 px-6 rounded-lg text-lg font-semibold hover:bg-sky-700 disabled:bg-sky-400 transition-colors"
        >
          {loading ? "Updating Job..." : "Update Job"}
        </button>
      </form>
    </div>
  );
};

export default EditJob;
