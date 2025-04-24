import * as Yup from "yup";
import { JobType, ExperienceLevel } from "@/types/job";

export interface JobFormValues {
  title: string;
  description: string;
  location: string;
  requirements: string;
  salary: string;
  jobType: JobType;
  experience: ExperienceLevel;
  deadline: string;
}

export const jobValidationSchema = Yup.object().shape({
  title: Yup.string().required("Judul pekerjaan harus diisi"),
  description: Yup.string().required("Deskripsi pekerjaan harus diisi"),
  location: Yup.string()
    .required("Lokasi harus diisi")
    .max(32, "Lokasi harus kurang dari 32 karakter"),
  requirements: Yup.string().required("Persyaratan pekerjaan harus diisi"),
  salary: Yup.string(),
  jobType: Yup.mixed<JobType>()
    .oneOf(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "REMOTE"])
    .required("Jenis pekerjaan harus diisi"),
  experience: Yup.mixed<ExperienceLevel>()
    .oneOf(["ENTRY", "MID", "SENIOR", "EXPERT"])
    .required("Level pengalaman harus diisi"),
  deadline: Yup.string().required("Deadline harus diisi"),
});
