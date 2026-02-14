"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import StadiumBackground from "@/components/StadiumBackground";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function CompetitionPage() {
  const [nom, setNom] = useState("");
  const [type, setType] = useState("CHAMPIONNAT");
  const [categorie, setCategorie] = useState("REGIONAL");
  const [phaseType, setPhaseType] = useState("SANS_GROUPES");
  const [gouvernorat, setGouvernorat] = useState("");
  const [saison, setSaison] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [nbEquipes, setNbEquipes] = useState("");
  const [terrains, setTerrains] = useState([]);
  const [selectedTerrains, setSelectedTerrains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  const { proprietaireInfo } = useSelector(
    (state) => state.proprietaireSignin
  );

  useEffect(() => {
    const fetchTerrains = async () => {
      try {
        const { data } = await axios.get(`${API}/api/terrains`, {
          headers: {
            Authorization: `Bearer ${proprietaireInfo?.token}`,
          },
        });
        setTerrains(data);
      } catch (err) {
        console.error(err);
      }
    };

    if (proprietaireInfo?.token) {
      fetchTerrains();
    }
  }, [proprietaireInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setShowMessage(false);

    try {
      await axios.post(
        `${API}/api/competitions`,
        {
          nom,
          type,
          categorie,
          ...(type === "TOURNOI" && { phaseType }),
          gouvernorat: categorie === "REGIONAL" ? gouvernorat : undefined,
          saison,
          dateDebut,
          dateFin,
          nbEquipes: Number(nbEquipes),
          terrains: selectedTerrains,
        },
        {
          headers: {
            Authorization: `Bearer ${proprietaireInfo?.token}`,
          },
        }
      );

      setMessage("✅ Compétition créée avec succès");
      setShowMessage(true);

      // reset form
      setNom("");
      setType("CHAMPIONNAT");
      setCategorie("REGIONAL");
      setPhaseType("SANS_GROUPES");
      setGouvernorat("");
      setSaison("");
      setDateDebut("");
      setDateFin("");
      setNbEquipes("");
      setSelectedTerrains([]);

      // Auto-hide message after 3 seconds
      setTimeout(() => setShowMessage(false), 3000);
    } catch (error) {
      console.error(error);
      setMessage("❌ Erreur lors de la création de la compétition");
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  const isFormInvalid =
    !nom || !dateDebut || !dateFin || !nbEquipes || selectedTerrains.length === 0;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <StadiumBackground>
      {/* Effet de particules */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          {/* En-tête avec effet de stade */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="inline-block mb-4"
            >
              <div className="relative">
                <div className="text-6xl filter drop-shadow-2xl">🏆</div>
                <motion.div
                  className="absolute -inset-4 bg-gradient-to-r from-yellow-500/20 to-green-500/20 rounded-full blur-xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-4xl font-black mb-2"
              style={{
                background: "linear-gradient(135deg, #facc15 0%, #4ade80 50%, #facc15 100%)",
                backgroundSize: "200% 200%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: "gradientShift 3s ease infinite",
              }}
            >
              CRÉER UNE COMPÉTITION
            </motion.h1>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="w-24 h-1 mx-auto bg-gradient-to-r from-yellow-400 to-green-400 rounded-full"
            />
          </div>

          {/* Formulaire */}
          <motion.form
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            onSubmit={submitHandler}
            className="space-y-5 backdrop-blur-xl bg-black/30 p-6 md:p-8 rounded-2xl border border-white/10 shadow-2xl"
          >
            {/* Message de notification */}
            <AnimatePresence>
              {showMessage && message && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  className={`p-4 rounded-xl text-center font-medium ${
                    message.includes("✅")
                      ? "bg-green-500/20 border border-green-500/30 text-green-300"
                      : "bg-red-500/20 border border-red-500/30 text-red-300"
                  }`}
                >
                  {message}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Nom de la compétition */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-white/80 mb-1 ml-1">
                Nom de la compétition
              </label>
              <input
                type="text"
                placeholder="Ex: Championnat Régional 2024"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                required
                className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-yellow-400/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all"
              />
            </motion.div>

            {/* Type et Catégorie en grille */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1 ml-1">
                  Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-yellow-400/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all"
                >
                  <option value="CHAMPIONNAT" className="bg-gray-900">Championnat</option>
                  <option value="TOURNOI" className="bg-gray-900">Tournoi</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-1 ml-1">
                  Catégorie
                </label>
                <select
                  value={categorie}
                  onChange={(e) => setCategorie(e.target.value)}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-yellow-400/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all"
                >
                  <option value="REGIONAL" className="bg-gray-900">Régional</option>
                  <option value="SCOLAIRE" className="bg-gray-900">Scolaire</option>
                  <option value="ENTREPRISE" className="bg-gray-900">Entreprise</option>
                  <option value="LIBRE" className="bg-gray-900">Libre</option>
                </select>
              </div>
            </motion.div>

            {/* Phase type pour tournoi */}
            <AnimatePresence>
              {type === "TOURNOI" && (
                <motion.div
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -20 }}
                >
                  <label className="block text-sm font-medium text-white/80 mb-1 ml-1">
                    Format du tournoi
                  </label>
                  <select
                    value={phaseType}
                    onChange={(e) => setPhaseType(e.target.value)}
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-yellow-400/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all"
                    required
                  >
                    <option value="SANS_GROUPES" className="bg-gray-900">
                      🔴 Élimination directe
                    </option>
                    <option value="AVEC_GROUPES" className="bg-gray-900">
                      🟢 Groupes + Élimination
                    </option>
                  </select>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Gouvernorat (conditionnel) */}
            <AnimatePresence>
              {categorie === "REGIONAL" && (
                <motion.div
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -20 }}
                >
                  <label className="block text-sm font-medium text-white/80 mb-1 ml-1">
                    Gouvernorat
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Tunis, Sfax, Nabeul..."
                    value={gouvernorat}
                    onChange={(e) => setGouvernorat(e.target.value)}
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-yellow-400/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Saison */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-white/80 mb-1 ml-1">
                Saison
              </label>
              <input
                type="text"
                placeholder="Ex: 2024/2025"
                value={saison}
                onChange={(e) => setSaison(e.target.value)}
                className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-yellow-400/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all"
              />
            </motion.div>

            {/* Dates */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1 ml-1">
                  Date début
                </label>
                <input
                  type="date"
                  value={dateDebut}
                  onChange={(e) => setDateDebut(e.target.value)}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-yellow-400/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all [color-scheme:dark]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1 ml-1">
                  Date fin
                </label>
                <input
                  type="date"
                  value={dateFin}
                  onChange={(e) => setDateFin(e.target.value)}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-yellow-400/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all [color-scheme:dark]"
                  required
                />
              </div>
            </motion.div>

            {/* Nombre d'équipes */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-white/80 mb-1 ml-1">
                Nombre d'équipes
              </label>
              <input
                type="number"
                min="2"
                placeholder="Ex: 8, 16, 32..."
                value={nbEquipes}
                onChange={(e) => setNbEquipes(e.target.value)}
                className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-yellow-400/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all"
                required
              />
            </motion.div>

            {/* Terrains */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-white/80 mb-2 ml-1">
                Terrains disponibles
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto p-3 bg-white/5 rounded-xl border border-white/10">
                {terrains.length === 0 ? (
                  <p className="text-white/50 text-center py-2">
                    Aucun terrain disponible
                  </p>
                ) : (
                  terrains.map((terrain, index) => (
                    <motion.label
                      key={terrain._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTerrains.includes(terrain._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTerrains([...selectedTerrains, terrain._id]);
                          } else {
                            setSelectedTerrains(
                              selectedTerrains.filter((id) => id !== terrain._id)
                            );
                          }
                        }}
                        className="w-4 h-4 accent-green-500"
                      />
                      <div className="flex-1">
                        <span className="text-white font-medium">{terrain.nom}</span>
                        <span className="text-white/50 text-sm ml-2">– {terrain.ville}</span>
                      </div>
                      <span className="text-xs px-2 py-1 bg-white/10 rounded-full text-white/70">
                        {terrain.type}
                      </span>
                    </motion.label>
                  ))
                )}
              </div>
              {selectedTerrains.length > 0 && (
                <p className="text-xs text-green-400 mt-1 ml-1">
                  ✓ {selectedTerrains.length} terrain(s) sélectionné(s)
                </p>
              )}
            </motion.div>

            {/* Bouton de soumission */}
            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                disabled={loading || isFormInvalid}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative w-full p-4 rounded-xl font-bold text-white overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {/* Fond avec gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 group-hover:from-green-600 group-hover:to-green-700 transition-all duration-300" />
                
                {/* Effet de lumière */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.8 }}
                />
                
                {/* Contenu du bouton */}
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                      <span>Création en cours...</span>
                    </>
                  ) : (
                    <>
                      <span>🏆</span>
                      <span>Créer la compétition</span>
                      <span>✨</span>
                    </>
                  )}
                </span>
              </motion.button>
            </motion.div>

            {/* Indicateur de progression */}
            <motion.div variants={itemVariants} className="text-center">
              <div className="flex items-center justify-center gap-1 text-xs text-white/40">
                <span>⚡</span>
                <span>Préparez-vous à vivre une compétition exceptionnelle</span>
                <span>⚡</span>
              </div>
            </motion.div>
          </motion.form>
        </motion.div>
      </div>

      {/* Styles CSS additionnels */}
      <style jsx>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        /* Personnalisation de la scrollbar pour la liste des terrains */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </StadiumBackground>
  );
}


// "use client";

// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";

// const API = process.env.NEXT_PUBLIC_API_URL;

// export default function CompetitionPage() {
//   const [nom, setNom] = useState("");
//   const [type, setType] = useState("CHAMPIONNAT");
//   const [categorie, setCategorie] = useState("REGIONAL");
//   const [phaseType, setPhaseType] = useState("SANS_GROUPES");
//   const [gouvernorat, setGouvernorat] = useState("");
//   const [saison, setSaison] = useState("");
//   const [dateDebut, setDateDebut] = useState("");
//   const [dateFin, setDateFin] = useState("");
//   const [nbEquipes, setNbEquipes] = useState("");
//   const [terrains, setTerrains] = useState([]);
//   const [selectedTerrains, setSelectedTerrains] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   const { proprietaireInfo } = useSelector(
//     (state) => state.proprietaireSignin
//   );

//   useEffect(() => {
//     const fetchTerrains = async () => {
//       try {
//         const { data } = await axios.get(`${API}/api/terrains`, {
//           headers: {
//             Authorization: `Bearer ${proprietaireInfo?.token}`,
//           },
//         });
//         setTerrains(data);
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     if (proprietaireInfo?.token) {
//       fetchTerrains();
//     }
//   }, [proprietaireInfo]);

//   const submitHandler = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage("");

//     try {
//       await axios.post(
//         `${API}/api/competitions`,
//         {
//           nom,
//           type,
//           categorie,
//           gouvernorat: categorie === "REGIONAL" ? gouvernorat : undefined,
//           saison,
//           dateDebut,
//           dateFin,
//           nbEquipes: Number(nbEquipes),
//           terrains: selectedTerrains,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${proprietaireInfo?.token}`,
//           },
//         }
//       );

//       setMessage("✅ Compétition créée avec succès");

//       // reset form
//       setNom("");
//       setType("CHAMPIONNAT");
//       setCategorie("REGIONAL");
//       setGouvernorat("");
//       setSaison("");
//       setDateDebut("");
//       setDateFin("");
//       setNbEquipes("");
//       setSelectedTerrains([]);
//     } catch (error) {
//       console.error(error);
//       setMessage("❌ Erreur lors de la création de la compétition");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const isFormInvalid =
//     !nom || !dateDebut || !dateFin || !nbEquipes || selectedTerrains.length === 0;

//   return (
//     <div className="max-w-md mx-auto p-4 py-8">
//       <h1 className="text-xl font-bold mb-4 text-center">
//         Créer une compétition
//       </h1>

//       <form onSubmit={submitHandler} className="space-y-4">
//         <input
//           type="text"
//           placeholder="Nom de la compétition"
//           value={nom}
//           onChange={(e) => setNom(e.target.value)}
//           required
//           className="w-full p-2 border rounded"
//         />

//         <select
//           value={type}
//           onChange={(e) => setType(e.target.value)}
//           className="w-full p-2 border rounded"
//         >
//           <option value="CHAMPIONNAT">Championnat</option>
//           <option value="TOURNOI">Tournoi</option>
//         </select>

//         {type === "TOURNOI" && (
//   <select
//     value={phaseType}
//     onChange={(e) => setPhaseType(e.target.value)}
//     className="w-full p-2 border rounded"
//     required
//   >
//     <option value="SANS_GROUPES">
//       🔴 Élimination directe (sans groupes)
//     </option>
//     <option value="AVEC_GROUPES">
//       🟢 Phase de groupes puis élimination
//     </option>
//   </select>
// )}

//         <select
//           value={categorie}
//           onChange={(e) => setCategorie(e.target.value)}
//           className="w-full p-2 border rounded"
//         >
//           <option value="REGIONAL">Régional</option>
//           <option value="SCOLAIRE">Scolaire</option>
//           <option value="ENTREPRISE">Entreprise</option>
//           <option value="LIBRE">Libre</option>
//         </select>

//         {categorie === "REGIONAL" && (
//           <input
//             type="text"
//             placeholder="Gouvernorat"
//             value={gouvernorat}
//             onChange={(e) => setGouvernorat(e.target.value)}
//             className="w-full p-2 border rounded"
//           />
//         )}

//         <input
//           type="text"
//           placeholder="Saison (ex: 2027/2028)"
//           value={saison}
//           onChange={(e) => setSaison(e.target.value)}
//           className="w-full p-2 border rounded"
//         />

//         <input
//           type="date"
//           value={dateDebut}
//           onChange={(e) => setDateDebut(e.target.value)}
//           className="w-full p-2 border rounded"
//           required
//         />

//         <input
//           type="date"
//           value={dateFin}
//           onChange={(e) => setDateFin(e.target.value)}
//           className="w-full p-2 border rounded"
//           required
//         />

//         <input
//           type="number"
//           min="2"
//           placeholder="Nombre d'équipes"
//           value={nbEquipes}
//           onChange={(e) => setNbEquipes(e.target.value)}
//           className="w-full p-2 border rounded"
//           required
//         />

//         <div>
//           <p className="font-semibold mb-1">Terrains</p>
//           <div className="space-y-1">
//             {terrains.map((terrain) => (
//               <label
//                 key={terrain._id}
//                 className="flex items-center gap-2 text-sm"
//               >
//                 <input
//                   type="checkbox"
//                   checked={selectedTerrains.includes(terrain._id)}
//                   onChange={(e) => {
//                     if (e.target.checked) {
//                       setSelectedTerrains([...selectedTerrains, terrain._id]);
//                     } else {
//                       setSelectedTerrains(
//                         selectedTerrains.filter((id) => id !== terrain._id)
//                       );
//                     }
//                   }}
//                 />
//                 {terrain.nom} – {terrain.ville}
//               </label>
//             ))}
//           </div>
//         </div>

//         <button
//           type="submit"
//           disabled={loading || isFormInvalid}
//           className="w-full bg-blue-600 text-white p-2 rounded disabled:opacity-50"
//         >
//           {loading ? "Création..." : "Créer la compétition"}
//         </button>

//         {message && (
//           <p className="text-center text-sm mt-2">{message}</p>
//         )}
//       </form>
//     </div>
//   );
// }




// "use client";

// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";

// const API = process.env.NEXT_PUBLIC_API_URL;

// export default function CompetitionPage() {
//   const [nom, setNom] = useState("");
//   const [type, setType] = useState("CHAMPIONNAT");
//   const [categorie, setCategorie] = useState("REGIONAL");
//   const [gouvernorat, setGouvernorat] = useState("");
//   const [saison, setSaison] = useState("");
//   const [terrains, setTerrains] = useState([]);
//   const [selectedTerrains, setSelectedTerrains] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");

// const { proprietaireInfo } = useSelector(
//   (state) => state.proprietaireSignin);
// //   const proprietaireInfo =
// //     typeof window !== "undefined"
// //       ? JSON.parse(localStorage.getItem("proprietaireInfo"))
// //       : null;
// console.log("API =", API);
//   useEffect(() => {
//     const fetchTerrains = async () => {
//       try {
//         const { data } = await axios.get(`${API}/api/terrains`, {
//           headers: {
//             Authorization: `Bearer ${proprietaireInfo?.token}`,
//           },
//         });
//         setTerrains(data);
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchTerrains();
//   }, []);

//   const submitHandler = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage("");

//     try {
//       await axios.post(
//         `${API}/api/competitions`,
//         {
//           nom,
//           type,
//           categorie,
//           gouvernorat: categorie === "REGIONAL" ? gouvernorat : undefined,
//           saison,
//           terrains: selectedTerrains,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${proprietaireInfo?.token}`,
//           },
//         }
//       );

//       setMessage("✅ Compétition créée avec succès");
//       setNom("");
//       setGouvernorat("");
//       setSaison("");
//       setSelectedTerrains([]);
//     } catch (error) {
//       setMessage("❌ Erreur lors de la création");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto p-4">
//       <h1 className="text-xl font-bold mb-4 text-center">
//         Créer une compétition
//       </h1>

//       <form onSubmit={submitHandler} className="space-y-4">
//         <input
//           type="text"
//           placeholder="Nom de la compétition"
//           value={nom}
//           onChange={(e) => setNom(e.target.value)}
//           required
//           className="w-full p-2 border rounded"
//         />

//         <select
//           value={type}
//           onChange={(e) => setType(e.target.value)}
//           className="w-full p-2 border rounded"
//         >
//           <option value="CHAMPIONNAT">Championnat</option>
//           <option value="TOURNOI">Tournoi</option>
//         </select>

//         <select
//           value={categorie}
//           onChange={(e) => setCategorie(e.target.value)}
//           className="w-full p-2 border rounded"
//         >
//           <option value="REGIONAL">Régional</option>
//           <option value="SCOLAIRE">Scolaire</option>
//           <option value="ENTREPRISE">Entreprise</option>
//           <option value="LIBRE">Libre</option>
//         </select>

//         {categorie === "REGIONAL" && (
//           <input
//             type="text"
//             placeholder="Gouvernorat"
//             value={gouvernorat}
//             onChange={(e) => setGouvernorat(e.target.value)}
//             className="w-full p-2 border rounded"
//           />
//         )}

//         <input
//           type="text"
//           placeholder="Saison (ex: 2025/2026)"
//           value={saison}
//           onChange={(e) => setSaison(e.target.value)}
//           className="w-full p-2 border rounded"
//         />

//         <div>
//           <p className="font-semibold mb-1">Terrains</p>
//           <div className="space-y-1">
//             {terrains.map((terrain) => (
//               <label
//                 key={terrain._id}
//                 className="flex items-center gap-2 text-sm"
//               >
//                 <input
//                   type="checkbox"
//                   value={terrain._id}
//                   checked={selectedTerrains.includes(terrain._id)}
//                   onChange={(e) => {
//                     if (e.target.checked) {
//                       setSelectedTerrains([
//                         ...selectedTerrains,
//                         terrain._id,
//                       ]);
//                     } else {
//                       setSelectedTerrains(
//                         selectedTerrains.filter((id) => id !== terrain._id)
//                       );
//                     }
//                   }}
//                 />
//                 {terrain.nom} – {terrain.ville}
//               </label>
//             ))}
//           </div>
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-blue-600 text-white p-2 rounded"
//         >
//           {loading ? "Création..." : "Créer la compétition"}
//         </button>

//         {message && (
//           <p className="text-center text-sm mt-2">{message}</p>
//         )}
//       </form>
//     </div>
//   );
// }
