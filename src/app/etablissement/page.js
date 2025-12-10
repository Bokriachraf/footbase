"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import StadiumBackground from "@/components/StadiumBackground";
import { 
  Users, 
  Calendar, 
  Trophy, 
  Shield, 
  BookOpen, 
  TrendingUp,
  Award,
  School,
  Target,
  Heart
} from "lucide-react";

export default function EtablissementPage() {
  const [activeFeature, setActiveFeature] = useState(null);

  const features = [
    {
      icon: <School className="text-purple-400" />,
      title: "Gestion des Équipes",
      description: "Organisez facilement vos équipes scolaires par classe, niveau ou section.",
      color: "from-purple-500/20 to-purple-600/20"
    },
    {
      icon: <Calendar className="text-blue-400" />,
      title: "Tournois Interscolaires",
      description: "Planifiez et gérez des compétitions entre établissements en toute simplicité.",
      color: "from-blue-500/20 to-blue-600/20"
    },
    {
      icon: <Trophy className="text-yellow-400" />,
      title: "Suivi des Performances",
      description: "Analysez les performances des élèves et équipes avec des statistiques détaillées.",
      color: "from-yellow-500/20 to-yellow-600/20"
    },
    {
      icon: <Shield className="text-green-400" />,
      title: "Sécurité et Encadrement",
      description: "Environnement sécurisé avec encadrement adapté aux élèves.",
      color: "from-green-500/20 to-green-600/20"
    }
  ];

  const benefits = [
    {
      title: "Développement Personnel",
      points: ["Esprit d'équipe", "Confiance en soi", "Leadership", "Discipline"]
    },
    {
      title: "Santé & Bien-être",
      points: ["Activité physique régulière", "Réduction du stress", "Équilibre vie scolaire"]
    },
    {
      title: "Engagement Scolaire",
      points: ["Meilleure concentration", "Motivation accrue", "Sentiment d'appartenance"]
    }
  ];

  return (
    <StadiumBackground>
      {/* Overlay de blur pour lisibilité */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50 backdrop-blur-[2px] pointer-events-none" />
      
      <div className="relative z-10 min-h-screen py-8 px-4 sm:px-6">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring" }}
            className="inline-block mb-6"
          >
            <div className="text-6xl md:text-7xl bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              🏫
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
          >
            <span className="bg-gradient-to-r from-purple-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
              FootBase Éducation
            </span>
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-32 md:w-48 h-1 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 mx-auto rounded-full my-6"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed mb-8 backdrop-blur-lg bg-black/20 rounded-2xl p-6"
          >
            <span className="font-semibold text-purple-300">Révolutionnez le sport scolaire</span> avec une plateforme dédiée à l'organisation, au suivi et au développement des activités sportives dans votre établissement.
          </motion.p>
        </motion.div>

        {/* Importance du Sport Scolaire */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto mb-16"
        >
          <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <Heart className="text-red-400" size={24} />
              <h2 className="text-2xl md:text-3xl font-bold text-white">L'Importance du Sport Scolaire</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-lg rounded-2xl p-5 border border-white/10"
                >
                  <h3 className="text-xl font-bold text-white mb-4">{benefit.title}</h3>
                  <ul className="space-y-2">
                    {benefit.points.map((point, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-white/70">
                        <div className="w-2 h-2 bg-purple-400 rounded-full" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto mb-16"
        >
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
              Fonctionnalités Spécialisées
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`bg-gradient-to-br ${feature.color} backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center hover:border-white/40 transition-all duration-300 cursor-pointer`}
                onMouseEnter={() => setActiveFeature(index)}
                onMouseLeave={() => setActiveFeature(null)}
              >
                <div className="text-4xl mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-white/70 text-sm md:text-base">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Témoignages */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto mb-16"
        >
          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-8">
              <Award className="text-yellow-400" size={24} />
              <h2 className="text-2xl md:text-3xl font-bold text-white">Témoignages</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    PD
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Pr. Dridi</h4>
                    <p className="text-white/60 text-sm">Proviseur, Lycée Pilote</p>
                  </div>
                </div>
                <p className="text-white/80 italic">
                  "FootBase a transformé notre gestion des activités sportives. Les élèves sont plus motivés et l'organisation des tournois est devenue un jeu d'enfant."
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold">
                    CS
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Coach Sami</h4>
                    <p className="text-white/60 text-sm">Professeur d'EPS</p>
                  </div>
                </div>
                <p className="text-white/80 italic">
                  "La plateforme me permet de suivre la progression de chaque élève et d'adapter mes entraînements. Un outil indispensable pour tout enseignant d'EPS."
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-xl border border-white/20 rounded-3xl p-8 md:p-12">
            <Target className="text-white w-16 h-16 mx-auto mb-6" />
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Prêt à <span className="text-purple-300">transformer</span> le sport dans votre établissement ?
            </h2>
            
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Rejoignez les établissements qui utilisent déjà FootBase pour offrir une expérience sportive exceptionnelle à leurs élèves.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-lg"
                >
                  📋 Demander une démo
                </motion.button>
              </Link>
              
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-xl font-bold border-2 border-white/30 text-white hover:bg-white/10 transition-all duration-300 backdrop-blur-lg"
                >
                  🚀 Créer un compte
                </motion.button>
              </Link>
            </div>

            <p className="text-white/60 text-sm mt-6">
              💡 Solution adaptée pour: Lycées, Collèges, Universités, Internats
            </p>
          </div>
        </motion.div>
      </div>
    </StadiumBackground>
  );
}