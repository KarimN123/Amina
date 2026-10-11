// lib/actions/nurse.actions.ts

'use server'

import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto'
import { AppwriteException, ID, Query } from 'node-appwrite'
import type { Appointment, PatientFullRecord } from '@/types/appwrite.types'
import { APPOINTMENT_COLLECTION_ID, CARE_NOTES_COLLECTION_ID, DATABASE_ID, databases, NURSE_COLLECTION_ID, PATIENT_COLLECTION_ID, VITAL_SIGNS_COLLECTION_ID } from '../appwrite.config'
import { parseStringify } from '../utils'
import { CreateNurseValidation, type CreateNurseValues } from '@/lib/validation'

const derivePasskey = (passkey: string, salt: Buffer) =>
  new Promise<Buffer>((resolve, reject) => {
    scrypt(passkey, salt, 32, (error, derivedKey) => {
      if (error) {
        reject(error)
        return
      }
      resolve(derivedKey)
    })
  })

const hashPasskey = async (passkey: string) => {
  const salt = randomBytes(16)
  const derivedKey = await derivePasskey(passkey, salt)
  return `scrypt$${salt.toString('base64')}$${derivedKey.toString('base64')}`
}

const verifyPasskey = async (storedPasskey: string, passkey: string) => {
  if (storedPasskey.startsWith('scrypt$')) {
    const [, saltValue, hashValue] = storedPasskey.split('$')
    if (!saltValue || !hashValue) return false

    const salt = Buffer.from(saltValue, 'base64')
    const expectedHash = Buffer.from(hashValue, 'base64')
    if (salt.length !== 16 || expectedHash.length !== 32) return false

    const actualHash = await derivePasskey(passkey, salt)
    return timingSafeEqual(expectedHash, actualHash)
  }

  try {
    return storedPasskey === btoa(passkey)
  } catch {
    return false
  }
}

// ─── Authentification infirmier ───────────────────────────────
export const loginNurse = async (email: string, passkey: string) => {
  try {
    const normalizedEmail = email.trim().toLowerCase()
    const nurses = await databases.listDocuments(
      DATABASE_ID!,
      NURSE_COLLECTION_ID!,
      [Query.equal('email', [normalizedEmail])]
    )

    if (nurses.total === 0) {
      throw new Error('Infirmier non trouvé')
    }

    const nurse = nurses.documents[0]

    if (!(await verifyPasskey(nurse.passkey, passkey))) {
      throw new Error('Passkey incorrect')
    }

    return parseStringify({
      $id: nurse.$id,
      name: nurse.name,
      email: nurse.email,
      role: nurse.role,
      department: nurse.department,
    })

  } catch (error) {
    console.error('Erreur connexion infirmier :', error)
    throw error
  }
}

export const createNurse = async (
  values: CreateNurseValues,
  adminPasskey: string
) => {
  if (!process.env.ADMIN_PASSKEY) {
    throw new Error('La variable serveur ADMIN_PASSKEY doit être configurée.')
  }

  if (adminPasskey !== process.env.ADMIN_PASSKEY) {
    throw new Error('Accès administrateur refusé.')
  }

  const validation = CreateNurseValidation.safeParse(values)
  if (!validation.success) {
    throw new Error('Les informations du compte infirmier sont invalides.')
  }

  if (!DATABASE_ID || !NURSE_COLLECTION_ID) {
    throw new Error('La base ou la collection des infirmiers n’est pas configurée.')
  }

  const nurse = validation.data

  try {
    const createdNurse = await databases.createDocument(
      DATABASE_ID,
      NURSE_COLLECTION_ID,
      ID.unique(),
      {
        name: nurse.name.trim(),
        email: nurse.email.trim().toLowerCase(),
        phone: nurse.phone,
        role: nurse.role,
        department: nurse.department,
        regNumber: nurse.registrationNumber.trim(),
        passkey: await hashPasskey(nurse.passkey),
      }
    )

    return parseStringify({
      $id: createdNurse.$id,
      name: createdNurse.name,
      email: createdNurse.email,
    })
  } catch (error) {
    console.error('Erreur création compte infirmier :', error)
    throw error
  }
}

