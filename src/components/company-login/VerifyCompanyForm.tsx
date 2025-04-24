"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { Eye, EyeOff, Loader2, Building2, Lock, Phone } from "lucide-react";
import { authCompanyAPI } from "@/services/authCompany";

const verifySchema = Yup.object().shape({
  name: Yup.string().required("Nama perusahaan harus diisi"),
  password: Yup.string()
    .min(8, "Password minimal 8 karakter")
    .required("Password harus diisi"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Password harus cocok")
    .required("Konfirmasi password harus diisi"),
  phone: Yup.string()
    .matches(/^\+?\d{10,15}$/, "Nomor telepon tidak valid")
    .required("Nomor telepon harus diisi"),
});

interface VerifyCompanyFormProps {
  token: string;
}

export default function VerifyCompanyForm({ token }: VerifyCompanyFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (values: {
    name: string;
    password: string;
    confirmPassword: string;
    phone: string;
  }) => {
    try {
      await authCompanyAPI.verifyUser(token, {
        name: values.name,
        password: values.password,
        no_handphone: values.phone,
      });

      Swal.fire({
        title: "Verifikasi Berhasil!",
        text: "Akun perusahaan Anda telah aktif",
        icon: "success",
        confirmButtonColor: "#0ea5e9",
      }).then(() => {
        router.push("/auth/company/login");
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        Swal.fire({
          title: "Verifikasi Gagal",
          text: error.message || "Terjadi kesalahan saat verifikasi",
          icon: "error",
          confirmButtonColor: "#0ea5e9",
        });
      } else {
        Swal.fire({
          title: "Verifikasi Gagal",
          text: "Terjadi kesalahan saat verifikasi",
          icon: "error",
        });
      }
    }
  };

  return (
    <Formik
      initialValues={{
        name: "",
        password: "",
        confirmPassword: "",
        phone: "",
      }}
      validationSchema={verifySchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-sky-700 mb-1">
              Nama Perusahaan
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Building2 className="h-5 w-5 text-sky-400" />
              </div>
              <Field
                type="text"
                name="name"
                className="block w-full pl-10 pr-3 py-3 border border-sky-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 outline-none"
                placeholder="Masukkan nama perusahaan"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
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
                type={showPassword ? "text" : "password"}
                name="password"
                className="block w-full pl-10 pr-3 py-3 border border-sky-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 outline-none"
                placeholder="Masukkan password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-sky-400" />
                ) : (
                  <Eye className="h-5 w-5 text-sky-400" />
                )}
              </button>
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-sky-700 mb-1">
              Konfirmasi Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-sky-400" />
              </div>
              <Field
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                className="block w-full pl-10 pr-3 py-3 border border-sky-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 outline-none"
                placeholder="Konfirmasi password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-sky-400" />
                ) : (
                  <Eye className="h-5 w-5 text-sky-400" />
                )}
              </button>
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-sky-700 mb-1">
              Nomor Telepon
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-sky-400" />
              </div>
              <Field
                type="text"
                name="phone"
                className="block w-full pl-10 pr-3 py-3 border border-sky-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 outline-none"
                placeholder="Masukkan nomor telepon"
              />
              <ErrorMessage
                name="phone"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-sky-600 text-white py-3 rounded-xl hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                Memverifikasi...
              </>
            ) : (
              "Verifikasi Akun"
            )}
          </button>
        </Form>
      )}
    </Formik>
  );
}
