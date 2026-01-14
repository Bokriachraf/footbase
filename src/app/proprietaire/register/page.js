"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import Link from "next/link";
import { proprietaireRegister } from "../../../redux/actions/proprietaireActions";
import StadiumBackground from "@/components/StadiumBackground";
import Loader from "@/components/Loader";

export default function ProprietaireRegisterPage() {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [password, setPassword] = useState("");
  const [ville, setVille] = useState("");
  const [terrainNom, setTerrainNom] = useState("");
  const [adresse, setAdresse] = useState("");
  const [typeGazon, setTypeGazon] = useState("Synthétique");
  const [capacite, setCapacite] = useState("");
  const [prixHeure, setPrixHeure] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const terrain = {
      nom: terrainNom,
      adresse,
      ville,
      typeGazon,
      capacite: Number(capacite),
      prixHeure: Number(prixHeure),
    };
    
    try {
      await dispatch(proprietaireRegister({ nom, email, password, telephone, gouvernorat: ville, terrain }, router));
    } finally {
      setLoading(false);
    }
  };

  return (
    <StadiumBackground>
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-4xl mx-auto"
        >
          {/* En-tête AMÉLIORÉ */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-8 relative"
          >
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl font-black mb-4 relative z-10"
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
              Inscription Propriétaire
            </motion.h1>

            {/* Ballon décoratif */}
            <motion.div
              animate={{ 
                rotate: 360,
                y: [0, -10, 0]
              }}
              transition={{ 
                rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
              className="text-4xl mb-4 opacity-80"
            >
              ⚽
            </motion.div>

            {/* Ligne de séparation animée */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="w-48 h-1 bg-gradient-to-r from-green-400 via-yellow-400 to-green-400 mx-auto rounded-full mb-4"
              style={{
                backgroundSize: "200% 100%",
                animation: "lineShimmer 2s ease-in-out infinite",
              }}
            />
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-white/80 text-lg font-medium"
            >
              Créez votre compte et ajoutez votre premier terrain
            </motion.p>
          </motion.div>

          {/* Carte du formulaire AMÉLIORÉE */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-2xl border border-white/20 border-b-4 border-r-4 border-b-white/30 border-r-white-30 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
          >
            {/* Effet de lumière */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-yellow-400/5 to-green-600/10 rounded-3xl -z-10" />

            <form onSubmit={submitHandler} className="space-y-8">
              {/* Section Informations Propriétaire */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h3 className="text-2xl font-bold text-white mb-6 pb-2 border-b border-white/20">
                  👤 Informations Propriétaire
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-white font-semibold block mb-3 text-sm">
                      Nom complet
                    </label>
                    <input
                      required
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                      placeholder="Votre nom complet"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 text-white placeholder-white/50 border border-white/20 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 outline-none transition-all duration-300 backdrop-blur-sm"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="text-white font-semibold block mb-3 text-sm">
                      📧 Adresse Email
                    </label>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre@email.com"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 text-white placeholder-white/50 border border-white/20 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 outline-none transition-all duration-300 backdrop-blur-sm"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="text-white font-semibold block mb-3 text-sm">
                      📞 Téléphone
                    </label>
                    <input
                      required
                      value={telephone}
                      onChange={(e) => setTelephone(e.target.value)}
                      placeholder="Votre numéro de téléphone"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 text-white placeholder-white/50 border border-white/20 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 outline-none transition-all duration-300 backdrop-blur-sm"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="text-white font-semibold block mb-3 text-sm">
                      🔒 Mot de passe
                    </label>
                    <input
                      required
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Créez un mot de passe sécurisé"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 text-white placeholder-white/50 border border-white/20 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 outline-none transition-all duration-300 backdrop-blur-sm"
                      disabled={loading}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Section Informations Terrain */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h3 className="text-2xl font-bold text-white mb-6 pb-2 border-b border-white/20">
                  🏟️ Informations Terrain
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-white font-semibold block mb-3 text-sm">
                      Nom du terrain
                    </label>
                    <input
                      required
                      value={terrainNom}
                      onChange={(e) => setTerrainNom(e.target.value)}
                      placeholder="Ex: Stade Olympique, Terrain des Champions..."
                      className="w-full px-4 py-3 rounded-xl bg-white/5 text-white placeholder-white/50 border border-white/20 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 outline-none transition-all duration-300 backdrop-blur-sm"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="text-white font-semibold block mb-3 text-sm">
                      🏙️ Ville / Gouvernorat
                    </label>
                    <input
                      required
                      value={ville}
                      onChange={(e) => setVille(e.target.value)}
                      placeholder="Ex: Tunis, Sfax, Sousse..."
                      className="w-full px-4 py-3 rounded-xl bg-white/5 text-white placeholder-white/50 border border-white/20 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 outline-none transition-all duration-300 backdrop-blur-sm"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="text-white font-semibold block mb-3 text-sm">
                      📍 Adresse complète
                    </label>
                    <input
                      required
                      value={adresse}
                      onChange={(e) => setAdresse(e.target.value)}
                      placeholder="Adresse détaillée du terrain"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 text-white placeholder-white/50 border border-white/20 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 outline-none transition-all duration-300 backdrop-blur-sm"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="text-white font-semibold block mb-3 text-sm">
                      🌿 Type de gazon
                    </label>
                    <select
                      value={typeGazon}
                      onChange={(e) => setTypeGazon(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 text-white border border-white/20 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 outline-none transition-all duration-300 backdrop-blur-sm"
                      disabled={loading}
                    >
                      <option value="Synthétique">Synthétique</option>
                      <option value="Naturel">Naturel</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-white font-semibold block mb-3 text-sm">
                      👥 Capacité
                    </label>
                    <input
                      required
                      type="number"
                      value={capacite}
                      onChange={(e) => setCapacite(e.target.value)}
                      placeholder="Nombre de joueurs (ex: 14)"
                      min="4"
                      max="22"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 text-white placeholder-white/50 border border-white/20 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 outline-none transition-all duration-300 backdrop-blur-sm"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="text-white font-semibold block mb-3 text-sm">
                      💰 Prix / heure
                    </label>
                    <input
                      required
                      type="number"
                      value={prixHeure}
                      onChange={(e) => setPrixHeure(e.target.value)}
                      placeholder="Prix par heure en DT (ex: 50)"
                      min="0"
                      step="5"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 text-white placeholder-white/50 border border-white/20 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 outline-none transition-all duration-300 backdrop-blur-sm"
                      disabled={loading}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Bouton d'inscription */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="pt-4"
              >
                <motion.button
                  whileHover={{ 
                    scale: loading ? 1 : 1.02,
                    boxShadow: loading ? "none" : "0 10px 30px rgba(250, 204, 21, 0.3)"
                  }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl font-bold text-black bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 disabled:from-gray-500 disabled:to-gray-600 shadow-lg transition-all duration-300 disabled:cursor-not-allowed relative overflow-hidden group"
                >
                  {/* Effet de brillance */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                        Inscription en cours...
                      </>
                    ) : (
                      <>
                        <motion.span
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          🚀
                        </motion.span>
                        S'inscrire et créer le terrain
                      </>
                    )}
                  </span>
                </motion.button>
              </motion.div>
            </form>

            {/* Lien de connexion */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center mt-8 pt-6 border-t border-white/20"
            >
              <p className="text-white/70 text-sm">
                Déjà propriétaire ?{" "}
                <Link
                  href="/proprietaire/signin"
                  className="text-yellow-300 hover:text-yellow-200 font-semibold underline underline-offset-4 transition-colors"
                >
                  Connectez-vous ici
                </Link>
              </p>
            </motion.div>

            {/* Lien retour */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-center mt-4"
            >
              <Link
                href="/"
                className="text-white/60 hover:text-white text-sm transition-colors inline-flex items-center gap-2"
              >
                <span>←</span>
                Retour à l'accueil
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

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
          
          @keyframes lineShimmer {
            0%, 100% { 
              background-position: 0% 50%;
              opacity: 1;
            }
            50% { 
              background-position: 100% 50%;
              opacity: 0.8;
            }
          }
        `}</style>
      </div>
    </StadiumBackground>
  );
}

