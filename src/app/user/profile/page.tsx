"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FiEdit2 } from "react-icons/fi";
import { userAPI } from "@/services/user";
import { UserProfile } from "@/types/user";
import { formatDate } from "@/helpers/format";
import withAuthGuard from "@/hoc/withAuthGuard";

function UserProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userAPI.getProfile();
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
    router.push("/user/profile/edit");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm sm:text-base">
            {error}
          </div>
          <button
            onClick={() => router.back()}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm sm:text-base"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4 text-sm sm:text-base">
            Tidak ada data profil
          </div>
          <button
            onClick={() => router.back()}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm sm:text-base"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">Profil Pelamar</h1>
          <button
            onClick={handleEditProfile}
            className="w-full sm:w-auto px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <FiEdit2 className="text-sm sm:text-base" />
            Edit Profil
          </button>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
          {/* Header with avatar and basic info */}
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 sm:gap-6">
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-gray-300 flex-shrink-0">
                {profile.avatar ? (
                  <Image
                    src={profile.avatar}
                    alt={`${profile.name} avatar`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <span className="text-gray-400 text-sm sm:text-base">
                      No Avatar
                    </span>
                  </div>
                )}
              </div>

              <div className="flex-1 text-center md:text-left">
                <h2 className="text-xl sm:text-2xl font-bold">
                  {profile.name}
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  {profile.email}
                </p>

                {profile.phone && (
                  <div className="mt-2 flex items-center justify-center md:justify-start">
                    <span className="text-sm sm:text-base text-gray-500">
                      {profile.phone}
                    </span>
                  </div>
                )}

                <div className="mt-2 flex flex-wrap gap-2 justify-center md:justify-start">
                  {profile.isVerified && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm">
                      Verified
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* User details */}
          <div className="p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
              Tentang
            </h3>
            {profile.bio ? (
              <div
                className="text-sm sm:text-base text-gray-700"
                dangerouslySetInnerHTML={{ __html: profile.bio }}
              />
            ) : (
              <p className="text-sm sm:text-base text-gray-500 italic">
                Tidak ada bio yang diberikan
              </p>
            )}

            <div className="mt-4 sm:mt-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                Skills
              </h3>
              {profile.skills && profile.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs sm:text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm sm:text-base text-gray-500 italic">
                  Tidak ada skills yang diberikan
                </p>
              )}
            </div>
          </div>

          {/* Experience Section */}
          <div className="p-4 sm:p-6 border-t border-gray-200">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
              Pengalaman Kerja
            </h3>
            {profile.experience && profile.experience.length > 0 ? (
              <div className="space-y-4">
                {profile.experience.map((exp, index) => (
                  <div key={index} className="border-l-4 border-sky-500 pl-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                      <div>
                        <h4 className="font-semibold text-base sm:text-lg">
                          {exp.title}
                        </h4>
                        <p className="text-sm sm:text-base text-gray-700">
                          {exp.company}
                        </p>
                        {exp.location && (
                          <p className="text-xs sm:text-sm text-gray-500">
                            {exp.location}
                          </p>
                        )}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500">
                        {new Date(exp.startDate).toLocaleDateString(undefined, {
                          month: "short",
                          year: "numeric",
                        })}
                        {" - "}
                        {exp.current
                          ? "Present"
                          : exp.endDate
                          ? new Date(exp.endDate).toLocaleDateString(
                              undefined,
                              {
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : ""}
                      </div>
                    </div>
                    {exp.description && (
                      <div
                        className="mt-2 text-sm sm:text-base text-gray-600"
                        dangerouslySetInnerHTML={{ __html: exp.description }}
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm sm:text-base text-gray-500 italic">
                Tidak ada pengalaman kerja yang diberikan
              </p>
            )}
          </div>

          {/* Education Section */}
          <div className="p-4 sm:p-6 border-t border-gray-200">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
              Pendidikan
            </h3>
            {profile.education && profile.education.length > 0 ? (
              <div className="space-y-4">
                {profile.education.map((edu, index) => (
                  <div key={index} className="border-l-4 border-sky-500 pl-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                      <div>
                        <h4 className="font-semibold text-base sm:text-lg">
                          {edu.school}
                        </h4>
                        <p className="text-sm sm:text-base text-gray-700">
                          {edu.degree}{" "}
                          {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                        </p>
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500">
                        {new Date(edu.startDate).toLocaleDateString(undefined, {
                          month: "short",
                          year: "numeric",
                        })}
                        {" - "}
                        {edu.current
                          ? "Present"
                          : edu.endDate
                          ? new Date(edu.endDate).toLocaleDateString(
                              undefined,
                              {
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : ""}
                      </div>
                    </div>
                    {edu.description && (
                      <div
                        className="mt-2 text-sm sm:text-base text-gray-600"
                        dangerouslySetInnerHTML={{ __html: edu.description }}
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm sm:text-base text-gray-500 italic">
                Tidak ada pendidikan yang diberikan
              </p>
            )}
          </div>

          {/* Footer with timestamps */}
          <div className="bg-gray-50 p-3 sm:p-4 text-xs sm:text-sm text-gray-500">
            <div className="flex flex-col md:flex-row justify-between">
              <div>Terakhir diperbarui: {formatDate(profile.updatedAt)}</div>
            </div>
          </div>
        </div>

        {/* Profile Completion Alert */}
        {(!profile.bio ||
          !profile.phone ||
          !profile.skills ||
          profile.skills.length === 0) && (
          <div className="mt-4 sm:mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-amber-800 mb-2">
              Profil belum lengkap
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default withAuthGuard(UserProfilePage, { requiredRole: "user" });
