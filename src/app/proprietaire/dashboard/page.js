"use client";

import React, { useEffect, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import StadiumBackground from "@/components/StadiumBackground";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCircle, Calendar, PlusCircle, Users, Loader2, Euro } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { listMyTerrains } from "../../../redux/actions/terrainActions";
import { listMatches } from "../../../redux/actions/matchActions";

export default function ProprietaireDashboardPage() {
  const dispatch = useDispatch();
  
  // Sélecteurs respectant votre architecture existante
  const { 
    terrains = [], 
    loading: terrainsLoading, 
    error: terrainsError 
  } = useSelector((state) => state.terrainMine || {});
  
  const { 
    matchs = [], 
    loading: matchsLoading, 
    error: matchsError 
  } = useSelector((state) => state.matchList || {});

  // Chargement des données
  useEffect(() => {
    dispatch(listMyTerrains());
    dispatch(listMatches());
  }, [dispatch]);

  // Calcul des revenus estimés basé sur votre structure de données
  const revenusEstimes = useMemo(() => {
    if (!terrains || terrains.length === 0) return 0;
    
    return terrains.reduce((total, terrain) => {
      const prix = terrain.prixHeure || 0;
      // Estimation: 20h de réservation par terrain
      return total + (prix * 20);
    }, 0);
  }, [terrains]);

  const isLoading = terrainsLoading || matchsLoading;
  const hasError = terrainsError || matchsError;

  // Fonction pour compter les joueurs selon votre structure
  const getJoueursCount = (match) => {
    if (!match) return 0;
    
    // Selon votre API, ça peut être un array, un number ou autre
    if (Array.isArray(match.joueurs)) {
      return match.joueurs.length;
    }
    if (typeof match.joueurs === 'number') {
      return match.joueurs;
    }
    // Fallback si la structure est différente
    return 0;
  };

  return (
    <StadiumBackground rotateOnMobile={true}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-7xl mx-auto py-8 px-4"
      >
        {/* En-tête avec effet "herbe" amélioré */}
        <div className="relative text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 1.2, 
              ease: [0.25, 0.46, 0.45, 0.94],
              y: { duration: 0.8, ease: "easeOut" }
            }}
            className="font-black text-5xl md:text-7xl lg:text-8xl relative z-10"
            style={{
              background: "linear-gradient(135deg, #0f5c2f 0%, #1a7a3f 15%, #2d9c5a 30%, #1a7a3f 50%, #0f5c2f 70%, #1a7a3f 85%, #0f5c2f 100%)",
              backgroundSize: "300% 300%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textShadow: `
                0 2px 4px rgba(0,0,0,0.4),
                0 4px 12px rgba(0,0,0,0.3),
                0 8px 24px rgba(34, 197, 94, 0.2),
                0 0 30px rgba(34, 197, 94, 0.15)
              `,
              filter: "brightness(1.1) contrast(1.2)",
              animation: "grassShimmer 4s ease-in-out infinite",
            }}
          >
            Tableau de Bord
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="w-64 h-1 bg-gradient-to-r from-green-400 via-yellow-400 to-green-400 mx-auto rounded-full mb-6 mt-4"
          />
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-xl text-white/80 font-medium"
          >
            Gestionnaire de terrains et matchs
          </motion.p>
          
          {/* Effet de texture d'herbe par-dessus - Amélioré */}
          <div 
            className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-50 z-0"
            style={{
              backgroundImage: `
                radial-gradient(circle at 10% 20%, rgba(120, 220, 80, 0.4) 3px, transparent 3px),
                radial-gradient(circle at 90% 40%, rgba(100, 200, 60, 0.3) 2px, transparent 2px),
                radial-gradient(circle at 40% 70%, rgba(140, 240, 100, 0.35) 4px, transparent 4px),
                radial-gradient(circle at 70% 10%, rgba(110, 210, 70, 0.25) 1px, transparent 1px),
                radial-gradient(circle at 20% 90%, rgba(130, 230, 90, 0.3) 3px, transparent 3px),
                radial-gradient(circle at 85% 85%, rgba(150, 250, 110, 0.2) 2px, transparent 2px)
              `,
              backgroundSize: "80px 80px, 60px 60px, 100px 100px, 40px 40px, 90px 90px, 70px 70px",
              animation: "grassFloat 8s ease-in-out infinite",
            }}
          />
          
          {/* Effet de profondeur supplémentaire */}
          <div 
            className="absolute inset-0 pointer-events-none mix-blend-soft-light opacity-30 z-0"
            style={{
              backgroundImage: `
                linear-gradient(45deg, transparent 48%, rgba(34, 197, 94, 0.1) 50%, transparent 52%),
                linear-gradient(-45deg, transparent 48%, rgba(34, 197, 94, 0.1) 50%, transparent 52%)
              `,
              backgroundSize: "20px 20px",
            }}
          />
        </div>

        <style jsx>{`
          @keyframes grassShimmer {
            0%, 100% { 
              background-position: 0% 50%;
              filter: brightness(1.1) contrast(1.2);
            }
            25% { 
              background-position: 50% 25%;
              filter: brightness(1.15) contrast(1.25);
            }
            50% { 
              background-position: 100% 50%;
              filter: brightness(1.2) contrast(1.3);
            }
            75% { 
              background-position: 50% 75%;
              filter: brightness(1.15) contrast(1.25);
            }
          }
          
          @keyframes grassFloat {
            0%, 100% { 
              transform: translateY(0px) translateX(0px);
              opacity: 0.5;
            }
            33% { 
              transform: translateY(-3px) translateX(2px);
              opacity: 0.6;
            }
            66% { 
              transform: translateY(2px) translateX(-3px);
              opacity: 0.4;
            }
          }
        `}</style>

        {/* Le reste du composant reste identique à la version précédente */}
        {/* Indicateurs de chargement et erreur */}
        {hasError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-500/20 border border-red-500/50 rounded-2xl p-6 text-red-200 text-center backdrop-blur-lg mb-8"
          >
            <p className="text-lg mb-2">Erreur lors du chargement des données</p>
            <Button 
              onClick={() => {
                dispatch(listMyTerrains());
                dispatch(listMatches());
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Réessayer
            </Button>
          </motion.div>
        )}

        {/* Cartes statistiques améliorées */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {/* Carte Terrains */}
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-green-200 font-semibold">Terrains</div>
              <UserCircle className="w-6 h-6 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-white flex items-center gap-2">
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                terrains.length
              )}
            </div>
            <div className="text-green-300 text-sm mt-2">
              Gérés actuellement
            </div>
          </motion.div>

          {/* Carte Matchs */}
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-blue-200 font-semibold">Matchs</div>
              <Calendar className="w-6 h-6 text-blue-400" />
            </div>
            <div className="text-3xl font-bold text-white flex items-center gap-2">
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                matchs.length
              )}
            </div>
            <div className="text-blue-300 text-sm mt-2">
              Organisés ce mois
            </div>
          </motion.div>

          {/* Carte Revenus */}
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-yellow-200 font-semibold">Revenus estimés</div>
              <Euro className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="text-3xl font-bold text-white">
              {isLoading ? "-" : `${revenusEstimes} DT`}
            </div>
            <div className="text-yellow-300 text-sm mt-2">
              Sur 20h de réservation
            </div>
          </motion.div>
        </motion.div>

        {/* Grille principale */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Section Terrains */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="rounded-2xl bg-white/10 border border-white/20 shadow-2xl backdrop-blur-lg overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h3 className="flex items-center gap-3 text-xl font-bold text-green-200">
                  <UserCircle className="w-6 h-6" /> 
                  Mes Terrains
                </h3>
                <Link href="/proprietaire/register">
                  <Button 
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white flex items-center gap-2 transition-all duration-300 shadow-lg"
                    disabled={isLoading}
                  >
                    <PlusCircle size={16} /> 
                    Ajouter
                  </Button>
                </Link>
              </div>
              <CardContent className="p-0">
                <div className="overflow-hidden">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-green-400 mr-3" />
                      <span className="text-white/80">Chargement des terrains...</span>
                    </div>
                  ) : terrains.length === 0 ? (
                    <div className="text-center py-12">
                      <UserCircle className="w-16 h-16 text-white/30 mx-auto mb-4" />
                      <p className="text-white/60 text-lg mb-4">Aucun terrain trouvé</p>
                      <Link href="/proprietaire/register">
                        <Button className="bg-green-600 hover:bg-green-700 text-white">
                          Créer votre premier terrain
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="max-h-96 overflow-y-auto">
                      {terrains.map((terrain, index) => (
                        <motion.div
                          key={terrain._id || `terrain-${index}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * index }}
                          whileHover={{ scale: 1.02 }}
                          className="border-b border-white/10 last:border-b-0 hover:bg-white/5 transition-all duration-300"
                        >
                          <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold text-white text-lg">
                                {terrain.nom || "Non renseigné"}
                              </h4>
                              <span className="text-green-300 font-bold">
                                {terrain.prixHeure ? `${terrain.prixHeure} DT/h` : "Gratuit"}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm text-white/70">
                              <span>{terrain.ville || "Ville non spécifiée"}</span>
                              <span>Capacité: {terrain.capacite || "N/A"}</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Section Matchs */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="rounded-2xl bg-white/10 border border-white/20 shadow-2xl backdrop-blur-lg overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h3 className="flex items-center gap-3 text-xl font-bold text-blue-200">
                  <Calendar className="w-6 h-6" /> 
                  Mes Matchs
                </h3>
                <Link href="/proprietaire/create-match">
                  <Button 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white flex items-center gap-2 transition-all duration-300 shadow-lg"
                    disabled={isLoading}
                  >
                    <PlusCircle size={16} /> 
                    Créer
                  </Button>
                </Link>
              </div>
              <CardContent className="p-0">
                <div className="overflow-hidden">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-blue-400 mr-3" />
                      <span className="text-white/80">Chargement des matchs...</span>
                    </div>
                  ) : matchs.length === 0 ? (
                    <div className="text-center py-12">
                      <Calendar className="w-16 h-16 text-white/30 mx-auto mb-4" />
                      <p className="text-white/60 text-lg mb-4">Aucun match trouvé</p>
                      <Link href="/proprietaire/create-match">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                          Organiser un match
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="max-h-96 overflow-y-auto">
                      {matchs.map((match, index) => (
                        <motion.div
                          key={match._id || `match-${index}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * index }}
                          whileHover={{ scale: 1.02 }}
                          className="border-b border-white/10 last:border-b-0 hover:bg-white/5 transition-all duration-300"
                        >
                          <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold text-white">
                                {match.terrain?.nom || "Terrain inconnu"}
                              </h4>
                              <div className="flex items-center gap-2 text-green-300">
                                <Users className="w-4 h-4" />
                                <span className="font-semibold">{getJoueursCount(match)}</span>
                              </div>
                            </div>
                            <div className="flex justify-between text-sm text-white/70 mb-2">
                              <span>{match.date || "Date non spécifiée"}</span>
                              <span>{match.heure || "Heure non spécifiée"}</span>
                            </div>
                            <div className="text-xs text-white/50">
                              Niveau: {match.niveau || "Tous niveaux"}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Pied de page */}
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-white/40 text-sm mt-12 pt-8 border-t border-white/10"
        >
          © 2025 FootBase Manager. Tous droits réservés.
        </motion.footer>
      </motion.div>
    </StadiumBackground>
  );
}



