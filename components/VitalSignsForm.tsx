"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import CustomFormField from "./CustomFormField";
import { FormFieldType } from "@/constants"
import SubmitButton from "./SubmitButton";
import { VitalSignsValidation, VitalSignsValues } from "@/lib/validation";
import { recordVitalSigns } from "@/lib/actions/nurse.actions";
import { VitalSignsAlerts } from "@/constants";

interface VitalSignsFormProps {
  patientId: string;
  nurseId: string;
  onSuccess?: () => void;
}

// ── Composant badge d'alerte ──────────────────────────────────
const AlertBadge = ({
  value,
  min,
  max,
  unit,
}: {
  value: number;
  min: number;
  max: number;
  unit: string;
}) => {
  if (!value) return null;
  const isNormal = value >= min && value <= max;
  return (
    <span
      className={`text-12-semibold rounded-full px-2 py-0.5 ${
        isNormal ? "bg-green-600 text-white" : "bg-red-600 text-white"
      }`}
    >
      {isNormal ? "Normal" : "⚠️ Anormal"} ({value} {unit})
    </span>
  );
};

// ── Composant principal ───────────────────────────────────────
const VitalSignsForm = ({ patientId, nurseId, onSuccess }: VitalSignsFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<VitalSignsValues>({
    resolver: zodResolver(VitalSignsValidation),
    defaultValues: {
      bloodPressure:     "",
      heartRate:         undefined,
      temperature:       undefined,
      oxygenSaturation:  undefined,
      weight:            undefined,
      height:            undefined,
      respiratoryRate:   undefined,
      bloodGlucose:      undefined,
      notes:             "",
    },
  });

  const watchedValues = useWatch({ control: form.control });

  const onSubmit = async (values: VitalSignsValues) => {
    setIsLoading(true);
    setError("");
    setSuccess(false);
    try {
      await recordVitalSigns({
        patientId,
        nurseId,
        ...values,
        measuredAt: new Date(),
      });
      setSuccess(true);
      form.reset();
      onSuccess?.();
      setTimeout(() => {
        setSuccess(false);
        setIsOpen(false);
      }, 2000);
    } catch (error) {
      console.error("Erreur enregistrement constantes :", error);
      setError(
        error instanceof Error
          ? error.message
          : "Impossible d’enregistrer les constantes vitales."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">

      {/* Bouton toggle */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-lg bg-dark-400 p-3 text-left transition-all hover:bg-dark-500"
      >
        <div className="flex items-center gap-2">
          <span className="text-green-500 text-lg">📊</span>
          <span className="text-14-medium text-white">
            Enregistrer de nouvelles constantes vitales
          </span>
        </div>
        <span className="text-dark-600 text-lg">{isOpen ? "▲" : "▼"}</span>
      </button>

      {/* Formulaire dépliable */}
      {isOpen && (
        <div className="rounded-xl border border-dark-500 bg-dark-400 p-5 space-y-6">

          {/* Message de succès */}
          {success && (
            <div className="flex items-center gap-2 rounded-lg bg-green-600 p-3">
              <span className="text-white text-lg">✅</span>
              <p className="text-14-medium text-white">
                Constantes vitales enregistrées avec succès !
              </p>
            </div>
          )}
          {error && (
            <p role="alert" className="shad-error text-14-regular">
              {error}
            </p>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

              {/* ── Section 1 : Constantes obligatoires ── */}
              <div>
                <h3 className="text-14-medium text-dark-700 mb-4 pb-2 border-b border-dark-500">
                  Constantes obligatoires
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                  {/* Tension artérielle */}
                  <div className="space-y-1">
                    <CustomFormField
                      fieldType={FormFieldType.INPUT}
                      control={form.control}
                      name="bloodPressure"
                      label="Tension artérielle (mmHg)"
                      placeholder="120/80"
                      iconSrc="/assets/icons/heart.svg"
                      iconAlt="tension"
                    />
                    <p className="text-12-regular text-dark-600">
                      Format : systolique/diastolique
                    </p>
                  </div>

                  {/* Fréquence cardiaque */}
                  <div className="space-y-1">
                    <CustomFormField
                      fieldType={FormFieldType.INPUT}
                      control={form.control}
                      name="heartRate"
                      inputType="number"
                      label="Fréquence cardiaque (bpm)"
                      placeholder="72"
                      iconSrc="/assets/icons/heart.svg"
                      iconAlt="pouls"
                    />
                    {watchedValues.heartRate && (
                      <AlertBadge
                        value={watchedValues.heartRate}
                        min={VitalSignsAlerts.heartRate.min}
                        max={VitalSignsAlerts.heartRate.max}
                        unit="bpm"
                      />
                    )}
                  </div>

                  {/* Température */}
                  <div className="space-y-1">
                    <CustomFormField
                      fieldType={FormFieldType.INPUT}
                      control={form.control}
                      name="temperature"
                      inputType="number"
                      label="Température (°C)"
                      placeholder="37.2"
                      iconSrc="/assets/icons/stat-roentgen.svg"
                      iconAlt="température"
                    />
                    {watchedValues.temperature && (
                      <AlertBadge
                        value={watchedValues.temperature}
                        min={VitalSignsAlerts.temperature.min}
                        max={VitalSignsAlerts.temperature.max}
                        unit="°C"
                      />
                    )}
                  </div>

                  {/* SpO2 */}
                  <div className="space-y-1">
                    <CustomFormField
                      fieldType={FormFieldType.INPUT}
                      control={form.control}
                      name="oxygenSaturation"
                      inputType="number"
                      label="Saturation en oxygène - SpO2 (%)"
                      placeholder="98"
                      iconSrc="/assets/icons/stat-roentgen.svg"
                      iconAlt="spo2"
                    />
                    {watchedValues.oxygenSaturation && (
                      <AlertBadge
                        value={watchedValues.oxygenSaturation}
                        min={VitalSignsAlerts.oxygenSaturation.min}
                        max={VitalSignsAlerts.oxygenSaturation.max}
                        unit="%"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* ── Section 2 : Constantes optionnelles ── */}
              <div>
                <h3 className="text-14-medium text-dark-700 mb-4 pb-2 border-b border-dark-500">
                  Constantes optionnelles
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="weight"
                    inputType="number"
                    label="Poids (kg)"
                    placeholder="70"
                    iconSrc="/assets/icons/stat-roentgen.svg"
                    iconAlt="poids"
                  />

                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="height"
                    inputType="number"
                    label="Taille (cm)"
                    placeholder="175"
                    iconSrc="/assets/icons/stat-roentgen.svg"
                    iconAlt="taille"
                  />

                  <div className="space-y-1">
                    <CustomFormField
                      fieldType={FormFieldType.INPUT}
                      control={form.control}
                      name="respiratoryRate"
                      inputType="number"
                      label="Fréquence respiratoire (/min)"
                      placeholder="16"
                      iconSrc="/assets/icons/stat-roentgen.svg"
                      iconAlt="respiration"
                    />
                    {watchedValues.respiratoryRate && (
                      <AlertBadge
                        value={watchedValues.respiratoryRate}
                        min={VitalSignsAlerts.respiratoryRate.min}
                        max={VitalSignsAlerts.respiratoryRate.max}
                        unit="/min"
                      />
                    )}
                  </div>

                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="bloodGlucose"
                    inputType="number"
                    label="Glycémie (mg/dL)"
                    placeholder="90"
                    iconSrc="/assets/icons/stat-roentgen.svg"
                    iconAlt="glycémie"
                  />
                </div>
              </div>

              {/* ── IMC calculé automatiquement ── */}
              {watchedValues.weight && watchedValues.height && (
                <div className="rounded-lg bg-dark-300 p-3">
                  <p className="text-12-regular text-dark-600 mb-1">
                    IMC calculé automatiquement
                  </p>
                  <p className="text-16-semibold text-white">
                    {(
                      watchedValues.weight /
                      Math.pow(watchedValues.height / 100, 2)
                    ).toFixed(1)}{" "}
                    kg/m²
                    <span className="ml-2 text-12-regular text-dark-600">
                      {(() => {
                        const imc =
                          watchedValues.weight /
                          Math.pow(watchedValues.height / 100, 2);
                        if (imc < 18.5) return "— Insuffisance pondérale";
                        if (imc < 25)   return "— Poids normal ✅";
                        if (imc < 30)   return "— Surpoids";
                        return "— Obésité";
                      })()}
                    </span>
                  </p>
                </div>
              )}

              {/* ── Notes ── */}
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="notes"
                label="Observations infirmières"
                placeholder="Ajoutez vos observations sur les constantes du patient..."
              />

              {/* ── Boutons ── */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="shad-gray-btn flex-1 rounded-lg px-4 py-2"
                >
                  Annuler
                </button>
                <SubmitButton isLoading={isLoading} className="shad-primary-btn flex-1">
                  Enregistrer les constantes
                </SubmitButton>
              </div>

            </form>
          </Form>
        </div>
      )}
    </div>
  );
};

export default VitalSignsForm;