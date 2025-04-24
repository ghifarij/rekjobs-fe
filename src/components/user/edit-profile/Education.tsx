import React from "react";
import { Field, FieldArray, ErrorMessage, FormikHelpers } from "formik";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { format } from "date-fns";
import RichTextEditor from "@/components/rich-text-editor/RichTextEditor";

export interface EducationItem {
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  description: string | null;
}

export interface EducationFormValues {
  education: EducationItem[];
}

export interface EducationProps {
  values: EducationFormValues;
  setFieldValue: FormikHelpers<EducationFormValues>["setFieldValue"];
}

const Education: React.FC<EducationProps> = ({ values, setFieldValue }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Pendidikan</h2>
      </div>

      <FieldArray name="education">
        {({ push, remove }) => (
          <div className="space-y-6">
            {values.education.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                Tidak ada pendidikan yang ditambahkan
              </p>
            ) : (
              values.education.map((edu: EducationItem, index: number) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-md p-4 relative"
                >
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-600"
                  >
                    <FiTrash2 />
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sekolah/Universitas *
                      </label>
                      <Field
                        type="text"
                        name={`education.${index}.school`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                      <ErrorMessage
                        name={`education.${index}.school`}
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gelar *
                      </label>
                      <Field
                        type="text"
                        name={`education.${index}.degree`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                      <ErrorMessage
                        name={`education.${index}.degree`}
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bidang Studi *
                      </label>
                      <Field
                        type="text"
                        name={`education.${index}.fieldOfStudy`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                      <ErrorMessage
                        name={`education.${index}.fieldOfStudy`}
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tanggal Mulai *
                      </label>
                      <Field
                        type="date"
                        name={`education.${index}.startDate`}
                        value={format(
                          new Date(values.education[index].startDate),
                          "yyyy-MM-dd"
                        )}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setFieldValue(
                            `education.${index}.startDate`,
                            new Date(e.target.value)
                          );
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                      <ErrorMessage
                        name={`education.${index}.startDate`}
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center mb-2">
                      <Field
                        type="checkbox"
                        id={`edu-current-${index}`}
                        name={`education.${index}.current`}
                        className="h-4 w-4 text-sky-500 focus:ring-sky-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`edu-current-${index}`}
                        className="ml-2 block text-sm text-gray-700"
                      >
                        Saya sedang belajar di sini
                      </label>
                    </div>

                    {!values.education[index].current && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tanggal Berakhir *
                        </label>
                        <Field
                          type="date"
                          name={`education.${index}.endDate`}
                          value={
                            values.education[index].endDate
                              ? format(
                                  new Date(values.education[index].endDate),
                                  "yyyy-MM-dd"
                                )
                              : ""
                          }
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            setFieldValue(
                              `education.${index}.endDate`,
                              new Date(e.target.value)
                            );
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                        <ErrorMessage
                          name={`education.${index}.endDate`}
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Deskripsi
                    </label>
                    <RichTextEditor
                      value={values.education[index].description}
                      onChange={(html) =>
                        setFieldValue(`education.${index}.description`, html)
                      }
                      placeholder="Deskripsi pencapaian Anda…"
                    />
                    <ErrorMessage
                      name={`education.${index}.description`}
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                </div>
              ))
            )}

            <button
              type="button"
              onClick={() =>
                push({
                  school: "",
                  degree: "",
                  fieldOfStudy: "",
                  startDate: new Date(),
                  endDate: undefined,
                  current: false,
                  description: null,
                })
              }
              className="flex items-center text-sky-500 hover:text-sky-600"
            >
              <FiPlus className="mr-1" /> Tambahkan Pendidikan
            </button>
          </div>
        )}
      </FieldArray>
    </div>
  );
};

export default Education;
