"use client";

import { CheckCircle } from "lucide-react";
import VerifyCompanyForm from "@/components/company-login/VerifyCompanyForm";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { authCompanyAPI } from "@/services/authCompany";

export default function VerifyCompanyPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const { token } = use(params);

  useEffect(() => {
    const checkVerificationStatus = async () => {
      if (!token) {
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
        const result = await authCompanyAPI.checkVerificationStatus(token);

        if (result.isVerified) {
          Swal.fire({
            title: "Akun Sudah Terverifikasi",
            text: "Akun perusahaan Anda sudah terverifikasi sebelumnya. Anda akan diarahkan ke halaman utama.",
            icon: "info",
            confirmButtonColor: "#0ea5e9",
          }).then(() => {
            router.push("/company/dashboard");
          });
        }
      } catch (error) {
        console.error("Error checking verification status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkVerificationStatus();
  }, [token, router]);

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
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-sky-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto relative">
        {/* Verification Progress */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-sky-900">
            Verifikasi Akun Perusahaan
          </h2>
          <p className="mt-2 text-sky-600">
            Lengkapi profil perusahaan Anda untuk mengaktifkan akun
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-sky-100">
          <VerifyCompanyForm token={token} />
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center text-sm text-sky-500">
          <p className="flex items-center justify-center">
            <CheckCircle className="h-4 w-4 mr-1" />
            Informasi Anda dienkripsi dengan aman
          </p>
        </div>
      </div>
    </div>
  );
}
