'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl } from '@/components/ui/form'
import { SelectItem } from '@/components/ui/select'
import CustomFormField from '../CustomFormField'
import SubmitButton from '../SubmitButton'
import { FormFieldType, NurseDepartments, NurseRoles } from '@/constants'
import { createNurse } from '@/lib/actions/nurse.actions'
import { CreateNurseValidation, type CreateNurseValues } from '@/lib/validation'

const NurseRegistrationForm = () => {
  const [adminPasskey, setAdminPasskey] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const form = useForm<CreateNurseValues>({
    resolver: zodResolver(CreateNurseValidation),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      role: 'infirmier',
      department: 'Médecine Générale',
      registrationNumber: '',
      passkey: '',
      confirmPasskey: '',
    },
  })

  const onSubmit = async (values: CreateNurseValues) => {
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const nurse = await createNurse(values, adminPasskey)
      setSuccess(`Compte créé pour ${nurse.name}. L’infirmier peut maintenant se connecter.`)
      form.reset()
    } catch (submitError: unknown) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Impossible de créer le compte infirmier.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="space-y-6 rounded-2xl bg-dark-300 p-6">
      <div className="space-y-1">
        <h2 className="sub-header">Créer un compte infirmier</h2>
        <p className="text-dark-700">
          Cette opération est réservée à l’administrateur.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="name"
              label="Nom complet"
              placeholder="Nom de l’infirmier"
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="email"
              label="E-mail professionnel"
              placeholder="infirmier@hopital.sn"
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="phone"
              label="Téléphone international"
              placeholder="+221XXXXXXXXX"
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="registrationNumber"
              label="Numéro professionnel"
              placeholder="Numéro d’ordre"
            />
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="role"
              label="Fonction"
              placeholder="Sélectionner une fonction"
            >
              {NurseRoles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </CustomFormField>
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="department"
              label="Service"
              placeholder="Sélectionner un service"
            >
              {NurseDepartments.map((department) => (
                <SelectItem key={department} value={department}>
                  {department}
                </SelectItem>
              ))}
            </CustomFormField>
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              inputType="password"
              control={form.control}
              name="passkey"
              label="Code d’accès infirmier"
              placeholder="Au moins 6 caractères"
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              inputType="password"
              control={form.control}
              name="confirmPasskey"
              label="Confirmer le code d’accès"
              placeholder="Répéter le code d’accès"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="admin-passkey" className="text-14-medium text-white">
              Clé d’accès administrateur
            </label>
            <FormControl>
              <input
                id="admin-passkey"
                type="password"
                autoComplete="current-password"
                required
                value={adminPasskey}
                onChange={(event) => setAdminPasskey(event.target.value)}
                className="shad-input w-full"
              />
            </FormControl>
            <p className="text-12-regular text-dark-600">
              Elle est vérifiée côté serveur et n’est pas enregistrée avec le compte.
            </p>
          </div>

          {error && <p className="shad-error text-14-regular">{error}</p>}
          {success && <p className="text-14-regular text-green-500">{success}</p>}

          <SubmitButton isLoading={isLoading}>
            Créer le compte infirmier
          </SubmitButton>
        </form>
      </Form>
    </section>
  )
}

export default NurseRegistrationForm
