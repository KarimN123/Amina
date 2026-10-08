"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Appointment } from "@/types/appwrite.types";

import { AppointmentForm } from "./forms/AppointmentForm";

type AppointmentModalProps = {
  type: "schedule" | "cancel";
  patientId: string;
  userId: string;
  appointment?: Appointment;
  title?: string;
  description?: string;
};

export const AppointmentModal = ({
  type,
  patientId,
  userId,
  appointment,
  title,
  description,
}: AppointmentModalProps) => {
  const [open, setOpen] = useState(false);
  const isScheduleAction = type === "schedule";
  const actionLabel = isScheduleAction
    ? "Planifier le rendez-vous"
    : "Annuler le rendez-vous";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className={`capitalize ${
            isScheduleAction ? "text-green-500" : "text-red-500"
          }`}
        >
          {isScheduleAction ? "Planifier" : "Annuler"}
        </Button>
      </DialogTrigger>
      <DialogContent className="shad-dialog sm:max-w-md">
        <DialogHeader className="mb-4 space-y-3">
          <DialogTitle>{title ?? actionLabel}</DialogTitle>
          <DialogDescription>
            {description ??
              (isScheduleAction
                ? "Confirmez les informations du rendez-vous."
                : "Souhaitez-vous vraiment annuler ce rendez-vous ?")}
          </DialogDescription>
        </DialogHeader>
        <AppointmentForm
          userId={userId}
          patientId={patientId}
          type={type}
          appointment={appointment}
          setOpen={setOpen}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentModal;
