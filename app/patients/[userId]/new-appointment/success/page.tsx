import { Button } from '@/components/ui/button';
import { Doctors } from '@/constants';
import { getAppointment } from '@/lib/actions/appointment.actions';
import { formatDateTime } from '@/lib/utils';
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

const Success = async ({
    params,
    searchParams,
}: {
    params: Promise<{ userId: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
    const { userId } = await params
    const query = await searchParams
    const appointmentId = query.appointmentId
    if (typeof appointmentId !== 'string' || !appointmentId) {
        notFound()
    }

    const appointment = await getAppointment(appointmentId)
    if (!appointment) {
        notFound()
    }

    const doctor = Doctors.find((doc) => doc.name === appointment.primaryPhysician)


  return (
    <div className='flex h-screen px-[5%]'>
        <div className='success-img'>
            <Link href='/'>
                <Image
                    src="/assets/icons/logo-full.svg"
                    height={1000}
                    width={1000}
                    alt='Logo AminaCare'
                    className='h-10 w-fit' 
                />
            </Link>
            <section className='flex flex-col items-center'>
                <Image
                    src="/assets/gifs/success.gif"
                    width={280}
                    height={300}
                    alt='Confirmation réussie'
                />
           
                <h2 className='header mb-6 max-w-[600px] text-center'>
                    Votre <span className='text-green-500'>rendez-vous a été soumis avec succès</span>
                </h2>
                <p>Nous vous recontacterons bientôt pour confirmer</p>
            </section>
            <section className='request-details'>
                <p>Détails du rendez-vous demandé :</p>
                <div className='flex items-center gap-3'>
                    {doctor ? (
                        <>
                            <Image
                                src={doctor.image}
                                width={48}
                                height={48}
                                alt={`Photo du Dr ${doctor.name}`}
                                className='size-12 rounded-full object-cover'
                            />
                            <p className='whitespace-nowrap'>Dr {doctor.name}</p>
                        </>
                    ) : (
                        <span>Médecin : {appointment.primaryPhysician}</span>
                    )}
                </div>
                <div className='flex gap-2'>
                    <Image
                        src="/assets/icons/calendar.svg"
                        width={24}
                        height={24}
                        alt='Calendrier'
                        />      
                        <p>{formatDateTime(appointment.schedule).dateTime}</p>
                </div>
            </section>
            <Button
                variant="outline"
                className="shad-primary-btn"
                render={<Link href={`/patients/${userId}/new-appointment`} />}
            >
                Nouveau rendez-vous
            </Button>
            <p className='copyright'> © 2026 Amina</p>
        </div>
    </div>
  )
}

export default Success