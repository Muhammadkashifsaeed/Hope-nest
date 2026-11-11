import { z } from "zod";

export const starterContactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(80, "Name must be 80 characters or fewer."),
  email: z.email("Please enter a valid email address."),
  message: z
    .string()
    .trim()
    .min(8, "Message must be at least 8 characters.")
    .max(500, "Message must be 500 characters or fewer."),
});

export type StarterContactValues = z.infer<typeof starterContactSchema>;

export const CONTACT_SUBJECT_OPTIONS = [
  "General Inquiry",
  "Partnership",
  "Volunteer",
  "Press",
] as const;

export type ContactSubject = (typeof CONTACT_SUBJECT_OPTIONS)[number];

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .max(100, "Name must be 100 characters or fewer."),
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .max(254, "Email address is too long.")
    .pipe(z.email("Please enter a valid email address.")),
  subject: z
    .string()
    .trim()
    .min(1, "Please select a subject.")
    .pipe(
      z.enum(CONTACT_SUBJECT_OPTIONS, {
        error: "Please select a subject.",
      }),
    ),
  message: z
    .string()
    .trim()
    .min(1, "Message is required.")
    .max(2000, "Message must be 2000 characters or fewer."),
});

export type ContactFormInput = z.input<typeof contactSchema>;
export type ContactFormValues = z.infer<typeof contactSchema>;

export const newsletterSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .max(254, "Email address is too long.")
    .pipe(z.email("Please enter a valid email address.")),
});

export type NewsletterFormValues = z.infer<typeof newsletterSchema>;

export const CREATE_EVENT_CATEGORY_OPTIONS = [
  "Cleanup",
  "Donation",
  "Plantation",
  "Other",
] as const;

export type CreateEventCategory = (typeof CREATE_EVENT_CATEGORY_OPTIONS)[number];

export const createEventSchema = z.object({
  title: z
    .string()
    .trim()
    .min(4, "Event title must be at least 4 characters.")
    .max(100, "Event title must be 100 characters or fewer."),
  category: z
    .string()
    .trim()
    .min(1, "Please select an event category.")
    .pipe(
      z.enum(CREATE_EVENT_CATEGORY_OPTIONS, {
        error: "Please select an event category.",
      }),
    ),
  date: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Please choose a valid event date."),
  time: z
    .string()
    .trim()
    .regex(/^\d{2}:\d{2}$/, "Please choose a valid start time."),
  duration: z
    .string()
    .trim()
    .min(2, "Please provide an estimated duration (e.g. 3 hours).")
    .max(40, "Duration must be 40 characters or fewer."),
  location: z
    .string()
    .trim()
    .min(3, "Venue or neighborhood name must be at least 3 characters.")
    .max(120, "Location must be 120 characters or fewer."),
  addressDetails: z
    .string()
    .trim()
    .min(4, "Please provide the meeting point or street address.")
    .max(160, "Address details must be 160 characters or fewer."),
  organizer: z
    .string()
    .trim()
    .min(2, "Organizer or group name must be at least 2 characters.")
    .max(80, "Organizer name must be 80 characters or fewer."),
  organizerEmail: z
    .string()
    .trim()
    .min(1, "Organizer email is required.")
    .max(254, "Email address is too long.")
    .pipe(z.email("Please enter a valid organizer email address.")),
  spotsAvailable: z.coerce
    .number()
    .int("Volunteer capacity must be a whole number.")
    .min(1, "At least 1 volunteer spot is required.")
    .max(500, "Maximum volunteer capacity is 500."),
  description: z
    .string()
    .trim()
    .min(15, "Summary must be at least 15 characters.")
    .max(300, "Summary must be 300 characters or fewer."),
  fullDescription: z
    .string()
    .trim()
    .max(1500, "Full overview must be 1500 characters or fewer.")
    .optional()
    .default(""),
});

export type CreateEventFormInput = z.input<typeof createEventSchema>;
export type CreateEventFormValues = z.infer<typeof createEventSchema>;


export const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .max(254, "Email address is too long.")
    .pipe(z.email("Please enter a valid email address.")),
  password: z
    .string()
    .min(1, "Password is required.")
    .max(128, "Password must be 128 characters or fewer."),
});

export type SignInFormValues = z.infer<typeof signInSchema>;

export const signUpSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Full name must be at least 2 characters.")
      .max(80, "Full name must be 80 characters or fewer."),
    email: z
      .string()
      .trim()
      .min(1, "Email is required.")
      .max(254, "Email address is too long.")
      .pipe(z.email("Please enter a valid email address.")),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(128, "Password must be 128 characters or fewer.")
      .refine(
        (value) => /[A-Za-z]/.test(value) && /\d/.test(value),
        "Password must include at least one letter and one number.",
      ),
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type SignUpFormValues = z.infer<typeof signUpSchema>;
