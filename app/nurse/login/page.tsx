// app/nurse/login/page.tsx

import NurseLoginForm from '@/components/forms/NurseLoginForm';
import NurseRegistrationForm from '@/components/forms/NurseRegistrationForm'
import Image from 'next/image'

const NurseLogin = () => {
  return (
    <div className="flex min-h-screen">
      <section className="remove-scrollbar container my-auto max-h-screen overflow-y-auto py-8">
        <div className="sub-container max-w-3xl">

          {/* Logo */}
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="CarePulse"
            className="mb-12 h-10 w-fit"
          />

          {/* Titre */}
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Espace Infirmier</h2>
            <p className="text-dark-700">
              Connectez-vous pour accéder aux dossiers patients
            </p>
          </div>

          {/* Formulaire */}
          <NurseLoginForm />

          <div className="my-10 border-t border-dark-500" />

          <NurseRegistrationForm />

          {/* Copyright */}
          <p className="copyright mt-8">
            © 2026 CarePulse — Espace Soignant
          </p>
        </div>
      </section>

      {/* Image côté droit */}
      <Image
        src="/assets/images/onboarding-img.png"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[50%]"
      />
    </div>
  )
}

export default NurseLogin