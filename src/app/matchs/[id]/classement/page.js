"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import StadiumBackground from "@/components/StadiumBackground";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function ClassementMatch() {
  const { id } = useParams();
  const router = useRouter();

  const [classement, setClassement] = useState([]);
  const [matchInfo, setMatchInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [matchRes, classementRes] = await Promise.all([
          axios.get(`${API}/api/matchs/${id}`),
          axios.get(`${API}/api/matchs/${id}/classement`)
        ]);
        setMatchInfo(matchRes.data);
        setClassement(classementRes.data);
      } catch (err) {
        console.log("Erreur:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const medal = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return " ";
  };

  const badgeColors = {
    Débutant: "bg-green-500/20 text-green-300 border-green-400/30",
    Intermédiaire: "bg-blue-500/20 text-blue-300 border-blue-400/30",
    Avancé: "bg-red-500/20 text-red-300 border-red-400/30",
  };

  const getPodiumHeight = (rank) => {
    switch (rank) {
      case 0: return "h-28 md:h-32"; // 1ère place
      case 1: return "h-20 md:h-24"; // 2ème place
      case 2: return "h-16 md:h-20"; // 3ème place
      default: return "h-12 md:h-16";
    }
  };

  const getPodiumColor = (rank) => {
    switch (rank) {
      case 0: return "from-yellow-400 to-yellow-600"; // Or
      case 1: return "from-gray-300 to-gray-500"; // Argent
      case 2: return "from-orange-300 to-orange-500"; // Bronze
      default: return "from-blue-400 to-blue-600";
    }
  };

  return (
    <StadiumBackground>
      <div className="relative z-10 min-h-screen py-6 px-3 md:py-8 md:px-4">
        <div className="max-w-6xl mx-auto">
          {/* En-tête AMÉLIORÉ */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 md:mb-12"
          >
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-5xl font-black mb-3 md:mb-4 relative z-10 px-2"
              style={{
                background: "linear-gradient(135deg, #0f5c2f 0%, #1a7a3f 25%, #2d9c5a 40%, #facc15 50%, #2d9c5a 60%, #1a7a3f 75%, #0f5c2f 100%)",
                backgroundSize: "300% 300%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "brightness(1.1) contrast(1.2)",
                animation: "grassShimmer 4s ease-in-out infinite",
              }}
            >
              Classement du Match
            </motion.h1>

            {/* Ligne de séparation */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-32 md:w-48 h-1 bg-gradient-to-r from-green-400 via-yellow-400 to-green-400 mx-auto rounded-full mb-4 md:mb-6"
            />

            {/* Badge niveau */}
            {matchInfo && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`inline-block px-4 py-1 md:px-6 md:py-2 rounded-full font-bold border-2 backdrop-blur-sm text-sm md:text-base ${badgeColors[matchInfo.niveau]}`}
              >
                Niveau : {matchInfo.niveau}
              </motion.div>
            )}
          </motion.div>

          {/* Bouton retour */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            onClick={() => router.push(`/matchs/${id}`)}
            className="mb-8 md:mb-12 bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/20 text-white px-4 py-2 md:px-6 md:py-3 rounded-xl transition-all duration-300 flex items-center gap-2 group text-sm md:text-base mx-auto"
          >
            <motion.span
              animate={{ x: [-5, 0, -5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ←
            </motion.span>
            Retour au match
          </motion.button>

          {loading ? (
            <div className="text-center py-16 md:py-20">
              <div className="inline-block w-10 h-10 md:w-12 md:h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-white/70 mt-3 md:mt-4 text-sm md:text-base">Chargement du classement...</p>
            </div>
          ) : classement.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 md:py-20 bg-white/10 backdrop-blur-lg rounded-2xl md:rounded-3xl border border-white/20 mx-2"
            >
              <div className="text-4xl md:text-6xl mb-3 md:mb-4">🏆</div>
              <p className="text-white/80 text-lg md:text-xl px-4">Aucune évaluation pour ce match.</p>
              <p className="text-white/60 mt-2 text-sm md:text-base">Soyez le premier à noter les joueurs !</p>
            </motion.div>
          ) : (
            <>
              {/* PODIUM 3D ANIMÉ - RESPONSIVE */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="mb-12 md:mb-16"
              >
                <h2 className="text-xl md:text-2xl font-bold text-center text-white mb-6 md:mb-8 px-2">
                  🏆 Podium des Champions 🏆
                </h2>
                
                <div className="flex justify-center items-end gap-2 md:gap-8 h-40 md:h-48 px-2">
                  <AnimatePresence>
                    {classement.slice(0, 3).map((item, index) => (
                      <motion.div
                        key={item.joueur?._id || index}
                        initial={{ opacity: 0, y: 100, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ 
                          duration: 0.6, 
                          delay: 0.7 + (index * 0.2),
                          type: "spring",
                          stiffness: 100
                        }}
                        whileHover={{ 
                          y: -8,
                          scale: 1.03,
                          transition: { duration: 0.3 }
                        }}
                        className={`relative ${getPodiumHeight(index)} w-16 md:w-32 bg-gradient-to-b ${getPodiumColor(index)} rounded-t-2xl shadow-2xl border-2 border-white/30 backdrop-blur-sm flex flex-col items-center justify-end pb-3 md:pb-4 group cursor-pointer`}
                      >
                        {/* Effet de brillance */}
                        <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent rounded-t-2xl" />
                        
                        {/* Médaille */}
                        <motion.div
                          animate={{ 
                            rotate: [0, 5, 0, -5, 0],
                            scale: [1, 1.1, 1]
                          }}
                          transition={{ 
                            duration: 2, 
                            repeat: Infinity,
                            delay: index * 0.5
                          }}
                          className="text-2xl md:text-3xl mb-1 md:mb-2 relative z-10"
                        >
                          {medal(index + 1)}
                        </motion.div>

                        {/* Avatar */}
                        <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-white font-bold text-sm md:text-lg mb-1 md:mb-2 relative z-10 shadow-lg">
                          {item.joueur?.name?.charAt(0).toUpperCase() || "?"}
                        </div>

                        {/* Nom */}
                        <div className="text-center relative z-10 px-1">
                          <p className="text-white font-bold text-xs md:text-sm truncate">
                            {item.joueur?.name?.split(' ')[0] || "Joueur"}
                          </p>
                          <p className="text-white/90 text-xs">
                            {item.moyenne.toFixed(1)}
                          </p>
                        </div>

                        {/* Effet de lumière au survol */}
                        <div className="absolute inset-0 bg-gradient-to-t from-yellow-200/10 to-transparent rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* LISTE COMPLÈTE DU CLASSEMENT - RESPONSIVE */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0 }}
                className="space-y-3 md:space-y-4 px-2"
              >
                <h3 className="text-lg md:text-xl font-bold text-white mb-4 md:mb-6 text-center">
                  Classement Complet
                </h3>
                
                {classement.map((item, index) => (
                  <motion.div
                    key={item.joueur?._id || index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 + (index * 0.1) }}
                    whileHover={{ scale: 1.01, x: 2 }}
                    className={`relative bg-white/10 backdrop-blur-xl border border-white/20 p-3 md:p-6 rounded-xl md:rounded-2xl shadow-lg flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 md:gap-0 group ${
                      index < 3 ? "ring-1 md:ring-2 ring-yellow-400/50" : ""
                    } hover:bg-white/15 transition-all duration-300`}
                  >
                    {/* Section gauche - Rang et infos joueur */}
                    <div className="flex items-center gap-3 md:gap-6 flex-1 min-w-0">
                      <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                        <div className="text-xl md:text-2xl w-6 md:w-8">
                          {medal(index + 1)}
                        </div>
                        
                        <div className="text-white font-bold text-lg md:text-xl w-6 md:w-8 text-center">
                          #{index + 1}
                        </div>
                      </div>

                      {/* Avatar */}
                      <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm md:text-lg shadow-lg border-2 border-white/30 flex-shrink-0">
                        {item.joueur?.name?.charAt(0).toUpperCase() || "?"}
                      </div>

                      {/* Infos joueur */}
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-white text-base md:text-lg truncate">
                          {item.joueur?.name || "Joueur supprimé"}
                        </h3>
                        <p className="text-white/70 text-xs md:text-sm flex items-center gap-1 md:gap-2 truncate">
                          <span className="text-xs md:text-sm">🎯</span>
                          {item.joueur?.position || "—"}
                        </p>
                      </div>
                    </div>

                    {/* Section droite - Score et progression */}
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <div className="flex items-center gap-2 md:gap-3">
                        <span className="text-yellow-400 font-bold text-xl md:text-2xl">
                          {item.moyenne.toFixed(1)}
                        </span>
                        <div className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 md:px-3 md:py-1 rounded-full border border-blue-400/30 whitespace-nowrap">
                          {item.nbEvaluations} éval.
                        </div>
                      </div>

                      {/* Barre de progression */}
                      <div className="w-24 md:w-32 bg-white/20 h-1.5 md:h-2 rounded-full">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(item.moyenne / 5) * 100}%` }}
                          transition={{ duration: 1, delay: 1.5 + (index * 0.1) }}
                          className="h-1.5 md:h-2 bg-gradient-to-r from-green-400 to-yellow-400 rounded-full"
                        />
                      </div>
                    </div>

                    {/* Effet de bordure au survol */}
                    <div className="absolute inset-0 rounded-xl md:rounded-2xl border-2 border-yellow-400/0 group-hover:border-yellow-400/30 transition-all duration-300 pointer-events-none" />
                  </motion.div>
                ))}
              </motion.div>
            </>
          )}
        </div>

        {/* Styles pour les animations */}
        <style jsx>{`
          @keyframes grassShimmer {
            0%, 100% { 
              background-position: 0% 50%;
              filter: brightness(1.1) contrast(1.2);
            }
            50% { 
              background-position: 100% 50%;
              filter: brightness(1.3) contrast(1.4);
            }
          }
        `}</style>
      </div>
    </StadiumBackground>
  );
}


// "use client";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams, useRouter } from "next/navigation";
// import { motion, AnimatePresence } from "framer-motion";
// import StadiumBackground from "@/components/StadiumBackground";

// const API = process.env.NEXT_PUBLIC_API_URL;

// export default function ClassementMatch() {
//   const { id } = useParams();
//   const router = useRouter();

//   const [classement, setClassement] = useState([]);
//   const [matchInfo, setMatchInfo] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const [matchRes, classementRes] = await Promise.all([
//           axios.get(`${API}/api/matchs/${id}`),
//           axios.get(`${API}/api/matchs/${id}/classement`)
//         ]);
//         setMatchInfo(matchRes.data);
//         setClassement(classementRes.data);
//       } catch (err) {
//         console.log("Erreur:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [id]);

//   const medal = (rank) => {
//     if (rank === 1) return "🥇";
//     if (rank === 2) return "🥈";
//     if (rank === 3) return "🥉";
//     return " ";
//   };

//   const badgeColors = {
//     Débutant: "bg-green-500/20 text-green-300 border-green-400/30",
//     Intermédiaire: "bg-blue-500/20 text-blue-300 border-blue-400/30",
//     Avancé: "bg-red-500/20 text-red-300 border-red-400/30",
//   };

//   const getPodiumHeight = (rank) => {
//     switch (rank) {
//       case 0: return "h-32"; // 1ère place
//       case 1: return "h-24"; // 2ème place
//       case 2: return "h-20"; // 3ème place
//       default: return "h-16";
//     }
//   };

//   const getPodiumColor = (rank) => {
//     switch (rank) {
//       case 0: return "from-yellow-400 to-yellow-600"; // Or
//       case 1: return "from-gray-300 to-gray-500"; // Argent
//       case 2: return "from-orange-300 to-orange-500"; // Bronze
//       default: return "from-blue-400 to-blue-600";
//     }
//   };

//   return (
//     <StadiumBackground>
//       <div className="relative z-10 min-h-screen py-8 px-4">
//         <div className="max-w-6xl mx-auto">
//           {/* En-tête AMÉLIORÉ */}
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="text-center mb-12"
//           >
//             <motion.h1
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.6 }}
//               className="text-5xl font-black mb-4 relative z-10"
//               style={{
//                 background: "linear-gradient(135deg, #0f5c2f 0%, #1a7a3f 25%, #2d9c5a 40%, #facc15 50%, #2d9c5a 60%, #1a7a3f 75%, #0f5c2f 100%)",
//                 backgroundSize: "300% 300%",
//                 WebkitBackgroundClip: "text",
//                 WebkitTextFillColor: "transparent",
//                 backgroundClip: "text",
//                 filter: "brightness(1.1) contrast(1.2)",
//                 animation: "grassShimmer 4s ease-in-out infinite",
//               }}
//             >
//               Classement du Match
//             </motion.h1>

//             {/* Ligne de séparation */}
//             <motion.div
//               initial={{ scaleX: 0 }}
//               animate={{ scaleX: 1 }}
//               transition={{ duration: 0.8, delay: 0.2 }}
//               className="w-48 h-1 bg-gradient-to-r from-green-400 via-yellow-400 to-green-400 mx-auto rounded-full mb-6"
//             />

//             {/* Badge niveau */}
//             {matchInfo && (
//               <motion.div
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.3 }}
//                 className={`inline-block px-6 py-2 rounded-full font-bold border-2 backdrop-blur-sm ${badgeColors[matchInfo.niveau]}`}
//               >
//                 Niveau : {matchInfo.niveau}
//               </motion.div>
//             )}
//           </motion.div>

//           {/* Bouton retour */}
//           <motion.button
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.4 }}
//             onClick={() => router.push(`/matchs/${id}`)}
//             className="mb-12 bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/20 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 group"
//           >
//             <motion.span
//               animate={{ x: [-5, 0, -5] }}
//               transition={{ duration: 1.5, repeat: Infinity }}
//             >
//               ←
//             </motion.span>
//             Retour au match
//           </motion.button>

//           {loading ? (
//             <div className="text-center py-20">
//               <div className="inline-block w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
//               <p className="text-white/70 mt-4">Chargement du classement...</p>
//             </div>
//           ) : classement.length === 0 ? (
//             <motion.div
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               className="text-center py-20 bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20"
//             >
//               <div className="text-6xl mb-4">🏆</div>
//               <p className="text-white/80 text-xl">Aucune évaluation pour ce match.</p>
//               <p className="text-white/60 mt-2">Soyez le premier à noter les joueurs !</p>
//             </motion.div>
//           ) : (
//             <>
//               {/* PODIUM 3D ANIMÉ */}
//               <motion.div
//                 initial={{ opacity: 0, y: 50 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.8, delay: 0.5 }}
//                 className="mb-16"
//               >
//                 <h2 className="text-2xl font-bold text-center text-white mb-8">
//                   🏆 Podium des Champions 🏆
//                 </h2>
                
//                 <div className="flex justify-center items-end gap-4 md:gap-8 h-48">
//                   <AnimatePresence>
//                     {classement.slice(0, 3).map((item, index) => (
//                       <motion.div
//                         key={item.joueur?._id || index}
//                         initial={{ opacity: 0, y: 100, scale: 0.8 }}
//                         animate={{ opacity: 1, y: 0, scale: 1 }}
//                         transition={{ 
//                           duration: 0.6, 
//                           delay: 0.7 + (index * 0.2),
//                           type: "spring",
//                           stiffness: 100
//                         }}
//                         whileHover={{ 
//                           y: -10,
//                           scale: 1.05,
//                           transition: { duration: 0.3 }
//                         }}
//                         className={`relative ${getPodiumHeight(index)} w-24 md:w-32 bg-gradient-to-b ${getPodiumColor(index)} rounded-t-2xl shadow-2xl border-2 border-white/30 backdrop-blur-sm flex flex-col items-center justify-end pb-4 group cursor-pointer`}
//                       >
//                         {/* Effet de brillance */}
//                         <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent rounded-t-2xl" />
                        
//                         {/* Médaille */}
//                         <motion.div
//                           animate={{ 
//                             rotate: [0, 5, 0, -5, 0],
//                             scale: [1, 1.1, 1]
//                           }}
//                           transition={{ 
//                             duration: 2, 
//                             repeat: Infinity,
//                             delay: index * 0.5
//                           }}
//                           className="text-3xl mb-2 relative z-10"
//                         >
//                           {medal(index + 1)}
//                         </motion.div>

//                         {/* Avatar */}
//                         <div className="w-12 h-12 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-white font-bold text-lg mb-2 relative z-10 shadow-lg">
//                           {item.joueur?.name?.charAt(0).toUpperCase() || "?"}
//                         </div>

//                         {/* Nom */}
//                         <div className="text-center relative z-10">
//                           <p className="text-white font-bold text-sm truncate max-w-20">
//                             {item.joueur?.name?.split(' ')[0] || "Joueur"}
//                           </p>
//                           <p className="text-white/90 text-xs">
//                             {item.moyenne.toFixed(1)}
//                           </p>
//                         </div>

//                         {/* Effet de lumière au survol */}
//                         <div className="absolute inset-0 bg-gradient-to-t from-yellow-200/10 to-transparent rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//                       </motion.div>
//                     ))}
//                   </AnimatePresence>
//                 </div>
//               </motion.div>

//               {/* LISTE COMPLÈTE DU CLASSEMENT */}
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 1.0 }}
//                 className="space-y-4"
//               >
//                 <h3 className="text-xl font-bold text-white mb-6 text-center">
//                   Classement Complet
//                 </h3>
                
//                 {classement.map((item, index) => (
//                   <motion.div
//                     key={item.joueur?._id || index}
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: 1.2 + (index * 0.1) }}
//                     whileHover={{ scale: 1.02, x: 5 }}
//                     className={`relative bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-lg flex justify-between items-center group ${
//                       index < 3 ? "ring-2 ring-yellow-400/50" : ""
//                     } hover:bg-white/15 transition-all duration-300`}
//                   >
//                     {/* Rang et médaille */}
//                     <div className="flex items-center gap-6">
//                       <div className="flex items-center gap-4">
//                         <div className="text-2xl w-8">
//                           {medal(index + 1)}
//                         </div>
                        
//                         <div className="text-white font-bold text-xl w-8 text-center">
//                           #{index + 1}
//                         </div>
//                       </div>

//                       {/* Avatar */}
//                       <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg border-2 border-white/30">
//                         {item.joueur?.name?.charAt(0).toUpperCase() || "?"}
//                       </div>

//                       {/* Infos joueur */}
//                       <div>
//                         <h3 className="font-bold text-white text-lg">
//                           {item.joueur?.name || "Joueur supprimé"}
//                         </h3>
//                         <p className="text-white/70 text-sm flex items-center gap-2">
//                           <span>🎯</span>
//                           {item.joueur?.position || "—"}
//                         </p>
//                       </div>
//                     </div>

//                     {/* Score et évaluations */}
//                     <div className="text-right">
//                       <div className="flex items-center gap-3">
//                         <span className="text-yellow-400 font-bold text-2xl">
//                           {item.moyenne.toFixed(1)}
//                         </span>
//                         <div className="text-xs bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full border border-blue-400/30">
//                           {item.nbEvaluations} éval.
//                         </div>
//                       </div>

//                       {/* Barre de progression */}
//                       <div className="w-32 bg-white/20 h-2 rounded-full mt-2">
//                         <motion.div
//                           initial={{ width: 0 }}
//                           animate={{ width: `${(item.moyenne / 5) * 100}%` }}
//                           transition={{ duration: 1, delay: 1.5 + (index * 0.1) }}
//                           className="h-2 bg-gradient-to-r from-green-400 to-yellow-400 rounded-full"
//                         />
//                       </div>
//                     </div>

//                     {/* Effet de bordure au survol */}
//                     <div className="absolute inset-0 rounded-2xl border-2 border-yellow-400/0 group-hover:border-yellow-400/30 transition-all duration-300 pointer-events-none" />
//                   </motion.div>
//                 ))}
//               </motion.div>
//             </>
//           )}
//         </div>

//         {/* Styles pour les animations */}
//         <style jsx>{`
//           @keyframes grassShimmer {
//             0%, 100% { 
//               background-position: 0% 50%;
//               filter: brightness(1.1) contrast(1.2);
//             }
//             50% { 
//               background-position: 100% 50%;
//               filter: brightness(1.3) contrast(1.4);
//             }
//           }
//         `}</style>
//       </div>
//     </StadiumBackground>
//   );
// }


// "use client";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams, useRouter } from "next/navigation";
// import { motion } from "framer-motion";

// const API = process.env.NEXT_PUBLIC_API_URL;

// export default function ClassementMatch() {
//   const { id } = useParams();
//   const router = useRouter();

//   const [classement, setClassement] = useState([]);
//   const [matchInfo, setMatchInfo] = useState(null);

//   useEffect(() => {
//     const fetchClassement = async () => {
//       try {
//         const { data } = await axios.get(`${API}/api/matchs/${id}/classement`);
//         setClassement(data);
//       } catch (err) {
//         console.log("Erreur Classement:", err);
//       }
//     };

//     const fetchMatch = async () => {
//       try {
//         const { data } = await axios.get(`${API}/api/matchs/${id}`);
//         setMatchInfo(data);
//       } catch (err) {
//         console.log("Erreur match:", err);
//       }
//     };

//     fetchMatch();
//     fetchClassement();
//   }, [id]);

//   const medal = (rank) => {
//     if (rank === 1) return "🥇";
//     if (rank === 2) return "🥈";
//     if (rank === 3) return "🥉";
//     return " ";
//   };

//   const badgeColors = {
//     Débutant: "bg-green-100 text-green-800",
//     Intermédiaire: "bg-blue-100 text-blue-800",
//     Avancé: "bg-red-100 text-red-800",
//   };

//   return (
//     <div className="max-w-3xl mx-auto py-24 px-4">
//       <motion.h1
//         initial={{ opacity: 0, y: -15 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="text-3xl font-bold text-center mb-4"
//       >
//         Classement du match
//       </motion.h1>

//       {/* Badge niveau */}
//       {matchInfo && (
//         <p className={`text-center mb-8 inline-block px-4 py-2 rounded-full text-sm font-semibold shadow ${badgeColors[matchInfo.niveau]}`}>
//           Niveau : {matchInfo.niveau}
//         </p>
//       )}

//       <button
//         onClick={() => router.push(`/matchs/${id}`)}
//         className="mb-10 block mx-auto bg-blue-600 text-white px-5 py-2 rounded-xl shadow hover:bg-blue-700 transition"
//       >
//         ← Retour au match
//       </button>

//       {classement.length === 0 && (
//         <p className="text-center text-gray-600">
//           Aucune évaluation pour ce match.
//         </p>
//       )}

//       {classement.map((item, index) => (
//         <motion.div
//           key={item.joueur?._id || index}
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: index * 0.1 }}
//           className={`relative bg-white/40 backdrop-blur-xl border border-white/20 p-4 rounded-xl shadow-md mb-4 flex justify-between items-center ${
//             index === 0 ? "ring-2 ring-yellow-400 animate-pulse" : ""
//           }`}
//         >
//           {/* Médaille */}
//           <div className="absolute -top-3 -left-3 text-2xl">
//             {medal(index + 1)}
//           </div>

//           {/* Avatar */}
//           <div className="flex items-center gap-4">
//             <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-300 to-blue-500 flex items-center justify-center text-white font-bold shadow">
//               {item.joueur?.name?.charAt(0).toUpperCase() || "?"}
//             </div>

//             <div>
//               <h3 className="font-bold text-lg">
//                 #{index + 1} — {item.joueur?.name || "Joueur supprimé"}
//               </h3>

//               <p className="text-gray-700 text-sm">
//                 {item.joueur?.position || "—"}
//               </p>
//             </div>
//           </div>

//           {/* Score + nb eval */}
//           <div className="text-right w-32">
//             <span className="text-blue-600 font-bold text-2xl">
//               {item.moyenne.toFixed(1)}
//             </span>

//             <div className="text-xs bg-blue-50 text-blue-800 px-2 py-1 rounded-lg mt-1">
//               {item.nbEvaluations} évals.
//             </div>

//             {/* Progress Bar */}
//             <div className="w-full bg-gray-200 h-2 rounded mt-2">
//               <div
//                 className="h-2 bg-blue-500 rounded transition-all"
//                 style={{
//                   width: `${(item.moyenne / 5) * 100}%`,
//                 }}
//               ></div>
//             </div>
//           </div>
//         </motion.div>
//       ))}
//     </div>
//   );
// }



// "use client";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams } from "next/navigation";
// import { motion } from "framer-motion";

// const API = process.env.NEXT_PUBLIC_API_URL;

// export default function ClassementMatch() {
//   const { id } = useParams();
//   const [classement, setClassement] = useState([]);

//   useEffect(() => {
//     const fetchClassement = async () => {
//       try {
//         const { data } = await axios.get(`${API}/api/matchs/${id}/classement`);
//         setClassement(data);
//       } catch (err) {
//         console.log("Erreur Classement:", err);
//       }
//     };

//     fetchClassement();
//   }, [id]);

//   return (
//     <div className="max-w-3xl mx-auto py-24 px-4">
//       <motion.h1
//         initial={{ opacity: 0, y: -15 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="text-3xl font-bold text-center mb-10"
//       >
//         Classement du match
//       </motion.h1>

//       {classement.length === 0 && (
//         <p className="text-center text-gray-600">Aucune évaluation pour ce match.</p>
//       )}

//       {classement.map((item, index) => (
//         <motion.div
//           key={item.joueur?._id || index}
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: index * 0.1 }}
//           className="bg-white/40 backdrop-blur-xl border border-white/20 p-4 rounded-xl shadow-md mb-4 flex justify-between items-center"
//         >
//           <div>
//             <h3 className="font-bold text-lg">
//               #{index + 1} — {item.joueur?.name || "Joueur introuvable"}
//             </h3>

//             <p className="text-gray-700 text-sm">
//               {item.joueur?.position || "—"}
//             </p>
//           </div>

//           <div className="text-right">
//             <span className="text-blue-600 font-bold text-2xl">
//               {item.moyenne.toFixed(1)}
//             </span>

//             <div className="text-sm bg-blue-50 text-blue-800 px-2 py-1 rounded-lg mt-1">
//               {item.nbEvaluations} éval.
//             </div>
//           </div>
//         </motion.div>
//       ))}
//     </div>
//   );
// }



// "use client";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams } from "next/navigation";

// const API = process.env.NEXT_PUBLIC_API_URL;


// export default function ClassementMatch() {
//   const { id } = useParams();
//   const [classement, setClassement] = useState([]);

//   useEffect(() => {
//     const fetchClassement = async () => {
//       const { data } = await axios.get(`${API}/api/matchs/${id}/classement`);
//       setClassement(data);  
//     };
//     fetchClassement();
//   }, [id]);

//   return (
//     <div className="max-w-3xl mx-auto my-10 py-24">
//       <h1 className="text-2xl font-bold text-center mb-8">
//         Classement du match
//       </h1>

//       {classement.map((item, index) => (
//         <div
//           key={item.joueur._id}
//           className="bg-white border p-4 rounded-xl shadow-md mb-4 flex justify-between items-center"
//         >
//           <div>
//             <h3 className="font-bold text-lg">
//               #{index + 1} — {item.joueur.nom} {item.joueur.prenom}
//             </h3>
//             <p className="text-gray-600 text-sm">{item.joueur.poste}</p>
//           </div>

//           <div className="text-right">
//             <span className="text-blue-600 font-bold text-xl">
//               {item.moyenne.toFixed(1)}
//             </span>

//             <div className="text-sm bg-blue-600/10 text-blue-700 px-2 py-1 rounded-lg mt-1">
//               {item.nbEvaluations} évaluations
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }



// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { motion } from "framer-motion";
// import axios from "axios";

// const API = process.env.NEXT_PUBLIC_API_URL;


// export default function ClassementMatch() {
//   const router = useRouter();
//   const { id } = router.query || {};

//   const [classement, setClassement] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!id) return;

//     const fetchClassement = async () => {
//       try {
//         const { data } = await axios.get(`${API}/api/matchs/${id}/classement`);
//         setClassement(data);
//       } catch (err) {
//         setError("Erreur lors du chargement du classement");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchClassement();
//   }, [id]);

//   if (loading) return <p className="text-center mt-10 text-lg">Chargement...</p>;
//   if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black p-6">
//       <motion.h1
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         className="text-center text-3xl font-bold text-white mb-10"
//       >
//         Classement du Match
//       </motion.h1>

//       <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20">
//         {classement.length === 0 ? (
//           <p className="text-white text-center">Aucune évaluation trouvée.</p>
//         ) : (
//           <div className="space-y-4">
//             {classement.map((player, index) => (
//               <motion.div
//                 key={player.evalue._id}
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.4, delay: index * 0.1 }}
//                 className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-all"
//               >
//                 <div className="flex items-center gap-3">
//                   <div className="text-white text-xl font-bold">#{index + 1}</div>
//                   <div>
//                     <p className="text-white font-semibold">{player.evalue.nom}</p>
//                     <p className="text-gray-300 text-sm">{player.nbEvaluations} évaluations</p>
//                   </div>
//                 </div>

//                 <div className="px-4 py-2 rounded-xl bg-blue-500/20 text-white font-bold backdrop-blur-xl border border-blue-300/20">
//                   {player.moyenne.toFixed(2)} ⭐
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



