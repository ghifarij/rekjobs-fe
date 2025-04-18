"use client";

import { CheckCircle } from "lucide-react";
import VerifyCompanyForm from "@/components/sub/company-login/VerifyCompanyForm";

export default function VerifyCompanyPage({
  params,
}: {
  params: { token: string };
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-sky-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 right-0 h-64 overflow-hidden">
        <div className="absolute inset-0 bg-sky-600 opacity-5">
          <svg className="absolute bottom-0" viewBox="0 0 1440 320">
            <path
              fill="currentColor"
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
            ></path>
          </svg>
        </div>
      </div>

      <div className="max-w-md mx-auto relative">
        {/* Verification Progress */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sky-100 mb-4">
            <CheckCircle className="w-8 h-8 text-sky-600" />
          </div>
          <h2 className="text-3xl font-bold text-sky-900">
            Verifikasi Akun Perusahaan
          </h2>
          <p className="mt-2 text-sky-600">
            Lengkapi profil perusahaan Anda untuk mengaktifkan akun
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-sky-100">
          <VerifyCompanyForm token={params.token} />
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
