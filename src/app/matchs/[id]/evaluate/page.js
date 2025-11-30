"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Loader from "../../../../components/Loader";
import { createEvaluation } from "../../../../redux/actions/evaluationActions";
import StadiumBackground from "@/components/StadiumBackground";

export default function EvaluateMatchPage() {
  const API = process.env.NEXT_PUBLIC_API_URL;
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = useParams();

  // States
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState({});
  const [commentaires, setCommentaires] = useState({});
  const [alreadyEvaluated, setAlreadyEvaluated] = useState({});

  // Redux state
  const { footballeurInfo } =
    useSelector((state) => state.footballeurSignin) || {};

  const evaluationCreate = useSelector((state) => state.evaluationCreate || {});
  const { loading: loadingEval, success, error } = evaluationCreate;

  // -----------------------------------------
  // 1) Charger le match
  // -----------------------------------------
  useEffect(() => {
    if (!footballeurInfo) {
      router.push("/signin");
      return;
    }

    const fetchMatch = async () => {
      try {
        const { data } = await axios.get(`${API}/api/matchs/${id}`, {
          headers: { Authorization: `Bearer ${footballeurInfo.token}` },
        });

        if (!data.joueurs?.some((j) => j._id === footballeurInfo._id)) {
          toast.warning("Vous ne participez pas à ce match.");
          router.push("/matchs");
          return;
        }

        setMatch(data);
        await checkAlreadyEvaluated(data.joueurs);
      } catch (err) {
        console.error("Erreur fetchMatch:", err);
        toast.error("Erreur lors du chargement du match");
      } finally {
        setLoading(false);
      }
    };

    fetchMatch();
  }, [id, footballeurInfo, router, API]);

  // -----------------------------------------
  // 2) Vérifier si A a déjà évalué B (via API)
  // -----------------------------------------
  const checkAlreadyEvaluated = async (joueurs) => {
    const results = {};

    for (let j of joueurs) {
      if (!footballeurInfo) return;

      if (j._id === footballeurInfo._id) continue;

      try {
        const { data } = await axios.get(
          `${API}/api/evaluations/check/${id}/${j._id}`,
          {
            headers: { Authorization: `Bearer ${footballeurInfo.token}` },
          }
        );

        results[j._id] = data.alreadyEvaluated;
      } catch (error) {
        console.error("Erreur vérification évaluation:", error);
      }
    }

    setAlreadyEvaluated(results);
  };

  // -----------------------------------------
  // 3) Success / error toast
  // -----------------------------------------
  useEffect(() => {
    if (success) toast.success("Évaluation envoyée avec succès !");
    if (error) toast.error(`Erreur : ${error}`);
  }, [success, error]);

  // -----------------------------------------
  // Gestion des changements inputs
  // -----------------------------------------
  const handleNoteChange = (playerId, value) => {
    setNotes({ ...notes, [playerId]: Number(value) });
  };

  const handleCommentChange = (playerId, value) => {
    setCommentaires({ ...commentaires, [playerId]: value });
  };

  // -----------------------------------------
  // Soumission d'une évaluation
  // -----------------------------------------
  const handleSubmit = (playerId) => {
    if (alreadyEvaluated[playerId]) return;

    const note = notes[playerId];
    const commentaire = commentaires[playerId] || "";

    if (!note) {
      toast.warning("Veuillez attribuer une note avant d'envoyer.");
      return;
    }

    // ⛔ Correction principale : bloquer immédiatement l'UI
    setAlreadyEvaluated((prev) => ({
      ...prev,
      [playerId]: true,
    }));

    dispatch(createEvaluation(id, playerId, note, commentaire));
  };

  // -----------------------------------------
  // Loading
  // -----------------------------------------
  if (loading)
    return (
      <StadiumBackground>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader text="Chargement du match..." />
        </div>
      </StadiumBackground>
    );

  if (!match || !footballeurInfo) return null;

  const joueurs =
    match.joueurs?.filter(
      (j) => footballeurInfo && j._id !== footballeurInfo._id
    ) || [];

  // -----------------------------------------
  // Rendu principal
  // -----------------------------------------
  return (
    <StadiumBackground>
      <div className="relative z-10 min-h-screen py-6 px-3 md:py-8 md:px-4">
        <div className="max-w-4xl mx-auto">
          {/* En-tête AMÉLIORÉ */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-8 md:mb-12"
          >
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl md:text-5xl font-black mb-4 md:mb-6 relative z-10"
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
              Évaluation du Match
            </motion.h1>

            {/* Ligne de séparation */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="w-32 md:w-48 h-1 bg-gradient-to-r from-green-400 via-yellow-400 to-green-400 mx-auto rounded-full mb-4 md:mb-6"
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-white/80 text-base md:text-lg font-medium"
            >
              Donnez votre avis sur les performances des autres joueurs
            </motion.p>
          </motion.div>

          {/* LISTE DES JOUEURS - DESIGN RESPONSIVE */}
          {joueurs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 md:py-20 bg-white/10 backdrop-blur-lg rounded-2xl md:rounded-3xl border border-white/20"
            >
              <div className="text-4xl md:text-6xl mb-3 md:mb-4">👥</div>
              <p className="text-white/80 text-lg md:text-xl">Aucun joueur à évaluer</p>
              <p className="text-white/60 mt-2 text-sm md:text-base">Vous êtes le seul joueur dans ce match</p>
            </motion.div>
          ) : (
            <div className="space-y-4 md:space-y-6">
              {joueurs.map((joueur, index) => (
                <motion.div
                  key={joueur._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-white/10 backdrop-blur-lg rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20 shadow-lg"
                >
                  {/* Layout responsive - Empilage vertical sur mobile */}
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 md:gap-6">
                    
                    {/* Section Info Joueur */}
                    <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-lg border-2 border-yellow-300/50 flex-shrink-0">
                        {joueur.name?.charAt(0) || "?"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg md:text-xl text-white font-bold truncate">
                          {joueur.name || "Joueur inconnu"}
                        </h3>
                        <p className="text-green-200 text-sm md:text-base flex items-center gap-1 md:gap-2">
                          <span>🎯</span>
                          {joueur.position || "Poste non spécifié"}
                        </p>
                      </div>
                    </div>

                    {/* Section Évaluation - Layout responsive */}
                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4 items-stretch sm:items-center flex-shrink-0">
                      
                      {/* Sélecteur de note */}
                      <div className="flex-1 sm:flex-none">
                        <select
                          disabled={alreadyEvaluated[joueur._id]}
                          value={notes[joueur._id] || ""}
                          onChange={(e) =>
                            handleNoteChange(joueur._id, e.target.value)
                          }
                          className="w-full sm:w-32 bg-white/10 border border-white/20 rounded-lg md:rounded-xl px-3 py-2 md:px-4 md:py-3 text-white text-sm md:text-base focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 outline-none transition-all duration-300 backdrop-blur-sm"
                        >
                          <option value="" className="text-gray-400">Note</option>
                          {[1, 2, 3, 4, 5].map((n) => (
                            <option key={n} value={n} className="text-black">
                              {n} ⭐
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Champ commentaire */}
                      <div className="flex-1 min-w-0">
                        <input
                          disabled={alreadyEvaluated[joueur._id]}
                          type="text"
                          placeholder="Commentaire..."
                          value={commentaires[joueur._id] || ""}
                          onChange={(e) =>
                            handleCommentChange(joueur._id, e.target.value)
                          }
                          className="w-full bg-white/10 border border-white/20 rounded-lg md:rounded-xl px-3 py-2 md:px-4 md:py-3 text-white text-sm md:text-base placeholder-white/50 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 outline-none transition-all duration-300 backdrop-blur-sm"
                        />
                      </div>

                      {/* Bouton d'envoi */}
                      <div className="flex-1 sm:flex-none">
                        <motion.button
                          whileHover={{ scale: alreadyEvaluated[joueur._id] ? 1 : 1.05 }}
                          whileTap={{ scale: alreadyEvaluated[joueur._id] ? 1 : 0.95 }}
                          disabled={
                            loadingEval || alreadyEvaluated[joueur._id] === true
                          }
                          onClick={() => handleSubmit(joueur._id)}
                          className={`w-full sm:w-32 px-4 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl font-semibold text-sm md:text-base transition-all duration-300 shadow-lg text-white relative overflow-hidden group
                            ${
                              alreadyEvaluated[joueur._id]
                                ? "bg-gray-500/50 cursor-not-allowed border border-gray-400/30"
                                : "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 border border-yellow-400/30"
                            }`}
                        >
                          {/* Effet de brillance */}
                          {!alreadyEvaluated[joueur._id] && !loadingEval && (
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                          )}
                          
                          <span className="relative z-10">
                            {alreadyEvaluated[joueur._id]
                              ? "✅ Noté"
                              : loadingEval
                              ? "⏳ Envoi..."
                              : "📤 Envoyer"}
                          </span>
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {/* Indicateur d'évaluation déjà faite */}
                  {alreadyEvaluated[joueur._id] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-3 text-center"
                    >
                      <p className="text-green-300 text-sm bg-green-500/20 border border-green-400/30 rounded-lg px-3 py-1 inline-block">
                        ✓ Évaluation déjà envoyée
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          )}

          {/* Bouton retour */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-8 md:mt-12"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push(`/matchs/${id}`)}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/20 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 group mx-auto text-sm md:text-base"
            >
              <motion.span
                animate={{ x: [-5, 0, -5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ←
              </motion.span>
              Retour au match
            </motion.button>
          </motion.div>
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

