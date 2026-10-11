// app/nurse/[nurseId]/page.tsx

import { getNursePatients } from '@/lib/actions/nurse.actions'
import NursePatientSearch from '@/components/NursePatientSearch'
import StatCard from '@/components/StatCard'
import Image from 'next/image'
import Link from 'next/link'

const NurseDashboard = async ({
  params,
}: {
  params: Promise<{ nurseId: string }>
}) => {
  const { nurseId } = await params
  const appointments = await getNursePatients()

  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-14">

      {/* Header */}
      <header className="admin-header">
        <Link href="/">
          <Image
            src="/assets/icons/logo-full.svg"
            height={32} width={162}
            alt="logo" className="h-8 w-fit"
          />
        </Link>
        <p className="text-16-semibold">
          Espace Infirmier
        </p>
      </header>

      {/* Main */}
      <main className="admin-main">
        <section className="w-full space-y-4">
          <h1 className="header">Tableau de bord</h1>
          <p className="text-dark-700">
            Gérez les soins et consultez les dossiers patients
          </p>
        </section>

        {/* Stats */}
        <section className="admin-stat">
          <StatCard
            type="appointment"
            count={appointments.filter((appointment) => appointment.status === 'scheduled').length}
            label="Patients à voir aujourd'hui"
            icon="/assets/icons/appointments.svg"
          />
          <StatCard
            type="pending"
            count={appointments.filter((appointment) => appointment.status === 'pending').length}
            label="En attente de soins"
            icon="/assets/icons/pending.svg"
          />
          <StatCard
            type="cancelled"
            count={0}
            label="Soins effectués"
            icon="/assets/icons/check.svg"
          />
        </section>

        <NursePatientSearch appointments={appointments} nurseId={nurseId} />
      </main>
    </div>
  )
}

export default NurseDashboard