// ─── Récupérer les patients assignés ─────────────────────────
export const getNursePatients = async (): Promise<Appointment[]> => {
  try {
    const appointments = await databases.listDocuments<Appointment>(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [
        Query.equal('status', ['scheduled']),
        Query.orderDesc('$createdAt'),
        Query.select(['*', 'patient.*']),
      ]
    )

    return parseStringify(appointments.documents)
  } catch (error) {
    console.error('Erreur récupération patients :', error)
    throw error
  }
}

// ─── Récupérer le dossier complet d'un patient ───────────────
export const getPatientFullRecord = async (
  patientId: string
): Promise<PatientFullRecord> => {
  if (!patientId?.trim() || patientId === 'undefined') {
    throw new Error('Identifiant patient manquant dans le rendez-vous.')
  }

  try {
    // 1. Infos patient
    const patient = await databases.getDocument(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      patientId
    )

    // 2. Historique rendez-vous
    const appointments = await databases.listDocuments(
      DATABASE_ID!,
      process.env.APPOINTMENT_COLLECTION_ID!,
      [Query.equal('userId', [patient.userId])]
    )

    // 3. Constantes vitales
    const vitalSigns = await databases.listDocuments(
      DATABASE_ID!,
      VITAL_SIGNS_COLLECTION_ID!,
      [
        Query.equal('patientId', [patientId]),
        Query.orderDesc('$createdAt'),
        Query.limit(10),
      ]
    )

    // 4. Notes de soins
    const careNotes = await databases.listDocuments(
      DATABASE_ID!,
      CARE_NOTES_COLLECTION_ID!,
      [
        Query.equal('patientId', [patientId]),
        Query.orderDesc('$createdAt'),
      ]
    )

    return parseStringify({
      patient,
      appointments: appointments.documents,
      vitalSigns: vitalSigns.documents,
      careNotes: careNotes.documents,
    })

  } catch (error) {
    console.error('Erreur dossier patient :', error)
    throw error
  }
}

// ─── Enregistrer les constantes vitales ──────────────────────
export const recordVitalSigns = async (params: VitalSignsParams) => {
  try {
    const heartRate = Number(params.heartRate)
    if (!Number.isInteger(heartRate) || heartRate < 30 || heartRate > 250) {
      throw new Error('La fréquence cardiaque doit être un entier entre 30 et 250 bpm.')
    }

    const document = Object.fromEntries(
      Object.entries(params).filter(
        ([, value]) => value !== undefined && value !== ''
      )
    )

    document.heartRate = heartRate

    const stringVitalFields = [
      'height',
      'weight',
      'respiratoryRate',
      'bloodGlucose',
    ] as const

    for (const field of stringVitalFields) {
      const value = params[field]
      if (value !== undefined) {
        document[field] = String(value)
      }
    }

    const vitals = await databases.createDocument(
      DATABASE_ID!,
      VITAL_SIGNS_COLLECTION_ID!,
      ID.unique(),
      {
        ...document,
        measuredAt: new Date().toISOString(),
      }
    )
    return parseStringify(vitals)
  } catch (error) {
    console.error('Erreur constantes vitales :', error)
    if (
      error instanceof AppwriteException &&
      error.type === 'document_invalid_structure'
    ) {
      const unknownAttribute = error.message.match(/Unknown attribute: "([^"]+)"/)
      if (unknownAttribute) {
        throw new Error(
          `La collection « Signes Vitaux » ne possède pas l’attribut « ${unknownAttribute[1]} ». Ajoutez cet attribut dans Appwrite, puis réessayez.`
        )
      }
    }
    throw error
  }
}

// ─── Ajouter une note de soins ────────────────────────────────
export const addCareNote = async (params: CareNoteParams) => {
  try {
    const note = await databases.createDocument(
      DATABASE_ID!,
      CARE_NOTES_COLLECTION_ID!,
      ID.unique(),
      {
        ...params,
        createdAt: new Date().toISOString(),
      }
    )
    return parseStringify(note)
  } catch (error) {
    console.error('Erreur note de soin :', error)
    throw error
  }
}