"use client";

import { useRouter } from "next/navigation";
import { FaLock } from "react-icons/fa";

export default function NotAuthorized() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6">
      <div className="max-w-md w-full p-6 sm:p-8 bg-white rounded-lg shadow-md text-center">
        <div className="flex justify-center mb-4 sm:mb-6">
          <FaLock className="text-4xl sm:text-5xl text-gray-400" />
        </div>
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">
          Akses Ditolak
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
          Anda tidak memiliki akses ke halaman ini. Silakan pastikan Anda telah
          login dengan akun yang benar.
        </p>
        <button
          onClick={() => router.push("/")}
          className="w-full sm:w-auto px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700 transition-colors text-sm sm:text-base"
        >
          Kembali ke Beranda
        </button>
      </div>
    </div>
  );
}
