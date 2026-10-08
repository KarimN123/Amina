import Image from "next/image";
import Link from "next/link";

import StatCard from "@/components/StatCard";
import { columns } from "@/components/table/columns";
import { DataTable } from "@/components/table/DataTable";
import { getRecentAppointmentList } from "@/lib/actions/appointment.actions";

const AdminPage = async () => {
  const appointments = await getRecentAppointmentList();

  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-14">
      <header className="admin-header">
        <Link href="/" className="cursor-pointer">
          <Image
            src="/assets/icons/logo-full.svg"
            height={32}
            width={162}
            alt="Logo AminaCare"
            className="h-8 w-fit"
          />
        </Link>

        <p className="text-16-semibold">Tableau de bord administrateur</p>
      </header>

      <main className="admin-main">
        <section className="w-full space-y-4">
          <h1 className="header">Bienvenue, administrateur</h1>
          <p className="text-dark-700">
            Gérez les nouveaux rendez-vous de la journée
          </p>
        </section>

        <section className="admin-stat">
          <StatCard
            type="appointment"
            count={appointments.scheduledCount}
            label="Rendez-vous planifiés"
            icon={"/assets/icons/appointments.svg"}
          />
          <StatCard
            type="pending"
            count={appointments.pendingCount}
            label="Rendez-vous en attente"
            icon={"/assets/icons/pending.svg"}
          />
          <StatCard
            type="cancelled"
            count={appointments.cancelledCount}
            label="Rendez-vous annulés"
            icon={"/assets/icons/cancelled.svg"}
          />
        </section>

        <DataTable columns={columns} data={appointments.documents} />
      </main>
    </div>
  );
};

export default AdminPage;