"use client";

import Image from "next/image";
import { createColumnHelper } from "@tanstack/react-table";

import { Doctors } from "@/constants";
import { formatDateTime } from "@/lib/utils";
import { Appointment } from "@/types/appwrite.types";

import { AppointmentModal } from "../AppointmentModal";
import { StatusBadge } from "../StatusBadge";
import { AppointmentTableFeatures } from "./data-table-features";

const columnHelper = createColumnHelper<
  AppointmentTableFeatures,
  Appointment
>();

export const columns = columnHelper.columns([
  columnHelper.display({
    id: "patientId",
    header: "N° patient",
    cell: ({ row }) => (
      <p className="text-14-regular">{row.index + 1}</p>
    ),
  }),
  columnHelper.accessor("patient.name", {
    id: "patient",
    header: "Patient",
    cell: ({ getValue }) => <p className="text-14-medium">{getValue()}</p>,
  }),
  columnHelper.accessor("status", {
    header: "Statut",
    cell: ({ getValue }) => (
      <div className="min-w-[115px]">
        <StatusBadge status={getValue()} />
      </div>
    ),
  }),
  columnHelper.accessor("schedule", {
    header: "Rendez-vous",
    cell: ({ getValue }) => (
      <p className="text-14-regular min-w-[100px]">
        {formatDateTime(getValue()).dateTime}
      </p>
    ),
  }),
  columnHelper.accessor("primaryPhysician", {
    header: "Médecin",
    cell: ({ getValue }) => {
      const physician = getValue();
      const doctor = Doctors.find(({ name }) => name === physician);

      return (
        <div className="flex items-center gap-3">
          {doctor && (
            <Image
              src={doctor.image}
              alt={`Photo du Dr ${doctor.name}`}
              width={32}
              height={32}
              className="size-8 rounded-full"
            />
          )}
          <p className="whitespace-nowrap">Dr {physician}</p>
        </div>
      );
    },
  }),
  columnHelper.display({
    id: "actions",
    header: () => <div className="pl-4">Actions</div>,
    cell: ({ row }) => {
      const appointment = row.original;

      return (
        <div className="flex gap-1">
          <AppointmentModal
            patientId={appointment.patient.$id}
            userId={appointment.userId}
            appointment={appointment}
            type="schedule"
            title="Planifier le rendez-vous"
            description="Confirmez les informations du rendez-vous."
          />
          <AppointmentModal
            patientId={appointment.patient.$id}
            userId={appointment.userId}
            appointment={appointment}
            type="cancel"
            title="Annuler le rendez-vous"
            description="Souhaitez-vous vraiment annuler ce rendez-vous ?"
          />
        </div>
      );
    },
  }),
]);
