'use client'

import Link from 'next/link'
import React from 'react'
import {
  Storefront,
  Description,
  People,
  AssignmentTurnedIn,
  LocalShipping,
  AttachMoney,
  BarChart,
  MailOutline,
  PermIdentity,
  ChatBubbleOutline,
  DynamicFeed,
  Settings,
} from '@mui/icons-material'
import './sidebar.css'

function Sidebar() {
  return (
    <div className="sidebar shadow-xl bg-black/60 backdrop-blur-md">
      <div className="sidebarwrapper">
        {/* Dashboard */}
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Tableau de bord</h3>
          <ul className="sidebarList">
            <li className="sidebarListItem">
              <Link href="/admin" className="link">
                <AssignmentTurnedIn className="sidebarIcon" />
                Accueil
              </Link>
            </li>
            <li className="sidebarListItem">
              <BarChart className="sidebarIcon" />
              Vue globale
            </li>
          </ul>
        </div>

        {/* Dossiers */}
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Dossiers</h3>
          <ul className="sidebarList">
            <li className="sidebarListItem">
              <Link href="/admin/inscription" className="link">
                <Storefront className="sidebarIcon" />
                Inscriptions 
              </Link>
            </li>
            <li className="sidebarListItem">
              <Description className="sidebarIcon" />
              Documents 
            </li>
            <li className="sidebarListItem">
              <AssignmentTurnedIn className="sidebarIcon" />
              Dossiers étudiants
            </li>
          </ul>
        </div>

        {/* Logistique */}
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Programme</h3>
          <ul className="sidebarList">
            <li className="sidebarListItem">
              <LocalShipping className="sidebarIcon" />
              Formation continue
            </li>
            <li className="sidebarListItem">
              <AssignmentTurnedIn className="sidebarIcon" />
              Projet fin d'etudes
            </li>
          </ul>
        </div>

        {/* Facturation */}
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Facturation</h3>
          <ul className="sidebarList">
            <li className="sidebarListItem">
              <AttachMoney className="sidebarIcon" />
             Formations
            </li>
            <li className="sidebarListItem">
              <BarChart className="sidebarIcon" />
              Paiements & taxes
            </li>
          </ul>
        </div>

        {/* Utilisateurs */}
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Etudiants</h3>
          <ul className="sidebarList">
           <li className="sidebarListItem">
            <Link href="/courses" className="link">
                <AttachMoney className="sidebarIcon" />
             Cours
              </Link>
             
            </li>
          </ul>
        </div>

        {/* Notifications */}
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Notifications</h3>
          <ul className="sidebarList">
            <li className="sidebarListItem">
              <MailOutline className="sidebarIcon" />
              Emails
            </li>
            <li className="sidebarListItem">
              <DynamicFeed className="sidebarIcon" />
              Avis
            </li>
            <li className="sidebarListItem">
              <ChatBubbleOutline className="sidebarIcon" />
              Messages
            </li>
          </ul>
        </div>

        {/* Paramètres */}
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Paramètres</h3>
          <ul className="sidebarList">
            <li className="sidebarListItemlast">
              <Settings className="sidebarIcon" />
              Configuration
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
