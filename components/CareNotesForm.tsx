"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import CustomFormField from "./CustomFormField";
import { FormFieldType } from "@/constants"
import SubmitButton from "./SubmitButton";
import { CareNoteValidation, CareNoteValues } from "@/lib/validation";
import { addCareNote } from "@/lib/actions/nurse.actions";
import { CareNoteTypes } from "@/constants";

interface CareNotesFormProps {
  patientId: string;
  nurseId: string;
  appointmentId?: string;
  onSuccess?: () => void;
}

// ── Badge type de note ────────────────────────────────────────
const NoteTypeBadge = ({
  type,
  selected,
  onClick,
}: {
  type: { value: string; label: string; color: string };
  selected: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-full px-3 py-1 text-12-semibold text-white transition-all ${
      selected
        ? `${type.color} ring-2 ring-white ring-offset-2 ring-offset-dark-400`
        : "bg-dark-500 opacity-60 hover:opacity-100"
    }`}
  >
    {type.label}
  </button>
);

// ── Composant principal ───────────────────────────────────────
const CareNotesForm = ({
  patientId,
  nurseId,
  appointmentId,
  onSuccess,
}: CareNotesFormProps) => {
  const [isLoading, setIsLoading]     = useState(false);
  const [success, setSuccess]         = useState(false);
  const [isOpen, setIsOpen]           = useState(false);
  const [selectedType, setSelectedType] = useState<string>("observation");

  const form = useForm<CareNoteValues>({
    resolver: zodResolver(CareNoteValidation),
    defaultValues: {
      note:          "",
      type:          "observation",
      appointmentId: appointmentId || "",
    },
  });
  const noteValue = useWatch({ control: form.control, name: "note" });

  const onSubmit = async (values: CareNoteValues) => {
    setIsLoading(true);
    try {
      await addCareNote({
        patientId,
        nurseId,
        appointmentId,
        note:      values.note,
        type:      values.type,
        createdAt: new Date(),
      });
      setSuccess(true);
      form.reset({
        note:          "",
        type:          "observation",
        appointmentId: appointmentId || "",
      });
      setSelectedType("observation");
      onSuccess?.();
      setTimeout(() => {
        setSuccess(false);
        setIsOpen(false);
      }, 2000);
    } catch (error) {
      console.error("Erreur ajout note de soin :", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Changer le type via les badges ET le form
  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    form.setValue("type", value as CareNoteValues["type"]);
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
          <span className="text-green-500 text-lg">📝</span>
          <span className="text-14-medium text-white">
            Ajouter une note de soin
          </span>
        </div>
        <span className="text-dark-600 text-lg">{isOpen ? "▲" : "▼"}</span>
      </button>

      {/* Formulaire dépliable */}
      {isOpen && (
        <div className="rounded-xl border border-dark-500 bg-dark-400 p-5 space-y-5">

          {/* Message de succès */}
          {success && (
            <div className="flex items-center gap-2 rounded-lg bg-green-600 p-3">
              <span className="text-white text-lg">✅</span>
              <p className="text-14-medium text-white">
                Note de soin ajoutée avec succès !
              </p>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

              {/* ── Sélection du type ── */}
              <div className="space-y-2">
                <p className="text-14-medium text-dark-700">
                  Type de note
                </p>
                <div className="flex flex-wrap gap-2">
                  {CareNoteTypes.map((type) => (
                    <NoteTypeBadge
                      key={type.value}
                      type={type}
                      selected={selectedType === type.value}
                      onClick={() => handleTypeChange(type.value)}
                    />
                  ))}
                </div>
                {/* Champ caché pour react-hook-form */}
                <input
                  type="hidden"
                  {...form.register("type")}
                  value={selectedType}
                />
                {form.formState.errors.type && (
                  <p className="shad-error text-12-regular">
                    {form.formState.errors.type.message}
                  </p>
                )}
              </div>

              {/* ── Bannière urgence ── */}
              {selectedType === "urgence" && (
                <div className="flex items-center gap-3 rounded-lg bg-red-600 p-3">
                  <span className="text-xl">🚨</span>
                  <div>
                    <p className="text-14-medium text-white">
                      Note d&apos;urgence
                    </p>
                    <p className="text-12-regular text-red-200">
                      Cette note sera mise en évidence dans le dossier patient.
                      Notifiez immédiatement le médecin responsable.
                    </p>
                  </div>
                </div>
              )}

              {/* ── Zone de texte principale ── */}
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="note"
                label="Contenu de la note"
                placeholder={
                  selectedType === "observation"
                    ? "Décrivez vos observations sur l'état du patient..."
                    : selectedType === "soin"
                    ? "Décrivez le soin effectué (procédure, matériel utilisé, réaction du patient)..."
                    : selectedType === "medicament"
                    ? "Précisez le médicament, la dose administrée, l'heure et la voie d'administration..."
                    : selectedType === "urgence"
                    ? "Décrivez l'urgence de façon précise : symptômes, heure de survenue, mesures prises..."
                    : "Détaillez le suivi effectué..."
                }
              />

              {/* ── Compteur de caractères ── */}
              <div className="flex justify-between">
                <p className="text-12-regular text-dark-600">
                  {noteValue?.length || 0} / 2000 caractères
                </p>
                {(noteValue?.length || 0) < 5 && (
                  <p className="text-12-regular text-dark-600">
                    Minimum 5 caractères requis
                  </p>
                )}
              </div>

              {/* ── Modèles rapides ── */}
              <div className="space-y-2">
                <p className="text-12-regular text-dark-600">
                  Modèles rapides :
                </p>
                <div className="flex flex-wrap gap-2">
                  {getTemplates(selectedType).map((template) => (
                    <button
                      key={template}
                      type="button"
                      onClick={() => form.setValue("note", template)}
                      className="rounded-md bg-dark-300 px-3 py-1 text-12-regular text-dark-700 hover:bg-dark-500 hover:text-white transition-all text-left"
                    >
                      {template.length > 40
                        ? template.substring(0, 40) + "..."
                        : template}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Boutons ── */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    form.reset();
                    setSelectedType("observation");
                    setIsOpen(false);
                  }}
                  className="shad-gray-btn flex-1 rounded-lg px-4 py-2"
                >
                  Annuler
                </button>
                <SubmitButton
                  isLoading={isLoading}
                  className={`flex-1 rounded-lg px-4 py-2 text-white ${
                    selectedType === "urgence"
                      ? "bg-red-700 hover:bg-red-600"
                      : "shad-primary-btn"
                  }`}
                >
                  {selectedType === "urgence"
                    ? "🚨 Enregistrer l'urgence"
                    : "Enregistrer la note"}
                </SubmitButton>
              </div>

            </form>
          </Form>
        </div>
      )}
    </div>
  );
};

// ── Modèles de notes selon le type ───────────────────────────
function getTemplates(type: string): string[] {
  const templates: Record<string, string[]> = {
    observation: [
      "Patient conscient et orienté dans le temps et l'espace.",
      "Patient algique, EVA à [score]/10. Surveillance en cours.",
      "Patient calme, coopérant. Constantes stables.",
      "Patient anxieux, nécessite réassurance.",
    ],
    soin: [
      "Pansement effectué au niveau de [localisation]. Plaie propre et cicatrisation satisfaisante.",
      "Injection de [médicament] effectuée en IM à [heure]. Patient tolérant bien.",
      "Pose de voie veineuse périphérique en [localisation]. Perméable et fonctionnelle.",
      "Soin d'hygiène complet effectué. Patient autonome / aidé.",
    ],
    medicament: [
      "Administration de [médicament] [dose] mg par voie [orale/IV/IM] à [heure].",
      "Médicament administré selon prescription. Pas d'effet secondaire noté.",
      "Patient refuse la prise médicamenteuse. Médecin informé.",
      "Médicament anti-douleur administré. Réévaluation dans 30 minutes.",
    ],
    urgence: [
      "URGENCE : Patient présentant une douleur thoracique intense. Médecin alerté à [heure].",
      "URGENCE : Chute du patient. Bilan lésionnel en cours. Médecin prévenu.",
      "URGENCE : Détresse respiratoire. O2 posé, médecin en route.",
      "URGENCE : Hypoglycémie sévère. Resucrage effectué. Surveillance en cours.",
    ],
    suivi: [
      "Suivi post-opératoire J+[nombre]. Évolution favorable.",
      "Bilan de sortie effectué. Patient informé des consignes.",
      "Appel de la famille pour information sur l'état du patient.",
      "Transmissions effectuées à l'équipe de nuit.",
    ],
  };
  return templates[type] || [];
}

export default CareNotesForm;