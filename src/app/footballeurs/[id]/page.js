// src/app/footballeurs/[id]/page.js (ou le chemin où tu as ton composant)
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { getFootballeurDetails } from "../../../redux/actions/footballeurActions";
import { motion } from "framer-motion";
import Link from "next/link";
import StadiumBackground from "@/components/StadiumBackground";
import Loader from "@/components/Loader";

export default function FootballeurProfil() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { footballeur, loading, error } = useSelector(
    (state) => state.footballeurDetails || {}
  );

  const [filter, setFilter] = useState("Tous");

  useEffect(() => {
    if (id) dispatch(getFootballeurDetails(id));
  }, [dispatch, id]);

  // --- UTIL : safe format rating ---
  const getFormattedRating = () => {
    if (!footballeur || !footballeur.averageRating) return "N/A";
    const rating = parseFloat(footballeur.averageRating);
    return isNaN(rating) ? "N/A" : rating.toFixed(1);
  };

  // --- UTIL : filtered matchs based on filter ---
  const getFilteredMatchs = () => {
    if (!footballeur || !footballeur.matchs) return [];
    return filter === "Tous"
      ? footballeur.matchs
      : footballeur.matchs.filter((m) => m.statut === filter);
  };

  // --- GROUP EVALUATIONS BY MATCH ---
  // footballeur.evaluations is populated on backend: each eval has .match (populated or id) and .note
  const evaluationsByMatch = useMemo(() => {
    const map = new Map();
    if (!footballeur || !Array.isArray(footballeur.evaluations)) return map;

    footballeur.evaluations.forEach((ev) => {
      // ev.match may be an object or an id string
      const matchId = ev.match && ev.match._id ? String(ev.match._id) : String(ev.match);
      if (!map.has(matchId)) map.set(matchId, []);
      const note = typeof ev.note === "number" ? ev.note : parseFloat(ev.note);
      if (!Number.isNaN(note)) map.get(matchId).push(note);
    });

    return map;
  }, [footballeur]);

  // compute average helper
  const computeAvg = (notes) => {
    if (!notes || notes.length === 0) return null;
    const sum = notes.reduce((s, n) => s + n, 0);
    return +(sum / notes.length).toFixed(1);
  };

  if (loading)
    return (
      <StadiumBackground>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader text="Chargement du profil..." />
        </div>
      </StadiumBackground>
    );

  if (error)
    return (
      <StadiumBackground>
        <div className="flex justify-center items-center min-h-[60vh]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-500/20 border border-red-500/50 rounded-2xl p-8 text-center max-w-md"
          >
            <p className="text-red-200 text-lg mb-4">{error}</p>
            <Link
              href="/matchs"
              className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Retour aux matchs
            </Link>
          </motion.div>
        </div>
      </StadiumBackground>
    );

  if (!footballeur)
    return (
      <StadiumBackground>
        <div className="flex justify-center items-center min-h-[60vh]">
          <p className="text-white/80 text-lg">Aucun joueur trouvé.</p>
        </div>
      </StadiumBackground>
    );

  const filteredMatchs = getFilteredMatchs();
  const formattedRating = getFormattedRating();

  return (
    <StadiumBackground>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-6xl mx-auto py-8 px-4"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-green-600 mb-6 drop-shadow-lg">
            👤 Profil Joueur
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-green-400 to-green-600 mx-auto rounded-full mb-8"></div>
        </motion.div>

        {/* Profile card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl mb-8"
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <motion.div whileHover={{ scale: 1.05 }} className="relative">
              <img
                src={footballeur.image || "/stadium.webp"}
                alt={footballeur.name || "Joueur"}
                className="w-36 h-36 rounded-full object-cover border-4 border-green-400 shadow-2xl"
              />
              <div className="absolute -bottom-2 -right-2 bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold border-2 border-white">
                ⚽
              </div>
            </motion.div>

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-white mb-2">
                {footballeur.name || "Nom non renseigné"}
              </h2>
              <p className="text-green-200 text-lg mb-4">
                Poste :{" "}
                <span className="font-semibold text-green-300">
                  {footballeur.position || "Non spécifié"}
                </span>
              </p>

              <div className="flex flex-col sm:flex-row gap-6 items-center justify-center md:justify-start">
                <motion.div
                  className="text-center"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <div className="text-3xl font-bold text-yellow-300 mb-1">
                    ⭐ {formattedRating}
                  </div>
                  <p className="text-white/70 text-sm">
                    {footballeur.totalRatings || 0} évaluation(s)
                  </p>
                </motion.div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-300 mb-1">
                    {footballeur.matchs?.length || 0}
                  </div>
                  <p className="text-white/70 text-sm">Matchs joués</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-3 justify-center mb-8"
        >
          {["Tous", "Ouvert", "Complet", "Terminé"].map((statut) => (
            <motion.button
              key={statut}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(statut)}
              className={`px-5 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                filter === statut
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg"
                  : "bg-white/10 text-white/90 hover:bg-white/20 backdrop-blur-sm"
              } border border-white/20`}
            >
              {statut}
            </motion.button>
          ))}
        </motion.div>

        {/* Matches list with per-match average */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-2 gap-6"
        >
          {filteredMatchs && filteredMatchs.length > 0 ? (
            filteredMatchs.map((m, index) => {
              const matchId = String(m._id);
              // try to read notes from evaluationsByMatch map
              const notes = evaluationsByMatch.get(matchId) || [];
              const avg = computeAvg(notes); // number or null

              return (
                <motion.div
                  key={m._id || index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-green-400/30 transition-all duration-300 shadow-xl"
                >
                  <h3 className="font-bold text-white text-xl mb-3">
                    {m.terrain?.nom || "Terrain inconnu"}
                  </h3>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <p className="text-green-200 mb-2">
                        📅 {m.date || "Date non spécifiée"} à {m.heure || "Heure non spécifiée"}
                      </p>
                      <p className="text-white/80 mb-2">
                        Niveau :{" "}
                        <span className="font-semibold text-blue-300">
                          {m.niveau || "Non spécifié"}
                        </span>
                      </p>
                    </div>

                    <div className="text-center">
                      <div className="text-sm text-white/80 mb-1">Moyenne match</div>
                      <div className={`text-2xl font-bold mb-2 ${avg !== null ? "text-yellow-300" : "text-white/50"}`}>
                        {avg !== null ? `${avg} / 5` : "N/A"}
                      </div>

                      <div className="flex gap-2 justify-center">
                        <Link
                          href={`/matchs/${m._id}/classement`}
                          className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/90 border border-white/10 transition"
                        >
                          Voir classement
                        </Link>

                        {m.statut === "Terminé" && (
                          <span className="inline-flex items-center px-3 py-2 rounded-lg bg-green-500/20 text-green-300 border border-green-500/30 text-sm">
                            Terminé
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        m.statut === "Terminé"
                          ? "bg-green-500/20 text-green-300 border border-green-500/30"
                          : m.statut === "Complet"
                          ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                          : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                      }`}
                    >
                      {m.statut || "Inconnu"}
                    </span>

                    {m.statut === "Terminé" && (
                      <Link
                        href={`/matchs/${m._id}/evaluate`}
                        className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2"
                      >
                        ⭐ Noter
                      </Link>
                    )}
                  </div>
                </motion.div>
              );
            })
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-2 text-center py-12"
            >
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <p className="text-white/60 text-lg mb-4">
                  {filter === "Tous"
                    ? "Aucun match trouvé pour ce joueur."
                    : `Aucun match "${filter}" trouvé.`}
                </p>
                <p className="text-green-300">Les matchs apparaîtront ici une fois inscrit.</p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12 pt-8 border-t border-white/10"
        >
          <Link
            href="/matchs"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white/90 px-6 py-3 rounded-2xl transition-all duration-300 backdrop-blur-sm border border-white/20"
          >
            ⬅️ Retour aux matchs
          </Link>
        </motion.div>
      </motion.div>
    </StadiumBackground>
  );
}


