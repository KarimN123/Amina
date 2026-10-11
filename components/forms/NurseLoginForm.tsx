// components/forms/NurseLoginForm.tsx

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form } from '@/components/ui/form'
import CustomFormField from '../CustomFormField'
import { FormFieldType } from "@/constants"
import SubmitButton from '../SubmitButton'
import { loginNurse } from '@/lib/actions/nurse.actions'
import { encryptKey } from '@/lib/utils'

const NurseLoginSchema = z.object({
  email: z.string().email('Email invalide'),
  passkey: z.string().min(4, 'Passkey requis'),
})

const NurseLoginForm = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const form = useForm<z.infer<typeof NurseLoginSchema>>({
    resolver: zodResolver(NurseLoginSchema),
    defaultValues: { email: '', passkey: '' },
  })

  const onSubmit = async (values: z.infer<typeof NurseLoginSchema>) => {
    setIsLoading(true)
    setError('')

    try {
      const nurse = await loginNurse(values.email, values.passkey)

      if (nurse) {
        // Stocker la session infirmier
        const encryptedKey = encryptKey(values.passkey)
        sessionStorage.setItem('nurseId', nurse.$id)
        sessionStorage.setItem('nurseKey', encryptedKey)

        router.push(`/nurse/${nurse.$id}`)
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Identifiants incorrects')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          inputType="password"
          control={form.control}
          name="email"
          label="Email professionnel"
          placeholder="infirmier@hopital.sn"
          iconSrc="/assets/icons/email.svg"
          iconAlt="email"
        />

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="passkey"
          label="Code d'accès"
          placeholder="Votre passkey"
          iconSrc="/assets/icons/lock.svg"
          iconAlt="passkey"
        />

        {error && (
          <p className="shad-error text-14-regular">{error}</p>
        )}

        <SubmitButton isLoading={isLoading}>
          Se connecter
        </SubmitButton>

      </form>
    </Form>
  )
}

export default NurseLoginForm