'use client'
import React, { useEffect,useState } from 'react'
import './topbar.css'
import { NotificationsNone, Language, Settings } from '@mui/icons-material'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import { listAllInscription } from '../../../../redux/actions/inscriptionActions' // ajuste le chemin si besoin

function Topbar() {
  const dispatch = useDispatch()
const [recentCount, setRecentCount] = useState(0)
  // 📦 Récupère tous les inscription pour l'admin
  const inscriptionAdminList = useSelector((state) => state.inscriptionAdminList)
  const { loading, error, inscription = [] } = inscriptionAdminList || {}

  // 🔄 Charger les inscription à chaque affichage
  useEffect(() => {
    dispatch(listAllInscription())
  }, [dispatch])
  useEffect(() => {
  if (inscription && inscription.length > 0) {
    const nonVus = inscription.filter((d) => d.vu === false).length
    setRecentCount(nonVus)
  }
}, [inscription])

  // 🟡 Compter les inscription non vus
  const nonVusCount = inscription.filter((d) => d.vu === false).length

  return (
    <div className="bg-black/60 topbar">
      <div className="topbarWrapper">
        <div className="topRight">
          <div className="topbarIconsContainer">
            <NotificationsNone />
            {nonVusCount > 0 && (
              <span className="topIconBadge">{nonVusCount}</span>
            )}
          </div>
          <div className="topbarIconsContainer">
            <Language />
           
          </div>
          <div className="topbarIconsContainer">
            <Settings />
          </div>
          <div className="topAvatar">
            <Image
              src="/ia.jpg"
              alt="Avatar"
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Topbar


