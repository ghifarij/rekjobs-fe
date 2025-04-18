"use client";

import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { authAPI } from "@/services/api";
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
  const resolvedParams = use(params);

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
      const result = await authAPI.verifyUser(resolvedParams.token, values);

      Swal.fire({
        title: "Sukses!",
        text: "Akun berhasil diverifikasi!",
        icon: "success",
        confirmButtonColor: "#0ea5e9",
      }).then(() => {
        router.push("/auth/user/login");
      });
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error.message || "Terjadi kesalahan saat verifikasi",
        icon: "error",
        confirmButtonColor: "#0ea5e9",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 pt-20">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg border-2 border-sky-500">
        <h1 className="text-3xl font-semibold text-center text-sky-600">
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
            <Form className="mt-4">
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-sky-500">
                  Username
                </label>
                <Field
                  type="text"
                  name="username"
                  className="w-full px-3 py-2 border border-sky-500 rounded focus:outline-none focus:ring focus:ring-sky-200"
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-sky-500">
                  Password
                </label>
                <div className="relative">
                  <Field
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="w-full px-3 py-2 border border-sky-500 rounded focus:outline-none focus:ring focus:ring-sky-200"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-sky-500">
                  Confirm Password
                </label>
                <div className="relative">
                  <Field
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    className="w-full px-3 py-2 border border-sky-500 rounded focus:outline-none focus:ring focus:ring-sky-200"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-sky-500">
                  Nomor telepon
                </label>
                <Field
                  type="text"
                  name="no_handphone"
                  className="w-full px-3 py-2 border border-sky-500 rounded focus:outline-none focus:ring focus:ring-sky-200"
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
                className={`w-full px-3 py-2 text-white bg-sky-500 rounded-lg hover:bg-sky-600 focus:outline-none focus:ring focus:ring-sky-200 ${
                  isSubmitting ? "opacity-50" : ""
                }`}
              >
                {isSubmitting ? "Memverifikasi..." : "Verifikasi Akun"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
