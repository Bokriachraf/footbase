'use client';

import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

import StadiumBackground from "@/components/StadiumBackground";
import Loader from "@/components/Loader";

import {
  addMatchScore,
  getMatchDetails,
  joinMatchEquipe,
} from "@/redux/actions/matchActions";

import {
  sendInvitation,
  listMyInvitations,
} from "@/redux/actions/invitationActions";

import { searchInvitablePlayers } from "@/redux/actions/footballeurActions";

export default function MatchEquipePage() {
  const { id: matchId } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [countdownText, setCountdownText] = useState(null);
  const [infoText, setInfoText] = useState(null);
  const [phase, setPhase] = useState("BEFORE_MATCH");
  const [showScoreForm, setShowScoreForm] = useState(false);
  const { proprietaireInfo } = useSelector(
  (state) => state.proprietaireSignin);
  const [scoreA, setScoreA] = useState("");
  const [scoreB, setScoreB] = useState("");
  const { footballeurInfo } = useSelector(
    (state) => state.footballeurSignin
  );

  const { match, loading, error } = useSelector(
    (state) => state.matchDetails
  );

  const { players } = useSelector(
    (state) => state.footballeurSearch
  );

  const { invitations } = useSelector(
    (state) => state.myInvitations
  );

  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [timeLeft, setTimeLeft] = useState(null);

  const hasRefreshedStatus = useRef(false);
  const handleOpenScore = () => {
  setShowScoreForm(true);
};
  /* =====================
      FETCH MATCH
  ===================== */
  useEffect(() => {
    if (matchId) dispatch(getMatchDetails(matchId));
  }, [dispatch, matchId]);

  /* =====================
      TIMER MATCH
  ===================== */

useEffect(() => {
  if (!match || !match.date || !match.heure) return;

  const matchStart = new Date(`${match.date}T${match.heure}`);
  const matchEnd = new Date(matchStart.getTime() + 90 * 60 * 1000);

  const interval = setInterval(() => {
    const now = new Date();
    let diff;

    /* =====================
       AVANT MATCH
    ===================== */
    if (now < matchStart) {
      setPhase("BEFORE_MATCH");

      diff = matchStart - now;

      setInfoText(
        "ℹ️ Après la fin du match, vous pourrez évaluer les joueurs, le terrain et l’arbitre."
      );
    }

    /* =====================
       MATCH EN COURS
    ===================== */
    else if (now >= matchStart && now < matchEnd) {
      setPhase("IN_MATCH");

      diff = matchEnd - now;

      setInfoText(
        "ℹ️ L’évaluation sera disponible immédiatement après la fin du match."
      );
    }

    /* =====================
       ÉVALUATION
    ===================== */
    else {
      setPhase("EVALUATION");
      setCountdownText("🟢 Le match est terminé — temps pour évaluer !");
      setInfoText(
        "⭐ Évaluez les joueurs, le terrain et l’arbitre selon votre expérience."
      );
      clearInterval(interval);
      return;
    }

    /* =====================
       FORMAT TEMPS
    ===================== */
    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const formatted =
      days > 0
        ? `${days} jour${days > 1 ? "s" : ""} ${hours
            .toString()
            .padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`
        : `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`;

    const label =
      phase === "BEFORE_MATCH"
        ? "⏳ Début du match dans"
        : "⚽ Temps restant avant évaluation";

    setCountdownText(`${label} : ${formatted}`);
  }, 1000);

  return () => clearInterval(interval);
}, [match]);


const handleSubmitScore = async () => {
  if (scoreA === "" || scoreB === "") {
    toast.error("Veuillez saisir les deux scores");
    return;
  }

  await dispatch(
    addMatchScore({
      matchId,
      scoreA: Number(scoreA),
      scoreB: Number(scoreB),
    })
  );

  await dispatch(getMatchDetails(matchId));

  toast.success("✅ Score ajouté avec succès");
  setShowScoreForm(false);
};


  /* =====================
      INVITATIONS
  ===================== */
  useEffect(() => {
    if (showModal) {
      dispatch(searchInvitablePlayers(search));
      dispatch(listMyInvitations());
    }
  }, [dispatch, showModal, search]);

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader text="Chargement du match..." />
      </div>
    );

  if (error) return <p className="text-red-500">{error}</p>;
  if (!match) return <p>Match introuvable</p>;

  const equipes = match.equipes || [];

 
    //  LOGIQUE UTILISATEUR

  const myEquipe = equipes.find(
    (eq) =>
      eq.capitaine === footballeurInfo?._id ||
      (eq.joueurs || []).some(
        (j) => j._id === footballeurInfo?._id
      )
  );

  const isCaptain = myEquipe?.capitaine === footballeurInfo?._id;
  const canCreateEquipe = !myEquipe && equipes.length < 2;

  /* =====================
      ACTIONS
  ===================== */
  const handleJoinEquipe = () => {
    if (!footballeurInfo) {
      toast.info("Veuillez vous connecter");
      router.push("/signin");
      return;
    }
    dispatch(joinMatchEquipe(matchId));
  };

  const invitePlayer = (playerId) => {
    if (!myEquipe) return;
    dispatch(
      sendInvitation({
        equipeId: myEquipe._id,
        playerId,
        matchId,
      })
    );
    setShowModal(false);
  };

 
  return (
    <StadiumBackground>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto py-8 px-4 space-y-6"
      >
        {/* Titre */}
        <h1 className="text-4xl font-extrabold text-center text-yellow-400">
          ⚽ Match – Mode Équipe
        </h1>

        {/* Compte à rebours */}

{/* ⏱️ COMPTE À REBOURS */}
{countdownText && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-center text-yellow-400 font-bold text-2xl drop-shadow-lg"
  >
    {countdownText}
  </motion.div>
)}

