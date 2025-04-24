"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FiEdit2 } from "react-icons/fi";
import { companyAPI } from "@/services/company";
import { CompanyProfile } from "@/types/company";
import Loading from "@/app/loading";
import { formatDate } from "@/helpers/format";
import withAuthGuard from "@/hoc/withAuthGuard";

function CompanyProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Company size mapping
  const companySizeLabels: Record<string, string> = {
    MICRO: "UMKM",
    SMALL: "Startup",
    MEDIUM: "Perusahaan Menengah (SME)",
    LARGE: "Korporasi / Perusahaan Besar",
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await companyAPI.getProfile();
        setProfile(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || "Failed to load profile");
        } else {
          setError("Failed to load profile");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEditProfile = () => {
    router.push("/company/profile/edit");
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            Tidak ada data profil
          </div>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">Profil Perusahaan</h1>
          <button
            onClick={handleEditProfile}
            className="w-full sm:w-auto px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 flex items-center justify-center"
          >
            <FiEdit2 className="mr-2" />
            Edit Profil
          </button>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
          {/* Header with logo and basic info */}
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col items-center sm:items-start gap-4 sm:gap-6 sm:flex-row">
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-gray-300 flex-shrink-0">
                {profile.logo ? (
                  <Image
                    src={profile.logo}
                    alt={`${profile.name} logo`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 96px, 128px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <span className="text-gray-400 text-sm">No Logo</span>
                  </div>
                )}
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-xl sm:text-2xl font-bold">
                  {profile.name}
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  {profile.email}
                </p>

                {profile.location && (
                  <div className="mt-2 flex items-center justify-center sm:justify-start">
                    <span className="text-gray-500 text-sm sm:text-base">
                      {profile.location}
                    </span>
                  </div>
                )}

                <div className="mt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
                  {profile.industry && (
                    <span className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs sm:text-sm">
                      {profile.industry}
                    </span>
                  )}

                  {profile.size && (
                    <span className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs sm:text-sm">
                      {companySizeLabels[profile.size] || profile.size}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Company details */}
          <div className="p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
              Tentang
            </h3>
            {profile.description ? (
              <p className="text-gray-700 whitespace-pre-line text-sm sm:text-base">
                {profile.description}
              </p>
            ) : (
              <p className="text-gray-500 italic text-sm sm:text-base">
                Tidak ada deskripsi yang diberikan
              </p>
            )}

            <div className="mt-4 sm:mt-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Website</h3>
              {profile.website ? (
                <a
                  href={
                    profile.website.startsWith("http")
                      ? profile.website
                      : `https://${profile.website}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-500 hover:underline text-sm sm:text-base"
                >
                  {profile.website}
                </a>
              ) : (
                <p className="text-gray-500 italic text-sm sm:text-base">
                  Belum ada website untuk perusahaan
                </p>
              )}
            </div>
          </div>

          {/* Footer with timestamps */}
          <div className="bg-gray-50 p-3 sm:p-4 text-xs sm:text-sm text-gray-500">
            <div className="flex flex-col sm:flex-row justify-between">
              <div>Terakhir diperbarui: {formatDate(profile.updatedAt)}</div>
            </div>
          </div>
        </div>

        {/* Profile Completion Alert */}
        {(!profile.description ||
          !profile.location ||
          !profile.industry ||
          !profile.size) && (
          <div className="mt-4 sm:mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-amber-800 mb-2">
              Lengkapi Profil Perusahaan
            </h3>

            <div className="space-y-2 mb-4">
              {!profile.description && (
                <div className="flex items-start">
                  <span className="text-amber-500 mr-2">•</span>
                  <span className="text-amber-700 text-sm sm:text-base">
                    Tambahkan deskripsi perusahaan untuk memberikan informasi
                    kepada kandidat
                  </span>
                </div>
              )}
              {!profile.location && (
                <div className="flex items-start">
                  <span className="text-amber-500 mr-2">•</span>
                  <span className="text-amber-700 text-sm sm:text-base">
                    Tambahkan lokasi perusahaan
                  </span>
                </div>
              )}
              {!profile.industry && (
                <div className="flex items-start">
                  <span className="text-amber-500 mr-2">•</span>
                  <span className="text-amber-700 text-sm sm:text-base">
                    Pilih industri perusahaan
                  </span>
                </div>
              )}
              {!profile.size && (
                <div className="flex items-start">
                  <span className="text-amber-500 mr-2">•</span>
                  <span className="text-amber-700 text-sm sm:text-base">
                    Pilih ukuran perusahaan
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default withAuthGuard(CompanyProfilePage, { requiredRole: "company" });
