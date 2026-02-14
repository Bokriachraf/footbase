"use client";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import Link from "next/link";
import { useRouter } from "next/navigation";
import StadiumBackground from "@/components/StadiumBackground";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const footballeurSignin = useSelector((state) => state.footballeurSignin || {});
    const { footballeurInfo } = footballeurSignin;
     const proprietaireSignin = useSelector((state) => state.proprietaireSignin || {});
    const { proprietaireInfo } = proprietaireSignin;
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  const [isBallonHovered, setIsBallonHovered] = useState(false);
  const [activeFeature, setActiveFeature] = useState(null);
  const router = useRouter();

  // Animations parallax améliorées
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.98]);
  const smoothScale = useSpring(scale, { stiffness: 100, damping: 30 });

  // Effet de particules de stade
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    // Générer des particules pour l'effet foule
    const newParticles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 40,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.4 + 0.1,
      duration: Math.random() * 4 + 2,
      delay: Math.random() * 2
    }));
    setParticles(newParticles);
  }, []);

  // Ballons flottants
  const floatingBalls = [
    { id: 1, x: "10%", y: "15%", delay: 0, size: "text-2xl" },
    { id: 2, x: "85%", y: "25%", delay: 0.4, size: "text-xl" },
    { id: 3, x: "20%", y: "80%", delay: 0.8, size: "text-3xl" },
    { id: 4, x: "75%", y: "70%", delay: 1.2, size: "text-2xl" }
  ];

  // Features améliorées avec animations
  const features = [
    { 
      icon: "👥", 
      title: "Gestion d'Équipe", 
      desc: "Organisez vos joueurs intelligemment",
      color: "from-green-500/20 to-green-600/20",
      hoverColor: "from-green-500/30 to-green-600/30",
      emojiAnimation: "👥→🤝→👥"
    },
    { 
      icon: "📅", 
      title: "Planning Intelligent", 
      desc: "Planifiez vos matchs en quelques clics",
      color: "from-blue-500/20 to-blue-600/20",
      hoverColor: "from-blue-500/30 to-blue-600/30",
      emojiAnimation: "📅→✅→📅"
    },
    { 
      icon: "⭐", 
      title: "Évaluations Pro", 
      desc: "Suivez les performances détaillées",
      color: "from-yellow-500/20 to-yellow-600/20",
      hoverColor: "from-yellow-500/30 to-yellow-600/30",
      emojiAnimation: "⭐→📊→⭐"
    }
  ];

  const stats = [
    { value: "500+", label: "Matchs Organisés", icon: "⚽", suffix: "" },
    { value: "1K+", label: "Joueurs Actifs", icon: "👟", suffix: "" },
    { value: "50+", label: "Terrains", icon: "🏟️", suffix: "" },
    { value: "4.8", label: "Satisfaction", icon: "⭐", suffix: "/5" }
  ];

  // Sections pour établissements et entreprises
  const professionalSections = [
    {
      id: 1,
      title: "Établissements Scolaires",
      description: "Sport interscolaire organisé",
      features: ["Gestion d'équipes scolaires", "Tournois interscolaires", "Suivi des performances"],
      icon: "🏫",
      color: "from-purple-500/20 to-purple-600/20",
      hoverColor: "from-purple-500/30 to-purple-600/30",
      link: "/etablissement",
      cta: "Gérer le sport scolaire"
    },
    {
      id: 2,
      title: "Entreprises & Sociétés",
      description: "Sport d'entreprise organisé",
      features: ["Tournois d'entreprise", "Team building sportif", "Clubs d'entreprise"],
      icon: "🏢",
      color: "from-indigo-500/20 to-indigo-600/20",
      hoverColor: "from-indigo-500/30 to-indigo-600/30",
      link: "/societe",
      cta: "Sport d'entreprise"
    }
  ];

  // Gestionnaire de clic pour déboguer
  const handleSectionClick = (link, title) => {
    console.log(`Navigation vers: ${link} - ${title}`);
    router.push(link);
  };

  return (
    <StadiumBackground>
      {/* Effet de foule animée (particules) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity
            }}
            animate={{
              y: [0, -10, 0],
              opacity: [particle.opacity, particle.opacity * 0.5, particle.opacity]
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Ballons flottants décoratifs */}
      {floatingBalls.map((ball) => (
        <motion.div
          key={ball.id}
          className={`fixed ${ball.size} opacity-10 pointer-events-none z-1`}
          style={{ left: ball.x, top: ball.y }}
          initial={{ y: 0, rotate: 0 }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            delay: ball.delay,
            ease: "easeInOut"
          }}
        >
          ⚽
        </motion.div>
      ))}

      <div ref={containerRef} className="relative z-10">
        {/* HERO SECTION - Optimisée mobile */}
        <motion.div
          style={{ scale: smoothScale }}
          className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 relative"
        >
          {/* Overlay de blur pour lisibilité */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40 backdrop-blur-[2px] pointer-events-none" />
          
          {/* Effet de lumière focalisée */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 2 }}
          >
            <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 md:w-96 h-64 md:h-96 bg-gradient-to-r from-green-500/10 via-yellow-500/5 to-green-500/10 rounded-full blur-3xl" />
          </motion.div>

          {/* Ballon principal avec effets améliorés */}
          <motion.div
            className="mb-6 md:mb-12 relative group"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              y: [0, -20, 0]
            }}
            transition={{ 
              scale: { duration: 1, ease: "backOut" },
              opacity: { duration: 1 },
              y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }}
            whileHover={{ 
              scale: 1.15,
              transition: { duration: 0.5 }
            }}
            onHoverStart={() => setIsBallonHovered(true)}
            onHoverEnd={() => setIsBallonHovered(false)}
          >
            {/* Effet d'aura autour du ballon */}
            <motion.div
              className="absolute -inset-6 md:-inset-8 bg-gradient-to-r from-green-500/20 to-yellow-500/20 rounded-full blur-xl"
              animate={isBallonHovered ? {
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              } : {
                scale: 1,
                opacity: 0.3
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            
            {/* Cercles concentriques animés */}
            <motion.div
              className="absolute -inset-4 md:-inset-6 border-4 border-green-400/20 rounded-full"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0, 0.3]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            
            <motion.div
              className="text-6xl md:text-9xl lg:text-[10rem] relative"
              animate={isBallonHovered ? { 
                rotate: 360,
              } : {}}
              transition={{ 
                rotate: { duration: 1.5, ease: "linear" }
              }}
            >
              ⚽
              {/* Reflets sur le ballon */}
              <motion.div
                className="absolute top-4 left-4 w-6 h-6 md:w-8 md:h-8 bg-white/30 rounded-full blur-sm"
                animate={{
                  x: [0, 10, 0],
                  y: [0, 5, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            
            {/* Étoiles tournantes autour du ballon */}
            {[0, 120, 240].map((rotation, i) => (
              <motion.div
                key={i}
                className="absolute text-yellow-400 text-base md:text-xl"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `rotate(${rotation}deg) translateX(40px) rotate(-${rotation}deg)`
                }}
                animate={{
                  rotate: 360,
                  scale: [1, 1.5, 1]
                }}
                transition={{
                  rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                  scale: { duration: 1.5, repeat: Infinity, delay: i * 0.3 }
                }}
              >
                ✨
              </motion.div>
            ))}
          </motion.div>
          {/* TITRE PRINCIPAL - Version HERBE POUSSANTE */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-center mb-6 md:mb-8 relative w-full px-2"
          >
            {/* Container principal du titre avec blur de fond */}
            <div className="relative inline-block px-4 py-2 md:px-6 md:py-3 rounded-3xl backdrop-blur-xl bg-black/30">
              <motion.h1
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 1.2, 
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="text-4xl md:text-7xl lg:text-8xl font-black mb-2 md:mb-4 leading-tight relative z-10"
                style={{
                  background: "linear-gradient(135deg, #0f5c2f 0%, #1a7a3f 15%, #2d9c5a 25%, #facc15 35%, #2d9c5a 45%, #1a7a3f 60%, #0f5c2f 75%, #facc15 85%, #0f5c2f 100%)",
                  backgroundSize: "400% 400%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  textShadow: `
                    0 2px 10px rgba(0,0,0,0.8),
                    0 4px 20px rgba(0,0,0,0.6),
                    0 8px 30px rgba(34, 197, 94, 0.4),
                    0 0 40px rgba(250, 204, 21, 0.3),
                    0 0 60px rgba(34, 197, 94, 0.2)
                  `,
                  filter: "brightness(1.1) contrast(1.3)",
                  animation: "grassShimmerEnhanced 3s ease-in-out infinite",
                }}
              >
                kickoora
              </motion.h1>
              
              {/* Effet de brins d'herbe individuels */}
              <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden rounded-lg">
                {Array.from({ length: 20 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute h-1 bg-gradient-to-b from-yellow-300 to-green-500 rounded-full"
                    style={{
                      left: `${(i / 19) * 100}%`,
                      top: `${Math.random() * 100}%`,
                      width: `${1 + Math.random() * 3}px`,
                      height: `${8 + Math.random() * 16}px`,
                      opacity: 0.3 + Math.random() * 0.4,
                      transform: `rotate(${-5 + Math.random() * 10}deg)`,
                    }}
                    animate={{
                      y: [0, -6, 0],
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
            </div>
            
            {/* Ligne de séparation animée améliorée */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="relative w-32 md:w-48 lg:w-64 h-1 mx-auto rounded-full my-4 md:my-6 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-yellow-400 to-green-400" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                animate={{
                  x: ["-100%", "100%"]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </motion.div>
            
            {/* Tagline avec animation séquentielle */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="backdrop-blur-lg bg-black/20 rounded-2xl px-4 py-3 md:px-6 md:py-4"
            >
              <h2 className="text-xl md:text-3xl font-bold text-white/95 mb-1">
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 }}
                  className="text-white"
                >
                  Votre terrain,
                </motion.span>
                {" "}
                <motion.span
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1 }}
                  className="text-yellow-300 bg-gradient-to-r from-yellow-300 to-yellow-400 bg-clip-text text-transparent"
                >
                  votre communauté
                </motion.span>
              </h2>
            </motion.div>
          </motion.div>

          {/* Sous-titre avec effet de révélation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="max-w-3xl mx-auto mb-8 md:mb-12 px-4"
          >
            <div className="backdrop-blur-lg bg-black/20 rounded-2xl p-4 md:p-6">
              <p className="text-base md:text-xl lg:text-2xl text-center text-white/90 leading-relaxed font-medium">
     <div>         
 <Link href="/competition">
    <Button className="bg-gradient-to-r from-green-500 to-yellow-600 hover:from-green-600 hover:to-yellow-400 text-white px-2 py-1 text-sm shadow-xl">
      🏆 Voir les compétitions
    </Button>
  </Link>
</div>

                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="inline-block"
                >
                  L'application qui transforme votre passion du football
                </motion.span>
                <br />
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4 }}
                  className="inline-block"
                >
                  en <span className="text-green-300 font-semibold">expérience organisée</span>.
                </motion.span>
              </p>
            </div>
          </motion.div>

          {/* STATISTIQUES ANIMÉES - Optimisé mobile */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-8 max-w-5xl mx-auto mb-8 md:mb-12 px-2"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 1.8 + index * 0.15,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -5,
                  transition: { duration: 0.3 }
                }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl md:rounded-2xl p-3 md:p-4 lg:p-6 text-center hover:border-green-400/30 transition-all duration-300 group relative overflow-hidden z-20"
                onMouseEnter={() => setActiveFeature(index)}
                onMouseLeave={() => setActiveFeature(null)}
              >
                {/* Effet de fond au survol */}
                <div className={`absolute inset-0 bg-gradient-to-br from-green-500/0 via-green-500/5 to-green-500/0 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300`} />
                
                <div className="text-2xl md:text-3xl mb-1 md:mb-2">{stat.icon}</div>
                <div className="flex items-baseline justify-center gap-1 mb-1 md:mb-2">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2 + index * 0.1 }}
                    className="text-xl md:text-2xl lg:text-4xl font-bold bg-gradient-to-r from-yellow-400 to-green-400 bg-clip-text text-transparent"
                  >
                    {stat.value}
                  </motion.div>
                  {stat.suffix && (
                    <span className="text-white/70 text-sm md:text-lg">{stat.suffix}</span>
                  )}
                </div>
                <div className="text-white/80 text-xs md:text-sm">{stat.label}</div>
                
                {/* Barre de croissance animée */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-yellow-400 rounded-b-xl md:rounded-b-2xl"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: activeFeature === index ? 1 : 0 }}
                  transition={{ duration: 0.5 }}
                />
              </motion.div>
            ))}
          </motion.div>

         {!footballeurInfo && !proprietaireInfo && (
          <motion.section>
             {/* BOUTONS CTA AMÉLIORÉS - Optimisé mobile */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 2.2 }}
            className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center mb-12 md:mb-16 px-4 w-full max-w-2xl z-20"
          >
            <Link href="/register" className="group relative w-full sm:w-auto z-30">
              {/* Effet d'aura */}
              <motion.div
                className="absolute -inset-2 md:-inset-3 bg-gradient-to-r from-green-500 to-yellow-500 rounded-3xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  y: -5,
                  boxShadow: "0 25px 50px rgba(34, 197, 94, 0.4)"
                }}
                whileTap={{ scale: 0.98 }}
                className="relative w-full px-6 py-4 md:px-10 md:py-5 rounded-2xl text-lg md:text-xl font-bold bg-gradient-to-r from-green-500 to-green-600 text-white shadow-2xl group-hover:from-green-600 group-hover:to-green-700 transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden"
              >
                {/* Effet de traînée lumineuse */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.8 }}
                />
                <motion.span
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="text-xl md:text-2xl"
                >
                  🚀
                </motion.span>
                <span className="relative">Commencer Maintenant</span>
              </motion.button>
            </Link>

            <Link href="/" className="group w-full sm:w-auto z-30">
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  y: -5,
                  boxShadow: "0 20px 40px rgba(250, 204, 21, 0.3)"
                }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-6 py-4 md:px-10 md:py-5 rounded-2xl text-lg md:text-xl font-bold border-2 border-yellow-400 text-yellow-300 hover:bg-yellow-400/10 transition-all duration-300 backdrop-blur-lg bg-white/5 flex items-center justify-center gap-3 relative overflow-hidden group"
              >
                <motion.span
                  animate={{ rotate: [0, 10, 0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-xl md:text-2xl"
                >
                  ✨
                </motion.span>
                <span>Découvrir Plus</span>
                {/* Effet de bordure animée */}
                <div className="absolute inset-0 border-2 border-yellow-400/0 group-hover:border-yellow-400/50 rounded-2xl transition-all duration-500" />
              </motion.button>
            </Link>
          </motion.div>
          </motion.section>
         )}

          {/* FEATURES AVEC ANIMATIONS DE STADE */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto mb-12 md:mb-16 px-4 z-20"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                  duration: 0.5, 
                  delay: 2.6 + index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -5,
                  transition: { duration: 0.3 }
                }}
                className={`bg-gradient-to-br ${feature.color} backdrop-blur-xl border border-white/20 rounded-2xl p-4 md:p-6 text-center hover:border-white/40 transition-all duration-300 relative overflow-hidden group z-20`}
                onMouseEnter={() => setActiveFeature(index)}
                onMouseLeave={() => setActiveFeature(null)}
              >
                {/* Effet de lumière au survol */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.hoverColor} opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300`} />
                
                <motion.div
                  animate={activeFeature === index ? {
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, 0]
                  } : {}}
                  transition={{ duration: 0.5 }}
                  className="text-3xl md:text-4xl lg:text-5xl mb-3 md:mb-4 relative z-10"
                >
                  {feature.icon}
                </motion.div>
                
                <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3 relative z-10">
                  {feature.title}
                </h3>
                <p className="text-white/70 text-sm md:text-base relative z-10">
                  {feature.desc}
                </p>
                
                {/* Effet de traînée */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                  initial={{ x: "-100%" }}
                  animate={{ x: activeFeature === index ? "100%" : "-100%" }}
                  transition={{ duration: 0.8 }}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* INDICATION SCROLL AMÉLIORÉE */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 3 }}
            className="absolute bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 z-30"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center gap-1 md:gap-2 cursor-pointer group"
              onClick={() => {
                const nextSection = document.querySelector('#second-section');
                nextSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span className="text-white/70 text-xs md:text-sm group-hover:text-white transition-colors">
                Explorer plus
              </span>
              <motion.div
                animate={{ 
                  y: [0, 3, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-lg md:text-2xl"
              >
                ⬇️
              </motion.div>
              {/* Cercle pulsant amélioré */}
              <motion.div
                className="absolute -inset-3 md:-inset-4 border-2 border-white/30 rounded-full"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.2, 0, 0.2]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* SECOND SECTION - Pour établissements et entreprises */}
        <motion.div
          id="second-section"
          style={{ y: y2 }}
          className="min-h-screen flex items-center justify-center px-4 sm:px-6 relative py-12 md:py-0"
        >
          {/* Overlay de blur pour cette section */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50 backdrop-blur-[3px] pointer-events-none" />
          
          <div className="max-w-6xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              {/* Trophée animé */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, type: "spring" }}
                className="inline-block mb-6 md:mb-8"
              >
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 5, 0, -5, 0]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="text-5xl md:text-7xl bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 bg-clip-text text-transparent"
                >
                  🏆
                </motion.div>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 md:mb-8"
              >
                <span className="bg-gradient-to-r from-green-300 via-yellow-300 to-green-300 bg-clip-text text-transparent">
                  Kickoora Pro
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="text-lg md:text-xl lg:text-2xl text-white/80 mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed backdrop-blur-lg bg-black/20 rounded-2xl p-4 md:p-6"
              >
                Solutions adaptées pour les établissements scolaires et les entreprises.
                Organisez vos activités sportives de manière professionnelle.
              </motion.p>

              {/* Sections pour établissements et entreprises */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
                {professionalSections.map((section, index) => (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7 + index * 0.2 }}
                    whileHover={{ 
                      scale: 1.03,
                      y: -5,
                      transition: { duration: 0.3 }
                    }}
                    className={`bg-gradient-to-br ${section.color} backdrop-blur-xl border border-white/20 rounded-2xl p-5 md:p-6 hover:border-white/40 transition-all duration-300 relative overflow-hidden group z-30`}
                  >
                    <div className="flex flex-col h-full relative z-40">
                      <div className="flex items-center gap-3 md:gap-4 mb-4">
                        <div className="text-4xl md:text-5xl">{section.icon}</div>
                        <div>
                          <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
                            {section.title}
                          </h3>
                          <p className="text-white/70 text-sm md:text-base">
                            {section.description}
                          </p>
                        </div>
                      </div>
                      
                      <ul className="space-y-2 mb-6 flex-1">
                        {section.features.map((feature, idx) => (
                          <motion.li
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.9 + (index * 0.3) + (idx * 0.1) }}
                            className="flex items-center gap-2 text-white/80 text-sm md:text-base"
                          >
                            <span className="text-green-400">✓</span>
                            {feature}
                          </motion.li>
                        ))}
                      </ul>
                      
                      <div className="mt-auto relative z-50">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleSectionClick(section.link, section.title)}
                          className="w-full py-3 px-4 rounded-xl font-bold bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 text-white border border-white/20 transition-all duration-300 group relative overflow-hidden"
                        >
                          <span className="flex items-center justify-center gap-2 relative z-10">
                            {section.cta}
                            <motion.span
                              animate={{ x: [0, 5, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                              className="text-lg"
                            >
                              →
                            </motion.span>
                          </span>
                          {/* Effet de traînée sur le bouton */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                            initial={{ x: "-100%" }}
                            whileHover={{ x: "100%" }}
                            transition={{ duration: 0.8 }}
                          />
                        </motion.button>
                      </div>
                    </div>
                    
                    {/* Effet de lumière au survol */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${section.hoverColor} opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300`} />
                  </motion.div>
                ))}
              </div>

              {/* Boutons finaux avec effet stade */}
            {!footballeurInfo && !proprietaireInfo && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1.1, type: "spring" }}
                className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center z-30"
              >
                <Link href="/signin" className="group relative w-full sm:w-auto z-40">
                  <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/30 to-blue-600/30 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative w-full px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-2xl flex items-center justify-center gap-3 group"
                  >
                    <motion.span
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-xl"
                    >
                      👟
                    </motion.span>
                    <span>Espace Joueur</span>
                  </motion.button>
                </Link>
                
                <Link href="/proprietaire/signin" className="group relative w-full sm:w-auto z-40">
                  <div className="absolute -inset-2 bg-gradient-to-r from-green-500/30 to-green-600/30 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative w-full px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-2xl flex items-center justify-center gap-3 group"
                  >
                    <motion.span
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="text-xl"
                    >
                      ⚽
                    </motion.span>
                    <span>Espace Propriétaire</span>
                  </motion.button>
                </Link>
              </motion.div>
)}
              {/* Message d'encouragement */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1.3 }}
                className="mt-8 md:mt-12 text-white/60 text-sm md:text-base backdrop-blur-lg bg-black/20 rounded-2xl p-3 md:p-4 inline-block"
              >
                ⚡ L'aventure commence ici
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Styles CSS */}
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
        
        /* Optimisations pour mobile */
        @media (max-width: 640px) {
          .text-4xl {
            font-size: 2.5rem;
          }
          .text-6xl {
            font-size: 4rem;
          }
        }
      `}</style>
    </StadiumBackground>
  );
}




// "use client";
// import { motion, useScroll, useTransform, useSpring } from "framer-motion";
// import { useRef, useState, useEffect } from "react";
// import Link from "next/link";
// import StadiumBackground from "@/components/StadiumBackground";

// export default function HomePage() {
//   const containerRef = useRef(null);
//   const { scrollYProgress } = useScroll({
//     target: containerRef,
//     offset: ["start start", "end end"]
//   });
  
//   const [isBallonHovered, setIsBallonHovered] = useState(false);
//   const [activeFeature, setActiveFeature] = useState(null);

//   // Animations parallax améliorées
//   const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
//   const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
//   const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.98]);
//   const smoothScale = useSpring(scale, { stiffness: 100, damping: 30 });

//   // Effet de particules de stade
//   const [particles, setParticles] = useState([]);
  
//   useEffect(() => {
//     // Générer des particules pour l'effet foule
//     const newParticles = Array.from({ length: 15 }).map((_, i) => ({
//       id: i,
//       x: Math.random() * 100,
//       y: Math.random() * 40,
//       size: Math.random() * 3 + 1,
//       opacity: Math.random() * 0.4 + 0.1,
//       duration: Math.random() * 4 + 2,
//       delay: Math.random() * 2
//     }));
//     setParticles(newParticles);
//   }, []);

//   // Ballons flottants
//   const floatingBalls = [
//     { id: 1, x: "10%", y: "15%", delay: 0, size: "text-2xl" },
//     { id: 2, x: "85%", y: "25%", delay: 0.4, size: "text-xl" },
//     { id: 3, x: "20%", y: "80%", delay: 0.8, size: "text-3xl" },
//     { id: 4, x: "75%", y: "70%", delay: 1.2, size: "text-2xl" }
//   ];

//   // Features améliorées avec animations
//   const features = [
//     { 
//       icon: "👥", 
//       title: "Gestion d'Équipe", 
//       desc: "Organisez vos joueurs intelligemment",
//       color: "from-green-500/20 to-green-600/20",
//       hoverColor: "from-green-500/30 to-green-600/30",
//       emojiAnimation: "👥→🤝→👥"
//     },
//     { 
//       icon: "📅", 
//       title: "Planning Intelligent", 
//       desc: "Planifiez vos matchs en quelques clics",
//       color: "from-blue-500/20 to-blue-600/20",
//       hoverColor: "from-blue-500/30 to-blue-600/30",
//       emojiAnimation: "📅→✅→📅"
//     },
//     { 
//       icon: "⭐", 
//       title: "Évaluations Pro", 
//       desc: "Suivez les performances détaillées",
//       color: "from-yellow-500/20 to-yellow-600/20",
//       hoverColor: "from-yellow-500/30 to-yellow-600/30",
//       emojiAnimation: "⭐→📊→⭐"
//     }
//   ];

//   const stats = [
//     { value: "500+", label: "Matchs Organisés", icon: "⚽", suffix: "" },
//     { value: "1K+", label: "Joueurs Actifs", icon: "👟", suffix: "" },
//     { value: "50+", label: "Terrains", icon: "🏟️", suffix: "" },
//     { value: "4.8", label: "Satisfaction", icon: "⭐", suffix: "/5" }
//   ];

//   // Sections pour établissements et entreprises
//   const professionalSections = [
//     {
//       id: 1,
//       title: "Établissements Scolaires",
//       description: "Sport interscolaire organisé",
//       features: ["Gestion d'équipes scolaires", "Tournois interscolaires", "Suivi des performances"],
//       icon: "🏫",
//       color: "from-purple-500/20 to-purple-600/20",
//       hoverColor: "from-purple-500/30 to-purple-600/30",
//       link: "/etablissement",
//       cta: "Gérer le sport scolaire"
//     },
//     {
//       id: 2,
//       title: "Entreprises & Sociétés",
//       description: "Sport d'entreprise organisé",
//       features: ["Tournois d'entreprise", "Team building sportif", "Clubs d'entreprise"],
//       icon: "🏢",
//       color: "from-indigo-500/20 to-indigo-600/20",
//       hoverColor: "from-indigo-500/30 to-indigo-600/30",
//       link: "/societe",
//       cta: "Sport d'entreprise"
//     }
//   ];

//   return (
//     <StadiumBackground>
//       {/* Effet de foule animée (particules) */}
//       <div className="fixed inset-0 pointer-events-none z-0">
//         {particles.map((particle) => (
//           <motion.div
//             key={particle.id}
//             className="absolute w-1 h-1 bg-white rounded-full"
//             style={{
//               left: `${particle.x}%`,
//               top: `${particle.y}%`,
//               width: `${particle.size}px`,
//               height: `${particle.size}px`,
//               opacity: particle.opacity
//             }}
//             animate={{
//               y: [0, -10, 0],
//               opacity: [particle.opacity, particle.opacity * 0.5, particle.opacity]
//             }}
//             transition={{
//               duration: particle.duration,
//               repeat: Infinity,
//               delay: particle.delay,
//               ease: "easeInOut"
//             }}
//           />
//         ))}
//       </div>

//       {/* Ballons flottants décoratifs */}
//       {floatingBalls.map((ball) => (
//         <motion.div
//           key={ball.id}
//           className={`fixed ${ball.size} opacity-10 pointer-events-none z-1`}
//           style={{ left: ball.x, top: ball.y }}
//           initial={{ y: 0, rotate: 0 }}
//           animate={{
//             y: [0, -30, 0],
//             rotate: [0, 180, 360],
//             scale: [1, 1.1, 1]
//           }}
//           transition={{
//             duration: 5,
//             repeat: Infinity,
//             delay: ball.delay,
//             ease: "easeInOut"
//           }}
//         >
//           ⚽
//         </motion.div>
//       ))}

//       <div ref={containerRef} className="relative z-10">
//         {/* HERO SECTION - Optimisée mobile */}
//         <motion.div
//           style={{ scale: smoothScale }}
//           className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 relative overflow-hidden "
//         >
//           {/* Overlay de blur pour lisibilité */}
//           <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40 backdrop-blur-[2px] pointer-events-none" />
          
//           {/* Effet de lumière focalisée */}
//           <motion.div
//             className="absolute inset-0 pointer-events-none"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 0.3 }}
//             transition={{ duration: 2 }}
//           >
//             <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 md:w-96 h-64 md:h-96 bg-gradient-to-r from-green-500/10 via-yellow-500/5 to-green-500/10 rounded-full blur-3xl" />
//           </motion.div>

//           {/* Ballon principal avec effets améliorés */}
//           <motion.div
//             className="mb-6 md:mb-12 relative group"
//             initial={{ scale: 0, opacity: 0 }}
//             animate={{ 
//               scale: 1, 
//               opacity: 1,
//               y: [0, -20, 0]
//             }}
//             transition={{ 
//               scale: { duration: 1, ease: "backOut" },
//               opacity: { duration: 1 },
//               y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
//             }}
//             whileHover={{ 
//               scale: 1.15,
//               transition: { duration: 0.5 }
//             }}
//             onHoverStart={() => setIsBallonHovered(true)}
//             onHoverEnd={() => setIsBallonHovered(false)}
//           >
//             {/* Effet d'aura autour du ballon */}
//             <motion.div
//               className="absolute -inset-6 md:-inset-8 bg-gradient-to-r from-green-500/20 to-yellow-500/20 rounded-full blur-xl"
//               animate={isBallonHovered ? {
//                 scale: [1, 1.2, 1],
//                 opacity: [0.3, 0.6, 0.3]
//               } : {
//                 scale: 1,
//                 opacity: 0.3
//               }}
//               transition={{ duration: 2, repeat: Infinity }}
//             />
            
//             {/* Cercles concentriques animés */}
//             <motion.div
//               className="absolute -inset-4 md:-inset-6 border-4 border-green-400/20 rounded-full"
//               animate={{
//                 scale: [1, 1.3, 1],
//                 opacity: [0.3, 0, 0.3]
//               }}
//               transition={{ duration: 3, repeat: Infinity }}
//             />
            
//             <motion.div
//               className="text-6xl md:text-9xl lg:text-[10rem] relative"
//               animate={isBallonHovered ? { 
//                 rotate: 360,
//               } : {}}
//               transition={{ 
//                 rotate: { duration: 1.5, ease: "linear" }
//               }}
//             >
//               ⚽
//               {/* Reflets sur le ballon */}
//               <motion.div
//                 className="absolute top-4 left-4 w-6 h-6 md:w-8 md:h-8 bg-white/30 rounded-full blur-sm"
//                 animate={{
//                   x: [0, 10, 0],
//                   y: [0, 5, 0]
//                 }}
//                 transition={{ duration: 2, repeat: Infinity }}
//               />
//             </motion.div>
            
//             {/* Étoiles tournantes autour du ballon */}
//             {[0, 120, 240].map((rotation, i) => (
//               <motion.div
//                 key={i}
//                 className="absolute text-yellow-400 text-base md:text-xl"
//                 style={{
//                   left: '50%',
//                   top: '50%',
//                   transform: `rotate(${rotation}deg) translateX(40px) rotate(-${rotation}deg)`
//                 }}
//                 animate={{
//                   rotate: 360,
//                   scale: [1, 1.5, 1]
//                 }}
//                 transition={{
//                   rotate: { duration: 4, repeat: Infinity, ease: "linear" },
//                   scale: { duration: 1.5, repeat: Infinity, delay: i * 0.3 }
//                 }}
//               >
//                 ✨
//               </motion.div>
//             ))}
//           </motion.div>

//           {/* TITRE PRINCIPAL - Version HERBE POUSSANTE */}
//           <motion.div
//             initial={{ y: 30, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             transition={{ duration: 1, delay: 0.3 }}
//             className="text-center mb-6 md:mb-8 relative w-full px-2"
//           >
//             {/* Container principal du titre avec blur de fond */}
//             <div className="relative inline-block px-4 py-2 md:px-6 md:py-3 rounded-3xl backdrop-blur-xl bg-black/30">
//               <motion.h1
//                 initial={{ opacity: 0, scale: 0.8 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ 
//                   duration: 1.2, 
//                   ease: [0.25, 0.46, 0.45, 0.94],
//                 }}
//                 className="text-4xl md:text-7xl lg:text-8xl font-black mb-2 md:mb-4 leading-tight relative z-10"
//                 style={{
//                   background: "linear-gradient(135deg, #0f5c2f 0%, #1a7a3f 15%, #2d9c5a 25%, #facc15 35%, #2d9c5a 45%, #1a7a3f 60%, #0f5c2f 75%, #facc15 85%, #0f5c2f 100%)",
//                   backgroundSize: "400% 400%",
//                   WebkitBackgroundClip: "text",
//                   WebkitTextFillColor: "transparent",
//                   backgroundClip: "text",
//                   textShadow: `
//                     0 2px 10px rgba(0,0,0,0.8),
//                     0 4px 20px rgba(0,0,0,0.6),
//                     0 8px 30px rgba(34, 197, 94, 0.4),
//                     0 0 40px rgba(250, 204, 21, 0.3),
//                     0 0 60px rgba(34, 197, 94, 0.2)
//                   `,
//                   filter: "brightness(1.1) contrast(1.3)",
//                   animation: "grassShimmerEnhanced 3s ease-in-out infinite",
//                 }}
//               >
//                 FOOTBASE
//               </motion.h1>
              
//               {/* Effet de brins d'herbe individuels */}
//               <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden rounded-lg">
//                 {Array.from({ length: 20 }).map((_, i) => (
//                   <motion.div
//                     key={i}
//                     className="absolute h-1 bg-gradient-to-b from-yellow-300 to-green-500 rounded-full"
//                     style={{
//                       left: `${(i / 19) * 100}%`,
//                       top: `${Math.random() * 100}%`,
//                       width: `${1 + Math.random() * 3}px`,
//                       height: `${8 + Math.random() * 16}px`,
//                       opacity: 0.3 + Math.random() * 0.4,
//                       transform: `rotate(${-5 + Math.random() * 10}deg)`,
//                     }}
//                     animate={{
//                       y: [0, -6, 0],
//                       opacity: [0.3, 0.8, 0.3],
//                     }}
//                     transition={{
//                       duration: 1.5 + Math.random() * 2,
//                       repeat: Infinity,
//                       delay: Math.random() * 2,
//                       ease: "easeInOut",
//                     }}
//                   />
//                 ))}
//               </div>
//             </div>
            
//             {/* Ligne de séparation animée améliorée */}
//             <motion.div
//               initial={{ scaleX: 0 }}
//               animate={{ scaleX: 1 }}
//               transition={{ duration: 1, delay: 0.8 }}
//               className="relative w-32 md:w-48 lg:w-64 h-1 mx-auto rounded-full my-4 md:my-6 overflow-hidden"
//             >
//               <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-yellow-400 to-green-400" />
//               <motion.div
//                 className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
//                 animate={{
//                   x: ["-100%", "100%"]
//                 }}
//                 transition={{
//                   duration: 1.5,
//                   repeat: Infinity,
//                   ease: "linear"
//                 }}
//               />
//             </motion.div>
            
//             {/* Tagline avec animation séquentielle */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ duration: 0.8, delay: 0.9 }}
//               className="backdrop-blur-lg bg-black/20 rounded-2xl px-4 py-3 md:px-6 md:py-4"
//             >
//               <h2 className="text-xl md:text-3xl font-bold text-white/95 mb-1">
//                 <motion.span
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: 1 }}
//                   className="text-white"
//                 >
//                   Votre terrain,
//                 </motion.span>
//                 {" "}
//                 <motion.span
//                   initial={{ opacity: 0, x: 20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: 1.1 }}
//                   className="text-yellow-300 bg-gradient-to-r from-yellow-300 to-yellow-400 bg-clip-text text-transparent"
//                 >
//                   votre communauté
//                 </motion.span>
//               </h2>
//             </motion.div>
//           </motion.div>

//           {/* Sous-titre avec effet de révélation */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 1, delay: 0.6 }}
//             className="max-w-3xl mx-auto mb-8 md:mb-12 px-4"
//           >
//             <div className="backdrop-blur-lg bg-black/20 rounded-2xl p-4 md:p-6">
//               <p className="text-base md:text-xl lg:text-2xl text-center text-white/90 leading-relaxed font-medium">
//                 <motion.span
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ delay: 1.2 }}
//                   className="inline-block"
//                 >
//                   L'application qui transforme votre passion du football
//                 </motion.span>
//                 <br />
//                 <motion.span
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ delay: 1.4 }}
//                   className="inline-block"
//                 >
//                   en <span className="text-green-300 font-semibold">expérience organisée</span>.
//                 </motion.span>
//               </p>
//             </div>
//           </motion.div>

