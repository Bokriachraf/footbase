"use client";

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { register } from "../../redux/actions/footballeurActions";
import StadiumBackground from "@/components/StadiumBackground";
import Loader from "@/components/Loader";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [position, setPosition] = useState("");
  const [age, setAge] = useState("");
  const [gouvernorat, setGouvernorat] = useState("");
  const [localError, setLocalError] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const dispatch = useDispatch();
  const footballeurRegister = useSelector(
    (state) => state.footballeurRegister || {}
  );
  const { loading, error } = footballeurRegister;

  const submitHandler = (e) => {
    e.preventDefault();
    setLocalError("");

    if (password !== confirmPassword) {
      setLocalError("❌ Les mots de passe ne correspondent pas.");
      return;
    }

    if (age < 18 || age > 60) {
      setLocalError("⚠️ L'âge doit être compris entre 18 et 60 ans.");
      return;
    }

    if (!position) {
      setLocalError("⚠️ Veuillez sélectionner votre position.");
      return;
    }

    if (!gouvernorat) {
      setLocalError("⚠️ Veuillez sélectionner votre gouvernorat.");
      return;
    }

    dispatch(register(name, email, password, position, age, gouvernorat, router));
  };

  return (
    <StadiumBackground>
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-2xl mx-auto"
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
              Inscription Footballeur
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
              Rejoignez la communauté FootBase et trouvez vos prochains matchs
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

            {/* Messages d'erreur */}
            {(error || localError) && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="mb-6 px-4 py-3 text-sm text-red-200 bg-red-500/20 border border-red-400/30 rounded-xl text-center backdrop-blur-sm"
              >
                {error || localError}
              </motion.div>
            )}

            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6 text-center"
              >
                <Loader text="Création du compte en cours..." />
              </motion.div>
            )}

            <form onSubmit={submitHandler} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nom complet */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <label className="text-white font-semibold block mb-3 text-sm">
                    👤 Nom complet
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Votre nom complet"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 text-white placeholder-white/50 border border-white/20 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 outline-none transition-all duration-300 backdrop-blur-sm"
                    disabled={loading}
                  />
                </motion.div>

                {/* Email */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <label className="text-white font-semibold block mb-3 text-sm">
                    📧 Adresse e-mail
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 text-white placeholder-white/50 border border-white/20 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 outline-none transition-all duration-300 backdrop-blur-sm"
                    disabled={loading}
                  />
                </motion.div>

                {/* Position */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <label className="text-white font-semibold block mb-3 text-sm">
                    🎯 Position
                  </label>
                  <select
                    required
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 text-white border border-white/20 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 outline-none transition-all duration-300 backdrop-blur-sm"
                    disabled={loading}
                  >
                    <option value="">Sélectionnez votre position</option>
                    <option value="Gardien">🧤 Gardien</option>
                    <option value="Défenseur">🛡️ Défenseur</option>
                    <option value="Milieu">⚙️ Milieu</option>
                    <option value="Attaquant">⚡ Attaquant</option>
                  </select>
                </motion.div>

                {/* Âge */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <label className="text-white font-semibold block mb-3 text-sm">
                    🎂 Âge
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="Votre âge (18-60)"
                    min="18"
                    max="60"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 text-white placeholder-white/50 border border-white/20 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 outline-none transition-all duration-300 backdrop-blur-sm"
                    disabled={loading}
                  />
                </motion.div>

                {/* Gouvernorat */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="md:col-span-2"
                >
                  <label className="text-white font-semibold block mb-3 text-sm">
                    🗺️ Gouvernorat
                  </label>
                  <select
                    required
                    value={gouvernorat}
                    onChange={(e) => setGouvernorat(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 text-white border border-white/20 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 outline-none transition-all duration-300 backdrop-blur-sm"
                    disabled={loading}
                  >
                    <option value="">Choisissez votre gouvernorat</option>
                    {[
                      "Tunis", "Ariana", "Ben Arous", "Manouba", "Nabeul",
                      "Bizerte", "Beja", "Jendouba", "Kef", "Siliana",
                      "Sousse", "Monastir", "Mahdia", "Kairouan", "Kasserine",
                      "Sidi Bouzid", "Sfax", "Gabès", "Médenine", "Tataouine",
                      "Gafsa", "Tozeur", "Kebili", "Zaghouan"
                    ].map((gov) => (
                      <option key={gov} value={gov}>{gov}</option>
                    ))}
                  </select>
                </motion.div>

                {/* Mot de passe */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <label className="text-white font-semibold block mb-3 text-sm">
                    🔒 Mot de passe
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Créez un mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 text-white placeholder-white/50 border border-white/20 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 outline-none transition-all duration-300 backdrop-blur-sm"
                    disabled={loading}
                  />
                </motion.div>

                {/* Confirmation mot de passe */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                >
                  <label className="text-white font-semibold block mb-3 text-sm">
                    🔐 Confirmer le mot de passe
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Confirmez votre mot de passe"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 text-white placeholder-white/50 border border-white/20 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 outline-none transition-all duration-300 backdrop-blur-sm"
                    disabled={loading}
                  />
                </motion.div>
              </div>

              {/* Bouton d'inscription */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.0 }}
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
                        Création du compte...
                      </>
                    ) : (
                      <>
                        <motion.span
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          ⚽
                        </motion.span>
                        Créer mon compte
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
              transition={{ delay: 1.1 }}
              className="text-center mt-8 pt-6 border-t border-white/20"
            >
              <p className="text-white/70 text-sm">
                Déjà un compte ?{" "}
                <Link
                  href={`/signin?redirect=${redirect}`}
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
              transition={{ delay: 1.2 }}
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
