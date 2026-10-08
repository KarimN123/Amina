'use client'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { encryptKey } from "@/lib/utils"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

const PasskeyModal = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const isAdmin = searchParams.get("admin") === "true"
    const open = isAdmin
    const adminPasskey = process.env.NEXT_PUBLIC_ADMIN_PASSKEY
    const [passkey, setPasskey] = useState("")
    const [error, setError] = useState("")

    useEffect(() => {
        if (!isAdmin || !adminPasskey) {
            return
        }

        const encryptedKey = window.localStorage.getItem("accessKey")
        if (adminPasskey && encryptedKey === encryptKey(adminPasskey)) {
            router.replace("/admin")
        }
    }, [adminPasskey, isAdmin, router])

    const validatePasskey = () => {
        if (adminPasskey && passkey === adminPasskey) {
            window.localStorage.setItem("accessKey", encryptKey(passkey))
            router.push("/admin")
            return
        }

        setError("Clé d’accès invalide. Veuillez réessayer.")
    }

    const closeModal = () => {
        router.push("/")
    }

  return (
        <AlertDialog open={open} onOpenChange={(nextOpen) => {
            if (!nextOpen && open) closeModal()
        }}>
            <AlertDialogContent className="shad-alert-dialog">
                <AlertDialogHeader>
                <AlertDialogTitle className="flex items-start justify-between">
                    Vérification de l’accès administrateur
                    <button
                        type="button"
                        onClick={closeModal}
                        aria-label="Fermer"
                        className="cursor-pointer"
                    >
                        <Image
                            src="/assets/icons/close.svg"
                            width={20}
                            height={20}
                            alt=""
                        />
                    </button>
                </AlertDialogTitle>
                <AlertDialogDescription>
                     Pour accéder à la page d’administration, veuillez entrer la clé d’accès
                </AlertDialogDescription>
                </AlertDialogHeader>

                <div>
                    <InputOTP
                        maxLength={6}
                        value={passkey}
                        onChange={(value) => {
                            setPasskey(value)
                            setError("")
                        }}
                    >
                    <InputOTPGroup className="shad-otp">
                        <InputOTPSlot className="shad-otp" index={0} />
                        <InputOTPSlot className="shad-otp" index={1} />
                        <InputOTPSlot className="shad-otp" index={2} />
                        <InputOTPSlot className="shad-otp" index={3} />
                        <InputOTPSlot className="shad-otp" index={4} />
                        <InputOTPSlot className="shad-otp" index={5} />
                    </InputOTPGroup>
                    </InputOTP>
                    {error && <p className="shad-error text-14-regular mt-4 flex justify-center">
                        {error}
                    </p>}
                </div>
                <AlertDialogFooter>
                <button
                    type="button"
                    onClick={validatePasskey}
                    className="shad-primary-btn w-full"
                >
                    Valider la clé d’accès
                </button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
  )
}
export default PasskeyModal