//           {/* STATISTIQUES ANIMÉES - Optimisé mobile */}
//           <motion.div
//             initial={{ opacity: 0, y: 40 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, delay: 1.6 }}
//             className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-8 max-w-5xl mx-auto mb-8 md:mb-12 px-2"
//           >
//             {stats.map((stat, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ scale: 0, rotate: -180 }}
//                 animate={{ scale: 1, rotate: 0 }}
//                 transition={{ 
//                   duration: 0.6, 
//                   delay: 1.8 + index * 0.15,
//                   type: "spring",
//                   stiffness: 100
//                 }}
//                 whileHover={{ 
//                   scale: 1.05, 
//                   y: -5,
//                   transition: { duration: 0.3 }
//                 }}
//                 className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl md:rounded-2xl p-3 md:p-4 lg:p-6 text-center hover:border-green-400/30 transition-all duration-300 group relative overflow-hidden"
//                 onMouseEnter={() => setActiveFeature(index)}
//                 onMouseLeave={() => setActiveFeature(null)}
//               >
//                 {/* Effet de fond au survol */}
//                 <div className={`absolute inset-0 bg-gradient-to-br from-green-500/0 via-green-500/5 to-green-500/0 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300`} />
                
//                 <div className="text-2xl md:text-3xl mb-1 md:mb-2">{stat.icon}</div>
//                 <div className="flex items-baseline justify-center gap-1 mb-1 md:mb-2">
//                   <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: 2 + index * 0.1 }}
//                     className="text-xl md:text-2xl lg:text-4xl font-bold bg-gradient-to-r from-yellow-400 to-green-400 bg-clip-text text-transparent"
//                   >
//                     {stat.value}
//                   </motion.div>
//                   {stat.suffix && (
//                     <span className="text-white/70 text-sm md:text-lg">{stat.suffix}</span>
//                   )}
//                 </div>
//                 <div className="text-white/80 text-xs md:text-sm">{stat.label}</div>
                
