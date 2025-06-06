"use client";

import { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import Link from "next/link";
import * as Yup from "yup";
import Swal from "sweetalert2";
import SocialLogin from "@/components/register/SocialLogin";
import { authAPI } from "@/services/authUser";

// Validation schema
const RegisterSchema = Yup.object().shape({
  email: Yup.string().email("Email tidak valid").required("Email harus diisi"),
});

// Form values type
interface FormValues {
  email: string;
}

export default function RegisterUser() {
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const handleSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setAlertMessage(null);

    try {
      await authAPI.register(values.email);

      Swal.fire({
        title: "Email Verifikasi Terkirim!",
        html: `
          <p>Kami telah mengirimkan email verifikasi ke <strong>${values.email}</strong>.</p>
          <p>Silakan cek email Anda dan klik tombol verifikasi untuk melanjutkan pendaftaran.</p>
        `,
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#0ea5e9", // sky-500
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        setAlertMessage(error.message || "Terjadi kesalahan saat mendaftar");
        Swal.fire({
          title: "Pendaftaran Gagal",
          text:
            error.message ||
            "Terjadi kesalahan saat mendaftar. Silakan coba lagi.",
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "#0ea5e9", // sky-500
        });
      } else {
        setAlertMessage("Terjadi kesalahan saat mendaftar");
        Swal.fire({
          title: "Pendaftaran Gagal",
          text: "Terjadi kesalahan saat mendaftar. Silakan coba lagi.",
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "#0ea5e9", // sky-500
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black flex items-center justify-center pb-20 pt-0 md:pt-8 md:pb-7 relative">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 w-full sm:w-[90%] lg:w-[90%] h-auto flex flex-col lg:flex-row items-center justify-between p-6 sm:p-10 bg-white shadow-2xl rounded-3xl border border-sky-200"
      >
        <div className="text-center lg:text-left max-w-lg flex flex-col items-center lg:items-start">
          <h1 className="text-4xl sm:text-5xl font-bold text-sky-600 mb-4">
            Temukan Pekerjaan Impian Anda
          </h1>
          <p className="text-gray-700 text-sm sm:text-base mt-4">
            Jelajahi pilihan lowongan kerja terbaik dengan gaji bersaing dan
            peluang karir yang menjanjikan!
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full sm:w-[90%] lg:w-[50%] bg-white/70 shadow-lg p-6 sm:p-8 md:p-12 border border-gray-300 backdrop-blur-lg rounded-xl"
        >
          <h1 className="text-3xl font-bold text-sky-600 mb-2">Daftar</h1>
          <p className="text-sm text-gray-500 mb-6">
            Buat akun untuk mulai melamar pekerjaan
          </p>

          {alertMessage && (
            <div className="flex items-center bg-red-500 text-white px-4 py-3 rounded-lg shadow-md space-x-3 mb-4">
              <FaTimes className="text-xl" />
              <span>{alertMessage}</span>
            </div>
          )}

          <Formik
            initialValues={{ email: "" }}
            validationSchema={RegisterSchema}
            onSubmit={handleSubmit}
          >
            {() => (
              <Form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <Field
                    name="email"
                    type="email"
                    placeholder="Masukkan email"
                    className="w-full p-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-sky-600 to-sky-400 py-3 rounded-lg text-white font-bold hover:opacity-90 transition-transform transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Loading..." : "Daftar"}
                </button>
              </Form>
            )}
          </Formik>

          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-400">Atau</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <div className="flex justify-center">
            <SocialLogin />
          </div>

          <div className="text-center text-sm mt-6">
            Sudah punya akun?{" "}
            <Link
              href="/auth/user/login"
              className="text-sky-500 hover:underline"
            >
              Login
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
