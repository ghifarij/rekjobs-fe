"use client";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Mail } from "lucide-react";
import SocialLoginCompany from "@/components/register/SocialLoginCompany";

const emailSchema = Yup.object().shape({
  email: Yup.string()
    .email("Email tidak valid")
    .required("Email harus diisi")
    .matches(
      /@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com|company\.com)$/,
      "Email harus menggunakan domain yang valid"
    ),
});

interface RegistrationFormProps {
  onSubmit: (values: { email: string }) => Promise<void>;
  isLoading: boolean;
}

const RegistrationForm = ({ onSubmit, isLoading }: RegistrationFormProps) => {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-sky-100">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-sky-900 mb-6">
          Mulai Perjalanan Anda
        </h2>

        <Formik
          initialValues={{ email: "" }}
          validationSchema={emailSchema}
          onSubmit={onSubmit}
        >
          {({ errors, touched }) => (
            <Form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-sky-700 mb-1">
                  Email Perusahaan
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-sky-400" />
                  </div>
                  <Field
                    type="email"
                    name="email"
                    className="block w-full pl-10 pr-3 py-3 border border-sky-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 outline-none"
                    placeholder="Masukkan email perusahaan"
                  />
                </div>
                {touched.email && errors.email && (
                  <div className="text-sm text-red-500 mt-1">
                    {errors.email}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-sky-600 to-sky-400 py-3 rounded-lg text-white font-bold hover:opacity-90 transition-transform transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? "Loading..." : "Daftar"}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-400">Atau</span>
                </div>
              </div>

              <SocialLoginCompany />
            </Form>
          )}
        </Formik>

        <div className="mt-8 text-center">
          <p className="text-center text-sm ">
            Dengan membuat akun, Anda menyetujui{" "}
            <span className="font-medium text-sky-500 hover:text-sky-700">
              Ketentuan Layanan
            </span>{" "}
            dan{" "}
            <span className="font-medium text-sky-500 hover:text-sky-700">
              Kebijakan Privasi
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
