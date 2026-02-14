"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

import { createFreeEquipe } from "@/redux/actions/equipeActions";
import StadiumBackground from "@/components/StadiumBackground";

export default function CreateEquipePage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [nom, setNom] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const { footballeurInfo } = useSelector(
    (state) => state.footballeurSignin
  );

  const { loading, error } = useSelector(
    (state) => state.equipeCreate || {}
  );

  // 🔐 sécurité
  useEffect(() => {
    if (!footballeurInfo) {
      router.push("/signin");
    }
  }, [footballeurInfo, router]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!nom.trim()) {
      toast.error("Nom d'équipe requis");
      return;
    }

    try {
      const equipe = await dispatch(createFreeEquipe(nom.trim()));

      toast.success("✅ Équipe créée avec succès");
      setShowSuccess(true);
      
      // Petit délai pour montrer l'animation de succès
      setTimeout(() => {
        router.push(`/equipes/${equipe._id}`);
      }, 1500);
    } catch (err) {
      // erreur déjà gérée par Redux
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 12,
      },
    },
  };

  const ballVariants = {
    animate: {
      y: [0, -15, 0],
      rotate: [0, 10, -10, 0],
      transition: {
        y: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        },
        rotate: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        },
      },
    },
  };

  return (
    <StadiumBackground>
      {/* Effet de foule animée */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
            }}
            animate={{
              y: [null, -50, 0],
              opacity: [0.1, 0.4, 0.1],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Ballons flottants décoratifs */}
      <motion.div
        className="fixed top-20 left-[10%] text-6xl opacity-10 pointer-events-none"
        animate={{
          y: [0, -40, 0],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        ⚽
      </motion.div>

      <motion.div
        className="fixed bottom-20 right-[15%] text-7xl opacity-10 pointer-events-none"
        animate={{
          y: [0, -30, 0],
          rotate: [360, 180, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        🏆
      </motion.div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Carte principale */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="backdrop-blur-xl bg-black/30 p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden"
          >
            {/* Effet de lumière de stade */}
            <motion.div
              className="absolute -inset-20 bg-gradient-to-r from-yellow-500/5 via-green-500/5 to-yellow-500/5 rounded-full blur-3xl"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
            />

            {/* Icône de couronne (capitaine) */}
            <motion.div
              variants={itemVariants}
              className="flex justify-center mb-4"
            >
              <div className="relative">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="text-6xl relative z-10"
                >
                  👑
                </motion.div>
                
                {/* Effet d'aura */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-yellow-500/30 to-yellow-600/30 rounded-full blur-xl"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
              </div>
            </motion.div>

            {/* Titre */}
            <motion.h1
              variants={itemVariants}
              className="text-3xl md:text-4xl font-black text-center mb-2"
              style={{
                background: "linear-gradient(135deg, #facc15 0%, #4ade80 50%, #facc15 100%)",
                backgroundSize: "200% 200%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: "gradientShift 3s ease infinite",
              }}
            >
              CRÉER UNE ÉQUIPE
            </motion.h1>

            {/* Sous-titre */}
            <motion.div
              variants={itemVariants}
              className="text-center mb-6"
            >
              <p className="text-white/70">
                Vous deviendrez automatiquement{" "}
                <span className="text-yellow-400 font-semibold">capitaine</span>
              </p>
              
              {/* Ligne décorative */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="w-16 h-0.5 mx-auto mt-3 bg-gradient-to-r from-yellow-400 to-green-400 rounded-full"
              />
            </motion.div>

            {/* Message d'erreur */}
            <AnimatePresence>
              {error && (
                <motion.div
                  variants={itemVariants}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-red-500/20 border border-red-500/30 text-red-300 p-4 rounded-xl mb-6 text-center"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Message de succès */}
            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-green-500/20 border border-green-500/30 text-green-300 p-4 rounded-xl mb-6 text-center"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5 }}
                    className="inline-block mb-2"
                  >
                    ✅
                  </motion.div>
                  <p className="font-medium">Équipe créée avec succès !</p>
                  <p className="text-sm text-green-400/70 mt-1">
                    Redirection en cours...
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Formulaire */}
            <form onSubmit={submitHandler}>
              <motion.div variants={itemVariants} className="mb-6">
                <label className="block text-white/80 text-sm font-medium mb-2 ml-1">
                  Nom de l'équipe
                </label>
                
                <div className="relative">
                  <input
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    onFocus={() => setIsHovered(true)}
                    onBlur={() => setIsHovered(false)}
                    disabled={loading || showSuccess}
                    className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-yellow-400/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all disabled:opacity-50"
                    placeholder="Ex: Les Lions de Carthage"
                  />
                  
                  {/* Animation de focus */}
                  <motion.div
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    animate={{
                      boxShadow: isHovered 
                        ? "0 0 0 2px rgba(250, 204, 21, 0.2)" 
                        : "0 0 0 0px rgba(250, 204, 21, 0)",
                    }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
              </motion.div>

              {/* Bouton de création */}
              <motion.div variants={itemVariants}>
                <motion.button
                  type="submit"
                  disabled={loading || showSuccess}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative w-full p-4 rounded-xl font-bold text-white overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {/* Fond avec gradient animé */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600"
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    style={{
                      backgroundSize: "200% 200%",
                    }}
                  />
                  
                  {/* Effet de brillance */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "200%" }}
                    transition={{ duration: 0.8 }}
                  />
                  
                  {/* Contenu du bouton */}
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {loading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        />
                        <span>Création en cours...</span>
                      </>
                    ) : showSuccess ? (
                      <>
                        <motion.span
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.5 }}
                        >
                          ✨
                        </motion.span>
                        <span>Équipe créée !</span>
                      </>
                    ) : (
                      <>
                        <motion.span
                          animate={ballVariants.animate}
                          className="text-xl"
                        >
                          ⚽
                        </motion.span>
                        <span>Créer l'équipe</span>
                        <motion.span
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          👑
                        </motion.span>
                      </>
                    )}
                  </span>
                </motion.button>
              </motion.div>

              {/* Conseils */}
              <motion.div
                variants={itemVariants}
                className="mt-6 text-center"
              >
                <div className="flex items-center justify-center gap-2 text-white/40 text-xs">
                  <span>💡</span>
                  <span>Choisissez un nom qui représente votre équipe</span>
                  <span>💡</span>
                </div>
                
                {/* Indicateur de longueur du nom */}
                {nom.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2"
                  >
                    <div className="text-xs text-white/30">
                      {nom.length} / 50 caractères
                    </div>
                    <div className="w-full h-1 bg-white/10 rounded-full mt-1 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-green-400 to-yellow-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((nom.length / 50) * 100, 100)}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </form>

            {/* Badge "Capitaine" */}
            <motion.div
              variants={itemVariants}
              className="absolute -top-2 -right-2"
            >
              <div className="relative">
                <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  CAPITAINE
                </div>
                <motion.div
                  className="absolute inset-0 bg-yellow-500/50 rounded-full blur-md"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Message de bienvenue */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-6 text-white/40 text-sm"
          >
            <p>Prêt à mener votre équipe vers la victoire ?</p>
            <div className="flex justify-center gap-1 mt-1">
              <span>⚡</span>
              <span>🏆</span>
              <span>⚡</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Styles additionnels */}
      <style jsx>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes glow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </StadiumBackground>
  );
}


// "use client";

// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useRouter } from "next/navigation";
// import { toast } from "react-toastify";

// import { createFreeEquipe } from "@/redux/actions/equipeActions";

// export default function CreateEquipePage() {
//   const dispatch = useDispatch();
//   const router = useRouter();

//   const [nom, setNom] = useState("");
//   const { footballeurInfo } = useSelector(
//     (state) => state.footballeurSignin
//   );

//   const { loading, error } = useSelector(
//     (state) => state.equipeCreate || {}
//   );

//   // 🔐 sécurité
//   useEffect(() => {
//     if (!footballeurInfo) {
//       router.push("/signin");
//     }
//   }, [footballeurInfo, router]);

//   const submitHandler = async (e) => {
//     e.preventDefault();

//     if (!nom.trim()) {
//       toast.error("Nom d’équipe requis");
//       return;
//     }

//     try {
//       const equipe = await dispatch(createFreeEquipe(nom.trim()));

//       toast.success("✅ Équipe créée avec succès");
//       router.push(`/equipes/${equipe._id}`);
//     } catch (err) {
//       // erreur déjà gérée par Redux
//     }
//   };

//   return (
//     <div className="max-w-lg mx-auto mt-12 p-6 bg-white rounded-xl shadow-md">
//       <h1 className="text-2xl font-bold mb-4 text-center">
//         Créer une équipe
//       </h1>

//       <p className="text-sm text-gray-600 mb-6 text-center">
//         Vous deviendrez automatiquement <strong>capitaine</strong>
//       </p>

//       {error && (
//         <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
//           {error}
//         </div>
//       )}

//       <form onSubmit={submitHandler}>
//         <label className="block mb-2 font-medium">
//           Nom de l’équipe
//         </label>

//         <input
//           value={nom}
//           onChange={(e) => setNom(e.target.value)}
//           className="w-full p-3 border rounded-lg mb-5"
//           disabled={loading}
//         />

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-blue-600 text-white py-3 rounded-lg disabled:opacity-50"
//         >
//           {loading ? "Création..." : "Créer l’équipe"}
//         </button>
//       </form>
//     </div>
//   );
// }



// "use client";

// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useRouter } from "next/navigation";
// import { motion, AnimatePresence } from "framer-motion";
// import { toast } from "react-toastify";

// import StadiumBackground from "@/components/StadiumBackground";
// import Loader from "@/components/Loader";

// import { createEquipe } from "@/redux/actions/equipeActions";
// import { searchInvitablePlayers } from "@/redux/actions/footballeurActions";
// import { sendInvitation, listMyInvitations } from "@/redux/actions/invitationActions";

// export default function CreateEquipePage() {
//   const dispatch = useDispatch();
//   const router = useRouter();

//   /* =====================
//       LOCAL STATE
//   ===================== */
//   const [nom, setNom] = useState("");
//   const [niveau, setNiveau] = useState("intermediaire");
//   const [showInviteModal, setShowInviteModal] = useState(false);
//   const [search, setSearch] = useState("");

//   /* =====================
//       REDUX STATE
//   ===================== */
//   const { footballeurInfo } = useSelector(
//     (state) => state.footballeurSignin
//   );

//   const { loading, equipe, error } = useSelector(
//     (state) => state.equipeCreate
//   );

//   const { players } = useSelector(
//     (state) => state.footballeurSearch
//   );

//   const { invitations } = useSelector(
//     (state) => state.myInvitations
//   );

//   /* =====================
//       GUARDS
//   ===================== */
//   useEffect(() => {
//     if (!footballeurInfo) {
//       router.push("/signin");
//     }
//   }, [footballeurInfo, router]);

//   useEffect(() => {
//     if (equipe?._id) {
//       toast.success("✅ Équipe créée avec succès");
//       setShowInviteModal(true);
//     }
//   }, [equipe]);

//   /* =====================
//       FETCH INVITABLE
//   ===================== */
//   useEffect(() => {
//     if (showInviteModal) {
//       dispatch(searchInvitablePlayers(search));
//       dispatch(listMyInvitations());
//     }
//   }, [dispatch, showInviteModal, search]);

//   /* =====================
//       HANDLERS
//   ===================== */
//   const handleCreateEquipe = () => {
//     if (!nom.trim()) {
//       toast.error("Veuillez saisir un nom d’équipe");
//       return;
//     }

//     dispatch(
//       createEquipe({
//         nom,
//         niveau,
//       })
//     );
//   };

//   const invitePlayer = (playerId) => {
//     if (!equipe?._id) return;

//     dispatch(
//       sendInvitation({
//         equipeId: equipe._id,
//         playerId,
//       })
//     );

//     toast.success("Invitation envoyée !");
//   };

//   /* =====================
//       RENDER
//   ===================== */
//   if (loading) {
//     return (
//       <div className="flex justify-center py-20">
//         <Loader text="Création de l’équipe..." />
//       </div>
//     );
//   }

//   return (
//     <StadiumBackground>
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="max-w-xl mx-auto py-10 px-4 space-y-6"
//       >
//         <h1 className="text-4xl font-extrabold text-center text-yellow-400">
//           👥 Créer mon équipe
//         </h1>

//         <div className="bg-black/60 backdrop-blur-lg rounded-2xl p-6 border border-yellow-400/20 space-y-4">
//           <div>
//             <label className="block text-white/80 mb-1">
//               Nom de l’équipe
//             </label>
//             <input
//               type="text"
//               value={nom}
//               onChange={(e) => setNom(e.target.value)}
//               placeholder="Ex : FC FootBase"
//               className="w-full p-3 rounded-xl bg-black/70 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
//             />
//           </div>

//           <div>
//             <label className="block text-white/80 mb-1">
//               Niveau
//             </label>
//             <select
//               value={niveau}
//               onChange={(e) => setNiveau(e.target.value)}
//               className="w-full p-3 rounded-xl bg-black/70 border border-white/20 text-white"
//             >
//               <option value="debutant">Débutant</option>
//               <option value="intermediaire">Intermédiaire</option>
//               <option value="avance">Avancé</option>
//             </select>
//           </div>

//           <button
//             onClick={handleCreateEquipe}
//             className="w-full py-3 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-black font-bold transition"
//           >
//             ➕ Créer l’équipe
//           </button>

//           {error && (
//             <p className="text-red-500 text-sm text-center">{error}</p>
//           )}
//         </div>
//       </motion.div>

//       {/* =====================
//           MODAL INVITATION
//       ===================== */}
//       <AnimatePresence>
//         {showInviteModal && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
//             onClick={() => setShowInviteModal(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.9 }}
//               animate={{ scale: 1 }}
//               exit={{ scale: 0.9 }}
//               className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <h2 className="text-xl font-bold mb-4 text-center">
//                 👥 Inviter des joueurs
//               </h2>

//               <input
//                 type="text"
//                 placeholder="Rechercher un joueur..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="w-full border p-3 rounded-xl mb-4"
//               />

//               <div className="space-y-2 max-h-64 overflow-y-auto">
//                 {players?.map((p) => {
//                   const alreadyInvited = invitations?.some(
//                     (i) => i.to === p._id
//                   );

//                   return (
//                     <div
//                       key={p._id}
//                       className="flex justify-between items-center border p-3 rounded-xl"
//                     >
//                       <div>
//                         <span className="font-semibold">{p.name}</span>
//                         <span className="text-gray-600 text-sm ml-2">
//                           ({p.position})
//                         </span>
//                       </div>
//                       <button
//                         disabled={alreadyInvited}
//                         onClick={() => invitePlayer(p._id)}
//                         className={`px-4 py-1 rounded-lg font-medium transition ${
//                           alreadyInvited
//                             ? "bg-gray-300 text-gray-500"
//                             : "bg-green-600 hover:bg-green-700 text-white"
//                         }`}
//                       >
//                         {alreadyInvited ? "Invité ✓" : "Inviter"}
//                       </button>
//                     </div>
//                   );
//                 })}
//               </div>

//               <button
//                 onClick={() => router.push("/competitions")}
//                 className="mt-6 w-full bg-yellow-500 hover:bg-yellow-600 py-3 rounded-xl font-bold"
//               >
//                 ✔️ Terminer
//               </button>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </StadiumBackground>
//   );
// }
