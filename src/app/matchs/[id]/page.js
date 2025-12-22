'use client';

import Link from "next/link";
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useRouter } from 'next/navigation';
import { getMatchDetails, joinMatch } from '../../../redux/actions/matchActions';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../../../components/Loader';
import StadiumBackground from "@/components/StadiumBackground";

export default function MatchDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const matchDetails = useSelector((state) => state.matchDetails || {});
  const { match, loading, error } = matchDetails;

  const footballeurSignin = useSelector((state) => state.footballeurSignin || {});
  const { footballeurInfo } = footballeurSignin;

  const [timeLeft, setTimeLeft] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const hasRefreshedStatus = useRef(false);

  // ✅ Fonction ajoutée pour formater la moyenne
  const getFormattedRating = (player) => {
    if (!player || !player.averageRating) return "N/A";
    const rating = parseFloat(player.averageRating);
    return isNaN(rating) ? "N/A" : rating.toFixed(1);
  };

  // Charger match
  useEffect(() => {
    if (id) dispatch(getMatchDetails(id));
  }, [dispatch, id]);

  // Timer match
  useEffect(() => {
    if (!match || !match.date || !match.heure) return;

    const matchDateTime = new Date(`${match.date}T${match.heure}`);
    const endTime = new Date(matchDateTime.getTime() + 90 * 60 * 1000);

    const interval = setInterval(() => {
      const now = new Date();
      const diff = endTime - now;

      if (diff <= 0) {
        setTimeLeft("00:00:00");
        clearInterval(interval);

        if (!hasRefreshedStatus.current) {
          hasRefreshedStatus.current = true;
          dispatch(getMatchDetails(id));
        }
      } else {
        const h = Math.floor(diff / 1000 / 3600);
        const m = Math.floor((diff / 1000 % 3600) / 60);
        const s = Math.floor(diff / 1000 % 60);
        setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [match, id, dispatch]);

  // Vérifie si joueur déjà inscrit
  const isUserJoined = () => {
    if (!match || !match.joueurs || !footballeurInfo) return false;
    return match.joueurs.some((j) => {
      const jid = j?._id ? j._id.toString() : j.toString();
      const uid = footballeurInfo._id?.toString() || footballeurInfo.id?.toString();
      return jid === uid;
    });
  };

  const isMatchFull = () => {
    const cap = match?.terrain?.capacite;
    if (!cap) return false;
    return (match?.joueurs?.length || 0) >= cap;
  };

  const handleJoin = async () => {
    if (!footballeurInfo) {
      toast.info('🧑‍💻 Veuillez vous connecter pour rejoindre un match');
      router.push('/signin');
      return;
    }

    if (isUserJoined()) return toast.warning('⚠️ Vous êtes déjà inscrit à ce match.');
    if (isMatchFull()) return toast.error('❌ Ce match est complet.');

    try {
      await dispatch(joinMatch(id));
      await dispatch(getMatchDetails(id));
      toast.success('✅ Vous avez rejoint le match !');
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'inscription !");
    }
  };

  // const handleEvaluateClick = () => {
  //   if (match?.statut !== "Terminé") {
  //     setShowModal(true);
  //   } else {
  //     router.push(`/matchs/${match._id}/evaluate`);
  //   }
  // };

  return (
    <StadiumBackground>

      {/* Bannière match terminé */}
      {match?.statut === "Terminé" && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full py-4 text-center bg-gradient-to-r from-yellow-600 to-yellow-800 text-black font-bold tracking-wide shadow-xl"
        >
          <motion.span
            initial={{ scale: 0.9 }}
            animate={{ scale: 1.05 }}
            transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
            className="text-xl"
          >
            🏆 MATCH TERMINÉ — Vous pouvez maintenant évaluer !
          </motion.span>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl mx-auto py-8 px-4"
      >

        {/* Titre */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-yellow-500 drop-shadow-xl">
            ⚽ Détails du Match
          </h1>
        </motion.div>

        {/* Loader */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader text="Chargement du match..." />
          </div>
        ) : error ? (
          <motion.div className="bg-red-600/20 border border-red-500 rounded-xl p-6 text-center text-red-300">
            <p className="text-lg">{error}</p>
            <button onClick={() => router.push('/matchs')} className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg">Retour</button>
          </motion.div>
        ) : !match ? (
          <motion.div className="bg-white/10 p-8 text-center border border-white/20 rounded-2xl">
            <p className="text-white/80 text-xl">Aucun match trouvé.</p>
          </motion.div>
        ) : (
          <div className="space-y-6">


            {/* Compte à rebours */}
            {match?.statut !== "Terminé" && timeLeft && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-yellow-400 font-bold text-2xl drop-shadow-lg"
              >
                ⏳ Temps restant avant fin du match : {timeLeft}
              </motion.div>
            )}
            {/* Informations Terrain */}
            <motion.section   className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
              <h2 className="text-2xl font-bold text-yellow-300 mb-4">🏟️ Terrain</h2>
              <div className="grid md:grid-cols-2 gap-4 text-white/90">
                <div className="space-y-3">
                  <p><span className="font-semibold text-yellow-200">Nom :</span> {match?.terrain?.nom}</p>
                  <p><span className="font-semibold text-yellow-200">Ville :</span> {match?.terrain?.ville}</p>
                  <p><span className="font-semibold text-yellow-200">Adresse :</span> {match?.terrain?.adresse}</p>
                </div>
                <div className="space-y-3">
                  <p><span className="font-semibold text-yellow-200">Gazon :</span> {match?.terrain?.typeGazon}</p>
                  <p><span className="font-semibold text-yellow-200">Capacité :</span> {match?.terrain?.capacite}</p>
                  <p><span className="font-semibold text-yellow-200">Prix/h :</span> {match?.terrain?.prixHeure} DT</p>
                </div>
              </div>
            </motion.section>

            {/* Informations Match */}
            <motion.section className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">

              <h2 className="text-2xl font-bold text-yellow-300 mb-4">📅 Match</h2>
              <div className="grid md:grid-cols-2 gap-4 text-white/90">
                <div className="space-y-3">
                  <p><span className="font-semibold text-yellow-200">Date :</span> {match?.date}</p>
                  <p><span className="font-semibold text-yellow-200">Heure :</span> {match?.heure}</p>
                  <p><span className="font-semibold text-yellow-200">Niveau :</span> {match?.niveau}</p>
                </div>

                <div className="space-y-3">
                  <p><span className="font-semibold text-yellow-200">Statut :</span> {match?.statut}</p>
                  <p>
                    <span className="font-semibold text-yellow-200">Joueurs :</span>
                    {match?.joueurs?.length ?? 0} / {match?.terrain?.capacite ?? 0}
                  </p>
                </div>
              </div>
            </motion.section>

            {/* --- Joueurs Inscrits avec moyenne --- */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl"
            >
              <h2 className="text-2xl font-bold text-yellow-300 mb-4 flex items-center gap-3">
                <span className="text-2xl">👥</span>
                Joueurs Inscrits ({match.joueurs?.length || 0})
              </h2>

              {match.joueurs?.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {match.joueurs.map((jRaw, index) => {
                    const j = typeof jRaw === 'string' ? { _id: jRaw } : jRaw;

                    return (
                      <motion.div
                        key={j._id || j}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 * index }}
                        className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-white text-lg">
                              {j.name || 'Joueur inconnu'}
                            </p>
                            <p className="text-green-200 text-sm">
                              {j.position || 'Non précisé'}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-white/70 text-sm">Âge: {j.age ?? 'N/A'}</p>

                            {/* ⭐ Affichage moyenne ajoutée ici */}
                            <p className="text-yellow-300 text-sm">
                              ⭐ {getFormattedRating(j)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-white/60 text-lg">Aucun joueur inscrit.</p>
                </div>
              )}
            </motion.section>

{match.mode === "INDIVIDUEL" && match.equipes?.length === 2 && (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
    {match.equipes.map((team) => (
      <div
        key={team._id}
        className="bg-black/60 border border-yellow-400/20 rounded-2xl p-4"
      >
        <h3 className="text-yellow-400 font-bold mb-3">{team.nom}</h3>

        <ul className="space-y-2">
          {team.joueurs.map((j) => (
            <li
              key={j._id}
              className="flex justify-between text-white/90"
            >
              <span>{j.name}</span>
              <span className="text-yellow-300">
                 {j.position}
              </span>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
)}



            {/* Boutons */}
            {footballeurInfo && (
            <motion.section className="pt-6 flex flex-col sm:flex-row gap-4 justify-center items-center">

              <motion.button
                onClick={handleJoin}
                disabled={isUserJoined() || isMatchFull()}
                whileHover={{ scale: 1.05 }}
                className={`px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl ${
                  isUserJoined()
                    ? 'bg-gray-500 text-white'
                    : isMatchFull()
                    ? 'bg-yellow-700 text-white'
                    : 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black'
                }`}
              >
                {isUserJoined() ? '✅ Déjà inscrit' : isMatchFull() ? '⛔ Match complet' : '⚽ Rejoindre'}
              </motion.button>
<motion.button
  whileHover={{ scale: match.statut === "Terminé" ? 1.05 : 1 }}
  whileTap={{ scale: match.statut === "Terminé" ? 0.95 : 1 }}
  disabled={match.statut !== "Terminé"}
  onClick={() => {
    if (match.statut === "Terminé") {
      router.push(`/matchs/${match._id}/evaluate`);
    } else {
      toast.warning("⛔ L'évaluation sera disponible une fois le match terminé.");
    }
  }}
  className={`px-6 py-4 rounded-2xl font-bold shadow-2xl transition-all duration-300 flex items-center gap-2 ${
    match.statut !== "Terminé"
      ? "bg-gray-600 text-gray-300 cursor-not-allowed"
      : "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white"
  }`}
>
  ⭐ Évaluer le match
</motion.button>
              {/* <motion.button
                onClick={handleEvaluateClick}
                whileHover={{ scale: match?.statut === "Terminé" ? 1.07 : 1 }}
                className="px-8 py-4 rounded-2xl font-bold bg-gradient-to-r from-yellow-300 to-yellow-500 text-black shadow-xl"
              >
                ⭐ Évaluer le match
              </motion.button> */}

              <motion.button
                onClick={() => router.push('/matchs')}
                whileHover={{ scale: 1.05 }}
                className="px-8 py-4 rounded-2xl font-bold bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-2xl"
              >
                ⬅️ Retour
              </motion.button>
            </motion.section>
)}
          </div>
        )}
      </motion.div>
    </StadiumBackground>
  );
}



// 'use client';

// import { useEffect, useState, useRef } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useParams, useRouter } from 'next/navigation';
// import { getMatchDetails, joinMatch } from '../../../redux/actions/matchActions';
// import { addPlayerToEquipe } from '../../../redux/actions/equipeActions';
// import { motion } from 'framer-motion';
// import { toast } from 'react-toastify';
// import Loader from '../../../components/Loader';
// import StadiumBackground from "@/components/StadiumBackground";

// export default function MatchDetailPage() {
//   const { id } = useParams();
//   const router = useRouter();
//   const dispatch = useDispatch();

//   const { match, loading, error } = useSelector(state => state.matchDetails || {});
//   const { footballeurInfo } = useSelector(state => state.footballeurSignin || {});

//   const [timeLeft, setTimeLeft] = useState(null);
//   const hasRefreshedStatus = useRef(false);

//   /* ===========================
//       UTILITAIRES
//   ============================ */

//   const getFormattedRating = (player) => {
//     if (!player || !player.averageRating) return "N/A";
//     const rating = parseFloat(player.averageRating);
//     return isNaN(rating) ? "N/A" : rating.toFixed(1);
//   };

//   const isUserJoinedMatch = () => {
//     if (!match || !footballeurInfo) return false;
//     return match.joueurs?.some(j =>
//       (j._id || j).toString() === footballeurInfo._id.toString()
//     );
//   };

//   const isUserInEquipe = (equipe) => {
//     if (!equipe || !footballeurInfo) return false;
//     return equipe.joueurs?.some(j =>
//       (j._id || j).toString() === footballeurInfo._id.toString()
//     );
//   };

//   /* ===========================
//       CHARGEMENT MATCH
//   ============================ */

//   useEffect(() => {
//     if (id) dispatch(getMatchDetails(id));
//   }, [dispatch, id]);

//   /* ===========================
//       TIMER
//   ============================ */

//   useEffect(() => {
//     if (!match?.date || !match?.heure) return;

//     const start = new Date(`${match.date}T${match.heure}`);
//     const end = new Date(start.getTime() + 90 * 60 * 1000);

//     const interval = setInterval(() => {
//       const diff = end - new Date();

//       if (diff <= 0) {
//         setTimeLeft("00:00:00");
//         clearInterval(interval);

//         if (!hasRefreshedStatus.current) {
//           hasRefreshedStatus.current = true;
//           dispatch(getMatchDetails(id));
//         }
//       } else {
//         const h = Math.floor(diff / 3600000);
//         const m = Math.floor((diff % 3600000) / 60000);
//         const s = Math.floor((diff % 60000) / 1000);
//         setTimeLeft(
//           `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`
//         );
//       }
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [match, id, dispatch]);

//   /* ===========================
//       ACTIONS
//   ============================ */

//   const handleJoinMatch = async () => {
//     if (!footballeurInfo) {
//       toast.info("Veuillez vous connecter");
//       return router.push('/signin');
//     }

//     if (isUserJoinedMatch())
//       return toast.warning("Déjà inscrit");

//     await dispatch(joinMatch(id));
//     await dispatch(getMatchDetails(id));
//     toast.success("Match rejoint");
//   };

//   const handleJoinEquipe = async (equipeId) => {
//     try {
//       await dispatch(addPlayerToEquipe(equipeId));
//       await dispatch(getMatchDetails(id));
//       toast.success("Ajouté à l'équipe");
//     } catch {
//       toast.error("Erreur équipe");
//     }
//   };

//   /* ===========================
//       RENDER
//   ============================ */

//   return (
//     <StadiumBackground>

//       {/* BANNIÈRE MATCH TERMINÉ */}
//       {match?.statut === "Terminé" && (
//         <div className="w-full py-4 text-center bg-yellow-600 text-black font-bold">
//           🏆 MATCH TERMINÉ — Évaluez les joueurs
//         </div>
//       )}

//       <div className="max-w-5xl mx-auto p-6 space-y-6">

//         {/* TITRE */}
//         <h1 className="text-5xl font-extrabold text-center text-yellow-400">
//           ⚽ Détails du Match
//         </h1>

//         {/* LOADER */}
//         {loading ? (
//           <Loader text="Chargement..." />
//         ) : error ? (
//           <p className="text-red-500">{error}</p>
//         ) : !match ? (
//           <p>Aucun match</p>
//         ) : (
//           <>

//             {/* TIMER */}
//             {match.statut !== "Terminé" && timeLeft && (
//               <div className="text-center text-yellow-300 text-2xl font-bold">
//                 ⏳ Temps restant : {timeLeft}
//               </div>
//             )}

//             {/* INFOS MATCH */}
//             <section className="bg-white/10 p-6 rounded-xl">
//               <p>📅 {match.date} — {match.heure}</p>
//               <p>👥 {match.joueurs.length} / {match.terrain.capacite}</p>
//               <p>🎮 Mode : {match.mode}</p>
//             </section>

//             {/* ===========================
//                 MODE INDIVIDUEL (INCHANGÉ)
//             ============================ */}
//             {match.mode === "INDIVIDUEL" && (
//               <section className="bg-white/10 p-6 rounded-xl">
//                 <h2 className="text-yellow-300 text-xl mb-4">👥 Joueurs</h2>

//                 <div className="grid md:grid-cols-2 gap-4">
//                   {match.joueurs.map(j => (
//                     <div key={j._id} className="bg-white/5 p-4 rounded-lg">
//                       <p className="font-bold">{j.name}</p>
//                       <p>{j.position}</p>
//                       <p>⭐ {getFormattedRating(j)}</p>
//                     </div>
//                   ))}
//                 </div>
//               </section>
//             )}

//             {/* ===========================
//                 🆕 MODE ÉQUIPE
//             ============================ */}
//             {match.mode === "EQUIPE" && match.equipes?.length === 2 && (
//               <div className="grid md:grid-cols-2 gap-6">

//                 {match.equipes.map((equipe) => (
//                   <div key={equipe._id} className="bg-black/60 p-5 rounded-xl border border-yellow-400/30">

//                     <h3 className="text-yellow-400 font-bold text-xl mb-2">
//                       {equipe.nom}
//                     </h3>

//                     <p className="text-sm text-yellow-200 mb-2">
//                       🧢 Capitaine : {equipe.capitaine?.name || "—"}
//                     </p>

//                     <ul className="space-y-2">
//                       {equipe.joueurs.map(j => (
//                         <li key={j._id} className="flex justify-between text-white">
//                           <span>{j.name}</span>
//                           <span>{j.position}</span>
//                         </li>
//                       ))}
//                     </ul>

//                     {!isUserInEquipe(equipe) && (
//                       <button
//                         onClick={() => handleJoinEquipe(equipe._id)}
//                         className="mt-4 w-full bg-yellow-500 text-black py-2 rounded-lg font-bold"
//                       >
//                         Rejoindre {equipe.nom}
//                       </button>
//                     )}

//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* BOUTONS */}
//             <div className="flex flex-wrap justify-center gap-4 pt-6">

//               <button
//                 onClick={handleJoinMatch}
//                 disabled={isUserJoinedMatch()}
//                 className="px-6 py-3 bg-yellow-500 text-black rounded-xl font-bold"
//               >
//                 ⚽ Rejoindre
//               </button>

//               <button
//                 disabled={match.statut !== "Terminé"}
//                 onClick={() => router.push(`/matchs/${match._id}/evaluate`)}
//                 className="px-6 py-3 bg-yellow-600 text-white rounded-xl font-bold"
//               >
//                 ⭐ Évaluer
//               </button>

//               <button
//                 onClick={() => router.push('/matchs')}
//                 className="px-6 py-3 bg-gray-600 text-white rounded-xl"
//               >
//                 ⬅ Retour
//               </button>

//             </div>

//           </>
//         )}
//       </div>
//     </StadiumBackground>
//   );
// }


// 'use client';

// import Link from "next/link";
// import { useEffect, useState, useRef } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useParams, useRouter } from 'next/navigation';
// import { getMatchDetails, joinMatch } from '../../../redux/actions/matchActions';
// import { motion } from 'framer-motion';
// import { toast } from 'react-toastify';
// import Loader from '../../../components/Loader';
// import StadiumBackground from "@/components/StadiumBackground";

// export default function MatchDetailPage() {
//   const { id } = useParams();
//   const router = useRouter();
//   const dispatch = useDispatch();

//   const { match, loading, error } = useSelector((state) => state.matchDetails || {});
//   const { footballeurInfo } = useSelector((state) => state.footballeurSignin || {});

//   const [timeLeft, setTimeLeft] = useState(null);
//   const hasRefreshedStatus = useRef(false);

//   /* ===========================
//      Utils
//   ============================ */

//   const getFormattedRating = (player) => {
//     if (!player || player.averageRating === undefined) return "N/A";
//     const r = Number(player.averageRating);
//     return isNaN(r) ? "N/A" : r.toFixed(1);
//   };

//   const isUserJoined = () => {
//     if (!match || !match.joueurs || !footballeurInfo) return false;
//     return match.joueurs.some(j =>
//       (j._id || j).toString() === footballeurInfo._id.toString()
//     );
//   };

//   const isMatchFull = () => {
//     return match?.joueurs?.length >= Number(match?.terrain?.capacite || 0);
//   };

//   /* ===========================
//      Load Match
//   ============================ */

//   useEffect(() => {
//     if (id) dispatch(getMatchDetails(id));
//   }, [dispatch, id]);

//   /* ===========================
//      Countdown
//   ============================ */

//   useEffect(() => {
//     if (!match?.date || !match?.heure) return;

//     const start = new Date(`${match.date}T${match.heure}`);
//     const end = new Date(start.getTime() + 90 * 60 * 1000);

//     const interval = setInterval(() => {
//       const diff = end - new Date();
//       if (diff <= 0) {
//         setTimeLeft("00:00:00");
//         clearInterval(interval);

//         if (!hasRefreshedStatus.current) {
//           hasRefreshedStatus.current = true;
//           dispatch(getMatchDetails(id));
//         }
//       } else {
//         const h = Math.floor(diff / 3600000);
//         const m = Math.floor((diff % 3600000) / 60000);
//         const s = Math.floor((diff % 60000) / 1000);
//         setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
//       }
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [match, id, dispatch]);

//   /* ===========================
//      Join
//   ============================ */

//   const handleJoin = async () => {
//     if (!footballeurInfo) {
//       toast.info("Veuillez vous connecter");
//       return router.push('/signin');
//     }

//     if (isUserJoined()) return toast.warning("Déjà inscrit");
//     if (isMatchFull()) return toast.error("Match complet");

//     await dispatch(joinMatch(id));
//     dispatch(getMatchDetails(id));
//   };

//   /* ===========================
//      Render
//   ============================ */

//   return (
//     <StadiumBackground>

//       {match?.statut === "Terminé" && (
//         <div className="w-full py-4 text-center bg-yellow-600 text-black font-bold">
//           🏆 MATCH TERMINÉ
//         </div>
//       )}

//       <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">

//         {loading ? <Loader /> : error ? (
//           <div className="text-red-400">{error}</div>
//         ) : match && (

//           <>
//             {/* ⏳ Countdown */}
//             {match.statut !== "Terminé" && timeLeft && (
//               <div className="text-center text-yellow-400 text-xl font-bold">
//                 ⏳ Temps restant : {timeLeft}
//               </div>
//             )}

//             {/* 👥 Joueurs inscrits */}
//             <section className="bg-white/10 rounded-2xl p-6">
//               <h2 className="text-yellow-300 font-bold mb-4">
//                 Joueurs inscrits ({match.joueurs.length})
//               </h2>

//               <div className="grid md:grid-cols-2 gap-4">
//                 {match.joueurs.map(j => (
//                   <div key={j._id} className="bg-white/5 p-3 rounded-xl">
//                     <p className="text-white font-semibold">{j.name}</p>
//                     <p className="text-green-300 text-sm">{j.position}</p>
//                     <p className="text-yellow-300 text-sm">
//                       ⭐ {getFormattedRating(j)}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             </section>

//             {/* ⚽ MODE INDIVIDUEL */}
//             {match.mode === "INDIVIDUEL" && match.equipes?.length === 2 && (
//               <div className="grid md:grid-cols-2 gap-6">
//                 {match.equipes.map(team => (
//                   <div key={team._id} className="bg-black/60 p-4 rounded-2xl">
//                     <h3 className="text-yellow-400 font-bold mb-3">{team.nom}</h3>
//                     {team.joueurs.map(j => (
//                       <div key={j._id} className="flex justify-between text-white">
//                         <span>{j.name}</span>
//                         <span>{j.position}</span>
//                       </div>
//                     ))}
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* 🧢 MODE ÉQUIPE */}
//             {match.mode === "EQUIPE" && match.equipes?.length > 0 && (
//               <div className="grid md:grid-cols-2 gap-6">
//                 {match.equipes.map(team => (
//                   <div key={team._id} className="bg-black/60 p-4 rounded-2xl">
//                     <h3 className="text-yellow-400 font-bold mb-3">
//                       {team.nom} {team.capitaine && "🧢"}
//                     </h3>

//                     {team.joueurs.length === 0 ? (
//                       <p className="text-white/50">Aucun joueur</p>
//                     ) : (
//                       team.joueurs.map(j => (
//                         <div key={j._id} className="flex justify-between text-white">
//                           <span>{j.name}</span>
//                           <span>{j.position}</span>
//                         </div>
//                       ))
//                     )}
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* 🎯 Actions */}
//             <div className="flex gap-4 justify-center pt-6">
//               <button
//                 onClick={handleJoin}
//                 disabled={isUserJoined() || isMatchFull()}
//                 className="px-6 py-3 bg-yellow-500 rounded-xl font-bold"
//               >
//                 Rejoindre
//               </button>

//               <button
//                 onClick={() => router.push('/matchs')}
//                 className="px-6 py-3 bg-gray-700 rounded-xl text-white"
//               >
//                 Retour
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </StadiumBackground>
//   );
// }






// 'use client';

// import Link from "next/link";
// import { useEffect, useState, useRef } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useParams, useRouter } from 'next/navigation';
// import { getMatchDetails, joinMatch } from '../../../redux/actions/matchActions';
// import { motion } from 'framer-motion';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import Loader from '../../../components/Loader';
// import StadiumBackground from "@/components/StadiumBackground";

// export default function MatchDetailPage() {
//   const { id } = useParams();
//   const router = useRouter();
//   const dispatch = useDispatch();

//   /* ---------------- Redux ---------------- */
//   const { match, loading, error } = useSelector(
//     (state) => state.matchDetails || {}
//   );

//   const { footballeurInfo } = useSelector(
//     (state) => state.footballeurSignin || {}
//   );

//   /* ---------------- Local state ---------------- */
//   const [timeLeft, setTimeLeft] = useState(null);
//   const hasRefreshedStatus = useRef(false);

//   /* ---------------- Helpers ---------------- */
//   const isTeamMode = match?.mode === "EQUIPE";
//   const isIndividualMode = match?.mode === "INDIVIDUEL";

//   const getFormattedRating = (player) => {
//     if (!player || !player.averageRating) return "N/A";
//     const rating = parseFloat(player.averageRating);
//     return isNaN(rating) ? "N/A" : rating.toFixed(1);
//   };

//   /* ---------------- Fetch match ---------------- */
//   useEffect(() => {
//     if (id) dispatch(getMatchDetails(id));
//   }, [dispatch, id]);

//   /* ---------------- Match timer ---------------- */
//   useEffect(() => {
//     if (!match?.date || !match?.heure) return;

//     const start = new Date(`${match.date}T${match.heure}`);
//     const end = new Date(start.getTime() + 90 * 60 * 1000);

//     const interval = setInterval(() => {
//       const diff = end - new Date();

//       if (diff <= 0) {
//         setTimeLeft("00:00:00");
//         clearInterval(interval);

//         if (!hasRefreshedStatus.current) {
//           hasRefreshedStatus.current = true;
//           dispatch(getMatchDetails(id));
//         }
//       } else {
//         const h = Math.floor(diff / 3600000);
//         const m = Math.floor((diff % 3600000) / 60000);
//         const s = Math.floor((diff % 60000) / 1000);
//         setTimeLeft(
//           `${h.toString().padStart(2, '0')}:${m
//             .toString()
//             .padStart(2, '0')}:${s.toString().padStart(2, '0')}`
//         );
//       }
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [match, dispatch, id]);

//   /* ---------------- Join logic ---------------- */
//   const isUserJoined = () => {
//     if (!match?.joueurs || !footballeurInfo) return false;
//     return match.joueurs.some((j) =>
//       (j._id || j).toString() === footballeurInfo._id.toString()
//     );
//   };

//   const isMatchFull = () => {
//     const cap = match?.terrain?.capacite || 0;
//     return (match?.joueurs?.length || 0) >= cap;
//   };

//   const canJoinMatch = () => {
//     if (!footballeurInfo || isUserJoined()) return false;

//     if (isIndividualMode) return !isMatchFull();

//     if (isTeamMode) {
//       return (match.equipes?.length || 0) < 2;
//     }

//     return false;
//   };

//   const getJoinLabel = () => {
//     if (isUserJoined()) return "✅ Déjà inscrit";

//     if (isTeamMode) {
//       if (!match.equipes || match.equipes.length === 0)
//         return "🅰️ Devenir capitaine (Équipe A)";
//       if (match.equipes.length === 1)
//         return "🅱️ Devenir capitaine (Équipe B)";
//       return "⛔ Équipes complètes";
//     }

//     return "⚽ Rejoindre";
//   };

//   const handleJoin = async () => {
//     if (!footballeurInfo) {
//       toast.info("Veuillez vous connecter");
//       router.push("/signin");
//       return;
//     }

//     try {
//       await dispatch(joinMatch(id));
//       await dispatch(getMatchDetails(id));
//       toast.success("Inscription réussie !");
//     } catch {
//       toast.error("Erreur lors de l'inscription");
//     }
//   };

//   /* ---------------- Render ---------------- */
//   return (
//     <StadiumBackground>
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="max-w-4xl mx-auto py-8 px-4 space-y-6"
//       >
//         <h1 className="text-4xl font-extrabold text-center text-yellow-400">
//           ⚽ Détails du Match
//         </h1>

//         {loading ? (
//           <Loader text="Chargement..." />
//         ) : error ? (
//           <div className="text-red-400 text-center">{error}</div>
//         ) : (
//           <>
//             {timeLeft && match?.statut !== "Terminé" && (
//               <div className="text-center text-yellow-300 font-bold">
//                 ⏳ Temps restant : {timeLeft}
//               </div>
//             )}

//             {/* Terrain */}
//             <section className="bg-white/10 p-6 rounded-2xl">
//               <h2 className="text-yellow-300 font-bold mb-3">🏟️ Terrain</h2>
//               <p>{match.terrain?.nom} — {match.terrain?.ville}</p>
//               <p>Capacité : {match.terrain?.capacite}</p>
//             </section>

//             {/* Match */}
//             <section className="bg-white/10 p-6 rounded-2xl">
//               <h2 className="text-yellow-300 font-bold mb-3">📅 Match</h2>
//               <p>Date : {match.date}</p>
//               <p>Heure : {match.heure}</p>
//               <p>Mode : {match.mode}</p>
//             </section>

//             {/* Joueurs */}
//             <section className="bg-white/10 p-6 rounded-2xl">
//               <h2 className="text-yellow-300 font-bold mb-3">
//                 👥 Joueurs ({match.joueurs?.length || 0})
//               </h2>

//               <div className="grid md:grid-cols-2 gap-4">
//                 {match.joueurs?.map((j) => (
//                   <div
//                     key={j._id}
//                     className="bg-black/40 p-3 rounded-xl"
//                   >
//                     <p className="font-semibold">{j.name}</p>
//                     <p className="text-sm text-yellow-300">{j.position}</p>
//                     <p className="text-sm">⭐ {getFormattedRating(j)}</p>
//                   </div>
//                 ))}
//               </div>
//             </section>

//             {/* Équipes (MODE ÉQUIPE) */}
//             {isTeamMode && match.equipes?.length > 0 && (
//               <div className="grid md:grid-cols-2 gap-6">
//                 {match.equipes.map((team) => (
//                   <div
//                     key={team._id}
//                     className="bg-black/60 p-4 rounded-2xl"
//                   >
//                     <h3 className="text-yellow-400 font-bold">
//                       {team.nom}
//                     </h3>
//                     <p className="text-sm text-yellow-200">
//                       🧢 Capitaine : {team.capitaine?.name}
//                     </p>

//                     <ul className="mt-3 space-y-1">
//                       {team.joueurs.map((j) => (
//                         <li key={j._id} className="flex justify-between">
//                           <span>{j.name}</span>
//                           <span className="text-yellow-300">{j.position}</span>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* Actions */}
//             {footballeurInfo && (
//               <div className="flex flex-wrap justify-center gap-4 pt-4">
//                 <button
//                   onClick={handleJoin}
//                   disabled={!canJoinMatch()}
//                   className={`px-6 py-3 rounded-xl font-bold ${
//                     canJoinMatch()
//                       ? "bg-yellow-500 text-black"
//                       : "bg-gray-600 text-gray-300 cursor-not-allowed"
//                   }`}
//                 >
//                   {getJoinLabel()}
//                 </button>

//                 <button
//                   onClick={() => router.push("/matchs")}
//                   className="px-6 py-3 rounded-xl bg-gray-700 text-white"
//                 >
//                   ⬅️ Retour
//                 </button>
//               </div>
//             )}
//           </>
//         )}
//       </motion.div>
//     </StadiumBackground>
//   );
// }




