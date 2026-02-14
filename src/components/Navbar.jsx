'use client'
import Link from 'next/link'
import { getSocket } from "../utils/socket"
import { useState, useEffect, useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { signout } from '../redux/actions/footballeurActions'
import { signoutProprietaire } from '../redux/actions/proprietaireActions'
import { useRouter } from 'next/navigation'
import { Menu, X, User, LogOut, Home, Calendar, Contact, Bell } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from "react-toastify"
import { addNotification } from "../redux/actions/notificationActions"
import NotificationPanel from "./NotificationPanel";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)
  const [isSticky, setIsSticky] = useState(false)
  const [loadingLogout, setLoadingLogout] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [pulse, setPulse] = useState(false)

  const dispatch = useDispatch()
  const router = useRouter()

  const footballeurSignin = useSelector((state) => state.footballeurSignin || {})
  const proprietaireSignin = useSelector((state) => state.proprietaireSignin || {})
  const { footballeurInfo } = footballeurSignin
  const { proprietaireInfo } = proprietaireSignin
  
  const user = useMemo(() => footballeurInfo || proprietaireInfo, [footballeurInfo, proprietaireInfo])
  const isPlayer = !!footballeurInfo
  const isOwner = !!proprietaireInfo

  const notifications = useSelector((state) => state.notifications.list || {})
  const unreadCount = useMemo(() => 
    notifications.filter(n => !n.read).length, 
    [notifications]
  )

  const signoutHandler = useCallback(() => {
    setLoadingLogout(true)
    if (footballeurInfo) dispatch(signout())
    else if (proprietaireInfo) dispatch(signoutProprietaire())

    setTimeout(() => {
      setLoadingLogout(false)
      setMenuOpen(false)
      router.push('/')
    }, 800)
  }, [dispatch, footballeurInfo, proprietaireInfo, router])

  useEffect(() => {
    const socket = getSocket();
    socket.on("evaluationReceived", (notif) => {
      dispatch(addNotification(notif))
      setPulse(true)
      setTimeout(() => setPulse(false), 600)
      if (navigator.vibrate) navigator.vibrate(50)
      toast.info(`🔔 Nouvelle notification : ${notif.title}`)
      new Audio("/notif.mp3").play()
    })
    return () => socket.off("evaluationReceived")
  }, [dispatch])

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const closeMobileMenu = useCallback(() => setMenuOpen(false), [])
  const toggleMenu = useCallback(() => setMenuOpen(prev => !prev), [])

  // Boutons Desktop
  const DesktopAuthButtons = () => (
    <div className="hidden md:flex items-center gap-4">
      <Link
        href="/signin"
        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
      >
        <span className="text-lg">👟</span>
        <span>Espace Joueur</span>
      </Link>

      <Link
        href="/proprietaire/signin"
        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
      >
        <span className="text-lg">⚽</span>
        <span>Espace Partenaire</span>
      </Link>
    </div>
  )

  // Boutons Mobile
  const MobileAuthButtons = () => (
    <div className="md:hidden flex items-center gap-3 mr-3 ml-4">
      <Link
        href="/signin"
        className="px-1 py-1.5 bg-blue-500/20 backdrop-blur-sm border border-blue-300/30 rounded-lg text-blue-300 text-xs font-medium hover:bg-blue-500/30 transition-all flex items-center gap-1"
      >
        <span className="text-sm">👟</span>
        <span>Joueur</span>
      </Link>

      <Link
        href="/proprietaire/signin"
        className="px-1 py-1.5 bg-green-500/20 backdrop-blur-sm border border-green-300/30 rounded-lg text-green-300 text-xs font-medium hover:bg-green-500/30 transition-all flex items-center gap-1"
      >
        <span className="text-sm">⚽</span>
        <span>Partenaire</span>
      </Link>
    </div>
  )

  return (
    <nav className={`${isSticky ? 'shadow-lg bg-black/95 backdrop-blur-lg' : 'bg-black/90 backdrop-blur-md'} text-white py-3 px-4 fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-white/10`}>
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link 
          href="/" 
          className="flex items-center gap-3 group relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.div 
            animate={{ rotate: isHovered ? 360 : 0, scale: isHovered ? 1.2 : 1 }}
            transition={{ 
              rotate: { duration: 1, ease: "linear" }, 
              scale: { duration: 0.3, type: "spring", stiffness: 200 } 
            }}
            className="text-2xl"
          >
            ⚽
          </motion.div>
          <motion.span 
            className="text-2xl font-black"
            style={{
              background: "linear-gradient(135deg,#0f5c2f,#1a7a3f,#2d9c5a,#facc15,#2d9c5a,#1a7a3f,#0f5c2f)",
              backgroundSize: "300% 300%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "grassNavShimmer 3s ease-in-out infinite"
            }}
          >
            kickoora
          </motion.span>
        </Link>

        {/* Notifications Desktop */}
        {user && (
          <button
            onClick={() => setPanelOpen(true)}
            className={`relative hidden md:flex p-2 ${pulse ? "bell-pulse" : "bell-glow"}`}
            aria-label="Notifications"
          >
            <Bell size={20} className="text-cyan-300" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full min-w-[18px] text-center">
                {unreadCount}
              </span>
            )}
          </button>
        )}

        {/* Navigation Desktop */}
        <ul className="hidden md:flex gap-6 items-center">
          {[
            { href: '/', label: 'Accueil', icon: Home },
            { href: '/matchs', label: 'Matchs', icon: Calendar },
            { href: '/contact', label: 'Contact', icon: Contact }
          ].map((item, index) => (
            <motion.li 
              key={item.href} 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <Link 
                href={item.href} 
                className="group flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition-colors duration-200"
              >
                <item.icon size={18} className="text-yellow-400" />
                <span className="font-medium">{item.label}</span>
              </Link>
            </motion.li>
          ))}

          {/* Boutons de connexion Desktop */}
          {!user && <DesktopAuthButtons />}

          {/* Liens utilisateur Desktop */}
          {isPlayer && (
            <Link 
              href={`/footballeurs/${user._id}`} 
              className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-green-500/20 transition-colors duration-200"
            >
              <User size={18} className="text-green-400" />
              <span className="font-medium">Mon profil</span>
            </Link>
          )}

          {isOwner && (
            <Link 
              href={`/proprietaire/${user._id}`} 
              className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-blue-500/20 transition-colors duration-200"
            >
              <User size={18} className="text-blue-400" />
              <span className="font-medium">Dashboard</span>
            </Link>
          )}

          {/* Déconnexion Desktop */}
          {user && (
            <button 
              onClick={signoutHandler} 
              className="text-red-400 flex items-center gap-2 hover:text-red-300 transition-colors duration-200 px-3 py-2 rounded-xl hover:bg-red-500/10"
              disabled={loadingLogout}
            >
              <LogOut size={14} /> 
              <span className="font-medium">
                {loadingLogout ? 'Déconnexion...' : 'Se déconnecter'}
              </span>
            </button>
          )}
        </ul>

        {/* Zone Mobile (droite) */}
        <div className="flex items-center gap-3">
          {/* Notifications Mobile */}
          {user && (
            <button 
              onClick={() => setPanelOpen(true)} 
              className={`relative md:hidden p-2 ${pulse ? 'bell-pulse' : 'bell-glow'}`}
              aria-label="Notifications"
            >
              <Bell size={22} className="text-cyan-300" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-2 rounded-full min-w-[18px] text-center">
                  {unreadCount}
                </span>
              )}
            </button>
          )}

          {/* Boutons de connexion Mobile (seulement si pas connecté) */}
          {!user && <MobileAuthButtons />}

          {/* Nom utilisateur Mobile */}
          {user && (
            <Link 
              href={isPlayer ? `/footballeurs/${user._id}` : `/proprietaire/${user._id}`}
              className="md:hidden"
            >
              <span className="text-xs bg-white/10 px-2 py-1 rounded-lg border border-white/20 hover:bg-white/20 transition-colors duration-200">
                {user.nom || user.name}
              </span>
            </Link>
          )}

          {/* Bouton Burger Menu */}
          <button 
            onClick={toggleMenu} 
            className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      <AnimatePresence mode="wait">
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ 
              opacity: 0, 
              y: -20,
              scale: 0.95 
            }}
            animate={{ 
              opacity: 1, 
              y: 0,
              scale: 1 
            }}
            exit={{ 
              opacity: 0, 
              y: -20,
              scale: 0.95 
            }}
            transition={{ 
              duration: 0.2,
              ease: "easeInOut" 
            }}
            className="md:hidden bg-black/95 p-6 rounded-xl mt-3 border border-white/10 shadow-2xl"
            style={{
              willChange: 'transform, opacity',
              transformOrigin: 'top right'
            }}
          >
            <ul className="space-y-3">
              {/* Liens principaux */}
              {[
                { href: '/', label: 'Accueil' },
                { href: '/matchs', label: 'Matchs' },
                { href: '/contact', label: 'Contact' }
              ].map((item) => (
                <li key={item.href}>
                  <Link 
                    href={item.href} 
                    onClick={closeMobileMenu}
                    className="block py-3 px-4 rounded-lg hover:bg-white/10 transition-colors duration-200 text-lg font-medium"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}

              {/* Liens utilisateur */}
              {isPlayer && (
                <li>
                  <Link 
                    href={`/footballeurs/${user._id}`} 
                    onClick={closeMobileMenu}
                    className="block py-3 px-4 rounded-lg hover:bg-white/10 transition-colors duration-200 text-lg font-medium"
                  >
                    Mon profil
                  </Link>
                </li>
              )}

              {isOwner && (
                <li>
                  <Link 
                    href={`/proprietaire/${user._id}`} 
                    onClick={closeMobileMenu}
                    className="block py-3 px-4 rounded-lg hover:bg-white/10 transition-colors duration-200 text-lg font-medium"
                  >
                    Dashboard
                  </Link>
                </li>
              )}

              {/* Boutons de connexion (dans le menu déroulant si pas connecté) */}
              {!user && (
                <>
                  <li>
                    <Link 
                      href="/signin" 
                      onClick={closeMobileMenu}
                      className="block py-3 px-4 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 transition-colors duration-200 text-lg font-medium text-blue-300"
                    >
                      Connexion Joueur
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/proprietaire/signin" 
                      onClick={closeMobileMenu}
                      className="block py-3 px-4 rounded-lg bg-green-500/20 hover:bg-green-500/30 transition-colors duration-200 text-lg font-medium text-green-300"
                    >
                      Connexion Partenaire
                    </Link>
                  </li>
                </>
              )}

              {/* Déconnexion */}
              {user && (
                <li>
                  <button 
                    onClick={() => {
                      signoutHandler();
                      closeMobileMenu();
                    }} 
                    className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors duration-200 w-full text-left py-3 px-4 rounded-lg hover:bg-red-500/10"
                    disabled={loadingLogout}
                  >
                    <LogOut size={16} /> 
                    <span className="font-medium">
                      {loadingLogout ? 'Déconnexion...' : 'Se déconnecter'}
                    </span>
                  </button>
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <NotificationPanel open={panelOpen} onClose={() => setPanelOpen(false)} />
    </nav>
  )
}


// 'use client'
// import Link from 'next/link'
// import { getSocket } from "../utils/socket"
// import { useState, useEffect, useCallback, useMemo } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { signout } from '../redux/actions/footballeurActions'
// import { signoutProprietaire } from '../redux/actions/proprietaireActions'
// import { useRouter } from 'next/navigation'
// import { Menu, X, User, LogOut, Home, Calendar, Contact, Bell } from 'lucide-react'
// import { motion, AnimatePresence } from 'framer-motion'
// import { toast } from "react-toastify"
// import { addNotification } from "../redux/actions/notificationActions"
// import NotificationPanel from "./NotificationPanel";

// export default function Navbar() {
//   const [menuOpen, setMenuOpen] = useState(false)
//   const [panelOpen, setPanelOpen] = useState(false)
//   const [isSticky, setIsSticky] = useState(false)
//   const [loadingLogout, setLoadingLogout] = useState(false)
//   const [isHovered, setIsHovered] = useState(false)
//   const [pulse, setPulse] = useState(false)

//   const dispatch = useDispatch()
//   const router = useRouter()

//   const footballeurSignin = useSelector((state) => state.footballeurSignin || {})
//   const proprietaireSignin = useSelector((state) => state.proprietaireSignin || {})
//   const { footballeurInfo } = footballeurSignin
//   const { proprietaireInfo } = proprietaireSignin
  
//   // Mémoïser les valeurs pour éviter les recalculs
//   const user = useMemo(() => footballeurInfo || proprietaireInfo, [footballeurInfo, proprietaireInfo])
//   const isPlayer = !!footballeurInfo
//   const isOwner = !!proprietaireInfo

//   const notifications = useSelector((state) => state.notifications.list || {})
//   const unreadCount = useMemo(() => 
//     notifications.filter(n => !n.read).length, 
//     [notifications]
//   )

//   const signoutHandler = useCallback(() => {
//     setLoadingLogout(true)
//     if (footballeurInfo) dispatch(signout())
//     else if (proprietaireInfo) dispatch(signoutProprietaire())

//     setTimeout(() => {
//       setLoadingLogout(false)
//       setMenuOpen(false)
//       router.push('/')
//     }, 800)
//   }, [dispatch, footballeurInfo, proprietaireInfo, router])

//   useEffect(() => {
//     const socket = getSocket();
//     socket.on("evaluationReceived", (notif) => {
//       dispatch(addNotification(notif))
//       setPulse(true)
//       setTimeout(() => setPulse(false), 600)
//       if (navigator.vibrate) navigator.vibrate(50)
//       toast.info(`🔔 Nouvelle notification : ${notif.title}`)
//       new Audio("/notif.mp3").play()
//     })
//     return () => socket.off("evaluationReceived")
//   }, [dispatch])

//   useEffect(() => {
//     const handleScroll = () => setIsSticky(window.scrollY > 10)
//     window.addEventListener('scroll', handleScroll, { passive: true })
//     return () => window.removeEventListener('scroll', handleScroll)
//   }, [])

//   const closeMobileMenu = useCallback(() => setMenuOpen(false), [])
//   const toggleMenu = useCallback(() => setMenuOpen(prev => !prev), [])

//   // Éviter de recalculer les items de navigation à chaque rendu
//   const mobileMenuItems = useMemo(() => {
//     const items = [
//       { href: '/', label: 'Accueil', onClick: closeMobileMenu },
//       { href: '/matchs', label: 'Matchs', onClick: closeMobileMenu },
//       { href: '/contact', label: 'Contact', onClick: closeMobileMenu }
//     ]

//     if (isPlayer) {
//       items.push({ 
//         href: `/footballeurs/${user._id}`, 
//         label: 'Profil', 
//         onClick: closeMobileMenu 
//       })
//     }

//     if (isOwner) {
//       items.push({ 
//         href: '/proprietaire/dashboard', 
//         label: 'Mes Terrains', 
//         onClick: closeMobileMenu 
//       })
//     }

//     return items
//   }, [isPlayer, isOwner, user, closeMobileMenu])

//   const desktopMenuItems = useMemo(() => [
//     { href: '/', label: 'Accueil', icon: Home },
//     { href: '/matchs', label: 'Matchs', icon: Calendar },
//     { href: '/contact', label: 'Contact', icon: Contact }
//   ], [])

//   return (
//     <nav className={`${isSticky ? 'shadow-lg bg-black/95 backdrop-blur-lg' : 'bg-black/90 backdrop-blur-md'} text-white py-3 px-4 fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-white/10`}>
//       <div className="flex items-center justify-between max-w-7xl mx-auto">

//         <Link 
//           href="/" 
//           className="flex items-center gap-3 group relative"
//           onMouseEnter={() => setIsHovered(true)}
//           onMouseLeave={() => setIsHovered(false)}
//         >
//           <motion.div 
//             animate={{ rotate: isHovered ? 360 : 0, scale: isHovered ? 1.2 : 1 }}
//             transition={{ 
//               rotate: { duration: 1, ease: "linear" }, 
//               scale: { duration: 0.3, type: "spring", stiffness: 200 } 
//             }}
//             className="text-2xl"
//           >
//             ⚽
//           </motion.div>
//           <motion.span 
//             className="text-2xl font-black"
//             style={{
//               background: "linear-gradient(135deg,#0f5c2f,#1a7a3f,#2d9c5a,#facc15,#2d9c5a,#1a7a3f,#0f5c2f)",
//               backgroundSize: "300% 300%",
//               WebkitBackgroundClip: "text",
//               WebkitTextFillColor: "transparent",
//               animation: "grassNavShimmer 3s ease-in-out infinite"
//             }}
//           >
//             FootBase
//           </motion.span>
//         </Link>

//         {user && (
//           <button
//             onClick={() => setPanelOpen(true)}
//             className={`relative hidden md:flex p-2 ${pulse ? "bell-pulse" : "bell-glow"}`}
//             aria-label="Notifications"
//           >
//             <Bell size={20} className="text-cyan-300" />
//             {unreadCount > 0 && (
//               <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full min-w-[18px] text-center">
//                 {unreadCount}
//               </span>
//             )}
//           </button>
//         )}

//         <ul className="hidden md:flex gap-6 items-center">
//           {desktopMenuItems.map((item, index) => (
//             <motion.li 
//               key={item.href} 
//               initial={{ opacity: 0, y: -10 }} 
//               animate={{ opacity: 1, y: 0 }} 
//               transition={{ delay: index * 0.1 }}
//               className="relative"
//             >
//               <Link 
//                 href={item.href} 
//                 className="group flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition-colors duration-200"
//               >
//                 <item.icon size={18} className="text-yellow-400" />
//                 <span className="font-medium">{item.label}</span>
//               </Link>
//             </motion.li>
//           ))}

          
       

//           {isPlayer && (
//             <Link 
//               href={`/footballeurs/${user._id}`} 
//               className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-green-500/20 transition-colors duration-200"
//             >
//               <User size={18} className="text-green-400" />
//               <span className="font-medium">Mon profil</span>
//             </Link>
//           )}

//           {isOwner && (
//             <Link 
//               href={`/proprietaire/${user._id}`} 
//               className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-blue-500/20 transition-colors duration-200"
//             >
//               <User size={18} className="text-blue-400" />
//               <span className="font-medium">Dashboard</span>
//             </Link>
//           )}

//           {user && (
//             <button 
//               onClick={signoutHandler} 
//               className="text-red-400 flex items-center gap-2 hover:text-red-300 transition-colors duration-200 px-3 py-2 rounded-xl hover:bg-red-500/10"
//               disabled={loadingLogout}
//             >
//               <LogOut size={14} /> 
//               <span className="font-medium">
//                 {loadingLogout ? 'Déconnexion...' : 'Se déconnecter'}
//               </span>
//             </button>
//           )}
//         </ul>

//         <div className="md:hidden flex items-center gap-3">
//           {user && (
//             <button 
//               onClick={() => setPanelOpen(true)} 
//               className={`relative p-2 ${pulse ? 'bell-pulse' : 'bell-glow'}`}
//               aria-label="Notifications"
//             >
//               <Bell size={22} className="text-cyan-300" />
//               {unreadCount > 0 && (
//                 <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-2 rounded-full min-w-[18px] text-center">
//                   {unreadCount}
//                 </span>
//               )}
//             </button>
//           )}

//           {!user && (
//             <div className="flex items-center gap-3">
//               <Link
//                 href="/signin"
//                 className="px-2 py-1.5 rounded-lg bg-blue-500/40 backdrop-blur-xl border border-blue-300/30 text-white text-xs hover:bg-blue-500/60 transition-all duration-200 shadow-md"
//               >
//                 Joueur
//               </Link>

//               <Link
//                 href="/proprietaire/signin"
//                 className="px-2 py-1.5 rounded-lg bg-green-500/40 backdrop-blur-xl border border-green-300/30 text-white text-xs hover:bg-green-500/60 transition-all duration-200 shadow-md"
//               >
//                 Propriétaire
//               </Link>
//             </div>
//           )}

//           {user && (
//             <Link href={isPlayer ? `/footballeurs/${user._id}` : `/proprietaire/${user._id}`}>
//               <span className="text-xs bg-white/10 px-2 py-1 rounded-lg border border-white/20 hover:bg-white/20 transition-colors duration-200">
//                 {user.nom || user.name}
//               </span>
//             </Link>
//           )}

//           <button 
//             onClick={toggleMenu} 
//             className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
//             aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
//             aria-expanded={menuOpen}
//           >
//             {menuOpen ? <X size={24} /> : <Menu size={24} />}
//           </button>
//         </div>
//       </div>

//       <AnimatePresence mode="wait">
//         {menuOpen && (
//           <motion.div
//             key="mobile-menu"
//             initial={{ 
//               opacity: 0, 
//               y: -20,
//               scale: 0.95 
//             }}
//             animate={{ 
//               opacity: 1, 
//               y: 0,
//               scale: 1 
//             }}
//             exit={{ 
//               opacity: 0, 
//               y: -20,
//               scale: 0.95 
//             }}
//             transition={{ 
//               duration: 0.2,
//               ease: "easeInOut" 
//             }}
//             className="md:hidden bg-black/95 p-6 rounded-xl mt-3 border border-white/10 shadow-2xl"
//             style={{
//               willChange: 'transform, opacity',
//               transformOrigin: 'top right'
//             }}
//           >
//             <ul className="space-y-3">
//               {mobileMenuItems.map((item) => (
//                 <li key={item.href}>
//                   <Link 
//                     href={item.href} 
//                     onClick={item.onClick}
//                     className="block py-3 px-4 rounded-lg hover:bg-white/10 transition-colors duration-200 text-lg font-medium"
//                   >
//                     {item.label}
//                   </Link>
//                 </li>
//               ))}

//               {user && (
//                 <li>
//                   <button 
//                     onClick={() => {
//                       signoutHandler();
//                       closeMobileMenu();
//                     }} 
//                     className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors duration-200 w-full text-left py-3 px-4 rounded-lg hover:bg-red-500/10"
//                     disabled={loadingLogout}
//                   >
//                     <LogOut size={16} /> 
//                     <span className="font-medium">
//                       {loadingLogout ? 'Déconnexion...' : 'Se déconnecter'}
//                     </span>
//                   </button>
//                 </li>
//               )}
//             </ul>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <NotificationPanel open={panelOpen} onClose={() => setPanelOpen(false)} />
      
//       <style jsx>{`
//         @keyframes grassNavShimmer {
//           0%, 100% { background-position: 0% 50%; }
//           50% { background-position: 100% 50%; }
//         }
        
//         /* Optimisations pour mobile */
//         @media (max-width: 768px) {
//           .backdrop-blur-xl {
//             backdrop-filter: blur(8px);
//           }
//         }
        
//         /* Réduire les effets sur les vieux mobiles */
//         @media (max-width: 640px) and (prefers-reduced-motion: reduce) {
//           * {
//             animation-duration: 0.01ms !important;
//             animation-iteration-count: 1 !important;
//             transition-duration: 0.01ms !important;
//           }
//         }
//       `}</style>
//     </nav>
//   )
// }



  //  {!user && (
  //           <div className="flex items-center gap-4">
  //             <Link 
  //               href="/signin" 
  //               className="px-4 py-2 rounded-xl bg-blue-500/40 backdrop-blur-xl border border-blue-300/30 text-white text-sm hover:bg-blue-500/60 transition-all duration-200 shadow-md"
  //             >
  //               Joueur
  //             </Link>

  //             <Link 
  //               href="/proprietaire/signin" 
  //               className="px-4 py-2 rounded-xl bg-green-500/40 backdrop-blur-xl border border-green-300/30 text-white text-sm hover:bg-green-500/60 transition-all duration-200 shadow-md"
  //             >
  //               Propriétaire
  //             </Link>
  //           </div>
  //         )}

// 'use client'
// import Link from 'next/link'
// import { getSocket } from "../utils/socket"
// import { useState, useEffect } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { signout } from '../redux/actions/footballeurActions'
// import { signoutProprietaire } from '../redux/actions/proprietaireActions'
// import { useRouter } from 'next/navigation'
// import { Menu, X, User, LogOut, Home, Calendar, Contact, Bell } from 'lucide-react'
// import { motion, AnimatePresence } from 'framer-motion'
// import { toast } from "react-toastify"
// import { addNotification } from "../redux/actions/notificationActions"
// import NotificationPanel from "./NotificationPanel";

// export default function Navbar() {
//   const [menuOpen, setMenuOpen] = useState(false)
//   const [panelOpen, setPanelOpen] = useState(false)
//   const [isSticky, setIsSticky] = useState(false)
//   const [loadingLogout, setLoadingLogout] = useState(false)
//   const [isHovered, setIsHovered] = useState(false)
//   const [pulse, setPulse] = useState(false)

//   const dispatch = useDispatch()
//   const router = useRouter()

//   const footballeurSignin = useSelector((state) => state.footballeurSignin || {})
//   const proprietaireSignin = useSelector((state) => state.proprietaireSignin || {})
//   const { footballeurInfo } = footballeurSignin
//   const { proprietaireInfo } = proprietaireSignin
//   const user = footballeurInfo || proprietaireInfo
//   const isPlayer = !!footballeurInfo
//   const isOwner = !!proprietaireInfo

//   const notifications = useSelector((state) => state.notifications.list || {})
//   const unreadCount = notifications.filter(n => !n.read).length

//   const signoutHandler = () => {
//     setLoadingLogout(true)
//     if (footballeurInfo) dispatch(signout())
//     else if (proprietaireInfo) dispatch(signoutProprietaire())

//     setTimeout(() => {
//       setLoadingLogout(false)
//       setMenuOpen(false)
//       router.push('/')
//     }, 800)
//   }

//   useEffect(() => {
//     const socket = getSocket();
//     socket.on("evaluationReceived", (notif) => {
//       dispatch(addNotification(notif))
//       setPulse(true)
//       setTimeout(() => setPulse(false), 600)
//       if (navigator.vibrate) navigator.vibrate(50)
//       toast.info(`🔔 Nouvelle notification : ${notif.title}`)
//       new Audio("/notif.mp3").play()
//     })
//     return () => socket.off("evaluationReceived")
//   }, [dispatch])

//   useEffect(() => {
//     const handleScroll = () => setIsSticky(window.scrollY > 10)
//     window.addEventListener('scroll', handleScroll)
//     return () => window.removeEventListener('scroll', handleScroll)
//   }, [])

//   const closeMobileMenu = () => setMenuOpen(false)

//   return (
//     <nav className={`${isSticky ? 'shadow-2xl bg-black/95 backdrop-blur-xl' : 'bg-black/90 backdrop-blur-lg'} text-white py-3 px-4 fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b border-white/10`}>
//       <div className="flex items-center justify-between max-w-7xl mx-auto">

//         <Link href="/" className="flex items-center gap-3 group relative"
//               onMouseEnter={() => setIsHovered(true)}
//               onMouseLeave={() => setIsHovered(false)}>
//           <motion.div animate={{ rotate: isHovered ? 360 : 0, scale: isHovered ? 1.2 : 1 }}
//                       transition={{ rotate: { duration: 1, ease: "linear" }, scale: { duration: 0.3 } }}
//                       className="text-2xl">
//             ⚽
//           </motion.div>
//           <motion.span className="text-2xl font-black"
//             style={{
//               background: "linear-gradient(135deg,#0f5c2f,#1a7a3f,#2d9c5a,#facc15,#2d9c5a,#1a7a3f,#0f5c2f)",
//               backgroundSize: "300% 300%",
//               WebkitBackgroundClip: "text",
//               WebkitTextFillColor: "transparent",
//               animation: "grassNavShimmer 3s ease-in-out infinite"
//             }}>
//             FootBase
//           </motion.span>
//         </Link>

//         {user && (
//           <button
//             onClick={() => setPanelOpen(true)}
//             className={`relative hidden md:flex p-2 ${pulse ? "bell-pulse" : "bell-glow"}`}
//           >
//             <Bell size={20} className="text-cyan-300" />
//             {unreadCount > 0 && (
//               <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
//                 {unreadCount}
//               </span>
//             )}
//           </button>
//         )}

//         <ul className="hidden md:flex gap-8 items-center">
//           {[{ href: '/', label: 'Accueil', icon: Home },
//             { href: '/matchs', label: 'Matchs', icon: Calendar },
//             { href: '/contact', label: 'Contact', icon: Contact }
//           ].map((item, index) => (
//             <motion.li key={item.href} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
//               <Link href={item.href} className="group flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10">
//                 <item.icon size={18} className="text-yellow-400" />
//                 {item.label}
//               </Link>
//             </motion.li>
//           ))}

//           {!user && (
//             <>
//              <div className="flex items-center gap-4">
//               <Link href="/signin" className="px-4 py-2 rounded-xl bg-blue-500/40 backdrop-blur-xl border border-blue-300/30 text-white text-sm hover:bg-blue-500/60 transition-all shadow-md" >
//                 Joueur
//               </Link>

//               <Link href="/proprietaire/signin" className="px-4 py-2 rounded-xl bg-green-500/40 backdrop-blur-xl border border-green-300/30 text-white text-sm hover:bg-green-500/60 transition-all shadow-md" >
//                 Propriétaire
//               </Link>
//             </div>
//               {/* <Link href="/signin" className="bg-yellow-500 px-4 py-2 rounded-lg text-black font-bold">Joueur</Link>
//               <Link href="/proprietaire/signin" className="bg-blue-500 px-4 py-2 rounded-lg text-black font-bold">Propriétaire</Link> */}
//             </>
//           )}

//           {isPlayer && (
//             <Link href={`/footballeurs/${user._id}`} className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-green-500/20">
//               <User size={18} className="text-green-400" />
//               Mon profil
//             </Link>
//           )}

//           {isOwner && (
//             <Link href={`/proprietaire/${user._id}`} className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-blue-500/20">
//               <User size={18} className="text-blue-400" />
//               Dashboard
//             </Link>
//           )}

//           {user && (
//             <button onClick={signoutHandler} className="text-red-400 flex items-center gap-2">
//               <LogOut size={14} /> Se déconnecter
//             </button>
//           )}
//         </ul>

//         <div className="md:hidden flex items-center gap-3">
//           {user && (
//             <button onClick={() => setPanelOpen(true)} className={`relative p-2 ${pulse ? 'bell-pulse' : 'bell-glow'}`}>
//               <Bell size={22} className="text-cyan-300" />
//               {unreadCount > 0 && (
//                 <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-2 rounded-full">{unreadCount}</span>
//               )}
//             </button>
//           )}

//           {!user && (
//             <>
//             <div className="flex items-center gap-3 m-2">
//   <Link
//     href="/signin"
//     className="px-2 py-1.5 rounded-lg bg-blue-500/40 backdrop-blur-xl border border-blue-300/30 text-white text-xs hover:bg-blue-500/60 transition-all shadow-md"
//   >
//     Joueur
//   </Link>

//   <Link
//     href="/proprietaire/signin"
//     className="px-2 py-1.5 rounded-lg bg-green-500/40 backdrop-blur-xl border border-green-300/30 text-white text-xs hover:bg-green-500/60 transition-all shadow-md"
//   >
//     Propriétaire
//   </Link>
// </div>
//           </>
//           )}

//           {user && (
//             <Link href={`/footballeurs/${user._id}`}>
//             <span className="text-xs bg-white/10 px-2 py-1 rounded-lg border border-white/20">{user.nom || user.name}</span>
//             </Link>
//           )}

//           <button onClick={() => setMenuOpen(!menuOpen)} className="p-2">
//             {menuOpen ? <X size={24} /> : <Menu size={24} />}
//           </button>
//         </div>
//       </div>

//       <AnimatePresence>
//         {menuOpen && (
//           <motion.div
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: "auto" }}
//             exit={{ opacity: 0, height: 0 }}
//             className="md:hidden bg-black/95 p-6 rounded-xl mt-3"
//           >
//             <ul className="space-y-4">
//               <li><Link href="/" onClick={closeMobileMenu}>Accueil</Link></li>
//               <li><Link href="/matchs" onClick={closeMobileMenu}>Matchs</Link></li>
//               <li><Link href="/contact" onClick={closeMobileMenu}>Contact</Link></li>

//               {isPlayer && (
//                 <li><Link href={`/footballeurs/${user._id}`} onClick={closeMobileMenu}>Profil</Link></li>
//               )}

//               {isOwner && (
//                 <li><Link href="/proprietaire/dashboard" onClick={closeMobileMenu}>Mes Terrains</Link></li>
//               )}

//               {user && (
//                 <li>
//                   <button onClick={signoutHandler} className="flex items-center gap-2 text-red-400">
//                     <LogOut size={14} /> Se déconnecter
//                   </button>
//                 </li>
//               )}
//             </ul>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <NotificationPanel open={panelOpen} onClose={() => setPanelOpen(false)} />
//     </nav>
//   )
// }


