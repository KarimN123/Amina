import Image from "next/image";
import { redirect } from "next/navigation";
import { AppointmentForm } from '@/components/forms/AppointmentForm';
import { getPatient } from '@/lib/actions/patient.actions';

const NewAppointment = async ({
  params,
}: {
  params: Promise<{ userId: string }>;
}) => {
  const { userId } = await params;

  const patient = await getPatient(userId);

  if (!patient) {
    redirect(`/patients/${userId}/register`);
  }

  return (
    <div className="flex h-screen max-h-screen">
      
        <section className="remove-scrollbar container my-auto">
          <div className="sub-container max-w-[860px] flex-1 justify-betwenn">
            <Image
              src="/assets/icons/logo-full.svg"
              height={1000}
              width={1000}
              alt="Logo AminaCare"
              className="mb-12 h-10 w-fit" 
            />

            <AppointmentForm
                type="create"
                userId={userId}
                patientId={patient.$id}
            />

            <p className="copyright mt-10 py-12"> 
                © 2026 Amina
            </p>           
          </div>
        </section>
        <Image
        src="/assets/images/appointment-img.png"
        height={1000}
        width={1000}
        alt="Illustration de rendez-vous"
        className="side-img max-w-[390px] bg-bottom"
        />
    </div>
  );
}


export default NewAppointment