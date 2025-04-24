"use client";

import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { authAPI } from "@/services/authUser";
import { use } from "react";

interface VerifyFormValues {
  username: string;
  password: string;
  confirmPassword: string;
  no_handphone: string;
}

const validationSchema = Yup.object({
  username: Yup.string().required("Nama pengguna diperlukan"),
  password: Yup.string()
    .min(8, "Kata sandi harus minimal 8 karakter")
    .required("Kata sandi diperlukan"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Kata sandi harus cocok")
    .required("Konfirmasi Kata Sandi diperlukan"),
  no_handphone: Yup.string()
    .matches(/^\d+$/, "Nomor telepon harus berupa angka")
    .required("Nomor telepon diperlukan"),
});

export default function VerifyPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const resolvedParams = use(params);

  useEffect(() => {
    const checkVerificationStatus = async () => {
      if (!resolvedParams?.token) {
        Swal.fire({
          title: "Error",
          text: "Token verifikasi tidak valid",
          icon: "error",
          confirmButtonColor: "#0ea5e9",
        }).then(() => {
          router.push("/");
        });
        return;
      }

      try {
        const result = await authAPI.checkVerificationStatus(
          resolvedParams.token
        );

        if (result.isVerified) {
          Swal.fire({
            title: "Akun Sudah Terverifikasi",
            text: "Akun Anda sudah terverifikasi sebelumnya. Anda akan diarahkan ke halaman utama.",
            icon: "info",
            confirmButtonColor: "#0ea5e9",
          }).then(() => {
            router.push("/");
          });
        }
      } catch (error) {
        console.error("Error checking verification status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkVerificationStatus();
  }, [resolvedParams?.token, router]);

  const onVerify = async (
    values: VerifyFormValues,
    { setSubmitting }: FormikHelpers<VerifyFormValues>
  ) => {
    if (!resolvedParams?.token) {
      Swal.fire({
        title: "Error",
        text: "Token verifikasi tidak valid",
        icon: "error",
        confirmButtonColor: "#0ea5e9",
      });
      router.push("/");
      return;
    }

    try {
      await authAPI.verifyUser(resolvedParams.token, values);

      Swal.fire({
        title: "Sukses!",
        text: "Akun berhasil diverifikasi!",
        icon: "success",
        confirmButtonColor: "#0ea5e9",
      }).then(() => {
        router.push("/auth/user/login");
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        Swal.fire({
          title: "Error",
          text: error.message || "Terjadi kesalahan saat verifikasi",
          icon: "error",
          confirmButtonColor: "#0ea5e9",
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "Terjadi kesalahan saat verifikasi",
          icon: "error",
          confirmButtonColor: "#0ea5e9",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg border-2 border-sky-500">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto"></div>
            <p className="mt-4 text-sky-600">Memeriksa status verifikasi...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg border-2 border-sky-500">
          <h1 className="text-2xl sm:text-3xl font-semibold text-center text-sky-600 mb-6">
            Verifikasi Akun Anda
          </h1>
          <Formik<VerifyFormValues>
            initialValues={{
              username: "",
              password: "",
              confirmPassword: "",
              no_handphone: "",
            }}
            validationSchema={validationSchema}
            onSubmit={onVerify}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-sky-500 mb-1">
                    Username
                  </label>
                  <Field
                    type="text"
                    name="username"
                    className="w-full px-3 py-2 sm:py-3 border border-sky-500 rounded focus:outline-none focus:ring focus:ring-sky-200"
                  />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-sky-500 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Field
                      name="password"
                      type={showPassword ? "text" : "password"}
                      className="w-full px-3 py-2 sm:py-3 border border-sky-500 rounded focus:outline-none focus:ring focus:ring-sky-200"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-sky-500 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Field
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      className="w-full px-3 py-2 sm:py-3 border border-sky-500 rounded focus:outline-none focus:ring focus:ring-sky-200"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-sky-500 mb-1">
                    Nomor telepon
                  </label>
                  <Field
                    type="text"
                    name="no_handphone"
                    className="w-full px-3 py-2 sm:py-3 border border-sky-500 rounded focus:outline-none focus:ring focus:ring-sky-200"
                  />
                  <ErrorMessage
                    name="no_handphone"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full px-4 py-2 sm:py-3 text-white bg-sky-500 rounded-lg hover:bg-sky-600 focus:outline-none focus:ring focus:ring-sky-200 transition-colors duration-200 ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? "Memverifikasi..." : "Verifikasi Akun"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
