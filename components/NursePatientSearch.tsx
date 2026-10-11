'use client'

import { useMemo, useState } from 'react'
import NursePatientCard from '@/components/NursePatientCard'
import type { Appointment } from '@/types/appwrite.types'

interface NursePatientSearchProps {
  appointments: Appointment[]
  nurseId: string
}

const normalizeText = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('fr')
    .trim()

const NursePatientSearch = ({
  appointments,
  nurseId,
}: NursePatientSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const filteredAppointments = useMemo(() => {
    const normalizedSearch = normalizeText(searchTerm)
    const searchDigits = searchTerm.replace(/\D/g, '')

    if (!normalizedSearch) return appointments

    return appointments.filter(({ patient }) => {
      const searchableText = normalizeText(
        `${patient.name} ${patient.email} ${patient.phone}`
      )
      const phoneDigits = patient.phone.replace(/\D/g, '')

      return (
        searchableText.includes(normalizedSearch) ||
        (searchDigits.length > 0 && phoneDigits.includes(searchDigits))
      )
    })
  }, [appointments, searchTerm])

  return (
    <section className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="nurse-patient-search" className="text-14-medium text-white">
          Rechercher un patient avec un rendez-vous planifié
        </label>
        <input
          id="nurse-patient-search"
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Nom, adresse e-mail ou téléphone"
          autoComplete="off"
          className="shad-input w-full"
        />
        <p className="text-12-regular text-dark-600" aria-live="polite">
          {filteredAppointments.length} rendez-vous planifié
          {filteredAppointments.length === 1 ? '' : 's'}
        </p>
      </div>

      {filteredAppointments.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredAppointments.map((appointment) => (
            <NursePatientCard
              key={appointment.$id}
              appointment={appointment}
              nurseId={nurseId}
            />
          ))}
        </div>
      ) : (
        <p className="rounded-xl bg-dark-300 p-6 text-center text-dark-700">
          {appointments.length === 0
            ? 'Aucun rendez-vous planifié pour le moment.'
            : 'Aucun patient avec un rendez-vous planifié ne correspond à cette recherche.'}
        </p>
      )}
    </section>
  )
}

export default NursePatientSearch
