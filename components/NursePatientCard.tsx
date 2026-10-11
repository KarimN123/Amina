"use client";

import Image from "next/image";
import Link from "next/link";
import { Doctors, StatusIcon } from "@/constants";
import { formatDateTime } from "@/lib/utils";
import type { Appointment } from "@/types/appwrite.types";

interface NursePatientCardProps {
  appointment: Appointment;
  nurseId: string;
}

const NursePatientCard = ({ appointment, nurseId }: NursePatientCardProps) => {
  const { patient, schedule, status, reason, primaryPhysician } = appointment;

  const doctor = Doctors.find((d) => d.name === primaryPhysician);

  const birthDate = new Date(patient.birthDate);
  const age = new Date().getFullYear() - birthDate.getFullYear();

  const statusColor = {
    scheduled: "bg-green-600",
    pending:   "bg-blue-600",
    cancelled: "bg-red-600",
  }[status];

  const statusLabel = {
    scheduled: "Planifié",
    pending:   "En attente",
    cancelled: "Annulé",
  }[status];

  return (
    <Link href={`/nurse/${nurseId}/patients/${patient.$id}`} className="block">
      <div className="flex flex-col gap-4 rounded-2xl bg-dark-300 p-5 transition-all hover:bg-dark-400 hover:shadow-lg cursor-pointer border border-dark-500 hover:border-green-500">

        {/* ── En-tête ── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 flex-shrink-0">
              <span className="text-18-bold text-white">
                {patient.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-16-semibold text-white">{patient.name}</p>
              <p className="text-12-regular text-dark-600">{patient.email}</p>
            </div>
          </div>
          <span className={`status-badge text-12-semibold text-white ${statusColor}`}>
            <Image
              src={StatusIcon[status]}
              width={12} height={12}
              alt={status}
              className="h-3 w-3"
            />
            {statusLabel}
          </span>
        </div>

        <div className="border-t border-dark-500" />

        {/* ── Infos patient ── */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Âge",       value: `${age} ans`              },
            { label: "Genre",     value: patient.gender             },
            { label: "Téléphone", value: patient.phone              },
            { label: "Allergies", value: patient.allergies || "Aucune" },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-lg bg-dark-400 p-3">
              <p className="text-12-regular text-dark-600 mb-1">{label}</p>
              <p className="text-14-medium text-white truncate">{value}</p>
            </div>
          ))}
        </div>

        {/* ── Rendez-vous + Médecin ── */}
        <div className="flex items-center justify-between rounded-lg bg-dark-400 p-3">
          <div className="flex items-center gap-2">
            <Image
              src="/assets/icons/appointments.svg"
              width={16} height={16}
              alt="rdv"
            />
            <div>
              <p className="text-12-regular text-dark-600">Rendez-vous</p>
              <p className="text-14-medium text-white">
                {formatDateTime(new Date(schedule)).dateTime}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {doctor?.image && (
              <Image
                src={doctor.image}
                width={24} height={24}
                alt={primaryPhysician}
                className="rounded-full"
              />
            )}
            <p className="text-12-regular text-dark-600">
              Dr. {primaryPhysician}
            </p>
          </div>
        </div>

        {/* ── Motif ── */}
        {reason && (
          <div className="rounded-lg bg-dark-400 p-3">
            <p className="text-12-regular text-dark-600 mb-1">Motif</p>
            <p className="text-14-regular text-white line-clamp-2">{reason}</p>
          </div>
        )}

        {/* ── CTA ── */}
        <div className="flex items-center justify-end gap-2 text-green-500">
          <p className="text-14-medium">Voir le dossier complet</p>
          <Image
            src="/assets/icons/arrow.svg"
            width={16} height={16}
            alt="voir"
          />
        </div>
      </div>
    </Link>
  );
};

export default NursePatientCard;