"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, FormikHelpers } from "formik";
import { authAPI } from "@/services/authUser";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import { forgotPasswordSchema } from "@/libs/validationSchema";

interface ForgotPasswordFormValues {
  email: string;
}

export default function UserForgotPasswordPage() {
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const initialValues: ForgotPasswordFormValues = {
    email: "",
  };

  const handleSubmit = async (
    values: ForgotPasswordFormValues,
    { setSubmitting, setErrors }: FormikHelpers<ForgotPasswordFormValues>
  ) => {
    setLoading(true);
    try {
      await authAPI.forgotPassword(values.email);
      setSuccess(true);
    } catch (err: unknown) {
      const error = err as Error;
      setErrors({
        email: error.message || "Gagal mengirim email reset password",
      });
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <FaEnvelope className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Cek Email Anda
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Kami telah mengirimkan link reset password ke email Anda. Silakan
              cek email Anda dan ikuti instruksi untuk reset password.
            </p>
          </div>
          <div className="mt-8">
            <button
              onClick={() => router.push("/auth/user/login")}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
            >
              Kembali ke Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-sky-100">
            <FaEnvelope className="h-6 w-6 text-sky-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Lupa Password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Masukkan alamat email Anda dan kami akan mengirimkan link untuk
            reset password.
          </p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={forgotPasswordSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="mt-8 space-y-6">
              {errors.email && touched.email && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        {errors.email}
                      </h3>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-sky-500 focus:border-sky-500 focus:z-10 sm:text-sm"
                  placeholder="Alamat Email"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    </span>
                  ) : null}
                  {loading ? "Mengirim Link Reset..." : "Kirim Link Reset"}
                </button>
              </div>

              <div className="text-center">
                <Link
                  href="/auth/user/login"
                  className="inline-flex items-center text-sm text-sky-600 hover:text-sky-500"
                >
                  <FaArrowLeft className="mr-2" />
                  Kembali ke Login
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
