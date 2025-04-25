"use client";

import React from "react";
import { Formik, Form } from "formik";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { userProfileValidationSchema } from "@/libs/validationSchema";
import BasicInformation from "@/components/user/edit-profile/BasicInformation";
import { BasicInformationFormValues } from "@/components/user/edit-profile/BasicInformation";
import WorkExperience, {
  WorkExperienceFormValues,
} from "@/components/user/edit-profile/WorkExperience";
import Education, {
  EducationFormValues,
} from "@/components/user/edit-profile/Education";
import { UserProfile, UserProfileUpdate } from "@/types/user";
import { userAPI } from "@/services/user";
import withAuthGuard from "@/hoc/withAuthGuard";

function EditProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    userAPI
      .getProfile()
      .then((data) => setProfile(data))
      .catch((err) => {
        console.error(err);
        Swal.fire("Error", "Failed to load profile", "error");
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-t-2 border-sky-500 rounded-full" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-sm sm:text-base">
          Gagal memuat profil. Silakan coba lagi nanti.
        </p>
      </div>
    );
  }

  // prepare initial values
  const initialValues: UserProfileUpdate = {
    name: profile.name,
    email: profile.email,
    phone: profile.phone || "",
    bio: profile.bio || "",
    skills: profile.skills,
    avatar: profile.avatar || "",
    experience: profile.experience.map((e) => ({
      id: e.id,
      title: e.title,
      company: e.company,
      location: e.location || "",
      startDate: new Date(e.startDate),
      endDate: e.endDate ? new Date(e.endDate) : undefined,
      current: e.current,
      description: e.description || "",
    })),
    education: profile.education.map((e) => ({
      id: e.id,
      school: e.school,
      degree: e.degree,
      fieldOfStudy: e.fieldOfStudy,
      startDate: new Date(e.startDate),
      endDate: e.endDate ? new Date(e.endDate) : undefined,
      current: e.current,
      description: e.description || "",
    })),
  };

  const handleSubmit = async (
    values: UserProfileUpdate,
    { setSubmitting }: { setSubmitting: (b: boolean) => void }
  ) => {
    setSubmitting(true);
    try {
      // Convert skills string to array if it's a string
      const updateData = {
        ...values,
        skills: Array.isArray(values.skills)
          ? values.skills
          : (values.skills || "")
              .split(",")
              .map((s: string) => s.trim())
              .filter((s: string) => s !== ""),
      };

      // call the service instead of raw fetch
      await userAPI.updateProfile(updateData);

      // await the alert so you see it
      await Swal.fire({
        icon: "success",
        title: "Profil diperbarui!",
        text: "Perubahan Anda telah disimpan.",
        showConfirmButton: false,
        timer: 1500,
      });

      router.push("/user/profile");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Gagal memperbarui profil", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
          Edit Profil
        </h1>
        <Formik
          initialValues={initialValues}
          validationSchema={userProfileValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form className="space-y-4 sm:space-y-6">
              <BasicInformation
                values={values as BasicInformationFormValues}
                setFieldValue={setFieldValue}
              />
              <WorkExperience
                values={values as WorkExperienceFormValues}
                setFieldValue={setFieldValue}
              />
              <Education
                values={values as EducationFormValues}
                setFieldValue={setFieldValue}
              />

              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button
                  type="button"
                  onClick={() => router.push("/user/profile")}
                  className="w-full sm:w-auto px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100 text-sm sm:text-base"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 disabled:opacity-50 text-sm sm:text-base"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default withAuthGuard(EditProfilePage, { requiredRole: "user" });
