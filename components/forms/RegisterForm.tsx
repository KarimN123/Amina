"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation";
import { Form, FormControl } from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import { SubmitButton } from "../SubmitButton"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { SelectItem } from "@/components/ui/select"

import { PatientFormValidation } from "@/lib/validation"
import {
  Doctors,
  GenderOptions,
  IdentificationTypes,
  PatientFormDefaultValues,
  FormFieldType,
} from "@/constants"

import FileUploader from "../FileUploader"
import { registerPatient } from "@/lib/actions/patient.actions"


const RegisterForm = ({ user }: { user: User }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
  })

  const onSubmit = async (values: z.infer<typeof PatientFormValidation>) => {
    setIsLoading(true)
    setSubmitError(null)

    let formData;

    if (values.identificationDocument && values.identificationDocument.length > 0) {
      const blobFile = new Blob([values.identificationDocument[0]], 
        { type: values.identificationDocument[0].type }); 

        formData = new FormData();
        formData.append("blobFile", blobFile);
        formData.append("fileName", values.identificationDocument[0].name);
    }
    try {

      const patientData = {
        ...values,
        userId: user.$id,
        birthDate: new Date(values.birthDate),
        identificationDocument: formData,
      }
      const patient  = await registerPatient(patientData)
      
      if(patient) router.push(`/patients/${user.$id}/new-appointment`)

    } catch(error) {
      console.error("Error submitting form:", error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de l'inscription. Veuillez réessayer."
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-12 flex-1"
      >
        {/* ---------- HEADER ---------- */}
        <section className="space-y-4">
          <h1 className="header">Bienvenue ✋</h1>

          <p className="text-dark-700">Parlez-nous un peu de vous</p>
        </section>

        {/* ---------- INFOS PERSONNELLES ---------- */}
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Informations personnelles</h2>
          </div>
        </section>

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="name"
          label="Nom complet"
          placeholder="Jean Dupont"
          iconSrc="/assets/icons/user.svg"
          iconAlt="utilisateur"
        />

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="email"
            label="Adresse e-mail"
            placeholder="jean@exemple.fr"
            iconSrc="/assets/icons/email.svg"
            iconAlt="e-mail"
          />
          <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name="phone"
            label="Numéro de téléphone"
            placeholder="77 575 08 99"
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.DATE_PICKER}
            control={form.control}
            name="birthDate"
            label="Date de naissance"
          />

          <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="gender"
            label="Genre"
            renderSkeleton={(field) => (
              <FormControl>
                <RadioGroup
                  className="flex h-11 gap-6 xl:justify-between"
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  {GenderOptions.map((option) => (
                    <div key={option} className="radio-group">
                      <RadioGroupItem
                        value={option}
                        id={option}
                      />
                      <label
                        htmlFor={option}
                        className="cursor-pointer"
                      >
                        {option === "male" ? "Homme" : "Femme"}
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="address"
            label="Adresse"
            placeholder="Diabir"
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="occupation"
            label="Profession"
            placeholder="Étudiant"
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="emergencyContactName"
            label="Nom du contact d'urgence"
            placeholder="Jean Dupont"
          />
          <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name="emergencyContactNumber"
            label="Numéro du contact d'urgence"
            placeholder="77 575 09 99"
          />
        </div>

        {/* ---------- INFOS MÉDICALES ---------- */}
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Informations médicales</h2>
          </div>
        </section>

        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="primaryPhysician"
          label="Médecin traitant"
          placeholder="Sélectionnez un médecin"
        >
          {Doctors.map((doctor) => (
            <SelectItem key={doctor.name} value={doctor.name}>
              <div className="flex cursor-pointer items-center gap-2">
                <Image
                  src={doctor.image}
                  alt={doctor.name}
                  width={32}
                  height={32}
                  className="rounded-full border-2 border-dark-500"
                />
                <p>Dr {doctor.name}</p>
              </div>
            </SelectItem>
          ))}
        </CustomFormField>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="insuranceProvider"
            label="Assureur"
            placeholder="Sonam Assurance"
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="insurancePolicyNumber"
            label="Numéro de police d'assurance"
            placeholder="123456789"
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="allergies"
            label="Allergies"
            placeholder="Listez vos allergies connues"
          />
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="currentMedication"
            label="Médicaments actuels"
            placeholder="Listez vos médicaments actuels"
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="familyMedicalHistory"
            label="Antécédents familiaux"
            placeholder="ex : Mère : Diabète"
          />
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="pastMedicalHistory"
            label="Antécédents médicaux"
            placeholder="ex : Appendicectomie en 2015"
          />
        </div>

        {/* ---------- IDENTIFICATION ---------- */}
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Identification et vérification</h2>
          </div>
        </section>

        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="identificationType"
          label="Type de pièce d'identité"
          placeholder="Sélectionnez un type"
        >
          {IdentificationTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </CustomFormField>

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="identificationNumber"
          label="Numéro d'identification"
          placeholder="Entrez votre numéro"
        />

        {/* Le champ FileUpload sera ajouté plus tard dans le tuto */}

        <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="identificationDocument"
            label="Pièce d’identité numérisée"
            renderSkeleton={(field) => (
              <FormControl>
                <FileUploader files={field.value} onChange={field.onChange} />
              </FormControl>
              
            )}
        />
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Consentement et confidentialité</h2>
          </div>
        </section>

        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="treatmentConsent"
          label="J’accepte le traitement de mes données personnelles conformément à la politique de confidentialité."
        />

        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="disclosureConsent"
          label="J’accepte la communication de mes informations médicales à des tiers à des fins de soins."
        />
        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="privacyConsent"
          label="J’accepte la politique de confidentialité."
        />
      {submitError && (
        <p role="alert" className="text-sm font-medium text-destructive">
          {submitError}
        </p>
      )}
      <SubmitButton isLoading={isLoading}>Commencer</SubmitButton>
      </form>
    </Form>
  )
}

export default RegisterForm