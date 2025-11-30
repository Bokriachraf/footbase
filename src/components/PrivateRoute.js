'use client'

import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

export default function PrivateRoute({ children }) {
  const { footballeurInfo } = useSelector((state) => state.footballeurSignin || {})
  const router = useRouter()
  const pathname = usePathname()

  const hasShownToast = useRef(false) // ✅ empêche le toast double

  useEffect(() => {
    if (!footballeurInfo) {
      if (!hasShownToast.current) {
        toast.info("Merci de vous connecter ou de créer un compte pour suivre l'état de votre dossier.")
        hasShownToast.current = true // ✅ évite la répétition
      }
      router.push('/signin?redirect=/inscription')
    }
  }, [footballeurInfo, pathname, router])

  if (!footballeurInfo) return null

  return children
}