{/* ℹ️ MESSAGE EXPLICATIF */}
{infoText && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="mt-2 text-center text-white/80 text-sm italic"
  >
    {infoText}
  </motion.div>
)}

{proprietaireInfo?._id === match?.proprietaire && !match.scoreFinal && (
  <button
    onClick={handleOpenScore}
    className="bg-blue-600 text-white px-5 py-2 rounded-xl"
  >
    Ajouter le score
  </button>
)}

 {match.score && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className="mt-6 flex justify-center px-3"
  >
    <div className="
      relative w-full max-w-sm
      rounded-3xl overflow-hidden
      bg-gradient-to-b from-black/80 via-black/60 to-black/80
      border border-green-500/30
      shadow-[0_0_30px_rgba(34,197,94,0.25)]
      backdrop-blur-md
    ">

      {/* Effet lumière stade */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.15),transparent_60%)]" />

      {/* Contenu */}
      <div className="relative px-5 py-4">

        {/* Noms des équipes */}
        <div className="flex justify-between items-center text-xs text-white/80 font-semibold">
          <span className="truncate max-w-[40%]">
            {match.equipes[0]?.nom || "Équipe A"}
          </span>

          <span className="text-green-400 text-[10px] uppercase tracking-widest">
            Match terminé
          </span>

          <span className="truncate max-w-[40%] text-right">
            {match.equipes[1]?.nom || "Équipe B"}
          </span>
        </div>

        {/* Score */}
        <div className="mt-3 flex items-center justify-center gap-6">
          <span className="text-white text-5xl font-extrabold drop-shadow-lg">
            {match.score.equipeA}
          </span>

          <span className="text-green-400 text-3xl font-bold">:</span>

          <span className="text-white text-5xl font-extrabold drop-shadow-lg">
            {match.score.equipeB}
          </span>
        </div>

        {/* Résultat */}
        <p className="mt-2 text-center text-xs text-white/70">
          {match.score.equipeA > match.score.equipeB
            ? `🏆 Victoire ${match.equipes[0]?.nom}`
            : match.score.equipeA < match.score.equipeB
            ? `🏆 Victoire ${match.equipes[1]?.nom}`
            : "🤝 Match nul"}
        </p>
      </div>
    </div>
  </motion.div>
)}


     


        {/* Infos Match */}
        <section className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold text-yellow-300 mb-4">
            📅 Détails du match
          </h2>
          <div className="grid md:grid-cols-2 gap-4 text-white/90">
            <p><span className="text-yellow-200 font-semibold">Date :</span> {match.date}</p>
            <p><span className="text-yellow-200 font-semibold">Heure :</span> {match.heure}</p>
            <p><span className="text-yellow-200 font-semibold">Niveau :</span> {match.niveau}</p>
            <p><span className="text-yellow-200 font-semibold">Statut :</span> {match.statut}</p>
          </div>
        </section>

        <AnimatePresence>
  {showScoreForm && (
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
        className="bg-white rounded-2xl p-6 w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-4 text-center">
          ➕ Ajouter le score final
        </h2>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <input
            type="number"
            min="0"
            placeholder="Score Équipe A"
            value={scoreA}
            onChange={(e) => setScoreA(e.target.value)}
            className="border p-3 rounded-xl text-center"
          />
          <input
            type="number"
            min="0"
            placeholder="Score Équipe B"
            value={scoreB}
            onChange={(e) => setScoreB(e.target.value)}
            className="border p-3 rounded-xl text-center"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowScoreForm(false)}
            className="flex-1 bg-gray-300 py-2 rounded-xl font-bold"
          >
            Annuler
          </button>

          <button
            onClick={() => handleSubmitScore()}
            className="flex-1 bg-blue-600 text-white py-2 rounded-xl font-bold"
          >
            Valider
          </button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>


        {/* Équipes */}
        <div className="grid md:grid-cols-2 gap-6">
          {equipes.map((equipe) => {
            const equipeFull = (equipe.joueurs || []).length >= 7;

            return (
              <div
                key={equipe._id}
                className="bg-black/60 border border-yellow-400/20 rounded-2xl p-4"
              >
                <h3 className="text-yellow-400 font-bold mb-3">
                  {equipe.nom}{" "}
                  {equipe.capitaine === footballeurInfo?._id && "👑"}
                </h3>

                <ul className="space-y-2">
                  {equipe.joueurs.map((j) => (
                    <li
                      key={j._id}
                      className="flex justify-between text-white/90"
                    >
                      <span>{j.name}</span>
                      <span className="text-yellow-300">{j.position}</span>
                    </li>
                  ))}
                </ul>

                {isCaptain && myEquipe?._id === equipe._id && (
                  <button
                    disabled={equipeFull}
                    onClick={() => setShowModal(true)}
                    className={`mt-4 w-full py-2 rounded-xl ${
                      equipeFull
                        ? "bg-gray-500"
                        : "bg-yellow-500 text-black font-bold"
                    }`}
                  >
                    {equipeFull
                      ? "Équipe complète"
                      : "➕ Inviter un joueur"}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Boutons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          {canCreateEquipe && (
            <button
              onClick={handleJoinEquipe}
              className="px-6 py-3 rounded-xl bg-green-600 text-white font-bold"
            >
              ➕ Créer mon équipe
            </button>
          )}
           {footballeurInfo && (
          <button
            // disabled={match.statut !== "Terminé"}
            disabled={phase !== "EVALUATION"}
            onClick={() => {
  if (phase === "EVALUATION") {
    router.push(`/matchs/${match._id}/evaluate`);
  }
}}
           
            className={`px-6 py-3 rounded-xl font-bold ${
              match.statut !== "Terminé"
                ? "bg-gray-600 text-gray-300"
                : "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black"
            }`}
          >
            ⭐ Évaluer
          </button>
           )}

          <button
            onClick={() => router.push("/matchs")}
            className="px-6 py-3 rounded-xl bg-gray-700 text-white font-bold"
          >
            ⬅️ Retour
          </button>
        </div>
      </motion.div>
    </StadiumBackground>
  );
}
