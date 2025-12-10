


'use client'
import Link from 'next/link'
import { getSocket } from "../utils/socket"
import { useState, useEffect } from 'react'
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
  const user = footballeurInfo || proprietaireInfo
  const isPlayer = !!footballeurInfo
  const isOwner = !!proprietaireInfo

  const notifications = useSelector((state) => state.notifications.list || {})
  const unreadCount = notifications.filter(n => !n.read).length

  const signoutHandler = () => {
    setLoadingLogout(true)
    if (footballeurInfo) dispatch(signout())
    else if (proprietaireInfo) dispatch(signoutProprietaire())

    setTimeout(() => {
      setLoadingLogout(false)
      setMenuOpen(false)
      router.push('/')
    }, 800)
  }

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
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const closeMobileMenu = () => setMenuOpen(false)

  return (
    <nav className={`${isSticky ? 'shadow-2xl bg-black/95 backdrop-blur-xl' : 'bg-black/90 backdrop-blur-lg'} text-white py-3 px-4 fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b border-white/10`}>
      <div className="flex items-center justify-between max-w-7xl mx-auto">

        <Link href="/" className="flex items-center gap-3 group relative"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}>
          <motion.div animate={{ rotate: isHovered ? 360 : 0, scale: isHovered ? 1.2 : 1 }}
                      transition={{ rotate: { duration: 1, ease: "linear" }, scale: { duration: 0.3 } }}
                      className="text-2xl">
            ⚽
          </motion.div>
          <motion.span className="text-2xl font-black"
            style={{
              background: "linear-gradient(135deg,#0f5c2f,#1a7a3f,#2d9c5a,#facc15,#2d9c5a,#1a7a3f,#0f5c2f)",
              backgroundSize: "300% 300%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "grassNavShimmer 3s ease-in-out infinite"
            }}>
            FootBase
          </motion.span>
        </Link>

        {user && (
          <button
            onClick={() => setPanelOpen(true)}
            className={`relative hidden md:flex p-2 ${pulse ? "bell-pulse" : "bell-glow"}`}
          >
            <Bell size={20} className="text-cyan-300" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
        )}

        <ul className="hidden md:flex gap-8 items-center">
          {[{ href: '/', label: 'Accueil', icon: Home },
            { href: '/matchs', label: 'Matchs', icon: Calendar },
            { href: '/contact', label: 'Contact', icon: Contact }
          ].map((item, index) => (
            <motion.li key={item.href} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <Link href={item.href} className="group flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10">
                <item.icon size={18} className="text-yellow-400" />
                {item.label}
              </Link>
            </motion.li>
          ))}

          {!user && (
            <>
             <div className="flex items-center gap-4">
              <Link href="/signin" className="px-4 py-2 rounded-xl bg-blue-500/40 backdrop-blur-xl border border-blue-300/30 text-white text-sm hover:bg-blue-500/60 transition-all shadow-md" >
                Joueur
              </Link>

              <Link href="/proprietaire/signin" className="px-4 py-2 rounded-xl bg-green-500/40 backdrop-blur-xl border border-green-300/30 text-white text-sm hover:bg-green-500/60 transition-all shadow-md" >
                Propriétaire
              </Link>
            </div>
              {/* <Link href="/signin" className="bg-yellow-500 px-4 py-2 rounded-lg text-black font-bold">Joueur</Link>
              <Link href="/proprietaire/signin" className="bg-blue-500 px-4 py-2 rounded-lg text-black font-bold">Propriétaire</Link> */}
            </>
          )}

          {isPlayer && (
            <Link href={`/footballeurs/${user._id}`} className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-green-500/20">
              <User size={18} className="text-green-400" />
              Mon profil
            </Link>
          )}

          {isOwner && (
            <Link href={`/proprietaire/${user._id}`} className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-blue-500/20">
              <User size={18} className="text-blue-400" />
              Dashboard
            </Link>
          )}

          {user && (
            <button onClick={signoutHandler} className="text-red-400 flex items-center gap-2">
              <LogOut size={14} /> Se déconnecter
            </button>
          )}
        </ul>

        <div className="md:hidden flex items-center gap-3">
          {user && (
            <button onClick={() => setPanelOpen(true)} className={`relative p-2 ${pulse ? 'bell-pulse' : 'bell-glow'}`}>
              <Bell size={22} className="text-cyan-300" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-2 rounded-full">{unreadCount}</span>
              )}
            </button>
          )}

          {!user && (
            <>
            <div className="flex items-center gap-3 m-2">
  <Link
    href="/signin"
    className="px-2 py-1.5 rounded-lg bg-blue-500/40 backdrop-blur-xl border border-blue-300/30 text-white text-xs hover:bg-blue-500/60 transition-all shadow-md"
  >
    Joueur
  </Link>

  <Link
    href="/proprietaire/signin"
    className="px-2 py-1.5 rounded-lg bg-green-500/40 backdrop-blur-xl border border-green-300/30 text-white text-xs hover:bg-green-500/60 transition-all shadow-md"
  >
    Propriétaire
  </Link>
</div>

            {/* <div className="flex items-center gap-4">
              <Link href="/signin" className="px-4 py-2 rounded-xl bg-blue-500/40 backdrop-blur-xl border border-blue-300/30 text-white text-sm hover:bg-blue-500/60 transition-all shadow-md" >
                Joueur
              </Link>

              <Link href="/proprietaire/signin" className="px-4 py-2 rounded-xl bg-green-500/40 backdrop-blur-xl border border-green-300/30 text-white text-sm hover:bg-green-500/60 transition-all shadow-md" >
                Propriétaire
              </Link>
            </div> */}
              {/* <Link href="/signin" className="bg-yellow-500 px-3 py-2 rounded-lg text-black font-bold text-sm">Joueur</Link>
              <Link href="/proprietaire/signin" className="bg-blue-500 px-3 py-2 rounded-lg text-black font-bold text-sm">Proprietaire</Link> */}
            </>
          )}

          {user && (
            <Link href={`/footballeurs/${user._id}`}>
            <span className="text-xs bg-white/10 px-2 py-1 rounded-lg border border-white/20">{user.nom || user.name}</span>
            </Link>
          )}

          <button onClick={() => setMenuOpen(!menuOpen)} className="p-2">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/95 p-6 rounded-xl mt-3"
          >
            <ul className="space-y-4">
              <li><Link href="/" onClick={closeMobileMenu}>Accueil</Link></li>
              <li><Link href="/matchs" onClick={closeMobileMenu}>Matchs</Link></li>
              <li><Link href="/contact" onClick={closeMobileMenu}>Contact</Link></li>

              {isPlayer && (
                <li><Link href={`/footballeurs/${user._id}`} onClick={closeMobileMenu}>Profil</Link></li>
              )}

              {isOwner && (
                <li><Link href="/proprietaire/dashboard" onClick={closeMobileMenu}>Mes Terrains</Link></li>
              )}

              {user && (
                <li>
                  <button onClick={signoutHandler} className="flex items-center gap-2 text-red-400">
                    <LogOut size={14} /> Se déconnecter
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


