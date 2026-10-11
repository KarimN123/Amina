// app/nurse/[nurseId]/patients/[patientId]/page.tsx

import { getPatientFullRecord } from '@/lib/actions/nurse.actions'
import VitalSignsForm from '@/components/VitalSignsForm'
import CareNotesForm from '@/components/CareNotesForm'
import type { PatientFullRecord } from '@/types/appwrite.types'

const PatientRecord = async ({
  params,
}: {
  params: Promise<{ nurseId: string; patientId: string }>
}) => {
  const { nurseId, patientId } = await params
  const record: PatientFullRecord = await getPatientFullRecord(patientId)
  const { patient, appointments, vitalSigns, careNotes } = record

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-8">

      {/* En-tête patient */}
      <div className="flex items-center gap-6 rounded-2xl bg-dark-300 p-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-600">
          <span className="text-32-bold text-white">
            {patient.name?.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <h1 className="text-24-bold text-white">{patient.name}</h1>
          <p className="text-dark-700">{patient.email}</p>
          <p className="text-dark-700">{patient.phone}</p>
        </div>
        <div className="ml-auto grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-dark-400 p-3 text-center">
            <p className="text-12-regular text-dark-700">Date de naissance</p>
            <p className="text-14-medium text-white">
              {new Date(patient.birthDate).toLocaleDateString('fr-FR')}
            </p>
          </div>
          <div className="rounded-lg bg-dark-400 p-3 text-center">
            <p className="text-12-regular text-dark-700">Médecin traitant</p>
            <p className="text-14-medium text-white">
              {patient.primaryPhysician}
            </p>
          </div>
          <div className="rounded-lg bg-dark-400 p-3 text-center">
            <p className="text-12-regular text-dark-700">Groupe sanguin</p>
            <p className="text-14-medium text-white">Non renseigné</p>
          </div>
          <div className="rounded-lg bg-dark-400 p-3 text-center">
            <p className="text-12-regular text-dark-700">Allergies</p>
            <p className="text-14-medium text-white">
              {patient.allergies || 'Aucune'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">

        {/* Informations médicales */}
        <section className="space-y-4 rounded-2xl bg-dark-300 p-6">
          <h2 className="sub-header">Informations médicales</h2>
          <div className="space-y-3">
            <InfoRow label="Traitement en cours"
              value={patient.currentMedication || 'Aucun'} />
            <InfoRow label="Antécédents médicaux"
              value={patient.pastMedicalHistory || 'Aucun'} />
            <InfoRow label="Antécédents familiaux"
              value={patient.familyMedicalHistory || 'Aucun'} />
            <InfoRow label="Assurance"
              value={`${patient.insuranceProvider} — ${patient.insurancePolicyNumber}`} />
            <InfoRow label="Contact urgence"
              value={`${patient.emergencyContactName} (${patient.emergencyContactNumber})`} />
          </div>
        </section>

        {/* Constantes vitales récentes */}
        <section className="space-y-4 rounded-2xl bg-dark-300 p-6">
          <h2 className="sub-header">Constantes vitales récentes</h2>
          {vitalSigns.length > 0 ? (
            vitalSigns.slice(0, 3).map((vital) => (
              <div key={vital.$id}
                className="rounded-lg bg-dark-400 p-4 space-y-2">
                <p className="text-12-regular text-dark-700">
                  {new Date(vital.measuredAt).toLocaleString('fr-FR')}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <VitalBadge label="TA" value={vital.bloodPressure} />
                  <VitalBadge label="Pouls" value={`${vital.heartRate} bpm`} />
                  <VitalBadge label="Temp." value={`${vital.temperature}°C`} />
                  <VitalBadge label="SpO2" value={`${vital.oxygenSaturation}%`} />
                </div>
              </div>
            ))
          ) : (
            <p className="text-dark-600">Aucune constante enregistrée</p>
          )}

          {/* Formulaire nouvelles constantes */}
          <VitalSignsForm patientId={patientId} nurseId={nurseId} />
        </section>

      </div>

      {/* Notes de soins */}
      <section className="rounded-2xl bg-dark-300 p-6 space-y-4">
        <h2 className="sub-header">Notes de soins</h2>
        <CareNotesForm patientId={patientId} nurseId={nurseId} />
        <div className="space-y-3 mt-4">
          {careNotes.map((note) => (
            <div key={note.$id}
              className="rounded-lg bg-dark-400 p-4 space-y-1">
              <div className="flex items-center justify-between">
                <span className={`status-badge ${
                  note.type === 'urgence'
                    ? 'bg-red-600' : 'bg-dark-500'
                }`}>
                  {note.type}
                </span>
                <p className="text-12-regular text-dark-700">
                  {new Date(note.createdAt).toLocaleString('fr-FR')}
                </p>
              </div>
              <p className="text-14-regular text-white">{note.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Rendez-vous */}
      <section className="rounded-2xl bg-dark-300 p-6 space-y-4">
        <h2 className="sub-header">Historique des rendez-vous</h2>
        {appointments.map((appt) => (
          <div key={appt.$id}
            className="flex items-center justify-between rounded-lg bg-dark-400 p-4">
            <div>
              <p className="text-14-medium text-white">
                Dr. {appt.primaryPhysician}
              </p>
              <p className="text-12-regular text-dark-700">{appt.reason}</p>
            </div>
            <div className="text-right">
              <p className="text-14-regular text-white">
                {new Date(appt.schedule).toLocaleDateString('fr-FR')}
              </p>
              <span className={`status-badge ${
                appt.status === 'scheduled'
                  ? 'bg-green-600' : 'bg-dark-500'
              }`}>
                {appt.status}
              </span>
            </div>
          </div>
        ))}
      </section>

    </div>
  )
}

// Composants utilitaires
const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between border-b border-dark-500 pb-2">
    <span className="text-14-regular text-dark-700">{label}</span>
    <span className="text-14-medium text-white text-right max-w-[60%]">
      {value}
    </span>
  </div>
)

const VitalBadge = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-md bg-dark-300 p-2 text-center">
    <p className="text-10 text-dark-600">{label}</p>
    <p className="text-12-semibold text-green-500">{value}</p>
  </div>
)

export default PatientRecord