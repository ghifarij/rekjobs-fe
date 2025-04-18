"use client";

import { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";
import { Mail, Lock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import SocialLoginCompany from "@/components/main/register/SocialLoginCompany";

const loginSchema = Yup.object().shape({
  email: Yup.string().email("Email tidak valid").required("Email harus diisi"),
  password: Yup.string()
    .min(8, "Password minimal 8 karakter")
    .required("Password harus diisi"),
});

export default function CompanyLoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/auth/company/login", values);

      Swal.fire({
        title: "Login Berhasil!",
        text: "Anda akan diarahkan ke dashboard",
        icon: "success",
        confirmButtonColor: "#0ea5e9",
      }).then(() => {
        window.location.href = "/company/dashboard";
      });
    } catch (error: any) {
      Swal.fire({
        title: "Login Gagal",
        text: error.response?.data?.message || "Email atau password salah",
        icon: "error",
        confirmButtonColor: "#0ea5e9",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-5 md:pt-10">
      <div className="absolute top-0 md:top-6 left-0 right-0 h-64 bg-gradient-to-b from-sky-50 to-white overflow-hidden">
        <svg
          className="absolute top-0 left-0 w-full h-64"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="rgba(14, 165, 233, 0.1)"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          ></path>
        </svg>
      </div>

      <div className="container mx-auto px-4 py-12 relative">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-sky-900 mb-4">Login</h1>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg border border-sky-100">
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={loginSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched }) => (
                <Form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-sky-700 mb-1">
                      Email Perusahaan
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-sky-400" />
                      </div>
                      <Field
                        type="email"
                        name="email"
                        className="block w-full pl-10 pr-3 py-3 border border-sky-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 outline-none"
                        placeholder="Masukkan email perusahaan"
                      />
                      {touched.email && errors.email && (
                        <div className="text-sm text-red-500">
                          {errors.email}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-sky-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-sky-400" />
                      </div>
                      <Field
                        type="password"
                        name="password"
                        className="block w-full pl-10 pr-3 py-3 border border-sky-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 outline-none"
                        placeholder="Masukkan password"
                      />
                      {touched.password && errors.password && (
                        <div className="text-sm text-red-500">
                          {errors.password}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Field
                        type="checkbox"
                        name="remember"
                        className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-sky-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-sky-700">
                        Ingat saya
                      </label>
                    </div>
                    <Link
                      href="/auth/company/forgot-password"
                      className="text-sm font-medium text-sky-600 hover:text-sky-700"
                    >
                      Lupa password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-sky-600 to-sky-400 py-3 rounded-lg text-white font-bold hover:opacity-90 transition-transform transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Loading..." : "Login"}
                  </button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-400">Atau</span>
                    </div>
                  </div>

                  <SocialLoginCompany />
                </Form>
              )}
            </Formik>

            <div className="mt-6 text-center">
              <p className="text-sm">
                Belum punya akun?{" "}
                <Link
                  href="/auth/company/register"
                  className="font-medium text-sky-500 hover:underline"
                >
                  Daftar di sini
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
