'use client';

import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

import { getMatchDetails } from '@/redux/actions/matchActions';
import { joinMatchEquipe } from '@/redux/actions/matchActions';
import {
  addPlayerToEquipe,
  removePlayerFromEquipe,
} from '@/redux/actions/equipeActions';

import StadiumBackground from '@/components/StadiumBackground';
import Loader from '@/components/Loader';

export default function MatchEquipePage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  /* -------------------- REDUX -------------------- */
  const { match, loading, error } = useSelector(
    (state) => state.matchDetails || {}
  );

  const { footballeurInfo } = useSelector(
    (state) => state.footballeurSignin || {}
  );

  const { loading: loadingEquipe } = useSelector(
    (state) => state.equipe || {}
  );

const equipes = match?.equipes || [];
const joueurs = match?.joueurs || [];

  /* -------------------- LOCAL STATE -------------------- */
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [search, setSearch] = useState('');

  /* -------------------- LOAD MATCH -------------------- */
  useEffect(() => {
    if (id) dispatch(getMatchDetails(id));
  }, [dispatch, id]);

  /* -------------------- GUARDS -------------------- */
  useEffect(() => {
    if (match && match.mode !== 'EQUIPE') {
      router.replace(`/matchs/${id}`);
    }
  }, [match, id, router]);

  /* -------------------- HELPERS -------------------- */
  const myEquipe = useMemo(() => {
    if (!equipes || !footballeurInfo) return null;
    return equipes.find((eq) =>
      eq.joueurs.some((j) => j._id === footballeurInfo._id)
    );
  }, [match, footballeurInfo]);

  const isCaptain = myEquipe?.capitaine?._id === footballeurInfo?._id;

  const isInEquipe = Boolean(myEquipe);

  const matchIsFull = match?.statut === 'Complet';

  /* -------------------- PLAYERS AVAILABLE -------------------- */
  const playersAvailable = useMemo(() => {
if (!joueurs.length) return [];

    const playersInTeams = equipes.flatMap((eq) =>
      eq.joueurs.map((j) => j._id)
    );

    return joueurs.filter(
      (j) =>
        !playersInTeams.includes(j._id) &&
        j._id !== footballeurInfo?._id &&
        j.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [match, search, footballeurInfo]);

  /* -------------------- HANDLERS -------------------- */
  const handleJoinEquipe = async () => {
    if (!footballeurInfo) {
      toast.info('Veuillez vous connecter');
      router.push('/signin');
      return;
    }

    try {
      await dispatch(joinMatchEquipe(id));
      await dispatch(getMatchDetails(id));
      toast.success('Équipe créée / rejointe');
    } catch {
      toast.error('Action impossible');
    }
  };

  const handleAddPlayer = async (playerId) => {
    await dispatch(addPlayerToEquipe(myEquipe._id, playerId));
    await dispatch(getMatchDetails(id));
    toast.success('Invitation envoyée');
  };

  const handleRemovePlayer = async (playerId) => {
    await dispatch(removePlayerFromEquipe(myEquipe._id, playerId));
    await dispatch(getMatchDetails(id));
    toast.info('Joueur retiré');
  };

  /* -------------------- RENDER -------------------- */
  return (
    <StadiumBackground>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {loading ? (
          <Loader text="Chargement du match..." />
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <>
            {/* ---------- HEADER ---------- */}
            <h1 className="text-4xl font-extrabold text-yellow-400 mb-6 text-center">
              ⚽ Mode Équipe
            </h1>

            {/* ---------- JOIN BUTTON ---------- */}
            {!isInEquipe && equipes.length < 2 && (
              <div className="flex justify-center mb-6">
                <button
                  disabled={matchIsFull}
                  onClick={handleJoinEquipe}
                  className="bg-green-600 hover:bg-green-700 px-8 py-4 rounded-2xl font-bold text-white disabled:opacity-50"
                >
                  Créer / Rejoindre une équipe
                </button>
              </div>
            )}

            {/* ---------- EQUIPES ---------- */}
            <div className="grid md:grid-cols-2 gap-6">
              {equipes.map((eq) => (
                <div
                  key={eq._id}
                  className="bg-black/60 rounded-2xl p-5 border border-yellow-400/20"
                >
                  <h2 className="text-yellow-300 font-bold text-xl mb-3">
                    {eq.nom}
                    {eq.capitaine?._id === footballeurInfo?._id && ' 👑'}
                  </h2>

                  {eq.joueurs.map((j) => (
                    <div
                      key={j._id}
                      className="flex justify-between text-white/90 py-1"
                    >
                      <span>{j.name}</span>

                      {isCaptain &&
                        eq._id === myEquipe?._id &&
                        j._id !== footballeurInfo._id && (
                          <button
                            onClick={() => handleRemovePlayer(j._id)}
                            className="text-red-400 hover:text-red-600"
                          >
                            ❌
                          </button>
                        )}
                    </div>
                  ))}

                  {isCaptain && eq._id === myEquipe?._id && (
                    <button
                      onClick={() => setShowInviteModal(true)}
                      className="mt-4 w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 rounded-xl"
                    >
                      ➕ Inviter joueur
                    </button>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ================= MODAL INVITATION ================= */}
      <AnimatePresence>
        {showInviteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-gray-900 rounded-2xl p-6 w-full max-w-md"
            >
              <h3 className="text-yellow-400 font-bold text-xl mb-4">
                Inviter un joueur
              </h3>

              <input
                type="text"
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full mb-4 px-3 py-2 rounded bg-black text-white border border-white/20"
              />

              <div className="max-h-64 overflow-y-auto space-y-2">
                {playersAvailable.length === 0 && (
                  <p className="text-white/60 text-center">
                    Aucun joueur disponible
                  </p>
                )}

                {playersAvailable.map((p) => (
                  <div
                    key={p._id}
                    className="flex justify-between items-center bg-white/5 p-2 rounded"
                  >
                    <span className="text-white">{p.name}</span>
                    <button
                      disabled={loadingEquipe}
                      onClick={() => handleAddPlayer(p._id)}
                      className="bg-green-600 px-3 py-1 rounded text-white text-sm"
                    >
                      Inviter
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowInviteModal(false)}
                className="mt-4 w-full bg-gray-700 py-2 rounded-xl text-white"
              >
                Fermer
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </StadiumBackground>
  );
}



// 'use client';

// import { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { joinMatchEquipe } from '@/redux/actions/matchActions';
// import { getMatchDetails } from '@/redux/actions/matchActions';
// import { useParams } from 'next/navigation';

// export default function MatchEquipePage() {
//   const { id } = useParams();
//   const dispatch = useDispatch();

//   const { match } = useSelector((state) => state.matchDetails);
//   const { footballeurInfo } = useSelector((state) => state.footballeurSignin);
//   const joinEquipeState = useSelector((state) => state.matchJoinEquipe);

//   useEffect(() => {
//     dispatch(getMatchDetails(id));
//   }, [dispatch, id, joinEquipeState.success]);

//   if (!match) return null;

//   const isCaptain = equipes?.some(
//     (e) => e.capitaine === footballeurInfo?._id
//   );

//   const isPlayerInEquipe = equipes?.some((e) =>
//     e.joueurs.some((j) => j._id === footballeurInfo?._id)
//   );

//   const canJoin =
//     match.mode === 'EQUIPE' &&
//     match.statut === 'Ouvert' &&
//     !isPlayerInEquipe;

//   // const handleJoinEquipe = () => {
//   //   dispatch(joinMatchEquipe(id));
//   // };

// const handleJoinEquipe = () => {
//   console.log('CLICK JOIN MATCH', id);
//   dispatch(joinMatchEquipe(id));
// };

//   return (
//     <div className="max-w-5xl mx-auto p-6 space-y-6">
//       <h1 className="text-2xl font-bold">Match – Mode Équipe</h1>

//       {canJoin && (
//         <button
//           onClick={handleJoinEquipe}
//           disabled={joinEquipeState.loading}
//           className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50"
//         >
//           Créer / Rejoindre une équipe
//         </button>
//       )}

// {joinEquipeState?.loading && (
//   <p className="text-blue-500">Création de l’équipe...</p>
// )}

// {joinEquipeState?.error && (
//   <p className="text-red-500">{joinEquipeState.error}</p>
// )}

// {joinEquipeState?.success && (
//   <p className="text-green-600">Équipe créée avec succès ✅</p>
// )}

//       {isPlayerInEquipe && (
//         <p className="text-green-600 font-semibold">
//           Vous êtes déjà dans une équipe ✅
//         </p>
//       )}

//       <div className="grid md:grid-cols-2 gap-6">
//         {equipes?.map((equipe) => (
//           <div
//             key={equipe._id}
//             className="border rounded-xl p-4 bg-white shadow"
//           >
//             <h2 className="font-bold text-lg mb-2">{equipe.nom}</h2>

//             {equipe.joueurs.map((j) => (
//               <div
//                 key={j._id}
//                 className="flex justify-between border-b py-1 text-sm"
//               >
//                 <span>{j.name}</span>
//                 {equipe.capitaine === j._id && (
//                   <span className="text-yellow-500">👑</span>
//                 )}
//               </div>
//             ))}

//             {isCaptain && equipe.capitaine === footballeurInfo._id && (
//               <p className="text-xs text-blue-600 mt-2">
//                 Vous êtes capitaine
//               </p>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }




// 'use client';

// import { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useParams, useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { motion } from 'framer-motion';

// // actions existantes
// import { getMatchDetails } from '@/redux/actions/matchActions';
// import { addPlayerToEquipe } from '@/redux/actions/equipeActions';

// export default function MatchEquipePage() {
//   const { id } = useParams();
//   const router = useRouter();
//   const dispatch = useDispatch();

//   const { match, loading, error } = useSelector(
//     (state) => state.matchDetails
//   );

//   const { footballeurInfo } = useSelector(
//     (state) => state.footballeurSignin
//   );

//   const { loading: loadingEquipe } = useSelector(
//     (state) => state.equipe
//   );

//   useEffect(() => {
//     dispatch(getMatchDetails(id));
//   }, [dispatch, id]);

//   if (loading) {
//     return <div className="text-center mt-20">Chargement du match...</div>;
//   }

//   if (error) {
//     return <div className="text-center mt-20 text-red-500">{error}</div>;
//   }

//   if (!match) return null;

//   const equipes = equipes || [];
//   const equipeA = equipes[0] || null;
//   const equipeB = equipes[1] || null;

//   const userId = footballeurInfo?._id;

//   const isMatchFinished = match.statut === 'Terminé';

//   const isUserInEquipe = equipes.some((e) =>
//     e.joueurs.some((j) => j._id === userId)
//   );

//   const isUserCapitaine = equipes.some(
//     (e) => e.capitaine?._id === userId
//   );

//   const canCreateEquipe =
//     !isMatchFinished &&
//     userId &&
//     equipes.length < 2 &&
//     !isUserInEquipe;

//   const handleCreateEquipe = () => {
//     if (!canCreateEquipe) return;
//     dispatch(addPlayerToEquipe(null, userId)); 
//     // ⚠️ backend : join-equipe (capitaine auto)
//   };

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-10">
//       {/* HEADER */}
//       <div className="mb-8">
//         <Link href="/matchs" className="text-sm text-gray-400 hover:text-white">
//           ← Retour aux matchs
//         </Link>

//         <h1 className="text-3xl font-bold mt-2">Match – Mode Équipe</h1>

//         <div className="flex flex-wrap gap-4 text-sm text-gray-300 mt-3">
//           <span>📍 {match.stade}</span>
//           <span>📅 {match.date}</span>
//           <span>⏰ {match.heure}</span>
//           <span className="font-semibold">
//             Statut : {match.statut}
//           </span>
//         </div>
//       </div>

//       {/* EQUIPES */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         {[equipeA, equipeB].map((equipe, index) => (
//           <div
//             key={index}
//             className="bg-white/5 border border-white/10 rounded-xl p-6"
//           >
//             <h2 className="text-xl font-semibold mb-4">
//               Équipe {index === 0 ? 'A' : 'B'}
//             </h2>

//             {!equipe ? (
//               <p className="text-gray-400 italic">
//                 Équipe non créée
//               </p>
//             ) : (
//               <>
//                 <p className="text-sm text-gray-300 mb-2">
//                   Capitaine :{' '}
//                   <span className="font-semibold">
//                     {equipe.capitaine?.pseudo}
//                   </span>
//                 </p>

//                 <ul className="space-y-2 mb-4">
//                   {equipe.joueurs.map((joueur) => (
//                     <li
//                       key={joueur._id}
//                       className="flex justify-between items-center bg-black/20 px-3 py-2 rounded-lg"
//                     >
//                       <span>{joueur.pseudo}</span>
//                     </li>
//                   ))}
//                 </ul>

//                 {userId === equipe.capitaine?._id &&
//                   !isMatchFinished && (
//                     <button
//                       className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
//                       onClick={() =>
//                         alert('UI invitation à brancher')
//                       }
//                     >
//                       + Inviter un joueur
//                     </button>
//                   )}
//               </>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* ZONE ACTION UTILISATEUR */}
//       <div className="mt-10 bg-white/5 border border-white/10 rounded-xl p-6 text-center">
//         {isMatchFinished && (
//           <p className="text-gray-400">
//             Ce match est terminé.
//           </p>
//         )}

//         {!isMatchFinished && !userId && (
//           <p className="text-gray-400">
//             Connectez-vous pour interagir avec le match.
//           </p>
//         )}

//         {!isMatchFinished &&
//           userId &&
//           !isUserInEquipe &&
//           equipes.length === 0 && (
//             <>
//               <p className="mb-4">
//                 Aucune équipe n’a encore été créée.
//               </p>
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 disabled={loadingEquipe}
//                 onClick={handleCreateEquipe}
//                 className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold"
//               >
//                 Créer une équipe (Capitaine)
//               </motion.button>
//             </>
//           )}

//         {!isMatchFinished &&
//           userId &&
//           !isUserInEquipe &&
//           equipes.length === 1 && (
//             <>
//               <p className="mb-4">
//                 Une équipe existe déjà. Créez l’équipe adverse.
//               </p>
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 disabled={loadingEquipe}
//                 onClick={handleCreateEquipe}
//                 className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold"
//               >
//                 Créer l’équipe adverse
//               </motion.button>
//             </>
//           )}

//         {!isMatchFinished &&
//           userId &&
//           isUserInEquipe &&
//           !isUserCapitaine && (
//             <p className="text-gray-300">
//               Vous faites partie d’une équipe.
//             </p>
//           )}

//         {!isMatchFinished &&
//           userId &&
//           !isUserInEquipe &&
//           equipes.length === 2 && (
//             <p className="text-gray-400">
//               Les équipes sont en cours de constitution.  
//               Vous devez être invité par un capitaine.
//             </p>
//           )}
//       </div>
//     </div>
//   );
// }



// 'use client';

// import { useEffect, useState, useRef } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useParams, useRouter } from 'next/navigation';
// import { motion } from 'framer-motion';
// import { toast } from 'react-toastify';

// import { getMatchDetails, joinMatch } from '../../../../redux/actions/matchActions';
// import Loader from '../../../../components/Loader';
// import StadiumBackground from '@/components/StadiumBackground';

// export default function MatchDetailEquipePage() {
//   const { id } = useParams();
//   const router = useRouter();
//   const dispatch = useDispatch();

//   const { match, loading, error } = useSelector(
//     (state) => state.matchDetails || {}
//   );

//   const { footballeurInfo } = useSelector(
//     (state) => state.footballeurSignin || {}
//   );

//   const [timeLeft, setTimeLeft] = useState(null);
//   const hasRefreshedStatus = useRef(false);

//   /* =========================
//      Charger les données
//   ========================= */
//   useEffect(() => {
//     if (id) dispatch(getMatchDetails(id));
//   }, [dispatch, id]);

//   /* =========================
//      Timer du match
//   ========================= */
//   useEffect(() => {
//     if (!match?.date || !match?.heure) return;

//     const start = new Date(`${match.date}T${match.heure}`);
//     const end = new Date(start.getTime() + 90 * 60 * 1000);

//     const interval = setInterval(() => {
//       const diff = end - new Date();

//       if (diff <= 0) {
//         setTimeLeft('00:00:00');
//         clearInterval(interval);

//         if (!hasRefreshedStatus.current) {
//           hasRefreshedStatus.current = true;
//           dispatch(getMatchDetails(id));
//         }
//       } else {
//         const h = Math.floor(diff / 1000 / 3600);
//         const m = Math.floor((diff / 1000 % 3600) / 60);
//         const s = Math.floor((diff / 1000) % 60);
//         setTimeLeft(
//           `${h.toString().padStart(2, '0')}:${m
//             .toString()
//             .padStart(2, '0')}:${s.toString().padStart(2, '0')}`
//         );
//       }
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [match, id, dispatch]);

//   /* =========================
//      Helpers
//   ========================= */
//   const isUserInMatch = () => {
//     if (!match?.equipes || !footballeurInfo) return false;

//     return equipes.some((e) =>
//       e.joueurs.some(
//         (j) =>
//           j._id?.toString() ===
//           (footballeurInfo._id || footballeurInfo.id)?.toString()
//       )
//     );
//   };

//   const handleJoinEquipe = async (equipeId) => {
//     if (!footballeurInfo) {
//       toast.info('Veuillez vous connecter');
//       router.push('/signin');
//       return;
//     }

//     if (isUserInMatch()) {
//       toast.warning('Vous êtes déjà dans une équipe');
//       return;
//     }

//     try {
//       await dispatch(joinMatch(id, equipeId));
//       await dispatch(getMatchDetails(id));
//       toast.success('Vous avez rejoint l’équipe');
//     } catch (err) {
//       toast.error('Erreur lors de l’inscription');
//     }
//   };

//   /* =========================
//      RENDER
//   ========================= */
//   return (
//     <StadiumBackground>
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="max-w-5xl mx-auto px-4 py-8"
//       >
//         <h1 className="text-center text-5xl font-extrabold text-yellow-400 mb-8">
//           ⚽ Match – Mode Équipe
//         </h1>

//         {loading && <Loader text="Chargement du match..." />}

//         {error && (
//           <div className="bg-red-600/20 p-6 rounded-xl text-center text-red-300">
//             {error}
//           </div>
//         )}

//         {!loading && match && (
//           <div className="space-y-6">
//             {/* TIMER */}
//             {match.statut !== 'Terminé' && timeLeft && (
//               <div className="text-center text-yellow-300 font-bold text-xl">
//                 ⏳ Temps restant : {timeLeft}
//               </div>
//             )}

//             {/* INFOS MATCH */}
//             <section className="bg-white/10 p-6 rounded-2xl border border-white/20">
//               <h2 className="text-yellow-300 text-2xl font-bold mb-4">
//                 📅 Informations
//               </h2>

//               <div className="grid md:grid-cols-2 gap-4 text-white/90">
//                 <p>Date : {match.date}</p>
//                 <p>Heure : {match.heure}</p>
//                 <p>Niveau : {match.niveau}</p>
//                 <p>Statut : {match.statut}</p>
//               </div>
//             </section>

//             {/* ÉQUIPES */}
//             <section className="grid md:grid-cols-2 gap-6">
//               {equipes?.map((equipe) => (
//                 <motion.div
//                   key={equipe._id}
//                   initial={{ opacity: 0, scale: 0.95 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   className="bg-black/60 border border-yellow-400/20 rounded-2xl p-5"
//                 >
//                   <h3 className="text-yellow-400 font-bold text-xl mb-4">
//                     {equipe.nom}
//                   </h3>

//                   <ul className="space-y-2 mb-4">
//                     {equipe.joueurs.map((j) => (
//                       <li
//                         key={j._id}
//                         className="flex justify-between text-white/90"
//                       >
//                         <span>{j.name}</span>
//                         <span className="text-yellow-300">{j.position}</span>
//                       </li>
//                     ))}
//                   </ul>

//                   {match.statut !== 'Terminé' && (
//                     <button
//                       onClick={() => handleJoinEquipe(equipe._id)}
//                       disabled={isUserInMatch()}
//                       className={`w-full py-3 rounded-xl font-bold transition ${
//                         isUserInMatch()
//                           ? 'bg-gray-600 text-gray-300'
//                           : 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black'
//                       }`}
//                     >
//                       ➕ Rejoindre cette équipe
//                     </button>
//                   )}
//                 </motion.div>
//               ))}
//             </section>

//             {/* ACTIONS */}
//             <div className="flex flex-wrap gap-4 justify-center pt-6">
//               <button
//                 disabled={match.statut !== 'Terminé'}
//                 onClick={() =>
//                   match.statut === 'Terminé'
//                     ? router.push(`/matchs/${match._id}/evaluate`)
//                     : toast.warning(
//                         'Évaluation disponible après le match'
//                       )
//                 }
//                 className={`px-6 py-3 rounded-2xl font-bold ${
//                   match.statut !== 'Terminé'
//                     ? 'bg-gray-600 text-gray-300'
//                     : 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black'
//                 }`}
//               >
//                 ⭐ Évaluer le match
//               </button>

//               <button
//                 onClick={() => router.push('/matchs')}
//                 className="px-6 py-3 rounded-2xl bg-gray-700 text-white font-bold"
//               >
//                 ⬅️ Retour
//               </button>
//             </div>
//           </div>
//         )}
//       </motion.div>
//     </StadiumBackground>
//   );
// }