//                 {/* Barre de croissance animée */}
//                 <motion.div
//                   className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-yellow-400 rounded-b-xl md:rounded-b-2xl"
//                   initial={{ scaleX: 0 }}
//                   animate={{ scaleX: activeFeature === index ? 1 : 0 }}
//                   transition={{ duration: 0.5 }}
//                 />
//               </motion.div>
//             ))}
//           </motion.div>

//           {/* BOUTONS CTA AMÉLIORÉS - Optimisé mobile */}
//           <motion.div
//             initial={{ y: 30, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             transition={{ duration: 0.8, delay: 2.2 }}
//             className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center mb-12 md:mb-16 px-4 w-full max-w-2xl"
//           >
//             <Link href="/inscription" className="group relative w-full sm:w-auto">
//               {/* Effet d'aura */}
//               <motion.div
//                 className="absolute -inset-2 md:-inset-3 bg-gradient-to-r from-green-500 to-yellow-500 rounded-3xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"
//                 animate={{
//                   scale: [1, 1.1, 1],
//                 }}
//                 transition={{ duration: 2, repeat: Infinity }}
//               />
              
//               <motion.button
//                 whileHover={{ 
//                   scale: 1.05,
//                   y: -5,
//                   boxShadow: "0 25px 50px rgba(34, 197, 94, 0.4)"
//                 }}
//                 whileTap={{ scale: 0.98 }}
//                 className="relative w-full px-6 py-4 md:px-10 md:py-5 rounded-2xl text-lg md:text-xl font-bold bg-gradient-to-r from-green-500 to-green-600 text-white shadow-2xl group-hover:from-green-600 group-hover:to-green-700 transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden"
//               >
//                 {/* Effet de traînée lumineuse */}
//                 <motion.div
//                   className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12"
//                   initial={{ x: "-100%" }}
//                   whileHover={{ x: "100%" }}
//                   transition={{ duration: 0.8 }}
//                 />
//                 <motion.span
//                   animate={{ rotate: [0, 360] }}
//                   transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
//                   className="text-xl md:text-2xl"
//                 >
//                   🚀
//                 </motion.span>
//                 <span className="relative">Commencer Maintenant</span>
//               </motion.button>
//             </Link>

//             <Link href="/apropos" className="group w-full sm:w-auto">
//               <motion.button
//                 whileHover={{ 
//                   scale: 1.05,
//                   y: -5,
//                   boxShadow: "0 20px 40px rgba(250, 204, 21, 0.3)"
//                 }}
//                 whileTap={{ scale: 0.98 }}
//                 className="w-full px-6 py-4 md:px-10 md:py-5 rounded-2xl text-lg md:text-xl font-bold border-2 border-yellow-400 text-yellow-300 hover:bg-yellow-400/10 transition-all duration-300 backdrop-blur-lg bg-white/5 flex items-center justify-center gap-3 relative overflow-hidden group"
//               >
//                 <motion.span
//                   animate={{ rotate: [0, 10, 0, -10, 0] }}
//                   transition={{ duration: 3, repeat: Infinity }}
//                   className="text-xl md:text-2xl"
//                 >
//                   ✨
//                 </motion.span>
//                 <span>Découvrir Plus</span>
//                 {/* Effet de bordure animée */}
//                 <div className="absolute inset-0 border-2 border-yellow-400/0 group-hover:border-yellow-400/50 rounded-2xl transition-all duration-500" />
//               </motion.button>
//             </Link>
//           </motion.div>

//           {/* FEATURES AVEC ANIMATIONS DE STADE */}
//           <motion.div
//             initial={{ opacity: 0, y: 40 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, delay: 2.4 }}
//             className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto mb-12 md:mb-16 px-4"
//           >
//             {features.map((feature, index) => (
//               <motion.div
//                 key={feature.title}
//                 initial={{ opacity: 0, scale: 0.9, y: 20 }}
//                 animate={{ opacity: 1, scale: 1, y: 0 }}
//                 transition={{ 
//                   duration: 0.5, 
//                   delay: 2.6 + index * 0.1,
//                   type: "spring",
//                   stiffness: 100
//                 }}
//                 whileHover={{ 
//                   scale: 1.05, 
//                   y: -5,
//                   transition: { duration: 0.3 }
//                 }}
//                 className={`bg-gradient-to-br ${feature.color} backdrop-blur-xl border border-white/20 rounded-2xl p-4 md:p-6 text-center hover:border-white/40 transition-all duration-300 relative overflow-hidden group`}
//                 onMouseEnter={() => setActiveFeature(index)}
//                 onMouseLeave={() => setActiveFeature(null)}
//               >
//                 {/* Effet de lumière au survol */}
//                 <div className={`absolute inset-0 bg-gradient-to-br ${feature.hoverColor} opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300`} />
                
