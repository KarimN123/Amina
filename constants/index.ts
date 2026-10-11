

export const GenderOptions = ["male", "female"] as const
export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
}

export const PatientFormDefaultValues = {
  name: "",
  email: "",
  phone: "",
  birthDate: new Date(Date.now()),
  gender: "male" as Gender,
  address: "",
  occupation: "",
  emergencyContactName: "",
  emergencyContactNumber: "",
  primaryPhysician: "",
  insuranceProvider: "",
  insurancePolicyNumber: "",
  allergies: "",
  currentMedication: "",
  familyMedicalHistory: "",
  pastMedicalHistory: "",
  identificationType: "Acte de naissance",
  identificationNumber: "",
  identificationDocument: [],
  treatmentConsent: false,
  disclosureConsent: false,
  privacyConsent: false,
};

export const IdentificationTypes = [
"Acte de naissance",
"Permis de conduire",
"Carte / Police d'assurance maladie",
"Carte d'identité militaire",
"Carte nationale d'identité",
"Passeport",
"Carte de résident étranger (Carte verte)",
"Carte de sécurité sociale",
"Carte d'identité d'État",
"Carte d'étudiant",
"Carte d'électeur",
];

export const Doctors = [
  {
    image: "/assets/images/dr-green.png",
    name: "John Green",
  },
  {
    image: "/assets/images/dr-cameron.png",
    name: "Leila Cameron",
  },
  {
    image: "/assets/images/dr-livingston.png",
    name: "David Livingston",
  },
  {
    image: "/assets/images/dr-peter.png",
    name: "Evan Peter",
  },
  {
    image: "/assets/images/dr-powell.png",
    name: "Jane Powell",
  },
  {
    image: "/assets/images/dr-remirez.png",
    name: "Alex Ramirez",
  },
  {
    image: "/assets/images/dr-lee.png",
    name: "Jasmine Lee",
  },
  {
    image: "/assets/images/dr-cruz.png",
    name: "Alyana Cruz",
  },
  {
    image: "/assets/images/dr-sharma.png",
    name: "Hardik Sharma",
  },
];

export const StatusIcon = {
  scheduled: "/assets/icons/check.svg",
  pending: "/assets/icons/pending.svg",
  cancelled: "/assets/icons/cancelled.svg",
};

// ─── ✅ NOUVEAU — Types de notes de soins ────────────────────
export const CareNoteTypes = [
  { value: "observation", label: "Observation",    color: "bg-blue-600" },
  { value: "soin",        label: "Soin effectué",  color: "bg-green-600" },
  { value: "medicament",  label: "Médicament",     color: "bg-dark-500" },
  { value: "urgence",     label: "Urgence",        color: "bg-red-600" },
  { value: "suivi",       label: "Suivi",          color: "bg-dark-500" },
];

export const NurseRoles = [
  "infirmier",
  "infirmiere",
  "aide-soignant",
  "aide-soignante",
  "infirmier-chef",
] as const;

export const NurseDepartments = [
  "Urgences",
  "Pédiatrie",
  "Cardiologie",
  "Chirurgie",
  "Maternité",
  "Médecine Générale",
  "Réanimation",
  "Oncologie",
  "Neurologie",
  "Orthopédie",
] as const;
 
// ─── ✅ NOUVEAU — Valeurs par défaut formulaire infirmier ─────
export const NurseFormDefaultValues = {
  name: "",
  email: "",
  phone: "",
  role: "infirmier" as NurseRole,
  department: "Médecine Générale",
  registrationNumber: "",
  passkey: "",
};
 
// ─── ✅ NOUVEAU — Valeurs par défaut constantes vitales ───────
export const VitalSignsDefaultValues = {
  bloodPressure: "",
  heartRate: 0,
  temperature: 0,
  oxygenSaturation: 0,
  weight: undefined,
  height: undefined,
  respiratoryRate: undefined,
  bloodGlucose: undefined,
  notes: "",
};
 
// ─── ✅ NOUVEAU — Seuils d'alerte constantes vitales ─────────
export const VitalSignsAlerts = {
  heartRate: {
    min: 60,
    max: 100,
    label: "Fréquence cardiaque normale : 60-100 bpm",
  },
  temperature: {
    min: 36.1,
    max: 37.9,
    label: "Température normale : 36.1-37.9°C",
  },
  oxygenSaturation: {
    min: 95,
    max: 100,
    label: "SpO2 normale : 95-100%",
  },
  respiratoryRate: {
    min: 12,
    max: 20,
    label: "Fréquence respiratoire normale : 12-20/min",
  },
};
 
// ─── ✅ NOUVEAU — Icônes de statut pour l'espace infirmier ───
export const NurseStatusIcon = {
  scheduled: "/assets/icons/check.svg",
  pending:   "/assets/icons/pending.svg",
  cancelled: "/assets/icons/cancelled.svg",
  inProgress: "/assets/icons/pending.svg",
};