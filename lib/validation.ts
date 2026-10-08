
import { z } from "zod"
import { GenderOptions } from "@/constants"

export const UserFormValidation = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères.").max(50),
  email: z.string().email("Adresse email invalide."),
  phone: z.string().refine(
    (phone) => /^\+?\d{10,15}$/.test(phone.replace(/\s/g, "")),
    "Numéro de téléphone invalide."
  ),
})

export const PatientFormValidation = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères.").max(50),
  email: z.string().email("Adresse email invalide."),
  phone: z.string().refine(
    (phone) => /^\+?\d{10,15}$/.test(phone.replace(/\s/g, "")),
    "Numéro de téléphone invalide."
  ),
  birthDate: z.date(),
  gender: z.enum(GenderOptions),
  address: z.string().min(2, "L'adresse est requise."),
  occupation: z.string().min(2, "La profession est requise."),
  emergencyContactName: z.string().min(2, "Le nom du contact est requis."),
  emergencyContactNumber: z.string().refine(
    (phone) => /^\+?\d{10,15}$/.test(phone.replace(/\s/g, "")),
    "Numéro de téléphone invalide."
  ),
  primaryPhysician: z.string().min(2, "Veuillez sélectionner un médecin."),
  insuranceProvider: z.string().min(2, "L'assureur est requis."),
  insurancePolicyNumber: z.string().min(2, "Le numéro de police est requis."),
  allergies: z.string().optional(),
  currentMedication: z.string().optional(),
  familyMedicalHistory: z.string().optional(),
  pastMedicalHistory: z.string().optional(),
  identificationType: z.string().min(1, "Veuillez sélectionner un type."),
  identificationNumber: z.string().min(2, "Le numéro est requis."),
  identificationDocument: z.custom<File[]>().optional(),
  treatmentConsent: z.boolean().refine((val) => val === true, {
    message: "Vous devez accepter le traitement.",
  }),
  disclosureConsent: z.boolean().refine((val) => val === true, {
    message: "Vous devez accepter la divulgation.",
  }),
  privacyConsent: z.boolean().refine((val) => val === true, {
    message: "Vous devez accepter la politique de confidentialité.",
  }),
})

export const AppointmentFormValidation = z.object({
  primaryPhysician: z.string(),
  schedule: z.date(),
  reason: z.string(),
  note: z.string().optional(),
  cancellationReason: z.string(),
})

export const getAppointmentSchema = (
  type: "create" | "schedule" | "cancel"
) =>
  AppointmentFormValidation.superRefine((values, context) => {
    if (type !== "cancel" && !values.primaryPhysician.trim()) {
      context.addIssue({
        code: "custom",
        path: ["primaryPhysician"],
        message: "Sélectionnez un médecin",
      })
    }

    if (type === "create") {
      if (values.reason.trim().length < 2) {
        context.addIssue({
          code: "custom",
          path: ["reason"],
          message: "Le motif doit contenir au moins 2 caractères",
        })
      } else if (values.reason.length > 500) {
        context.addIssue({
          code: "custom",
          path: ["reason"],
          message: "Le motif ne peut pas dépasser 500 caractères",
        })
      }
    }

    if (type === "cancel" && values.cancellationReason.trim().length < 2) {
      context.addIssue({
        code: "custom",
        path: ["cancellationReason"],
        message: "Indiquez un motif d'annulation",
      })
    }
  })