//                 <motion.div
//                   animate={activeFeature === index ? {
//                     scale: [1, 1.2, 1],
//                     rotate: [0, 5, 0]
//                   } : {}}
//                   transition={{ duration: 0.5 }}
//                   className="text-3xl md:text-4xl lg:text-5xl mb-3 md:mb-4 relative z-10"
//                 >
//                   {feature.icon}
//                 </motion.div>
                
//                 <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3 relative z-10">
//                   {feature.title}
//                 </h3>
//                 <p className="text-white/70 text-sm md:text-base relative z-10">
//                   {feature.desc}
//                 </p>
                
//                 {/* Effet de traînée */}
//                 <motion.div
//                   className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
//                   initial={{ x: "-100%" }}
//                   animate={{ x: activeFeature === index ? "100%" : "-100%" }}
//                   transition={{ duration: 0.8 }}
//                 />
//               </motion.div>
//             ))}
//           </motion.div>

//           {/* INDICATION SCROLL AMÉLIORÉE */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 1, delay: 3 }}
//             className="absolute bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2"
//           >
//             <motion.div
//               animate={{ y: [0, -10, 0] }}
//               transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
//               className="flex flex-col items-center gap-1 md:gap-2 cursor-pointer group"
//               onClick={() => {
//                 const nextSection = document.querySelector('#second-section');
//                 nextSection?.scrollIntoView({ behavior: 'smooth' });
//               }}
//             >
//               <span className="text-white/70 text-xs md:text-sm group-hover:text-white transition-colors">
//                 Explorer plus
//               </span>
//               <motion.div
//                 animate={{ 
//                   y: [0, 3, 0],
//                   scale: [1, 1.1, 1]
//                 }}
//                 transition={{ duration: 1.5, repeat: Infinity }}
//                 className="text-lg md:text-2xl"
//               >
//                 ⬇️
//               </motion.div>
//               {/* Cercle pulsant amélioré */}
//               <motion.div
//                 className="absolute -inset-3 md:-inset-4 border-2 border-white/30 rounded-full"
//                 animate={{
//                   scale: [1, 1.3, 1],
//                   opacity: [0.2, 0, 0.2]
//                 }}
//                 transition={{ duration: 2, repeat: Infinity }}
//               />
//             </motion.div>
//           </motion.div>
//         </motion.div>

//         {/* SECOND SECTION - Pour établissements et entreprises */}
//         <motion.div
//           id="second-section"
//           style={{ y: y2 }}
//           className="min-h-screen flex items-center justify-center px-4 sm:px-6 relative py-12 md:py-0"
//         >
//           {/* Overlay de blur pour cette section */}
//           <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50 backdrop-blur-[3px] pointer-events-none" />
          
//           <div className="max-w-6xl mx-auto relative z-10">
//             <motion.div
//               initial={{ opacity: 0, y: 50 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true, margin: "-50px" }}
//               transition={{ duration: 0.8 }}
//               className="text-center"
//             >
//               {/* Trophée animé */}
//               <motion.div
//                 initial={{ scale: 0 }}
//                 whileInView={{ scale: 1 }}
//                 viewport={{ once: true }}
//                 transition={{ duration: 1, type: "spring" }}
//                 className="inline-block mb-6 md:mb-8"
//               >
//                 <motion.div
//                   animate={{
//                     y: [0, -10, 0],
//                     rotate: [0, 5, 0, -5, 0]
//                   }}
//                   transition={{ duration: 4, repeat: Infinity }}
//                   className="text-5xl md:text-7xl bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 bg-clip-text text-transparent"
//                 >
//                   🏆
//                 </motion.div>
//               </motion.div>

//               <motion.h2
//                 initial={{ opacity: 0 }}
//                 whileInView={{ opacity: 1 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: 0.3 }}
//                 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 md:mb-8"
//               >
//                 <span className="bg-gradient-to-r from-green-300 via-yellow-300 to-green-300 bg-clip-text text-transparent">
//                   FootBase Pro
//                 </span>
//               </motion.h2>

//               <motion.p
//                 initial={{ opacity: 0 }}
//                 whileInView={{ opacity: 1 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: 0.5 }}
//                 className="text-lg md:text-xl lg:text-2xl text-white/80 mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed backdrop-blur-lg bg-black/20 rounded-2xl p-4 md:p-6"
//               >
//                 Solutions adaptées pour les établissements scolaires et les entreprises.
//                 Organisez vos activités sportives de manière professionnelle.
//               </motion.p>

//               {/* Sections pour établissements et entreprises */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
//                 {professionalSections.map((section, index) => (
//                   <motion.div
//                     key={section.id}
//                     initial={{ opacity: 0, y: 30 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     viewport={{ once: true }}
//                     transition={{ delay: 0.7 + index * 0.2 }}
//                     whileHover={{ 
//                       scale: 1.03,
//                       y: -5,
//                       transition: { duration: 0.3 }
//                     }}
//                     className={`bg-gradient-to-br ${section.color} backdrop-blur-xl border border-white/20 rounded-2xl p-5 md:p-6 hover:border-white/40 transition-all duration-300 relative overflow-hidden group`}
//                   >
//                     <div className="flex flex-col h-full">
//                       <div className="flex items-center gap-3 md:gap-4 mb-4">
//                         <div className="text-4xl md:text-5xl">{section.icon}</div>
//                         <div>
//                           <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
//                             {section.title}
//                           </h3>
//                           <p className="text-white/70 text-sm md:text-base">
//                             {section.description}
//                           </p>
//                         </div>
//                       </div>
                      
//                       <ul className="space-y-2 mb-6 flex-1">
//                         {section.features.map((feature, idx) => (
//                           <motion.li
//                             key={idx}
//                             initial={{ opacity: 0, x: -10 }}
//                             whileInView={{ opacity: 1, x: 0 }}
//                             viewport={{ once: true }}
//                             transition={{ delay: 0.9 + (index * 0.3) + (idx * 0.1) }}
//                             className="flex items-center gap-2 text-white/80 text-sm md:text-base"
//                           >
//                             <span className="text-green-400">✓</span>
//                             {feature}
//                           </motion.li>
//                         ))}
//                       </ul>
                      
//                       <Link href={section.link} className="mt-auto"   onClick={() => console.log(`Clic sur ${section.title} - Route: ${section.link}`)}
// >
//                         <motion.button
//                           whileHover={{ scale: 1.05 }}
//                           whileTap={{ scale: 0.95 }}
//                           className="z-50 w-full py-3 px-4 rounded-xl font-bold bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 text-white border border-white/20 transition-all duration-300 group"
//                         >
//                           <span className="flex items-center justify-center gap-2">
//                             {section.cta}
//                             <motion.span
//                               animate={{ x: [0, 5, 0] }}
//                               transition={{ duration: 1.5, repeat: Infinity }}
//                               className="text-lg"
//                             >
//                               →
//                             </motion.span>
//                           </span>
//                         </motion.button>
//                       </Link>
//                     </div>
                    
//                     {/* Effet de lumière au survol */}
//                     <div className={`absolute inset-0 bg-gradient-to-br ${section.hoverColor} opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300`} />
//                   </motion.div>
//                 ))}
//               </div>

//               {/* Boutons finaux avec effet stade */}
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 whileInView={{ opacity: 1, scale: 1 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: 1.1, type: "spring" }}
//                 className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center"
//               >
//                 <Link href="/signin" className="group relative w-full sm:w-auto">
//                   <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/30 to-blue-600/30 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     className="relative w-full px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-2xl flex items-center justify-center gap-3 group"
//                   >
//                     <motion.span
//                       animate={{ y: [0, -3, 0] }}
//                       transition={{ duration: 1.5, repeat: Infinity }}
//                       className="text-xl"
//                     >
//                       👟
//                     </motion.span>
//                     <span>Espace Joueur</span>
//                   </motion.button>
//                 </Link>
                
//                 <Link href="/proprietaire/signin" className="group relative w-full sm:w-auto">
//                   <div className="absolute -inset-2 bg-gradient-to-r from-green-500/30 to-green-600/30 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     className="relative w-full px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-2xl flex items-center justify-center gap-3 group"
//                   >
//                     <motion.span
//                       animate={{ rotate: [0, 360] }}
//                       transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
//                       className="text-xl"
//                     >
//                       ⚽
//                     </motion.span>
//                     <span>Espace Propriétaire</span>
//                   </motion.button>
//                 </Link>
//               </motion.div>

//               {/* Message d'encouragement */}
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 whileInView={{ opacity: 1 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: 1.3 }}
//                 className="mt-8 md:mt-12 text-white/60 text-sm md:text-base backdrop-blur-lg bg-black/20 rounded-2xl p-3 md:p-4 inline-block"
//               >
//                 ⚡ L'aventure commence ici
//               </motion.div>
//             </motion.div>
//           </div>
//         </motion.div>
//       </div>

//       {/* Styles CSS */}
//       <style jsx>{`
//         @keyframes grassShimmerEnhanced {
//           0%, 100% { 
//             background-position: 0% 50%;
//             filter: brightness(1.1) contrast(1.3);
//           }
//           25% { 
//             background-position: 50% 25%;
//             filter: brightness(1.2) contrast(1.4);
//           }
//           50% { 
//             background-position: 100% 50%;
//             filter: brightness(1.3) contrast(1.5);
//           }
//           75% { 
//             background-position: 50% 75%;
//             filter: brightness(1.2) contrast(1.4);
//           }
//         }
        
//         @keyframes grassFloatEnhanced {
//           0%, 100% { 
//             transform: translateY(0px) translateX(0px) scale(1);
//             opacity: 0.4;
//           }
//           33% { 
//             transform: translateY(-4px) translateX(3px) scale(1.02);
//             opacity: 0.6;
//           }
//           66% { 
//             transform: translateY(3px) translateX(-4px) scale(0.98);
//             opacity: 0.3;
//           }
//         }

//         @keyframes organicMovement {
//           0%, 100% { 
//             background-position: 0% 0%, 0% 0%, 0% 0%;
//           }
//           25% { 
//             background-position: 10px 5px, -5px 10px, 5px -5px;
//           }
//           50% { 
//             background-position: 20px 10px, -10px 20px, 10px -10px;
//           }
//           75% { 
//             background-position: 10px 15px, -15px 10px, 15px -5px;
//           }
//         }
        
//         /* Optimisations pour mobile */
//         @media (max-width: 640px) {
//           .text-4xl {
//             font-size: 2.5rem;
//           }
//           .text-6xl {
//             font-size: 4rem;
//           }
//         }
//       `}</style>
//     </StadiumBackground>
//   );
// }


// "use client";
// import { motion, useScroll, useTransform, useSpring } from "framer-motion";
// import { useRef, useState, useEffect } from "react";
// import Link from "next/link";
// import StadiumBackground from "@/components/StadiumBackground";

// export default function HomePage() {
//   const containerRef = useRef(null);
//   const { scrollYProgress } = useScroll({
//     target: containerRef,
//     offset: ["start start", "end end"]
//   });
  
//   const [isBallonHovered, setIsBallonHovered] = useState(false);
//   const [activeFeature, setActiveFeature] = useState(null);

//   // Animations parallax améliorées
//   const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
//   const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
//   const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.98]);
//   const smoothScale = useSpring(scale, { stiffness: 100, damping: 30 });

//   // Effet de particules de stade
//   const [particles, setParticles] = useState([]);
  
//   useEffect(() => {
//     // Générer des particules pour l'effet foule
//     const newParticles = Array.from({ length: 15 }).map((_, i) => ({
//       id: i,
//       x: Math.random() * 100,
//       y: Math.random() * 40,
//       size: Math.random() * 3 + 1,
//       opacity: Math.random() * 0.4 + 0.1,
//       duration: Math.random() * 4 + 2,
//       delay: Math.random() * 2
//     }));
//     setParticles(newParticles);
//   }, []);

//   // Ballons flottants
//   const floatingBalls = [
//     { id: 1, x: "10%", y: "15%", delay: 0, size: "text-2xl" },
//     { id: 2, x: "85%", y: "25%", delay: 0.4, size: "text-xl" },
//     { id: 3, x: "20%", y: "80%", delay: 0.8, size: "text-3xl" },
//     { id: 4, x: "75%", y: "70%", delay: 1.2, size: "text-2xl" }
//   ];

//   // Features améliorées avec animations
//   const features = [
//     { 
//       icon: "👥", 
//       title: "Gestion d'Équipe", 
//       desc: "Organisez vos joueurs intelligemment",
//       color: "from-green-500/20 to-green-600/20",
//       hoverColor: "from-green-500/30 to-green-600/30",
//       emojiAnimation: "👥→🤝→👥"
//     },
//     { 
//       icon: "📅", 
//       title: "Planning Intelligent", 
//       desc: "Planifiez vos matchs en quelques clics",
//       color: "from-blue-500/20 to-blue-600/20",
//       hoverColor: "from-blue-500/30 to-blue-600/30",
//       emojiAnimation: "📅→✅→📅"
//     },
//     { 
//       icon: "⭐", 
//       title: "Évaluations Pro", 
//       desc: "Suivez les performances détaillées",
//       color: "from-yellow-500/20 to-yellow-600/20",
//       hoverColor: "from-yellow-500/30 to-yellow-600/30",
//       emojiAnimation: "⭐→📊→⭐"
//     }
//   ];

//   const stats = [
//     { value: "500+", label: "Matchs Organisés", icon: "⚽", suffix: "" },
//     { value: "1K+", label: "Joueurs Actifs", icon: "👟", suffix: "" },
//     { value: "50+", label: "Terrains", icon: "🏟️", suffix: "" },
//     { value: "4.8", label: "Satisfaction", icon: "⭐", suffix: "/5" }
//   ];

