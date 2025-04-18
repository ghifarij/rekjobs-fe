import * as Yup from "yup";

export interface JobFormValues {
  title: string;
  description: string;
  location: string;
  requirements: string;
  salary?: string;
  jobType: string;
  experience?: string;
  deadline: string;
}

export const validationSchema = Yup.object().shape({
  title: Yup.string().required("Job title is required"),
  description: Yup.string().required("Description is required"),
  location: Yup.string().required("Location is required"),
  requirements: Yup.string().required("Requirements are required"),
  salary: Yup.string().optional(),
  jobType: Yup.string().required("Job type is required"),
  experience: Yup.string().optional(),
  deadline: Yup.date().required("Deadline is required").nullable(),
});
