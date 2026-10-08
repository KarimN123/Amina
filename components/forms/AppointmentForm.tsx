"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { SelectItem } from "@/components/ui/select";
import { Doctors, FormFieldType } from "@/constants";
import {
  createAppointment,
  updateAppointment,
} from "@/lib/actions/appointment.actions";
import { getAppointmentSchema } from "@/lib/validation";
import { Appointment } from "@/types/appwrite.types";

import "react-datepicker/dist/react-datepicker.css";

import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { Form } from "../ui/form";

export const AppointmentForm = ({
  userId,
  patientId,
  type = "create",
  appointment,
  setOpen,
}: {
  userId: string;
  patientId: string;
  type: "create" | "schedule" | "cancel";
  appointment?: Appointment;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const appointmentFormValidation = getAppointmentSchema(type);

  const form = useForm<z.infer<typeof appointmentFormValidation>>({
    resolver: zodResolver(appointmentFormValidation),
    defaultValues: {
      primaryPhysician: appointment?.primaryPhysician ?? "",
      schedule: appointment ? new Date(appointment.schedule) : undefined,
      reason: appointment?.reason ?? "",
      note: appointment?.note || "",
      cancellationReason: appointment?.cancellationReason || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof appointmentFormValidation>) => {
    setIsLoading(true);
    setErrorMessage(null);
    const status: Status =
      type === "schedule"
        ? "scheduled"
        : type === "cancel"
          ? "cancelled"
          : "pending";

    try {
      if (type === "create" && patientId) {
        const appointmentToCreate = {
          userId,
          patient: patientId,
          primaryPhysician: values.primaryPhysician,
          schedule: new Date(values.schedule),
          reason: values.reason,
          status,
          note: values.note,
        };

        const newAppointment = await createAppointment(appointmentToCreate);

        if (!newAppointment) {
          throw new Error("La création du rendez-vous a échoué.");
        }
        form.reset();
        router.push(
          `/patients/${userId}/new-appointment/success?appointmentId=${newAppointment.$id}`
        );
      } else {
        if (!appointment) {
          throw new Error("Un rendez-vous est requis pour mettre à jour son statut.");
        }

        const appointmentToUpdate = {
          userId,
          appointmentId: appointment.$id,
          appointment: {
            primaryPhysician: values.primaryPhysician,
            schedule: new Date(values.schedule),
            status,
            cancellationReason: values.cancellationReason,
          },
          type,
        };

        const updatedAppointment = await updateAppointment(appointmentToUpdate);

        if (!updatedAppointment) {
          throw new Error("La mise à jour du rendez-vous a échoué.");
        }
        setOpen?.(false);
        form.reset();
        router.refresh();
      }
    } catch (error) {
      console.error("Échec de l’enregistrement du rendez-vous.", error);
      setErrorMessage("Impossible d’enregistrer le rendez-vous. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  let buttonLabel;
  switch (type) {
    case "cancel":
      buttonLabel = "Annuler le rendez-vous";
      break;
    case "schedule":
      buttonLabel = "Planifier le rendez-vous";
      break;
    default:
      buttonLabel = "Envoyer la demande de rendez-vous";
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
        {type === "create" && (
          <section className="mb-12 space-y-4">
            <h1 className="header">Nouveau rendez-vous</h1>
            <p className="text-dark-700">
              Demandez un rendez-vous en quelques secondes.
            </p>
          </section>
        )}

        {type !== "cancel" && (
          <>
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="primaryPhysician"
              label="Médecin"
              placeholder="Sélectionnez un médecin"
            >
              {Doctors.map((doctor, i) => (
                <SelectItem key={doctor.name + i} value={doctor.name}>
                  <div className="flex cursor-pointer items-center gap-2">
                    <Image
                      src={doctor.image}
                      width={32}
                      height={32}
                      alt={`Photo du Dr ${doctor.name}`}
                      className="rounded-full border border-dark-500"
                    />
                    <p>{doctor.name}</p>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>

            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="schedule"
              label="Date et heure souhaitées"
              showTimeSelect
              dateFormat="dd/MM/yyyy - HH:mm"
            />

            <div
              className={`flex flex-col gap-6  ${type === "create" && "xl:flex-row"}`}
            >
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="reason"
                label="Motif du rendez-vous"
                placeholder="Bilan de santé annuel"
                disabled={type === "schedule"}
              />

              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="note"
                label="Commentaires et notes"
                placeholder="Je préfère un rendez-vous l’après-midi, si possible"
                disabled={type === "schedule"}
              />
            </div>
          </>
        )}

        {type === "cancel" && (
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="cancellationReason"
            label="Motif de l’annulation"
            placeholder="Un impératif m’empêche de venir"
          />
        )}

        {errorMessage && (
          <p className="shad-error" role="alert">
            {errorMessage}
          </p>
        )}

        <SubmitButton
          isLoading={isLoading}
        className={`${type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"} w-full`}
        >
          {buttonLabel}
        </SubmitButton>
      </form>
    </Form>
  );
};