//   return (
//     <StadiumBackground>
//       {/* Effet de foule animée (particules) */}
//       <div className="fixed inset-0 pointer-events-none z-0">
//         {particles.map((particle) => (
//           <motion.div
//             key={particle.id}
//             className="absolute w-1 h-1 bg-white rounded-full"
//             style={{
//               left: `${particle.x}%`,
//               top: `${particle.y}%`,
//               width: `${particle.size}px`,
//               height: `${particle.size}px`,
//               opacity: particle.opacity
//             }}
//             animate={{
//               y: [0, -10, 0],
//               opacity: [particle.opacity, particle.opacity * 0.5, particle.opacity]
//             }}
//             transition={{
//               duration: particle.duration,
//               repeat: Infinity,
//               delay: particle.delay,
//               ease: "easeInOut"
//             }}
//           />
//         ))}
//       </div>

//       {/* Ballons flottants décoratifs */}
//       {floatingBalls.map((ball) => (
//         <motion.div
//           key={ball.id}
//           className={`fixed ${ball.size} opacity-10 pointer-events-none z-1`}
//           style={{ left: ball.x, top: ball.y }}
//           initial={{ y: 0, rotate: 0 }}
//           animate={{
//             y: [0, -30, 0],
//             rotate: [0, 180, 360],
//             scale: [1, 1.1, 1]
//           }}
//           transition={{
//             duration: 5,
//             repeat: Infinity,
//             delay: ball.delay,
//             ease: "easeInOut"
//           }}
//         >
//           ⚽
//         </motion.div>
//       ))}

//       <div ref={containerRef} className="relative z-10">
//         {/* HERO SECTION - Ultra améliorée */}
//         <motion.div
//           style={{ scale: smoothScale }}
//           className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 relative overflow-hidden"
//         >
//           {/* Effet de lumière focalisée */}
//           <motion.div
//             className="absolute inset-0 pointer-events-none"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 0.3 }}
//             transition={{ duration: 2 }}
//           >
//             <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-green-500/10 via-yellow-500/5 to-green-500/10 rounded-full blur-3xl" />
//           </motion.div>

//           {/* Ballon principal avec effets améliorés */}
//           <motion.div
//             className="mb-8 md:mb-12 relative group"
//             initial={{ scale: 0, opacity: 0 }}
//             animate={{ 
//               scale: 1, 
//               opacity: 1,
//               y: [0, -20, 0]
//             }}
//             transition={{ 
//               scale: { duration: 1, ease: "backOut" },
//               opacity: { duration: 1 },
//               y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
//             }}
//             whileHover={{ 
//               scale: 1.15,
//               transition: { duration: 0.5 }
//             }}
//             onHoverStart={() => setIsBallonHovered(true)}
//             onHoverEnd={() => setIsBallonHovered(false)}
//           >
//             {/* Effet d'aura autour du ballon */}
//             <motion.div
//               className="absolute -inset-8 bg-gradient-to-r from-green-500/20 to-yellow-500/20 rounded-full blur-xl"
//               animate={isBallonHovered ? {
//                 scale: [1, 1.2, 1],
//                 opacity: [0.3, 0.6, 0.3]
//               } : {
//                 scale: 1,
//                 opacity: 0.3
//               }}
//               transition={{ duration: 2, repeat: Infinity }}
//             />
            
//             {/* Cercles concentriques animés */}
//             <motion.div
//               className="absolute -inset-6 border-4 border-green-400/20 rounded-full"
//               animate={{
//                 scale: [1, 1.3, 1],
//                 opacity: [0.3, 0, 0.3]
//               }}
//               transition={{ duration: 3, repeat: Infinity }}
//             />
            
//             <motion.div
//               className="text-7xl md:text-9xl lg:text-[10rem] relative"
//               animate={isBallonHovered ? { 
//                 rotate: 360,
//               } : {}}
//               transition={{ 
//                 rotate: { duration: 1.5, ease: "linear" }
//               }}
//             >
//               ⚽
//               {/* Reflets sur le ballon */}
//               <motion.div
//                 className="absolute top-4 left-4 w-8 h-8 bg-white/30 rounded-full blur-sm"
//                 animate={{
//                   x: [0, 10, 0],
//                   y: [0, 5, 0]
//                 }}
//                 transition={{ duration: 2, repeat: Infinity }}
//               />
//             </motion.div>
            
//             {/* Étoiles tournantes autour du ballon */}
//             {[0, 120, 240].map((rotation, i) => (
//               <motion.div
//                 key={i}
//                 className="absolute text-yellow-400 text-xl"
//                 style={{
//                   left: '50%',
//                   top: '50%',
//                   transform: `rotate(${rotation}deg) translateX(60px) rotate(-${rotation}deg)`
//                 }}
//                 animate={{
//                   rotate: 360,
//                   scale: [1, 1.5, 1]
//                 }}
//                 transition={{
//                   rotate: { duration: 4, repeat: Infinity, ease: "linear" },
//                   scale: { duration: 1.5, repeat: Infinity, delay: i * 0.3 }
//                 }}
//               >
//                 ✨
//               </motion.div>
//             ))}
//           </motion.div>

//           {/* TITRE PRINCIPAL - Version HERBE POUSSANTE (identique) */}
//           <motion.div
//             initial={{ y: 50, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             transition={{ duration: 1, delay: 0.3 }}
//             className="text-center mb-8 relative"
//           >
//             {/* Container principal du titre */}
//             <div className="relative inline-block">
//               <motion.h1
//                 initial={{ opacity: 0, scale: 0.8 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ 
//                   duration: 1.2, 
//                   ease: [0.25, 0.46, 0.45, 0.94],
//                 }}
//                 className="text-5xl md:text-7xl lg:text-8xl font-black mb-4 leading-tight relative z-10"
//                 style={{
//                   background: "linear-gradient(135deg, #0f5c2f 0%, #1a7a3f 15%, #2d9c5a 25%, #facc15 35%, #2d9c5a 45%, #1a7a3f 60%, #0f5c2f 75%, #facc15 85%, #0f5c2f 100%)",
//                   backgroundSize: "400% 400%",
//                   WebkitBackgroundClip: "text",
//                   WebkitTextFillColor: "transparent",
//                   backgroundClip: "text",
//                   textShadow: `
//                     0 2px 10px rgba(0,0,0,0.6),
//                     0 4px 20px rgba(0,0,0,0.4),
//                     0 8px 30px rgba(34, 197, 94, 0.3),
//                     0 0 40px rgba(250, 204, 21, 0.2),
//                     0 0 60px rgba(34, 197, 94, 0.15)
//                   `,
//                   filter: "brightness(1.1) contrast(1.3)",
//                   animation: "grassShimmerEnhanced 3s ease-in-out infinite",
//                 }}
//               >
//                 FOOTBASE
//               </motion.h1>
              
//               {/* Effet de brins d'herbe individuels */}
//               <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden rounded-lg">
//                 {Array.from({ length: 25 }).map((_, i) => (
//                   <motion.div
//                     key={i}
//                     className="absolute h-1 bg-gradient-to-b from-yellow-300 to-green-500 rounded-full"
//                     style={{
//                       left: `${(i / 24) * 100}%`,
//                       top: `${Math.random() * 100}%`,
//                       width: `${2 + Math.random() * 4}px`,
//                       height: `${10 + Math.random() * 20}px`,
//                       opacity: 0.3 + Math.random() * 0.4,
//                       transform: `rotate(${-5 + Math.random() * 10}deg)`,
//                     }}
//                     animate={{
//                       y: [0, -8, 0],
//                       opacity: [0.3, 0.8, 0.3],
//                     }}
//                     transition={{
//                       duration: 1.5 + Math.random() * 2,
//                       repeat: Infinity,
//                       delay: Math.random() * 2,
//                       ease: "easeInOut",
//                     }}
//                   />
//                 ))}
//               </div>

//               {/* Texture d'herbe dense en overlay */}
//               <div 
//                 className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-40 z-15"
//                 style={{
//                   backgroundImage: `
//                     radial-gradient(circle at 10% 20%, rgba(120, 220, 80, 0.6) 2px, transparent 2px),
//                     radial-gradient(circle at 90% 40%, rgba(100, 200, 60, 0.5) 3px, transparent 3px),
//                     radial-gradient(circle at 40% 70%, rgba(140, 240, 100, 0.7) 4px, transparent 4px),
//                     radial-gradient(circle at 70% 10%, rgba(110, 210, 70, 0.4) 1px, transparent 1px),
//                     radial-gradient(circle at 20% 90%, rgba(130, 230, 90, 0.5) 3px, transparent 3px),
//                     radial-gradient(circle at 85% 85%, rgba(150, 250, 110, 0.3) 2px, transparent 2px),
//                     radial-gradient(circle at 60% 30%, rgba(250, 204, 21, 0.4) 2px, transparent 2px),
//                     radial-gradient(circle at 30% 60%, rgba(250, 204, 21, 0.3) 3px, transparent 3px)
//                   `,
//                   backgroundSize: "60px 60px, 80px 80px, 100px 100px, 40px 40px, 90px 90px, 70px 70px, 50px 50px, 110px 110px",
//                   animation: "grassFloatEnhanced 6s ease-in-out infinite",
//                 }}
//               />

//               {/* Effet de profondeur */}
//               <div 
//                 className="absolute inset-0 pointer-events-none mix-blend-soft-light opacity-50 z-5"
//                 style={{
//                   backgroundImage: `
//                     linear-gradient(45deg, transparent 45%, rgba(34, 197, 94, 0.1) 50%, transparent 55%),
//                     linear-gradient(-45deg, transparent 45%, rgba(250, 204, 21, 0.08) 50%, transparent 55%),
//                     linear-gradient(90deg, transparent 48%, rgba(34, 197, 94, 0.05) 50%, transparent 52%)
//                   `,
//                   backgroundSize: "25px 25px, 30px 30px, 40px 40px",
//                   animation: "organicMovement 8s ease-in-out infinite",
//                 }}
//               />
//             </div>
            
//             {/* Ligne de séparation animée améliorée */}
//             <motion.div
//               initial={{ scaleX: 0 }}
//               animate={{ scaleX: 1 }}
//               transition={{ duration: 1, delay: 0.8 }}
//               className="relative w-48 md:w-64 h-1 mx-auto rounded-full mb-6 mt-4 overflow-hidden"
//             >
//               <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-yellow-400 to-green-400" />
//               <motion.div
//                 className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
//                 animate={{
//                   x: ["-100%", "100%"]
//                 }}
//                 transition={{
//                   duration: 1.5,
//                   repeat: Infinity,
//                   ease: "linear"
//                 }}
//               />
//             </motion.div>
            
//             {/* Tagline avec animation séquentielle */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ duration: 0.8, delay: 0.9 }}
//             >
//               <h2 className="text-2xl md:text-3xl font-bold text-white/90 mb-2">
//                 <motion.span
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: 1 }}
//                 >
//                   Votre terrain,
//                 </motion.span>
//                 {" "}
//                 <motion.span
//                   initial={{ opacity: 0, x: 20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: 1.1 }}
//                   className="text-yellow-300 bg-gradient-to-r from-yellow-300 to-yellow-400 bg-clip-text text-transparent"
//                 >
//                   votre communauté
//                 </motion.span>
//               </h2>
//             </motion.div>
//           </motion.div>

//           {/* Sous-titre avec effet de révélation */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 1, delay: 0.6 }}
//             className="max-w-3xl mx-auto mb-12 px-4"
//           >
//             <p className="text-lg md:text-xl lg:text-2xl text-center text-white/85 leading-relaxed font-medium">
//               <motion.span
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 1.2 }}
//                 className="inline-block"
//               >
//                 L'application qui transforme votre passion du football
//               </motion.span>
//               <br />
//               <motion.span
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 1.4 }}
//                 className="inline-block"
//               >
//                 en <span className="text-green-300 font-semibold">expérience organisée</span>.
//               </motion.span>
//             </p>
//           </motion.div>

//           {/* STATISTIQUES ANIMÉES */}
//           <motion.div
//             initial={{ opacity: 0, y: 40 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, delay: 1.6 }}
//             className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-4xl mx-auto mb-12 px-4"
//           >
//             {stats.map((stat, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ scale: 0, rotate: -180 }}
//                 animate={{ scale: 1, rotate: 0 }}
//                 transition={{ 
//                   duration: 0.6, 
//                   delay: 1.8 + index * 0.15,
//                   type: "spring",
//                   stiffness: 100
//                 }}
//                 whileHover={{ 
//                   scale: 1.1, 
//                   y: -8,
//                   transition: { duration: 0.3 }
//                 }}
//                 className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 md:p-6 text-center hover:border-green-400/30 transition-all duration-300 group relative overflow-hidden"
//                 onMouseEnter={() => setActiveFeature(index)}
//                 onMouseLeave={() => setActiveFeature(null)}
//               >
//                 {/* Effet de fond au survol */}
//                 <div className={`absolute inset-0 bg-gradient-to-br from-green-500/0 via-green-500/5 to-green-500/0 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300`} />
                
//                 <div className="text-2xl md:text-3xl mb-2">{stat.icon}</div>
//                 <div className="flex items-baseline justify-center gap-1 mb-2">
//                   <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: 2 + index * 0.1 }}
//                     className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-yellow-400 to-green-400 bg-clip-text text-transparent"
//                   >
//                     {stat.value}
//                   </motion.div>
//                   {stat.suffix && (
//                     <span className="text-white/70 text-lg">{stat.suffix}</span>
//                   )}
//                 </div>
//                 <div className="text-white/80 text-xs md:text-sm">{stat.label}</div>
                
//                 {/* Barre de croissance animée */}
//                 <motion.div
//                   className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-yellow-400 rounded-b-2xl"
//                   initial={{ scaleX: 0 }}
//                   animate={{ scaleX: activeFeature === index ? 1 : 0 }}
//                   transition={{ duration: 0.5 }}
//                 />
//               </motion.div>
//             ))}
//           </motion.div>

//           {/* BOUTONS CTA AMÉLIORÉS */}
//           <motion.div
//             initial={{ y: 30, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             transition={{ duration: 0.8, delay: 2.2 }}
//             className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 px-4"
//           >
//             <Link href="/inscription" className="group relative">
//               {/* Effet d'aura */}
//               <motion.div
//                 className="absolute -inset-3 bg-gradient-to-r from-green-500 to-yellow-500 rounded-3xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"
//                 animate={{
//                   scale: [1, 1.1, 1],
//                 }}
//                 transition={{ duration: 2, repeat: Infinity }}
//               />
              
