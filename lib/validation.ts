
import { z } from "zod"
import { GenderOptions, NurseDepartments, NurseRoles } from "@/constants"

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

//NOUVEAU — SCHEMAS INFIRMIER
export const NurseLoginValidation = z.object({
  email: z
    .string()
    .email("Adresse email invalide")
    .min(1, "L'email est requis"),
  passkey: z
    .string()
    .min(4, "Le code d'accès doit contenir au moins 4 caractères")
    .max(20, "Le code d'accès doit contenir au plus 20 caractères"),
});

  // ─── Création d'un compte infirmier ──────────────────────────
export const CreateNurseValidation = z.object({
  name: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom doit contenir au plus 50 caractères"),
  email: z
    .string()
    .email("Adresse email invalide")
    .min(1, "L'email est requis"),
  phone: z
    .string()
    .refine(
      (phone) => /^\+\d{10,15}$/.test(phone),
      "Numéro de téléphone invalide (format : +221XXXXXXXXX)"
    ),
  role: z.enum(NurseRoles, {
    error: "Veuillez sélectionner un rôle",
  }),
  department: z.enum(NurseDepartments, {
    error: "Veuillez sélectionner un département",
  }),
  registrationNumber: z
    .string()
    .min(4, "Le numéro d'ordre doit contenir au moins 4 caractères")
    .max(20, "Le numéro d'ordre doit contenir au plus 20 caractères"),
  passkey: z
    .string()
    .min(6, "Le code d'accès doit contenir au moins 6 caractères")
    .max(20, "Le code d'accès doit contenir au plus 20 caractères"),
  confirmPasskey: z
    .string()
    .min(6, "La confirmation doit contenir au moins 6 caractères"),
}).refine(
  (data) => data.passkey === data.confirmPasskey,
  {
    message: "Les codes d'accès ne correspondent pas",
    path: ["confirmPasskey"],
  }
);
 
// ─── Constantes vitales ───────────────────────────────────────
export const VitalSignsValidation = z.object({
  bloodPressure: z
    .string()
    .regex(
      /^\d{2,3}\/\d{2,3}$/,
      "Format invalide — exemple : 120/80"
    )
    .min(1, "La tension artérielle est requise"),
  heartRate: z
    .number({
      error: (issue) =>
        issue.input === undefined
          ? "La fréquence cardiaque est requise"
          : "Veuillez entrer un nombre valide",
    })
    .int("La fréquence cardiaque doit être un nombre entier.")
    .min(30, "Valeur trop basse (minimum 30 bpm)")
    .max(250, "Valeur trop haute (maximum 250 bpm)"),
  temperature: z
    .number({
      error: (issue) =>
        issue.input === undefined
          ? "La température est requise"
          : "Veuillez entrer un nombre valide",
    })
    .min(30, "Valeur trop basse (minimum 30°C)")
    .max(45, "Valeur trop haute (maximum 45°C)"),
  oxygenSaturation: z
    .number({
      error: (issue) =>
        issue.input === undefined
          ? "La SpO2 est requise"
          : "Veuillez entrer un nombre valide",
    })
    .min(50, "Valeur trop basse (minimum 50%)")
    .max(100, "La SpO2 ne peut pas dépasser 100%"),
  weight: z
    .number({
      error: "Veuillez entrer un nombre valide",
    })
    .min(1, "Le poids doit être supérieur à 1 kg")
    .max(500, "Le poids doit être inférieur à 500 kg")
    .optional(),
  height: z
    .number({
      error: "Veuillez entrer un nombre valide",
    })
    .min(30, "La taille doit être supérieure à 30 cm")
    .max(250, "La taille doit être inférieure à 250 cm")
    .optional(),
  respiratoryRate: z
    .number({
      error: "Veuillez entrer un nombre valide",
    })
    .min(5, "Valeur trop basse (minimum 5/min)")
    .max(60, "Valeur trop haute (maximum 60/min)")
    .optional(),
  bloodGlucose: z
    .number({
      error: "Veuillez entrer un nombre valide",
    })
    .min(20, "Valeur trop basse (minimum 20 mg/dL)")
    .max(600, "Valeur trop haute (maximum 600 mg/dL)")
    .optional(),
  notes: z
    .string()
    .max(1000, "Les notes doivent contenir au plus 1000 caractères")
    .optional(),
});
 
// ─── Note de soin ─────────────────────────────────────────────
export const CareNoteValidation = z.object({
  note: z
    .string()
    .min(5, "La note doit contenir au moins 5 caractères")
    .max(2000, "La note doit contenir au plus 2000 caractères"),
  type: z.enum(
    ["observation", "soin", "medicament", "urgence", "suivi"],
    {
      error: "Veuillez sélectionner un type de note",
    }
  ),
  appointmentId: z.string().optional(),
});
 
// ─── Mise à jour dossier patient (par infirmier) ──────────────
export const UpdatePatientNurseValidation = z.object({
  allergies: z
    .string()
    .max(500, "Les allergies doivent contenir au plus 500 caractères")
    .optional(),
  currentMedication: z
    .string()
    .max(1000, "Les médicaments doivent contenir au plus 1000 caractères")
    .optional(),
  pastMedicalHistory: z
    .string()
    .max(1000, "L'historique doit contenir au plus 1000 caractères")
    .optional(),
  nurseObservation: z
    .string()
    .min(5, "L'observation doit contenir au moins 5 caractères")
    .max(2000, "L'observation doit contenir au plus 2000 caractères")
    .optional(),
});
 
// ─── Recherche patient (par infirmier) ───────────────────────
export const PatientSearchValidation = z.object({
  query: z
    .string()
    .min(2, "La recherche doit contenir au moins 2 caractères")
    .max(100, "La recherche doit contenir au plus 100 caractères"),
  searchBy: z
    .enum(["name", "email", "phone"], {
      error: "Critère de recherche invalide",
    })
    .default("name"),
});
 
// ═══════════════════════════════════════════════════════════════
// ✅ TYPES INFÉRÉS — Utilisables dans les composants
// ═══════════════════════════════════════════════════════════════
 
export type UserFormValues = z.infer<typeof UserFormValidation>;
export type PatientFormValues = z.infer<typeof PatientFormValidation>;
export type CreateAppointmentValues = z.infer<typeof AppointmentFormValidation>;
export type ScheduleAppointmentValues = z.infer<typeof AppointmentFormValidation>;
export type CancelAppointmentValues = z.infer<typeof AppointmentFormValidation>;
 
// ✅ Nouveaux types infirmier
export type NurseLoginValues = z.infer<typeof NurseLoginValidation>;
export type CreateNurseValues = z.infer<typeof CreateNurseValidation>;
export type VitalSignsValues = z.infer<typeof VitalSignsValidation>;
export type CareNoteValues = z.infer<typeof CareNoteValidation>;
export type UpdatePatientNurseValues = z.infer<typeof UpdatePatientNurseValidation>;
export type PatientSearchValues = z.infer<typeof PatientSearchValidation>;