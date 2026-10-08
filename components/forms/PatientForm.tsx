'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useState } from "react"
import { useRouter } from "next/navigation"

import { Form } from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import { SubmitButton } from "../SubmitButton"
import { UserFormValidation } from "@/lib/validation"
import { createUser } from "@/lib/actions/patient.actions"
import { FormFieldType } from "@/constants"


const PatientForm = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof UserFormValidation>) => {
    setIsLoading(true)

    try {
      const userData = {
        name: values.name,
        email: values.email,
        phone: values.phone,
      }

      const newUser = await createUser(userData)

      if (newUser) {
        router.push(`/patients/${newUser.$id}/register`)
      }
    } catch (error) {
      console.error("Erreur lors de la création de l'utilisateur :", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex-1">
        <section className="mb-12 space-y-4">
          <h1 className="header">Salut 👋</h1>
          <p className="text-dark-700">Planifiez votre premier rendez-vous</p>
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

        <SubmitButton isLoading={isLoading}> Commencer</SubmitButton>
      </form>
    </Form>
  )
}

export default PatientForm