//               <motion.button
//                 whileHover={{ 
//                   scale: 1.05,
//                   y: -5,
//                   boxShadow: "0 25px 50px rgba(34, 197, 94, 0.4)"
//                 }}
//                 whileTap={{ scale: 0.98 }}
//                 className="relative px-10 py-5 rounded-2xl text-xl font-bold bg-gradient-to-r from-green-500 to-green-600 text-white shadow-2xl group-hover:from-green-600 group-hover:to-green-700 transition-all duration-300 flex items-center gap-3 overflow-hidden"
//               >
//                 {/* Effet de traînée lumineuse */}
//                 <motion.div
//                   className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12"
//                   initial={{ x: "-100%" }}
//                   whileHover={{ x: "100%" }}
//                   transition={{ duration: 0.8 }}
//                 />
//                 <motion.span
//                   animate={{ rotate: [0, 360] }}
//                   transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
//                   className="text-2xl"
//                 >
//                   🚀
//                 </motion.span>
//                 <span className="relative">Commencer Maintenant</span>
//               </motion.button>
//             </Link>

//             <Link href="/apropos" className="group">
//               <motion.button
//                 whileHover={{ 
//                   scale: 1.05,
//                   y: -5,
//                   boxShadow: "0 20px 40px rgba(250, 204, 21, 0.3)"
//                 }}
//                 whileTap={{ scale: 0.98 }}
//                 className="px-10 py-5 rounded-2xl text-xl font-bold border-2 border-yellow-400 text-yellow-300 hover:bg-yellow-400/10 transition-all duration-300 backdrop-blur-lg bg-white/5 flex items-center gap-3 relative overflow-hidden group"
//               >
//                 <motion.span
//                   animate={{ rotate: [0, 10, 0, -10, 0] }}
//                   transition={{ duration: 3, repeat: Infinity }}
//                   className="text-2xl"
//                 >
//                   ✨
//                 </motion.span>
//                 <span>Découvrir Plus</span>
//                 {/* Effet de bordure animée */}
//                 <div className="absolute inset-0 border-2 border-yellow-400/0 group-hover:border-yellow-400/50 rounded-2xl transition-all duration-500" />
//               </motion.button>
//             </Link>
//           </motion.div>

//           {/* FEATURES AVEC ANIMATIONS DE STADE */}
//           <motion.div
//             initial={{ opacity: 0, y: 40 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, delay: 2.4 }}
//             className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16 px-4"
//           >
//             {features.map((feature, index) => (
//               <motion.div
//                 key={feature.title}
//                 initial={{ opacity: 0, scale: 0.9, y: 20 }}
//                 animate={{ opacity: 1, scale: 1, y: 0 }}
//                 transition={{ 
//                   duration: 0.5, 
//                   delay: 2.6 + index * 0.1,
//                   type: "spring",
//                   stiffness: 100
//                 }}
//                 whileHover={{ 
//                   scale: 1.05, 
//                   y: -10,
//                   transition: { duration: 0.3 }
//                 }}
//                 className={`bg-gradient-to-br ${feature.color} backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center hover:border-white/40 transition-all duration-300 relative overflow-hidden group`}
//                 onMouseEnter={() => setActiveFeature(index)}
//                 onMouseLeave={() => setActiveFeature(null)}
//               >
//                 {/* Effet de lumière au survol */}
//                 <div className={`absolute inset-0 bg-gradient-to-br ${feature.hoverColor} opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300`} />
                
//                 <motion.div
//                   animate={activeFeature === index ? {
//                     scale: [1, 1.2, 1],
//                     rotate: [0, 5, 0]
//                   } : {}}
//                   transition={{ duration: 0.5 }}
//                   className="text-4xl md:text-5xl mb-4 relative z-10"
//                 >
//                   {feature.icon}
//                 </motion.div>
                
//                 <h3 className="text-xl font-bold text-white mb-3 relative z-10">
//                   {feature.title}
//                 </h3>
//                 <p className="text-white/70 relative z-10">
//                   {feature.desc}
//                 </p>
                
//                 {/* Effet de traînée */}
//                 <motion.div
//                   className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
//                   initial={{ x: "-100%" }}
//                   animate={{ x: activeFeature === index ? "100%" : "-100%" }}
//                   transition={{ duration: 0.8 }}
//                 />
//               </motion.div>
//             ))}
//           </motion.div>

//           {/* INDICATION SCROLL AMÉLIORÉE */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 1, delay: 3 }}
//             className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
//           >
//             <motion.div
//               animate={{ y: [0, -15, 0] }}
//               transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
//               className="flex flex-col items-center gap-2 cursor-pointer group"
//               onClick={() => {
//                 window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
//               }}
//             >
//               <span className="text-white/70 text-sm group-hover:text-white transition-colors">
//                 Continuer l'aventure
//               </span>
//               <motion.div
//                 animate={{ 
//                   y: [0, 5, 0],
//                   scale: [1, 1.2, 1]
//                 }}
//                 transition={{ duration: 1.5, repeat: Infinity }}
//                 className="text-2xl"
//               >
//                 ⬇️
//               </motion.div>
//               {/* Cercle pulsant amélioré */}
//               <motion.div
//                 className="absolute -inset-4 border-2 border-white/30 rounded-full"
//                 animate={{
//                   scale: [1, 1.5, 1],
//                   opacity: [0.3, 0, 0.3]
//                 }}
//                 transition={{ duration: 2, repeat: Infinity }}
//               />
//             </motion.div>
//           </motion.div>
//         </motion.div>

//         {/* SECOND SECTION - Expérience immersive */}
//         <motion.div
//           style={{ y: y2 }}
//           className="min-h-screen flex items-center justify-center px-4 sm:px-6 relative"
//         >
//           <div className="max-w-6xl mx-auto">
//             <motion.div
//               initial={{ opacity: 0, y: 50 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true, margin: "-100px" }}
//               transition={{ duration: 0.8 }}
//               className="text-center"
//             >
//               {/* Trophée animé */}
//               <motion.div
//                 initial={{ scale: 0, rotate: -180 }}
//                 whileInView={{ scale: 1, rotate: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ duration: 1, type: "spring" }}
//                 className="inline-block mb-8"
//               >
//                 <motion.div
//                   animate={{
//                     y: [0, -20, 0],
//                     rotate: [0, 10, 0, -10, 0]
//                   }}
//                   transition={{ duration: 4, repeat: Infinity }}
//                   className="text-6xl md:text-8xl bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 bg-clip-text text-transparent"
//                 >
//                   🏆
//                 </motion.div>
//               </motion.div>

//               <motion.h2
//                 initial={{ opacity: 0 }}
//                 whileInView={{ opacity: 1 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: 0.3 }}
//                 className="text-4xl md:text-6xl font-bold text-white mb-8"
//               >
//                 <span className="bg-gradient-to-r from-green-300 via-yellow-300 to-green-300 bg-clip-text text-transparent">
//                   Prêt pour le match ?
//                 </span>
//               </motion.h2>

//               <motion.p
//                 initial={{ opacity: 0 }}
//                 whileInView={{ opacity: 1 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: 0.5 }}
//                 className="text-xl md:text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed"
//               >
//                 Rejoignez des milliers de passionnés qui ont déjà transformé leur expérience footballistique avec FootBase.
//               </motion.p>

//               {/* Boutons finaux avec effet stade */}
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 whileInView={{ opacity: 1, scale: 1 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: 0.7, type: "spring" }}
//                 className="flex flex-col sm:flex-row gap-6 justify-center items-center"
//               >
//                 <Link href="/signin" className="group relative">
//                   <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/30 to-blue-600/30 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     className="relative px-10 py-4 rounded-xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-2xl flex items-center gap-3 group"
//                   >
//                     <motion.span
//                       animate={{ y: [0, -5, 0] }}
//                       transition={{ duration: 1.5, repeat: Infinity }}
//                       className="text-2xl"
//                     >
//                       👟
//                     </motion.span>
//                     <span>Espace Joueur</span>
//                   </motion.button>
//                 </Link>
                
//                 <Link href="/proprietaire/signin" className="group relative">
//                   <div className="absolute -inset-2 bg-gradient-to-r from-green-500/30 to-green-600/30 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     className="relative px-10 py-4 rounded-xl font-bold bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-2xl flex items-center gap-3 group"
//                   >
//                     <motion.span
//                       animate={{ rotate: [0, 360] }}
//                       transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
//                       className="text-2xl"
//                     >
//                       ⚽
//                     </motion.span>
//                     <span>Espace Propriétaire</span>
//                   </motion.button>
//                 </Link>
//               </motion.div>

//               {/* Message d'encouragement */}
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 whileInView={{ opacity: 1 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: 1 }}
//                 className="mt-12 text-white/60 text-sm"
//               >
//                 ⚡ L'aventure commence ici
//               </motion.div>
//             </motion.div>
//           </div>
//         </motion.div>
//       </div>

//       {/* Styles CSS */}
//       <style jsx>{`
//         @keyframes grassShimmerEnhanced {
//           0%, 100% { 
//             background-position: 0% 50%;
//             filter: brightness(1.1) contrast(1.3);
//           }
//           25% { 
//             background-position: 50% 25%;
//             filter: brightness(1.2) contrast(1.4);
//           }
//           50% { 
//             background-position: 100% 50%;
//             filter: brightness(1.3) contrast(1.5);
//           }
//           75% { 
//             background-position: 50% 75%;
//             filter: brightness(1.2) contrast(1.4);
//           }
//         }
        
//         @keyframes grassFloatEnhanced {
//           0%, 100% { 
//             transform: translateY(0px) translateX(0px) scale(1);
//             opacity: 0.4;
//           }
//           33% { 
//             transform: translateY(-4px) translateX(3px) scale(1.02);
//             opacity: 0.6;
//           }
//           66% { 
//             transform: translateY(3px) translateX(-4px) scale(0.98);
//             opacity: 0.3;
//           }
//         }

//         @keyframes organicMovement {
//           0%, 100% { 
//             background-position: 0% 0%, 0% 0%, 0% 0%;
//           }
//           25% { 
//             background-position: 10px 5px, -5px 10px, 5px -5px;
//           }
//           50% { 
//             background-position: 20px 10px, -10px 20px, 10px -10px;
//           }
//           75% { 
//             background-position: 10px 15px, -15px 10px, 15px -5px;
//           }
//         }
//       `}</style>
//     </StadiumBackground>
//   );
// }



// "use client";
// import { motion, useScroll, useTransform, useSpring } from "framer-motion";
// import { useRef, useState, useEffect } from "react";
// import Link from "next/link";
// import StadiumBackground from "@/components/StadiumBackground";

// export default function HomePage() {
//   const containerRef = useRef(null);
//   const { scrollYProgress } = useScroll({
//     target: containerRef,
//     offset: ["start start", "end end"]
//   });
  
//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
//   const [isHovered, setIsHovered] = useState(false);

//   // Animations parallax
//   const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
//   const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
//   const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  
//   // Animation spring pour plus de fluidité
//   const smoothScale = useSpring(scale, { stiffness: 100, damping: 30 });

//   // Effet de suivi de souris
//   useEffect(() => {
//     const handleMouseMove = (e) => {
//       setMousePosition({
//         x: (e.clientX / window.innerWidth - 0.5) * 20,
//         y: (e.clientY / window.innerHeight - 0.5) * 20
//       });
//     };

//     window.addEventListener("mousemove", handleMouseMove);
//     return () => window.removeEventListener("mousemove", handleMouseMove);
//   }, []);

//   const floatingPlayers = [
//     { icon: "🧤", x: "10%", y: "20%", delay: 0 },
//     { icon: "🛡️", x: "85%", y: "15%", delay: 0.3 },
//     { icon: "⚙️", x: "15%", y: "70%", delay: 0.6 },
//     { icon: "⚡", x: "90%", y: "75%", delay: 0.9 }
//   ];

//   return (
//     <StadiumBackground>
//       {/* Élément de fond interactif */}
//       <motion.div
//         className="fixed inset-0 pointer-events-none z-0"
//         animate={{
//           x: mousePosition.x * 0.5,
//           y: mousePosition.y * 0.5
//         }}
//         transition={{ type: "spring", stiffness: 150, damping: 20 }}
//       >
//         <div className="absolute inset-0 bg-gradient-radial from-green-500/5 via-transparent to-transparent" />
//       </motion.div>

//       {/* Joueurs flottants */}
//       {floatingPlayers.map((player, i) => (
//         <motion.div
//           key={i}
//           className="fixed text-3xl md:text-4xl opacity-20 pointer-events-none z-1"
//           style={{ left: player.x, top: player.y }}
//           initial={{ y: 0 }}
//           animate={{
//             y: [0, -30, 0],
//             rotate: [0, 5, 0]
//           }}
//           transition={{
//             duration: 3 + i,
//             repeat: Infinity,
//             delay: player.delay,
//             ease: "easeInOut"
//           }}
//         >
//           {player.icon}
//         </motion.div>
//       ))}

//       <div ref={containerRef} className="relative z-10">
//         {/* HERO SECTION */}
//         <motion.div
//           style={{ scale: smoothScale }}
//           className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 relative overflow-hidden"
//         >
//           {/* Effet de particules */}
//           <div className="absolute inset-0 pointer-events-none">
//             {Array.from({ length: 30 }).map((_, i) => (
//               <motion.div
//                 key={i}
//                 className="absolute w-1 h-1 bg-yellow-400 rounded-full"
//                 style={{
//                   left: `${Math.random() * 100}%`,
//                   top: `${Math.random() * 100}%`,
//                 }}
//                 animate={{
//                   y: [0, -20, 0],
//                   opacity: [0, 0.8, 0],
//                   scale: [0, 1, 0]
//                 }}
//                 transition={{
//                   duration: 2 + Math.random() * 2,
//                   repeat: Infinity,
//                   delay: Math.random() * 3
//                 }}
//               />
//             ))}
//           </div>

