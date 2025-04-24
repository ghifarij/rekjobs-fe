"use client";

import { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import Swal from "sweetalert2";
import SocialLogin from "@/components/register/SocialLogin";
import { useRouter } from "next/navigation";
import { authAPI } from "@/services/authUser";
import { useSession } from "@/context/useSessionHook";
import { LoginFormValues, LoginSchema } from "@/libs/validationSchema";

export default function LoginUser() {
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { setToken } = useSession();

  const handleSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    setAlertMessage(null);

    try {
      const result = await authAPI.login(values.email, values.password);

      // Store the token and update session
      setToken(result.token);

      // Show success message
      await Swal.fire({
        title: "Login Berhasil!",
        text: "Selamat datang kembali di RekJobs",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#0ea5e9", // sky-500
      });

      // Redirect to dashboard
      router.push("/jobs");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setAlertMessage(error.message || "Terjadi kesalahan saat login");
        Swal.fire({
          title: "Login Gagal",
          text:
            error.message || "Terjadi kesalahan saat login. Silakan coba lagi.",
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "#0ea5e9", // sky-500
        });
      } else {
        setAlertMessage("Terjadi kesalahan saat login");
        Swal.fire({
          title: "Login Gagal",
          text: "Terjadi kesalahan saat login. Silakan coba lagi.",
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
        className="relative z-10 w-full sm:w-[90%] lg:w-[50%] h-auto flex flex-col items-center justify-center p-6 sm:p-10 bg-white shadow-2xl rounded-3xl border border-sky-200"
      >
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full bg-white/70 shadow-lg p-6 sm:p-8 md:p-12 border border-gray-300 backdrop-blur-lg rounded-xl"
        >
          <h1 className="text-3xl font-bold text-sky-600 mb-2">Login</h1>
          <p className="text-sm text-gray-500 mb-6">Selamat datang kembali!</p>

          {alertMessage && (
            <div className="flex items-center bg-red-500 text-white px-4 py-3 rounded-lg shadow-md space-x-3 mb-4">
              <FaTimes className="text-xl" />
              <span>{alertMessage}</span>
            </div>
          )}

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={LoginSchema}
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

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Field
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukkan password"
                      className="w-full p-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <Link
                  href="/auth/user/login/forgot-password"
                  className="text-sm text-sky-500 hover:underline"
                >
                  Lupa password?
                </Link>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-sky-600 to-sky-400 py-3 rounded-lg text-white font-bold hover:opacity-90 transition-transform transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Loading..." : "Login"}
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
            Belum punya akun?{" "}
            <Link
              href="/auth/user/register"
              className="text-sky-500 hover:underline"
            >
              Daftar
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
