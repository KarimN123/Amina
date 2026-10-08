import { StatusIcon } from '@/constants'
import clsx from 'clsx'
import Image from 'next/image'
import React from 'react'

const statusLabels: Record<Status, string> = {
  scheduled: "Planifié",
  pending: "En attente",
  cancelled: "Annulé",
}

export const StatusBadge = ({status}: {status: Status}) => {
  return (
    <div className={clsx('status-badge', {
        'bg-green-500/15': status === 'scheduled',
        'bg-blue-500/15':  status === 'pending',
        'bg-red-500/15':  status === 'cancelled',
    })}>
        <Image
            src={StatusIcon[status]}
            width={24}
            height={24}
            alt={`Statut : ${statusLabels[status]}`}
            className='h-fit w-3' 
        />
        <p className={clsx('text-12-semibold capitalize', {
          "text-green-500": status === "scheduled",
          "text-blue-500": status === "pending",
          "text-red-500": status === "cancelled",
        })}>{statusLabels[status]}</p>
    </div>
  )

}
export default StatusBadge