//           {/* Ballon principal animé avec effet 3D */}
//           <motion.div
//             className="mb-8 md:mb-12 relative"
//             initial={{ scale: 0, rotate: -180 }}
//             animate={{ 
//               scale: 1, 
//               rotate: 0,
//               y: [0, -25, 0]
//             }}
//             transition={{ 
//               scale: { duration: 1, ease: "backOut" },
//               rotate: { duration: 1.5, ease: "circOut" },
//               y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
//             }}
//             whileHover={{ 
//               scale: 1.2,
//               rotate: 720,
//               transition: { duration: 1.5 }
//             }}
//             onHoverStart={() => setIsHovered(true)}
//             onHoverEnd={() => setIsHovered(false)}
//           >
//             <motion.div
//               className="text-7xl md:text-9xl lg:text-[10rem] relative"
//               animate={isHovered ? { 
//                 rotate: 360,
//                 scale: [1, 1.1, 1]
//               } : {}}
//               transition={{ 
//                 rotate: { duration: 2, ease: "linear" },
//                 scale: { duration: 0.5 }
//               }}
//             >
//               ⚽
//               {/* Effet de brillance sur le ballon */}
//               <motion.div
//                 className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0"
//                 animate={isHovered ? { 
//                   opacity: [0, 0.5, 0],
//                   x: ["-100%", "100%"]
//                 } : {}}
//                 transition={{ duration: 1 }}
//               />
//             </motion.div>
            
//             {/* Cercles concentriques */}
//             <motion.div
//               className="absolute inset-0 border-4 border-yellow-400/30 rounded-full -m-8"
//               animate={{
//                 scale: [1, 1.5, 1],
//                 opacity: [0.3, 0, 0.3]
//               }}
//               transition={{ duration: 3, repeat: Infinity }}
//             />
//             <motion.div
//               className="absolute inset-0 border-2 border-green-400/20 rounded-full -m-12"
//               animate={{
//                 scale: [1, 2, 1],
//                 opacity: [0.2, 0, 0.2]
//               }}
//               transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
//             />
//           </motion.div>

//           {/* Titre principal avec effet STADIUM épique */}
//           <motion.div
//             initial={{ y: 50, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             transition={{ duration: 1, delay: 0.3 }}
//             className="text-center mb-8 relative"
//           >
//             <div className="relative inline-block">
//               {/* Ombre portée volumineuse */}
//               <div className="absolute -inset-4 bg-gradient-to-r from-green-600/40 to-yellow-600/40 blur-3xl rounded-full opacity-60" />
              
//               {/* Container texte avec effet stade */}
//               <div className="relative bg-gradient-to-b from-green-900/30 to-green-950/30 backdrop-blur-2xl border-2 border-white/10 rounded-3xl px-8 py-6 md:px-12 md:py-8 shadow-2xl">
//                 {/* Effet de gradins */}
//                 <div className="absolute inset-0 rounded-3xl border-4 border-white/5" />
//                 <div className="absolute inset-4 rounded-2xl border-2 border-white/5" />
                
//                 <motion.h1
//                   initial={{ opacity: 0, scale: 0.8 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   transition={{ 
//                     duration: 1.2, 
//                     ease: [0.25, 0.46, 0.45, 0.94],
//                   }}
//                   className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black mb-2 leading-tight relative z-10"
//                   style={{
//                     background: "linear-gradient(135deg, #0f5c2f 0%, #1a7a3f 15%, #2d9c5a 25%, #facc15 35%, #ffd700 45%, #facc15 55%, #2d9c5a 65%, #1a7a3f 75%, #0f5c2f 85%, #facc15 95%, #0f5c2f 100%)",
//                     backgroundSize: "400% 400%",
//                     WebkitBackgroundClip: "text",
//                     WebkitTextFillColor: "transparent",
//                     backgroundClip: "text",
//                     filter: "brightness(1.2) contrast(1.4) drop-shadow(0 10px 20px rgba(0,0,0,0.5))",
//                     animation: "grassShimmerEnhanced 3s ease-in-out infinite",
//                   }}
//                 >
//                   FOOTBASE
//                 </motion.h1>
                
//                 {/* Effet de lumière stade */}
//                 <motion.div
//                   className="absolute -inset-4 bg-gradient-to-r from-yellow-400/10 via-transparent to-yellow-400/10 rounded-3xl blur-xl"
//                   animate={{
//                     opacity: [0.3, 0.6, 0.3],
//                     scale: [1, 1.05, 1]
//                   }}
//                   transition={{ duration: 4, repeat: Infinity }}
//                 />
//               </div>
//             </div>

//             {/* Tagline avec effet frappe */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.6, duration: 0.8 }}
//               className="mt-6 md:mt-8"
//             >
//               <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white/95 mb-3">
//                 <motion.span
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ delay: 0.7 }}
//                   className="bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent"
//                 >
//                   Votre terrain,
//                 </motion.span>
//                 {" "}
//                 <motion.span
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ delay: 0.9 }}
//                   className="text-yellow-300 drop-shadow-lg"
//                 >
//                   votre communauté
//                 </motion.span>
//               </h2>
              
//               {/* Ligne de séparation animée avec effet LED */}
//               <motion.div
//                 initial={{ scaleX: 0 }}
//                 animate={{ scaleX: 1 }}
//                 transition={{ duration: 1, delay: 0.8 }}
//                 className="relative h-1 w-48 md:w-64 mx-auto my-4 overflow-hidden rounded-full"
//               >
//                 <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-yellow-400 to-green-400" />
//                 <motion.div
//                   className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
//                   animate={{
//                     x: ["-100%", "100%"]
//                   }}
//                   transition={{
//                     duration: 2,
//                     repeat: Infinity,
//                     ease: "linear"
//                   }}
//                 />
//               </motion.div>
//             </motion.div>
//           </motion.div>

//           {/* Sous-titre avec effet typewriter */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 1, delay: 0.6 }}
//             className="max-w-3xl mx-auto mb-12"
//           >
//             <p className="text-lg sm:text-xl md:text-2xl text-center text-white/85 leading-relaxed font-medium px-4">
//               <motion.span
//                 initial={{ width: 0 }}
//                 animate={{ width: "100%" }}
//                 transition={{ duration: 2, delay: 1 }}
//                 className="inline-block overflow-hidden"
//               >
//                 L'application qui transforme votre passion du football
//               </motion.span>
//               <br />
//               <motion.span
//                 initial={{ width: 0 }}
//                 animate={{ width: "100%" }}
//                 transition={{ duration: 2, delay: 1.5 }}
//                 className="inline-block overflow-hidden"
//               >
//                 en <span className="text-green-300 font-semibold">expérience organisée</span>.
//               </motion.span>
//             </p>
//           </motion.div>

//           {/* Boutons CTA avec effets premium */}
//           <motion.div
//             initial={{ y: 30, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             transition={{ duration: 0.8, delay: 0.9 }}
//             className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 px-4"
//           >
//             <Link href="/inscription" className="group relative">
//               {/* Effet halo */}
//               <motion.div
//                 className="absolute -inset-2 bg-gradient-to-r from-green-500 to-yellow-500 rounded-3xl blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500"
//                 animate={{
//                   scale: [1, 1.1, 1],
//                 }}
//                 transition={{ duration: 2, repeat: Infinity }}
//               />
              
//               <motion.button
//                 whileHover={{ 
//                   scale: 1.05,
//                   y: -5,
//                   boxShadow: "0 25px 50px rgba(34, 197, 94, 0.4)"
//                 }}
//                 whileTap={{ scale: 0.98 }}
//                 className="relative px-10 py-5 rounded-2xl text-xl font-bold bg-gradient-to-r from-green-500 to-green-600 text-white shadow-2xl group-hover:from-green-600 group-hover:to-green-700 transition-all duration-300 flex items-center gap-3 overflow-hidden"
//               >
//                 {/* Effet de brillance */}
//                 <motion.div
//                   className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12"
//                   initial={{ x: "-100%" }}
//                   whileHover={{ x: "100%" }}
//                   transition={{ duration: 0.8 }}
//                 />
//                 <motion.span
//                   animate={{ rotate: [0, 360] }}
//                   transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
//                 >
//                   🚀
//                 </motion.span>
//                 <span className="relative">Commencer Maintenant</span>
//               </motion.button>
//             </Link>

//             <Link href="/apropos" className="group">
//               <motion.button
//                 whileHover={{ 
//                   scale: 1.05,
//                   y: -5,
//                   boxShadow: "0 20px 40px rgba(250, 204, 21, 0.3)"
//                 }}
//                 whileTap={{ scale: 0.98 }}
//                 className="px-10 py-5 rounded-2xl text-xl font-bold border-2 border-yellow-400 text-yellow-300 hover:bg-yellow-400/10 transition-all duration-300 backdrop-blur-lg bg-white/5 flex items-center gap-3 relative overflow-hidden"
//               >
//                 <span>✨</span>
//                 <span>Découvrir Plus</span>
//                 {/* Effet de bordure animée */}
//                 <motion.div
//                   className="absolute inset-0 border-2 border-yellow-400/0 group-hover:border-yellow-400/50 rounded-2xl transition-all duration-500"
//                 />
//               </motion.button>
//             </Link>
//           </motion.div>

//           {/* Stats animées */}
//           <motion.div
//             initial={{ opacity: 0, y: 40 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, delay: 1.2 }}
//             className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto mb-16 px-4"
//           >
//             {[
//               { value: "500+", label: "Matchs", color: "from-green-400 to-green-600" },
//               { value: "1k+", label: "Joueurs", color: "from-blue-400 to-blue-600" },
//               { value: "50+", label: "Terrains", color: "from-yellow-400 to-yellow-600" }
//             ].map((stat, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ scale: 0, rotate: -180 }}
//                 animate={{ scale: 1, rotate: 0 }}
//                 transition={{ 
//                   duration: 0.6, 
//                   delay: 1.4 + index * 0.2,
//                   type: "spring",
//                   stiffness: 100
//                 }}
//                 whileHover={{ scale: 1.1, y: -5 }}
//                 className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 text-center hover:border-green-400/30 transition-all duration-300 group"
//               >
//                 <div className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
//                   {stat.value}
//                 </div>
//                 <div className="text-white/80 text-sm md:text-base">{stat.label}</div>
//                 {/* Effet de fond au survol */}
//                 <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/5 to-green-500/0 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300" />
//               </motion.div>
//             ))}
//           </motion.div>

//           {/* Indication scroll avec effet pulsing */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 1, delay: 2 }}
//             className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
//           >
//             <motion.div
//               animate={{ y: [0, -15, 0] }}
//               transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
//               className="flex flex-col items-center gap-2 cursor-pointer group"
//               onClick={() => {
//                 window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
//               }}
//             >
//               <span className="text-white/70 text-sm group-hover:text-white transition-colors">
//                 Explorer l'expérience
//               </span>
//               <motion.div
//                 animate={{ scale: [1, 1.2, 1] }}
//                 transition={{ duration: 1.5, repeat: Infinity }}
//                 className="text-2xl"
//               >
//                 ⬇️
//               </motion.div>
//               {/* Cercle pulsant */}
//               <motion.div
//                 className="absolute -inset-4 border-2 border-white/20 rounded-full"
//                 animate={{
//                   scale: [1, 1.5, 1],
//                   opacity: [0.5, 0, 0.5]
//                 }}
//                 transition={{ duration: 2, repeat: Infinity }}
//               />
//             </motion.div>
//           </motion.div>
//         </motion.div>

//         {/* SECOND SECTION - Parallax effect */}
//         <motion.div
//           style={{ y: y2 }}
//           className="min-h-screen flex items-center justify-center px-4 sm:px-6 relative"
//         >
//           <div className="max-w-6xl mx-auto">
//             <motion.div
//               initial={{ opacity: 0, y: 50 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true, margin: "-100px" }}
//               transition={{ duration: 0.8 }}
//               className="text-center"
//             >
//               {/* Élément décoratif */}
//               <motion.div
//                 initial={{ scale: 0 }}
//                 whileInView={{ scale: 1 }}
//                 viewport={{ once: true }}
//                 transition={{ duration: 0.6, delay: 0.2 }}
//                 className="inline-block mb-8"
//               >
//                 <div className="text-6xl md:text-8xl bg-gradient-to-r from-yellow-400 to-green-400 bg-clip-text text-transparent">
//                   🏆
//                 </div>
//               </motion.div>

//               <motion.h2
//                 initial={{ opacity: 0 }}
//                 whileInView={{ opacity: 1 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: 0.3 }}
//                 className="text-4xl md:text-6xl font-bold text-white mb-8"
//               >
//                 <span className="bg-gradient-to-r from-green-300 via-yellow-300 to-green-300 bg-clip-text text-transparent">
//                   Rejoignez la Révolution
//                 </span>
//               </motion.h2>

//               <motion.p
//                 initial={{ opacity: 0 }}
//                 whileInView={{ opacity: 1 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: 0.5 }}
//                 className="text-xl md:text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed"
//               >
//                 Des milliers de joueurs et propriétaires font déjà confiance à FootBase pour organiser leurs matchs et développer leur communauté footballistique.
//               </motion.p>

//               {/* Cards features améliorées */}
//               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
//                 {[
//                   { 
//                     icon: "👥", 
//                     title: "Communauté Active", 
//                     desc: "Rencontrez des joueurs passionnés près de chez vous",
//                     color: "from-green-500/20 to-green-600/20"
//                   },
//                   { 
//                     icon: "📊", 
//                     title: "Statistiques Détaillées", 
//                     desc: "Suivez vos performances et progressez",
//                     color: "from-blue-500/20 to-blue-600/20"
//                   },
//                   { 
//                     icon: "⚡", 
//                     title: "Réservation Instantanée", 
//                     desc: "Réservez des terrains en quelques clics",
//                     color: "from-yellow-500/20 to-yellow-600/20"
//                   }
//                 ].map((feature, index) => (
//                   <motion.div
//                     key={index}
//                     initial={{ opacity: 0, y: 30 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     viewport={{ once: true }}
//                     transition={{ delay: 0.7 + index * 0.1 }}
//                     whileHover={{ 
//                       scale: 1.05, 
//                       y: -10,
//                       transition: { duration: 0.3 }
//                     }}
//                     className={`bg-gradient-to-br ${feature.color} backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:border-white/40 transition-all duration-300 relative overflow-hidden group`}
//                   >
//                     <div className="text-4xl mb-4">{feature.icon}</div>
//                     <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
//                     <p className="text-white/70">{feature.desc}</p>
//                     {/* Effet de lumière */}
//                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
//                   </motion.div>
//                 ))}
//               </div>

