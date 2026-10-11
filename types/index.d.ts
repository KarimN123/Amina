/* eslint-disable no-unused-vars */

declare type SearchParamProps = {
  params: Promise<{ [key: string]: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

declare type Gender = "male" | "female";
declare type Status = "pending" | "scheduled" | "cancelled";

declare interface CreateUserParams {
  name: string;
  email: string;
  phone: string;
}
declare interface User extends CreateUserParams {
  $id: string;
}

declare interface RegisterUserParams extends CreateUserParams {
  userId: string;
  birthDate: Date;
  gender: Gender;
  address: string;
  occupation: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  primaryPhysician: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  allergies?: string;
  currentMedication?: string;
  familyMedicalHistory?: string;
  pastMedicalHistory?: string;
  identificationType: string | undefined;
  identificationNumber: string | undefined;
  identificationDocument: FormData | undefined;
  privacyConsent: boolean;
}

declare type CreateAppointmentParams = {
  userId: string;
  patient: string;
  primaryPhysician: string;
  reason: string;
  schedule: Date;
  status: Status;
  note: string | undefined;
};

declare type UpdateAppointmentParams = {
  appointmentId: string;
  userId: string;
  appointment: Appointment;
  type: string;
};

// ─── ✅ NOUVEAU — Types Infirmier ─────────────────────────────
 
declare type NurseRole =
  | "infirmier"
  | "infirmiere"
  | "aide-soignant"
  | "aide-soignante"
  | "infirmier-chef";
 
declare type Department =
  | "Urgences"
  | "Pédiatrie"
  | "Cardiologie"
  | "Chirurgie"
  | "Maternité"
  | "Médecine Générale"
  | "Réanimation"
  | "Oncologie"
  | "Neurologie"
  | "Orthopédie";
 
declare interface CreateNurseParams {
  name: string;
  email: string;
  phone: string;
  role: NurseRole;
  department: Department;
  registrationNumber: string; // Numéro d'ordre infirmier
  passkey: string;
}
 
declare interface Nurse extends CreateNurseParams {
  $id: string;
  createdAt?: string;
}
 
// ─── ✅ NOUVEAU — Constantes vitales ─────────────────────────
declare interface VitalSignsParams {
  patientId: string;
  nurseId: string;
  bloodPressure: string;      // ex: "120/80 mmHg"
  heartRate: number;          // battements par minute
  temperature: number;        // °C
  oxygenSaturation: number;   // % SpO2
  weight?: number;            // kg
  height?: number;            // cm
  respiratoryRate?: number;   // respirations/min
  bloodGlucose?: number;      // glycémie mg/dL
  notes?: string;
  measuredAt: Date;
}
 
// ─── ✅ NOUVEAU — Notes de soins ──────────────────────────────
declare type CareNoteType =
  | "observation"
  | "soin"
  | "medicament"
  | "urgence"
  | "suivi";
 
declare interface CareNoteParams {
  patientId: string;
  nurseId: string;
  appointmentId?: string;
  note: string;
  type: CareNoteType;
  createdAt: Date;
}
 
// ─── ✅ NOUVEAU — Dossier patient complet (vue infirmier) ─────
declare interface PatientFullRecord {
  patient: RegisterUserParams & { $id: string };
  appointments: CreateAppointmentParams[];
  vitalSigns: VitalSignsParams[];
  careNotes: CareNoteParams[];
}
 
// ─── ✅ NOUVEAU — Paramètres de connexion infirmier ──────────
declare interface NurseLoginParams {
  email: string;
  passkey: string;
}