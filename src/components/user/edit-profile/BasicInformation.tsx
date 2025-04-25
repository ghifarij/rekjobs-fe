import React, { useState } from "react";
import { Field, ErrorMessage, FormikHelpers } from "formik";
import RichTextEditor from "@/components/rich-text-editor/RichTextEditor";
import Image from "next/image";
import { FiUpload, FiX } from "react-icons/fi";

export interface BasicInformationFormValues {
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  skills: string[];
  avatar?: string;
}

export interface BasicInformationProps {
  values: BasicInformationFormValues;
  setFieldValue: FormikHelpers<BasicInformationFormValues>["setFieldValue"];
}

const BasicInformation: React.FC<BasicInformationProps> = ({
  values,
  setFieldValue,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    values.avatar || null
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/svg+xml",
    ];
    if (!validTypes.includes(file.type)) {
      setError(
        "Silahkan unggah file gambar yang valid (JPG, JPEG, PNG, atau SVG)"
      );
      return;
    }

    // Validate file size (1MB)
    if (file.size > 1024 * 1024) {
      setError("Ukuran file harus kurang dari 1MB");
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
        // Update form value with base64 string
        setFieldValue("avatar", reader.result as string);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setError("Gagal memproses foto. Silahkan coba lagi.");
      setPreviewUrl(values.avatar || null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setPreviewUrl(values.avatar || null);
    setFieldValue("avatar", values.avatar || "");
    setError(null);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Informasi Dasar</h2>

      <div className="flex flex-col items-center space-y-4 mb-6">
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="Profile Photo"
              fill
              className="object-cover"
              sizes="128px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <span className="text-gray-400 text-sm">No Photo</span>
            </div>
          )}
          {isUploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <label className="cursor-pointer bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-md flex items-center w-full sm:w-auto justify-center">
            <FiUpload className="mr-2" />
            <span>Upload Photo</span>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.svg"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {previewUrl && previewUrl !== values.avatar && (
            <button
              type="button"
              onClick={handleReset}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md flex items-center w-full sm:w-auto justify-center"
            >
              <FiX className="mr-2" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <p className="text-xs text-gray-500 text-center">
          Rekomendasi: photo 4x3. Max file size: 1MB
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nama Lengkap *
          </label>
          <Field
            type="text"
            name="name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <ErrorMessage
            name="name"
            component="div"
            className="text-red-500 text-sm mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={values.email || ""}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
          />
          <p className="text-xs text-gray-500 mt-1">Email tidak dapat diubah</p>
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nomor Telepon
        </label>
        <Field
          type="tel"
          name="phone"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
          placeholder="+62 812 3456 7890"
        />
        <ErrorMessage
          name="phone"
          component="div"
          className="text-red-500 text-sm mt-1"
        />
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Bio
        </label>
        <RichTextEditor
          value={values.bio}
          onChange={(html) => setFieldValue("bio", html)}
          placeholder="Tell us about yourself..."
        />
        <ErrorMessage
          name="bio"
          component="div"
          className="text-red-500 text-sm mt-1"
        />
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Skills
        </label>
        <div className="relative">
          <Field
            type="text"
            name="skills"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="JavaScript, React, Node.js"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Ketik skill dan pisahkan dengan koma (contoh: JavaScript, React,
          Node.js)
        </p>
        <ErrorMessage
          name="skills"
          component="div"
          className="text-red-500 text-sm mt-1"
        />
      </div>
    </div>
  );
};

export default BasicInformation;