//               {/* CTA Final */}
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 whileInView={{ opacity: 1, scale: 1 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: 1 }}
//                 className="flex flex-col sm:flex-row gap-6 justify-center items-center"
//               >
//                 <Link href="/signin">
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     className="px-10 py-4 rounded-xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-2xl flex items-center gap-3 group relative overflow-hidden"
//                   >
//                     <span className="text-2xl group-hover:rotate-12 transition-transform">👟</span>
//                     <span>Espace Joueur</span>
//                     <motion.div
//                       className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
//                     />
//                   </motion.button>
//                 </Link>
                
//                 <Link href="/proprietaire/signin">
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     className="px-10 py-4 rounded-xl font-bold bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-2xl flex items-center gap-3 group relative overflow-hidden"
//                   >
//                     <span className="text-2xl group-hover:rotate-12 transition-transform">⚽</span>
//                     <span>Espace Propriétaire</span>
//                     <motion.div
//                       className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
//                     />
//                   </motion.button>
//                 </Link>
//               </motion.div>
//             </motion.div>
//           </div>
//         </motion.div>
//       </div>

//       {/* Styles CSS globaux */}
//       <style jsx>{`
//         @keyframes grassShimmerEnhanced {
//           0%, 100% { 
//             background-position: 0% 50%;
//             filter: brightness(1.1) contrast(1.3) drop-shadow(0 5px 15px rgba(34, 197, 94, 0.3));
//           }
//           25% { 
//             background-position: 50% 25%;
//             filter: brightness(1.2) contrast(1.4) drop-shadow(0 8px 25px rgba(34, 197, 94, 0.4));
//           }
//           50% { 
//             background-position: 100% 50%;
//             filter: brightness(1.3) contrast(1.5) drop-shadow(0 10px 30px rgba(34, 197, 94, 0.5));
//           }
//           75% { 
//             background-position: 50% 75%;
//             filter: brightness(1.2) contrast(1.4) drop-shadow(0 8px 25px rgba(34, 197, 94, 0.4));
//           }
//         }

//         .gradient-radial {
//           background-image: radial-gradient(circle at center, var(--tw-gradient-stops));
//         }
//       `}</style>
//     </StadiumBackground>
//   );
// }


// "use client";
// import { motion } from "framer-motion";
// import Link from "next/link";
// import StadiumBackground from "@/components/StadiumBackground";

// export default function HomePage() {
//   return (
//     <StadiumBackground>
//       {/* Contenu principal centré */}
//       <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        
//         {/* Ballon animé au centre */}
//         <motion.div
//           className="mb-8"
//           initial={{ scale: 0, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           transition={{ duration: 1, ease: "backOut" }}
//         >
//           <motion.div
//             animate={{ 
//               rotate: 360,
//               y: [0, -20, 0]
//             }}
//             transition={{ 
//               rotate: { duration: 3, repeat: Infinity, ease: "linear" },
//               y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
//             }}
//             className="text-6xl md:text-8xl"
//           >
//             ⚽
//           </motion.div>
//         </motion.div>

//         {/* Titre principal avec EFFET HERBE RÉALISTE AMÉLIORÉ */}
//         <motion.div
//           initial={{ y: 50, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ duration: 1, delay: 0.3 }}
//           className="text-center mb-6 relative"
//         >
//           {/* Container principal du titre */}
//           <div className="relative inline-block">
//             <motion.h1
//               initial={{ opacity: 0, scale: 0.8 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ 
//                 duration: 1.2, 
//                 ease: [0.25, 0.46, 0.45, 0.94],
//               }}
//               className="text-5xl md:text-7xl lg:text-8xl font-black mb-4 leading-tight relative z-10"
//               style={{
//                 background: "linear-gradient(135deg, #0f5c2f 0%, #1a7a3f 15%, #2d9c5a 25%, #facc15 35%, #2d9c5a 45%, #1a7a3f 60%, #0f5c2f 75%, #facc15 85%, #0f5c2f 100%)",
//                 backgroundSize: "400% 400%",
//                 WebkitBackgroundClip: "text",
//                 WebkitTextFillColor: "transparent",
//                 backgroundClip: "text",
//                 textShadow: `
//                   0 2px 10px rgba(0,0,0,0.6),
//                   0 4px 20px rgba(0,0,0,0.4),
//                   0 8px 30px rgba(34, 197, 94, 0.3),
//                   0 0 40px rgba(250, 204, 21, 0.2),
//                   0 0 60px rgba(34, 197, 94, 0.15)
//                 `,
//                 filter: "brightness(1.1) contrast(1.3)",
//                 animation: "grassShimmerEnhanced 3s ease-in-out infinite",
//               }}
//             >
//               FOOTBASE
//             </motion.h1>
            
//             {/* Effet de brins d'herbe individuels - AMÉLIORÉ */}
//             <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden rounded-lg">
//               {Array.from({ length: 25 }).map((_, i) => (
//                 <motion.div
//                   key={i}
//                   className="absolute h-1 bg-gradient-to-b from-yellow-300 to-green-500 rounded-full"
//                   style={{
//                     left: `${(i / 24) * 100}%`,
//                     top: `${Math.random() * 100}%`,
//                     width: `${2 + Math.random() * 4}px`,
//                     height: `${10 + Math.random() * 20}px`,
//                     opacity: 0.3 + Math.random() * 0.4,
//                     transform: `rotate(${-5 + Math.random() * 10}deg)`,
//                   }}
//                   animate={{
//                     y: [0, -8, 0],
//                     opacity: [0.3, 0.8, 0.3],
//                   }}
//                   transition={{
//                     duration: 1.5 + Math.random() * 2,
//                     repeat: Infinity,
//                     delay: Math.random() * 2,
//                     ease: "easeInOut",
//                   }}
//                 />
//               ))}
//             </div>

//             {/* Texture d'herbe dense en overlay */}
//             <div 
//               className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-40 z-15"
//               style={{
//                 backgroundImage: `
//                   radial-gradient(circle at 10% 20%, rgba(120, 220, 80, 0.6) 2px, transparent 2px),
//                   radial-gradient(circle at 90% 40%, rgba(100, 200, 60, 0.5) 3px, transparent 3px),
//                   radial-gradient(circle at 40% 70%, rgba(140, 240, 100, 0.7) 4px, transparent 4px),
//                   radial-gradient(circle at 70% 10%, rgba(110, 210, 70, 0.4) 1px, transparent 1px),
//                   radial-gradient(circle at 20% 90%, rgba(130, 230, 90, 0.5) 3px, transparent 3px),
//                   radial-gradient(circle at 85% 85%, rgba(150, 250, 110, 0.3) 2px, transparent 2px),
//                   radial-gradient(circle at 60% 30%, rgba(250, 204, 21, 0.4) 2px, transparent 2px),
//                   radial-gradient(circle at 30% 60%, rgba(250, 204, 21, 0.3) 3px, transparent 3px)
//                 `,
//                 backgroundSize: "60px 60px, 80px 80px, 100px 100px, 40px 40px, 90px 90px, 70px 70px, 50px 50px, 110px 110px",
//                 animation: "grassFloatEnhanced 6s ease-in-out infinite",
//               }}
//             />

//             {/* Effet de profondeur avec motifs organiques */}
//             <div 
//               className="absolute inset-0 pointer-events-none mix-blend-soft-light opacity-50 z-5"
//               style={{
//                 backgroundImage: `
//                   linear-gradient(45deg, transparent 45%, rgba(34, 197, 94, 0.1) 50%, transparent 55%),
//                   linear-gradient(-45deg, transparent 45%, rgba(250, 204, 21, 0.08) 50%, transparent 55%),
//                   linear-gradient(90deg, transparent 48%, rgba(34, 197, 94, 0.05) 50%, transparent 52%)
//                 `,
//                 backgroundSize: "25px 25px, 30px 30px, 40px 40px",
//                 animation: "organicMovement 8s ease-in-out infinite",
//               }}
//             />
//           </div>
          
//           {/* Ligne de séparation animée */}
//           <motion.div
//             initial={{ scaleX: 0 }}
//             animate={{ scaleX: 1 }}
//             transition={{ duration: 1, delay: 0.8 }}
//             className="w-48 h-1 bg-gradient-to-r from-green-400 via-yellow-400 to-green-400 mx-auto rounded-full mb-6 mt-4"
//             style={{
//               backgroundSize: "200% 100%",
//               animation: "lineShimmer 2s ease-in-out infinite",
//             }}
//           />
          
//           <h2 className="text-2xl md:text-3xl font-bold text-white/90 mb-2">
//             Votre terrain, 
//             <span className="text-yellow-300"> votre communauté</span>
//           </h2>
//         </motion.div>

//         {/* Sous-titre avec effet de frappe */}
//         <motion.p
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 1, delay: 0.6 }}
//           className="text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto mb-12 text-center text-white/80 leading-relaxed font-medium"
//         >
//           L'application qui transforme votre passion du football en 
//           <span className="text-green-300 font-semibold"> expérience organisée</span>. 
//           Gérez les matchs, les joueurs et les statistiques comme un pro.
//         </motion.p>

//         {/* Styles CSS pour les nouvelles animations */}
//         <style jsx>{`
//           @keyframes grassShimmerEnhanced {
//             0%, 100% { 
//               background-position: 0% 50%;
//               filter: brightness(1.1) contrast(1.3);
//             }
//             25% { 
//               background-position: 50% 25%;
//               filter: brightness(1.2) contrast(1.4);
//             }
//             50% { 
//               background-position: 100% 50%;
//               filter: brightness(1.3) contrast(1.5);
//             }
//             75% { 
//               background-position: 50% 75%;
//               filter: brightness(1.2) contrast(1.4);
//             }
//           }
          
//           @keyframes grassFloatEnhanced {
//             0%, 100% { 
//               transform: translateY(0px) translateX(0px) scale(1);
//               opacity: 0.4;
//             }
//             33% { 
//               transform: translateY(-4px) translateX(3px) scale(1.02);
//               opacity: 0.6;
//             }
//             66% { 
//               transform: translateY(3px) translateX(-4px) scale(0.98);
//               opacity: 0.3;
//             }
//           }

//           @keyframes organicMovement {
//             0%, 100% { 
//               background-position: 0% 0%, 0% 0%, 0% 0%;
//             }
//             25% { 
//               background-position: 10px 5px, -5px 10px, 5px -5px;
//             }
//             50% { 
//               background-position: 20px 10px, -10px 20px, 10px -10px;
//             }
//             75% { 
//               background-position: 10px 15px, -15px 10px, 15px -5px;
//             }
//           }

//           @keyframes lineShimmer {
//             0%, 100% { 
//               background-position: 0% 50%;
//               opacity: 1;
//             }
//             50% { 
//               background-position: 100% 50%;
//               opacity: 0.8;
//             }
//           }
//         `}</style>

//         {/* Boutons d'action */}
//         <motion.div
//           initial={{ y: 30, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ duration: 0.8, delay: 0.9 }}
//           className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
//         >
//           <Link href="/inscription" className="group">
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               className="px-10 py-4 rounded-2xl text-xl font-bold bg-gradient-to-r from-green-500 to-green-600 text-white shadow-2xl hover:shadow-green-500/25 transition-all duration-300 group-hover:from-green-600 group-hover:to-green-700 flex items-center gap-3"
//             >
//               <span>🚀</span>
//               Commencer Maintenant
//             </motion.button>
//           </Link>

//           <Link href="/apropos" className="group">
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               className="px-10 py-4 rounded-2xl text-xl font-bold border-2 border-green-400 text-green-300 hover:bg-green-400 hover:text-white transition-all duration-300 backdrop-blur-sm bg-white/5 flex items-center gap-3"
//             >
//               <span>ℹ️</span>
//               Découvrir Plus
//             </motion.button>
//           </Link>
//         </motion.div>

//         {/* Features rapides */}
//         <motion.div
//           initial={{ opacity: 0, y: 40 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, delay: 1.2 }}
//           className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16"
//         >
//           {[
//             { icon: "👥", title: "Gestion d'Équipe", desc: "Organisez vos joueurs" },
//             { icon: "📅", title: "Planning Intelligent", desc: "Planifiez les matchs" },
//             { icon: "⭐", title: "Évaluations", desc: "Suivez les performances" }
//           ].map((feature, index) => (
//             <motion.div
//               key={feature.title}
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
//               whileHover={{ scale: 1.05, y: -5 }}
//               className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/20 hover:border-green-400/30 transition-all duration-300"
//             >
//               <div className="text-3xl mb-3">{feature.icon}</div>
//               <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
//               <p className="text-white/70 text-sm">{feature.desc}</p>
//             </motion.div>
//           ))}
//         </motion.div>

//         {/* Indication scroll */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 1, delay: 2 }}
//           className="absolute bottom-10 text-center"
//         >
//           <motion.div
//             animate={{ y: [0, -10, 0] }}
//             transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
//             className="text-white/60 text-sm mb-2 flex flex-col items-center gap-1"
//           >
//             <span>Découvrez l'expérience</span>
//             <div className="text-lg">⬇️</div>
//           </motion.div>
//         </motion.div>
//       </div>

//       {/* Section supplémentaire pour le scroll */}
//       <div className="min-h-screen flex items-center justify-center px-6">
//         <motion.div
//           initial={{ opacity: 0, y: 50 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//           className="text-center max-w-4xl"
//         >
//           <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
//             Prêt à <span className="text-green-300">révolutionner</span> votre football ?
//           </h2>
//           <p className="text-xl text-white/80 mb-8 leading-relaxed">
//             Rejoignez des milliers de joueurs et propriétaires de terrains qui utilisent déjà FootBase pour organiser leurs matchs et développer leur communauté footballistique.
//           </p>
          
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <Link href="/signin">
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
//               >
//                 👟 Espace Joueur
//               </motion.button>
//             </Link>
            
//             <Link href="/proprietaire/signin">
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transition-all duration-300"
//               >
//                 ⚽ Espace Propriétaire
//               </motion.button>
//             </Link>
//           </div>
//         </motion.div>
//       </div>
//     </StadiumBackground>
//   );
// }

