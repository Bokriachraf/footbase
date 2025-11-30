"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import StadiumBackground from "@/components/StadiumBackground";

export default function HomePage() {
  return (
    <StadiumBackground>
      {/* Contenu principal centré */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        
        {/* Ballon animé au centre */}
        <motion.div
          className="mb-8"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "backOut" }}
        >
          <motion.div
            animate={{ 
              rotate: 360,
              y: [0, -20, 0]
            }}
            transition={{ 
              rotate: { duration: 3, repeat: Infinity, ease: "linear" },
              y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
            className="text-6xl md:text-8xl"
          >
            ⚽
          </motion.div>
        </motion.div>

        {/* Titre principal avec EFFET HERBE RÉALISTE AMÉLIORÉ */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-center mb-6 relative"
        >
          {/* Container principal du titre */}
          <div className="relative inline-block">
            <motion.h1
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 1.2, 
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="text-5xl md:text-7xl lg:text-8xl font-black mb-4 leading-tight relative z-10"
              style={{
                background: "linear-gradient(135deg, #0f5c2f 0%, #1a7a3f 15%, #2d9c5a 25%, #facc15 35%, #2d9c5a 45%, #1a7a3f 60%, #0f5c2f 75%, #facc15 85%, #0f5c2f 100%)",
                backgroundSize: "400% 400%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textShadow: `
                  0 2px 10px rgba(0,0,0,0.6),
                  0 4px 20px rgba(0,0,0,0.4),
                  0 8px 30px rgba(34, 197, 94, 0.3),
                  0 0 40px rgba(250, 204, 21, 0.2),
                  0 0 60px rgba(34, 197, 94, 0.15)
                `,
                filter: "brightness(1.1) contrast(1.3)",
                animation: "grassShimmerEnhanced 3s ease-in-out infinite",
              }}
            >
              FOOTBASE
            </motion.h1>
            
            {/* Effet de brins d'herbe individuels - AMÉLIORÉ */}
            <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden rounded-lg">
              {Array.from({ length: 25 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute h-1 bg-gradient-to-b from-yellow-300 to-green-500 rounded-full"
                  style={{
                    left: `${(i / 24) * 100}%`,
                    top: `${Math.random() * 100}%`,
                    width: `${2 + Math.random() * 4}px`,
                    height: `${10 + Math.random() * 20}px`,
                    opacity: 0.3 + Math.random() * 0.4,
                    transform: `rotate(${-5 + Math.random() * 10}deg)`,
                  }}
                  animate={{
                    y: [0, -8, 0],
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: 1.5 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>

            {/* Texture d'herbe dense en overlay */}
            <div 
              className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-40 z-15"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 10% 20%, rgba(120, 220, 80, 0.6) 2px, transparent 2px),
                  radial-gradient(circle at 90% 40%, rgba(100, 200, 60, 0.5) 3px, transparent 3px),
                  radial-gradient(circle at 40% 70%, rgba(140, 240, 100, 0.7) 4px, transparent 4px),
                  radial-gradient(circle at 70% 10%, rgba(110, 210, 70, 0.4) 1px, transparent 1px),
                  radial-gradient(circle at 20% 90%, rgba(130, 230, 90, 0.5) 3px, transparent 3px),
                  radial-gradient(circle at 85% 85%, rgba(150, 250, 110, 0.3) 2px, transparent 2px),
                  radial-gradient(circle at 60% 30%, rgba(250, 204, 21, 0.4) 2px, transparent 2px),
                  radial-gradient(circle at 30% 60%, rgba(250, 204, 21, 0.3) 3px, transparent 3px)
                `,
                backgroundSize: "60px 60px, 80px 80px, 100px 100px, 40px 40px, 90px 90px, 70px 70px, 50px 50px, 110px 110px",
                animation: "grassFloatEnhanced 6s ease-in-out infinite",
              }}
            />

            {/* Effet de profondeur avec motifs organiques */}
            <div 
              className="absolute inset-0 pointer-events-none mix-blend-soft-light opacity-50 z-5"
              style={{
                backgroundImage: `
                  linear-gradient(45deg, transparent 45%, rgba(34, 197, 94, 0.1) 50%, transparent 55%),
                  linear-gradient(-45deg, transparent 45%, rgba(250, 204, 21, 0.08) 50%, transparent 55%),
                  linear-gradient(90deg, transparent 48%, rgba(34, 197, 94, 0.05) 50%, transparent 52%)
                `,
                backgroundSize: "25px 25px, 30px 30px, 40px 40px",
                animation: "organicMovement 8s ease-in-out infinite",
              }}
            />
          </div>
          
          {/* Ligne de séparation animée */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="w-48 h-1 bg-gradient-to-r from-green-400 via-yellow-400 to-green-400 mx-auto rounded-full mb-6 mt-4"
            style={{
              backgroundSize: "200% 100%",
              animation: "lineShimmer 2s ease-in-out infinite",
            }}
          />
          
          <h2 className="text-2xl md:text-3xl font-bold text-white/90 mb-2">
            Votre terrain, 
            <span className="text-yellow-300"> votre communauté</span>
          </h2>
        </motion.div>

        {/* Sous-titre avec effet de frappe */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto mb-12 text-center text-white/80 leading-relaxed font-medium"
        >
          L'application qui transforme votre passion du football en 
          <span className="text-green-300 font-semibold"> expérience organisée</span>. 
          Gérez les matchs, les joueurs et les statistiques comme un pro.
        </motion.p>

        {/* Styles CSS pour les nouvelles animations */}
        <style jsx>{`
          @keyframes grassShimmerEnhanced {
            0%, 100% { 
              background-position: 0% 50%;
              filter: brightness(1.1) contrast(1.3);
            }
            25% { 
              background-position: 50% 25%;
              filter: brightness(1.2) contrast(1.4);
            }
            50% { 
              background-position: 100% 50%;
              filter: brightness(1.3) contrast(1.5);
            }
            75% { 
              background-position: 50% 75%;
              filter: brightness(1.2) contrast(1.4);
            }
          }
          
          @keyframes grassFloatEnhanced {
            0%, 100% { 
              transform: translateY(0px) translateX(0px) scale(1);
              opacity: 0.4;
            }
            33% { 
              transform: translateY(-4px) translateX(3px) scale(1.02);
              opacity: 0.6;
            }
            66% { 
              transform: translateY(3px) translateX(-4px) scale(0.98);
              opacity: 0.3;
            }
          }

          @keyframes organicMovement {
            0%, 100% { 
              background-position: 0% 0%, 0% 0%, 0% 0%;
            }
            25% { 
              background-position: 10px 5px, -5px 10px, 5px -5px;
            }
            50% { 
              background-position: 20px 10px, -10px 20px, 10px -10px;
            }
            75% { 
              background-position: 10px 15px, -15px 10px, 15px -5px;
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

        {/* Boutons d'action */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
        >
          <Link href="/inscription" className="group">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 rounded-2xl text-xl font-bold bg-gradient-to-r from-green-500 to-green-600 text-white shadow-2xl hover:shadow-green-500/25 transition-all duration-300 group-hover:from-green-600 group-hover:to-green-700 flex items-center gap-3"
            >
              <span>🚀</span>
              Commencer Maintenant
            </motion.button>
          </Link>

          <Link href="/apropos" className="group">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 rounded-2xl text-xl font-bold border-2 border-green-400 text-green-300 hover:bg-green-400 hover:text-white transition-all duration-300 backdrop-blur-sm bg-white/5 flex items-center gap-3"
            >
              <span>ℹ️</span>
              Découvrir Plus
            </motion.button>
          </Link>
        </motion.div>

        {/* Features rapides */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16"
        >
          {[
            { icon: "👥", title: "Gestion d'Équipe", desc: "Organisez vos joueurs" },
            { icon: "📅", title: "Planning Intelligent", desc: "Planifiez les matchs" },
            { icon: "⭐", title: "Évaluations", desc: "Suivez les performances" }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/20 hover:border-green-400/30 transition-all duration-300"
            >
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-white/70 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Indication scroll */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="absolute bottom-10 text-center"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-white/60 text-sm mb-2 flex flex-col items-center gap-1"
          >
            <span>Découvrez l'expérience</span>
            <div className="text-lg">⬇️</div>
          </motion.div>
        </motion.div>
      </div>

      {/* Section supplémentaire pour le scroll */}
      <div className="min-h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Prêt à <span className="text-green-300">révolutionner</span> votre football ?
          </h2>
          <p className="text-xl text-white/80 mb-8 leading-relaxed">
            Rejoignez des milliers de joueurs et propriétaires de terrains qui utilisent déjà FootBase pour organiser leurs matchs et développer leur communauté footballistique.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signin">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
              >
                👟 Espace Joueur
              </motion.button>
            </Link>
            
            <Link href="/proprietaire/signin">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transition-all duration-300"
              >
                ⚽ Espace Propriétaire
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </StadiumBackground>
  );
}

