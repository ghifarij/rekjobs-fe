import React from "react";
import { Field, ErrorMessage, FormikHelpers } from "formik";
import RichTextEditor from "@/components/rich-text-editor/RichTextEditor";

export interface BasicInformationFormValues {
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  skills: string[];
}

export interface BasicInformationProps {
  values: BasicInformationFormValues;
  setFieldValue: FormikHelpers<BasicInformationFormValues>["setFieldValue"];
}

const BasicInformation: React.FC<BasicInformationProps> = ({
  values,
  setFieldValue,
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Informasi Dasar</h2>

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
        <Field
          type="text"
          name="skills"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
          placeholder="JavaScript, React, Node.js"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const skillsArray = e.target.value
              .split(",")
              .map((skill) => skill.trim())
              .filter((skill) => skill !== "");
            setFieldValue("skills", skillsArray);
          }}
          value={values.skills.join(", ")}
        />
        <p className="text-xs text-gray-500 mt-1">
          Pisahkan skills dengan koma
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
