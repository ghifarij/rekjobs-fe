"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FiUpload, FiSave, FiX } from "react-icons/fi";
import { companyAPI } from "@/services/company";
import { CompanyProfile } from "@/types/company";
import Loading from "@/app/loading";
import withAuthGuard from "@/hoc/withAuthGuard";

interface UpdateProfileData {
  name: string;
  description: string;
  website?: string;
  location: string;
  industry: string;
  size: string;
  logo?: string;
}

function EditCompanyProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [noWebsite, setNoWebsite] = useState<boolean>(false);

  // Company size options
  const companySizes = [
    { value: "MICRO", label: "UMKM" },
    { value: "SMALL", label: "Startup" },
    { value: "MEDIUM", label: "Perusahaan Menengah (SME)" },
    { value: "LARGE", label: "Korporasi / Perusahaan Besar" },
  ];

  // Industry options
  const industries = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Manufacturing",
    "Retail",
    "Real Estate",
    "Construction",
    "Transportation",
    "Other",
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await companyAPI.getProfile();
        setProfile(data);
        if (data.logo) {
          setLogoPreview(data.logo);
        }
        // Check if website is empty or null to set noWebsite state
        setNoWebsite(!data.website);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNoWebsiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setNoWebsite(checked);

    // If checked, clear the website field
    if (checked && profile) {
      setProfile({
        ...profile,
        website: null,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // Convert logo to base64 if a new file was selected
      const updateData: UpdateProfileData = {
        name: profile.name || "",
        description: profile.description || "",
        website: noWebsite ? undefined : profile.website || undefined,
        location: profile.location || "",
        industry: profile.industry || "",
        size: profile.size || "",
      };

      if (logoFile) {
        const reader = new FileReader();
        reader.readAsDataURL(logoFile);
        reader.onloadend = async () => {
          const base64String = reader.result as string;
          const dataWithLogo = { ...updateData, logo: base64String };

          // Update profile with logo
          await companyAPI.updateProfile(dataWithLogo);
          setSuccess("Profile updated successfully!");
          setSaving(false);

          // Redirect back to profile page after a short delay
          setTimeout(() => {
            router.push("/company/profile");
          }, 1500);
        };
      } else {
        // Update profile without logo
        await companyAPI.updateProfile(updateData);
        setSuccess("Profile updated successfully!");
        setSaving(false);

        // Redirect back to profile page after a short delay
        setTimeout(() => {
          router.push("/company/profile");
        }, 1500);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
          Edit Company Profile
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
              Basic Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={profile?.name || ""}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={profile?.email || ""}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm sm:text-base"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Email cannot be changed
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
              Company Details
            </h2>

            <div className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Description *
                </label>
                <textarea
                  name="description"
                  value={profile?.description || ""}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm sm:text-base"
                  placeholder="Tell us about your company..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <div className="space-y-3">
                  <input
                    type="url"
                    name="website"
                    value={profile?.website || ""}
                    onChange={handleInputChange}
                    disabled={noWebsite}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm sm:text-base ${
                      noWebsite ? "bg-gray-100" : ""
                    }`}
                    placeholder="https://example.com"
                  />

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="noWebsite"
                      checked={noWebsite}
                      onChange={handleNoWebsiteChange}
                      className="h-4 w-4 text-sky-500 focus:ring-sky-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="noWebsite"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Belum ada website untuk perusahaan
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={profile?.location || ""}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm sm:text-base"
                  placeholder="City, Country"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Industry *
                  </label>
                  <select
                    name="industry"
                    value={profile?.industry || ""}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm sm:text-base"
                  >
                    <option value="">Select Industry</option>
                    {industries.map((industry) => (
                      <option key={industry} value={industry}>
                        {industry}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Size *
                  </label>
                  <select
                    name="size"
                    value={profile?.size || ""}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm sm:text-base"
                  >
                    <option value="">Select Size</option>
                    {companySizes.map((size) => (
                      <option key={size.value} value={size.value}>
                        {size.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
              Company Logo
            </h2>

            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-gray-300">
                {logoPreview ? (
                  <Image
                    src={logoPreview}
                    alt="Company Logo"
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

              <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <label className="cursor-pointer bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-md flex items-center w-full sm:w-auto justify-center">
                  <FiUpload className="mr-2" />
                  <span>Upload Logo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                </label>

                {logoPreview && (
                  <button
                    type="button"
                    onClick={() => {
                      setLogoFile(null);
                      setLogoPreview(profile?.logo || null);
                    }}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md flex items-center w-full sm:w-auto justify-center"
                  >
                    <FiX className="mr-2" />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              <p className="text-xs text-gray-500 text-center">
                Recommended: Square image, at least 200x200 pixels
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              type="button"
              onClick={() => router.push("/company/profile")}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 w-full sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 flex items-center justify-center w-full sm:w-auto"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <FiSave className="mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default withAuthGuard(EditCompanyProfilePage, {
  requiredRole: "company",
});
