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

// User Profile Validation Schema
export interface UserProfileFormValues {
  name: string;
  phone?: string;
  bio: string | null;
  skills: string[];
  experience: {
    title: string;
    company: string;
    location?: string;
    startDate: Date;
    endDate?: Date;
    current: boolean;
    description: string | null;
  }[];
  education: {
    school: string;
    degree: string;
    fieldOfStudy: string;
    startDate: Date;
    endDate?: Date;
    current: boolean;
    description: string | null;
  }[];
}

export const userProfileValidationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  phone: Yup.string().optional(),
  bio: Yup.string().nullable(),
  skills: Yup.array().of(Yup.string()).optional(),
  experience: Yup.array()
    .of(
      Yup.object().shape({
        title: Yup.string().required("Job title is required"),
        company: Yup.string().required("Company name is required"),
        location: Yup.string().optional(),
        startDate: Yup.date().required("Start date is required"),
        endDate: Yup.date().when("current", {
          is: (val: boolean) => val === false,
          then: () =>
            Yup.date().required(
              "End date is required when not currently working"
            ),
          otherwise: () => Yup.date().optional(),
        }),
        current: Yup.boolean().default(false),
        description: Yup.string().nullable(),
      })
    )
    .optional(),
  education: Yup.array()
    .of(
      Yup.object().shape({
        school: Yup.string().required("School name is required"),
        degree: Yup.string().required("Degree is required"),
        fieldOfStudy: Yup.string().required("Field of study is required"),
        startDate: Yup.date().required("Start date is required"),
        endDate: Yup.date().when("current", {
          is: (val: boolean) => val === false,
          then: () =>
            Yup.date().required(
              "End date is required when not currently studying"
            ),
          otherwise: () => Yup.date().optional(),
        }),
        current: Yup.boolean().default(false),
        description: Yup.string().nullable(),
      })
    )
    .optional(),
});

// Validation schema
export const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Email tidak valid").required("Email harus diisi"),
  password: Yup.string()
    .min(6, "Password minimal 6 karakter")
    .required("Password harus diisi"),
});

// Form values type
export interface LoginFormValues {
  email: string;
  password: string;
}
