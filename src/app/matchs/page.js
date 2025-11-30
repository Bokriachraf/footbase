"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listMatches } from "../../redux/actions/matchActions";
import Link from "next/link";
import { motion } from "framer-motion";
import StadiumBackground from "@/components/StadiumBackground";
import Loader from "@/components/Loader";

export default function MatchListPage() {
  const dispatch = useDispatch();
  const matchList = useSelector((state) => state.matchList || {});
  const { loading, error, matchs } = matchList;

  useEffect(() => {
    dispatch(listMatches());
  }, [dispatch]);

  return (
    <StadiumBackground>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-7xl mx-auto py-8 px-4"
      >
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-green-600 mb-6 drop-shadow-lg">
            ⚽ Matchs Disponibles
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-green-400 to-green-600 mx-auto rounded-full mb-8"></div>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Découvrez tous les matchs organisés près de chez vous et rejoignez la communauté FootBase
          </p>
        </motion.div>

        {/* États de chargement et d'erreur */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <Loader text="Chargement des matchs..." />
          </div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-500/20 border border-red-500/50 rounded-2xl p-8 text-center max-w-2xl mx-auto mb-8"
          >
            <p className="text-red-200 text-lg mb-4">{error}</p>
            <button
              onClick={() => dispatch(listMatches())}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Réessayer
            </button>
          </motion.div>
        )}

        {/* Grille des matchs */}
        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {matchs?.length > 0 ? (
              matchs.map((m, index) => (
                <motion.div
                  key={m._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-green-400/30 transition-all duration-300 shadow-xl"
                >
                  {/* En-tête du match */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {m.terrain?.nom || "Terrain inconnu"}
                    </h3>
                    <div className="flex items-center gap-2 text-green-200 mb-1">
                      <span>📍</span>
                      <span>{m.terrain?.ville || "Ville non spécifiée"}</span>
                    </div>
                  </div>

                  {/* Informations du match */}
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Date</span>
                      <span className="text-white font-semibold">
                        {m.date || "Non spécifiée"}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Heure</span>
                      <span className="text-white font-semibold">
                        {m.heure || "Non spécifiée"}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Niveau</span>
                      <span className="text-blue-300 font-semibold">
                        {m.niveau || "Tous niveaux"}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Prix/joueur</span>
                      <span className="text-yellow-300 font-semibold">
                        {m.prixParJoueur ? `${m.prixParJoueur} DT` : "Gratuit"}
                      </span>
                    </div>

                    {/* Statut du match */}
                    {m.statut && (
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">Statut</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          m.statut === "Ouvert" 
                            ? "bg-green-500/20 text-green-300 border border-green-500/30"
                            : m.statut === "Complet"
                            ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                            : "bg-red-500/20 text-red-300 border border-red-500/30"
                        }`}>
                          {m.statut}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Bouton d'action */}
                  <Link href={`/matchs/${m._id}`}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg"
                    >
                      Voir le match ›
                    </motion.button>
                  </Link>
                </motion.div>
              ))
            ) : (
              // État vide
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-16"
              >
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-12 border border-white/10 max-w-2xl mx-auto">
                  <div className="text-6xl mb-4">⚽</div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Aucun match disponible
                  </h3>
                  <p className="text-white/60 text-lg mb-6">
                    Aucun match n'est actuellement programmé.
                    Soyez le premier à créer un match !
                  </p>
                  <Link href="/matchs/create">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300"
                    >
                      Créer un match
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Pied de page */}
        {!loading && matchs?.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-12 pt-8 border-t border-white/10"
          >
            <p className="text-white/60 mb-4">
              {matchs.length} match{matchs.length > 1 ? 's' : ''} disponible{matchs.length > 1 ? 's' : ''}
            </p>
            <Link 
              href="/"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white/90 px-6 py-3 rounded-2xl transition-all duration-300 backdrop-blur-sm border border-white/20"
            >
              ⬅️ Retour à l'accueil
            </Link>
          </motion.div>
        )}
      </motion.div>
    </StadiumBackground>
  );
}


