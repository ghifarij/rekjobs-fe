import React from "react";
import { Field, FieldArray, ErrorMessage, FormikHelpers } from "formik";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { format } from "date-fns";
import RichTextEditor from "@/components/rich-text-editor/RichTextEditor";

export interface WorkExperienceItem {
  title: string;
  company: string;
  location: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  description: string | null;
}

export interface WorkExperienceFormValues {
  experience: WorkExperienceItem[];
}

export interface WorkExperienceProps {
  values: WorkExperienceFormValues;
  setFieldValue: FormikHelpers<WorkExperienceFormValues>["setFieldValue"];
}

const WorkExperience: React.FC<WorkExperienceProps> = ({
  values,
  setFieldValue,
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Pengalaman Kerja</h2>
      </div>

      <FieldArray name="experience">
        {({ push, remove }) => (
          <div className="space-y-6">
            {values.experience.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                Tidak ada pengalaman kerja yang ditambahkan
              </p>
            ) : (
              values.experience.map(
                (exp: WorkExperienceItem, index: number) => (
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
                          Jabatan *
                        </label>
                        <Field
                          type="text"
                          name={`experience.${index}.title`}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                        <ErrorMessage
                          name={`experience.${index}.title`}
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Perusahaan *
                        </label>
                        <Field
                          type="text"
                          name={`experience.${index}.company`}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                        <ErrorMessage
                          name={`experience.${index}.company`}
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Lokasi
                        </label>
                        <Field
                          type="text"
                          name={`experience.${index}.location`}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                        <ErrorMessage
                          name={`experience.${index}.location`}
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
                          name={`experience.${index}.startDate`}
                          value={format(
                            new Date(values.experience[index].startDate),
                            "yyyy-MM-dd"
                          )}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            setFieldValue(
                              `experience.${index}.startDate`,
                              new Date(e.target.value)
                            );
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                        <ErrorMessage
                          name={`experience.${index}.startDate`}
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center mb-2">
                        <Field
                          type="checkbox"
                          id={`current-${index}`}
                          name={`experience.${index}.current`}
                          className="h-4 w-4 text-sky-500 focus:ring-sky-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor={`current-${index}`}
                          className="ml-2 block text-sm text-gray-700"
                        >
                          Saya bekerja di sini
                        </label>
                      </div>

                      {!values.experience[index].current && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tanggal Berakhir *
                          </label>
                          <Field
                            type="date"
                            name={`experience.${index}.endDate`}
                            value={
                              values.experience[index].endDate
                                ? format(
                                    new Date(values.experience[index].endDate),
                                    "yyyy-MM-dd"
                                  )
                                : ""
                            }
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              setFieldValue(
                                `experience.${index}.endDate`,
                                new Date(e.target.value)
                              );
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                          />
                          <ErrorMessage
                            name={`experience.${index}.endDate`}
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
                        value={values.experience[index].description}
                        onChange={(html) =>
                          setFieldValue(`experience.${index}.description`, html)
                        }
                        placeholder="Deskripsi tanggung jawab Anda…"
                      />
                      <ErrorMessage
                        name={`experience.${index}.description`}
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                  </div>
                )
              )
            )}

            <button
              type="button"
              onClick={() =>
                push({
                  title: "",
                  company: "",
                  location: "",
                  startDate: new Date(),
                  endDate: undefined,
                  current: false,
                  description: null,
                })
              }
              className="flex items-center text-sky-500 hover:text-sky-600"
            >
              <FiPlus className="mr-1" /> Tambahkan Pengalaman Kerja
            </button>
          </div>
        )}
      </FieldArray>
    </div>
  );
};

export default WorkExperience;
