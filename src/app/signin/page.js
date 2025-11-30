"use client";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { signin } from "../../redux/actions/footballeurActions";
import Loader from "../../components/Loader";
import StadiumBackground from "@/components/StadiumBackground";

export default function SigninScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/matchs";

  const footballeurSignin = useSelector((state) => state.footballeurSignin || {});
  const { footballeurInfo, loading, error } = footballeurSignin;

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(signin(email, password, router));
  };

  useEffect(() => {
    if (footballeurInfo) {
      if (footballeurInfo.isAdmin) {
        router.push("/admin");
      } else {
        router.push(redirect);
      }
    }
  }, [router, redirect, footballeurInfo]);

  return (
    <StadiumBackground>
      {/* Contenu principal centré */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        
        {/* Carte du formulaire AMÉLIORÉE */}
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ 
            duration: 0.8,
            ease: "easeOut"
          }}
          className="relative w-full max-w-md px-8 py-10 rounded-3xl backdrop-blur-2xl bg-white/10 shadow-2xl border border-white/20 border-b-4 border-r-4 border-b-white/30 border-r-white/30"
        >
          {/* Effet de lumière derrière la carte */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-yellow-400/5 to-green-600/10 rounded-3xl -z-10" />
          
          {/* Élément décoratif football */}
          <motion.div
            initial={{ rotate: 0, scale: 0 }}
            animate={{ rotate: 360, scale: 1 }}
            transition={{ 
              rotate: { duration: 8, repeat: Infinity, ease: "linear" },
              scale: { duration: 1 }
            }}
            className="absolute -top-6 -right-6 text-4xl opacity-20"
          >
            ⚽
          </motion.div>

          {/* Titre avec effet herbe */}
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl font-black text-center mb-8 relative"
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
            Connexion
          </motion.h1>

          {/* Ligne de séparation */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-24 h-1 bg-gradient-to-r from-green-400 to-yellow-400 mx-auto rounded-full mb-8"
          />

          {/* Message d'erreur animé */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="mb-6 rounded-xl bg-red-500/20 text-red-200 border border-red-400/30 px-4 py-3 text-sm text-center backdrop-blur-sm"
            >
              {error}
            </motion.div>
          )}

          {loading ? (
            <div className="flex justify-center py-8">
              <Loader />
            </div>
          ) : (
            <form onSubmit={submitHandler} className="space-y-6">
              
              {/* Champ Email */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <label htmlFor="email" className="text-white font-semibold mb-2 block text-sm">
                  📧 Adresse e-mail
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 text-white border border-white/20 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 outline-none transition-all duration-300 placeholder-gray-400 backdrop-blur-sm"
                />
              </motion.div>

              {/* Champ Mot de passe */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <label htmlFor="password" className="text-white font-semibold mb-2 block text-sm">
                  🔒 Mot de passe
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  placeholder="Votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 text-white border border-white/20 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 outline-none transition-all duration-300 placeholder-gray-400 backdrop-blur-sm"
                />
              </motion.div>

              {/* Bouton de connexion */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <motion.button
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 10px 30px rgba(250, 204, 21, 0.3)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-4 rounded-xl font-bold text-black bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 shadow-lg relative overflow-hidden group"
                >
                  {/* Effet de brillance */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <motion.span
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      ⚽
                    </motion.span>
                    Se connecter
                  </span>
                </motion.button>
              </motion.div>
            </form>
          )}

          {/* Lien inscription */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-8 text-center text-white/80 text-sm"
          >
            Nouveau joueur ?{" "}
            <Link
              href={`/register?redirect=${redirect}`}
              className="text-yellow-300 hover:text-yellow-200 font-semibold underline underline-offset-4 transition-colors"
            >
              Créez un compte
            </Link>
          </motion.div>

          {/* Lien retour accueil */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-4 text-center"
          >
            <Link
              href="/"
              className="text-white/60 hover:text-white text-sm transition-colors flex items-center justify-center gap-1"
            >
              ← Retour à l'accueil
            </Link>
          </motion.div>
        </motion.div>

        {/* Styles pour l'animation du texte */}
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

