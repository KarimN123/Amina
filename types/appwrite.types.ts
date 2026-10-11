import { Models } from "node-appwrite";

export interface Patient extends Models.Document {
  userId: string;
  name: string;
  email: string;
  phone: string;
  birthDate: Date;
  gender: Gender;
  address: string;
  occupation: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  primaryPhysician: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  allergies: string | undefined;
  currentMedication: string | undefined;
  familyMedicalHistory: string | undefined;
  pastMedicalHistory: string | undefined;
  identificationType: string | undefined;
  identificationNumber: string | undefined;
  identificationDocument: FormData | undefined;
  privacyConsent: boolean;
}

export interface Appointment extends Models.Document {
  patient: Patient;
  schedule: Date;
  status: Status;
  primaryPhysician: string;
  reason: string;
  note: string;
  userId: string;
  cancellationReason: string | null;
}

// ─── ✅ NOUVEAU — Interface Nurse ────────────────────────────
export interface Nurse extends Models.Document {
  name: string;
  email: string;
  phone: string;
  role: NurseRole;
  department: Department;
  registrationNumber: string;
  passkey: string;         // Stocké hashé en production
}
 
// ─── ✅ NOUVEAU — Interface VitalSigns ───────────────────────
export interface VitalSigns extends Models.Document {
  patientId: string;
  nurseId: string;
  bloodPressure: string;      // "120/80 mmHg"
  heartRate: number;          // bpm
  temperature: number;        // °C
  oxygenSaturation: number;   // % SpO2
  weight?: number;            // kg
  height?: number;            // cm
  respiratoryRate?: number;   // respirations/min
  bloodGlucose?: number;      // mg/dL
  notes?: string;
  measuredAt: string;         // ISO string Appwrite
}
 
// ─── ✅ NOUVEAU — Interface CareNote ─────────────────────────
export interface CareNote extends Models.Document {
  patientId: string;
  nurseId: string;
  appointmentId?: string;
  note: string;
  type: CareNoteType;
  createdAt: string;          // ISO string Appwrite
}
 
// ─── ✅ NOUVEAU — Interface PatientFullRecord ────────────────
export interface PatientFullRecord {
  patient: Patient;
  appointments: Appointment[];
  vitalSigns: VitalSigns[];
  careNotes: CareNote[];
}