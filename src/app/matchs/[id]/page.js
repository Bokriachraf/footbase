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
    const endTime = new Date(matchDateTime.getTime() + 2 * 60 * 60 * 1000);

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

  const handleEvaluateClick = () => {
    if (match?.statut !== "Terminé") {
      setShowModal(true);
    } else {
      router.push(`/matchs/${match._id}/evaluate`);
    }
  };

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
            <motion.section className="bg-white/10 p-6 rounded-2xl border border-white/20 shadow-2xl">
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
            <motion.section className="bg-white/10 p-6 rounded-2xl border border-white/20 shadow-2xl">
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
                              {j.nom || 'Joueur inconnu'}
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


            {/* Boutons */}
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
                onClick={handleEvaluateClick}
                whileHover={{ scale: match?.statut === "Terminé" ? 1.07 : 1 }}
                className="px-8 py-4 rounded-2xl font-bold bg-gradient-to-r from-yellow-300 to-yellow-500 text-black shadow-xl"
              >
                ⭐ Évaluer le match
              </motion.button>

              <motion.button
                onClick={() => router.push('/matchs')}
                whileHover={{ scale: 1.05 }}
                className="px-8 py-4 rounded-2xl font-bold bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-2xl"
              >
                ⬅️ Retour
              </motion.button>
            </motion.section>

          </div>
        )}
      </motion.div>
    </StadiumBackground>
  );
}

