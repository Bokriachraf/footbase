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
  TrendingUp,
  Award,
  Building,
  Target,
  Heart,
  Zap,
  BarChart3
} from "lucide-react";

export default function SocietePage() {
  const [activeFeature, setActiveFeature] = useState(null);

  const features = [
    {
      icon: <Users className="text-indigo-400" />,
      title: "Team Building Sportif",
      description: "Renforcez la cohésion d'équipe à travers des activités sportives organisées.",
      color: "from-indigo-500/20 to-indigo-600/20"
    },
    {
      icon: <Trophy className="text-yellow-400" />,
      title: "Tournois d'Entreprise",
      description: "Organisez des compétitions internes ou inter-entreprises facilement.",
      color: "from-yellow-500/20 to-yellow-600/20"
    },
    {
      icon: <TrendingUp className="text-green-400" />,
      title: "Bien-être au Travail",
      description: "Promouvez la santé et réduisez le stress de vos collaborateurs.",
      color: "from-green-500/20 to-green-600/20"
    },
    {
      icon: <BarChart3 className="text-blue-400" />,
      title: "Analytics & Reporting",
      description: "Suivez la participation et l'impact de vos activités sportives.",
      color: "from-blue-500/20 to-blue-600/20"
    }
  ];

  const benefits = [
    {
      title: "Productivité & Performance",
      points: ["+25% de motivation", "Meilleure collaboration", "Réduction de l'absentéisme", "Créativité accrue"]
    },
    {
      title: "Santé des Employés",
      points: ["Réduction du stress", "Amélioration de la santé", "Équilibre vie pro/perso", "Prévention des TMS"]
    },
    {
      title: "Culture d'Entreprise",
      points: ["Renforcement des liens", "Sentiment d'appartenance", "Ambiance positive", "Image employeur"]
    }
  ];

  const caseStudies = [
    {
      company: "TechCorp SA",
      industry: "Technologie",
      result: "+40% participation",
      quote: "FootBase a transformé notre culture d'entreprise. Les tournois sont devenus un pilier de notre stratégie RH."
    },
    {
      company: "Finance Group",
      industry: "Finance",
      result: "-35% stress",
      quote: "Le bien-être de nos employés s'est considérablement amélioré grâce aux activités sportives régulières."
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
            <div className="text-6xl md:text-7xl bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
              🏢
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
          >
            <span className="bg-gradient-to-r from-indigo-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
              FootBase Entreprise
            </span>
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-32 md:w-48 h-1 bg-gradient-to-r from-indigo-400 via-blue-400 to-indigo-400 mx-auto rounded-full my-6"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed mb-8 backdrop-blur-lg bg-black/20 rounded-2xl p-6"
          >
            <span className="font-semibold text-indigo-300">Boostez votre entreprise</span> grâce au sport. Améliorez la productivité, renforcez la cohésion d'équipe et investissez dans le bien-être de vos collaborateurs.
          </motion.p>
        </motion.div>

        {/* ROI du Sport d'Entreprise */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto mb-16"
        >
          <div className="bg-gradient-to-br from-indigo-500/10 to-blue-500/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="text-green-400" size={24} />
              <h2 className="text-2xl md:text-3xl font-bold text-white">Retour sur Investissement</h2>
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
                        <div className="w-2 h-2 bg-indigo-400 rounded-full" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-8 p-6 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-2xl border border-green-400/30"
            >
              <div className="flex items-center gap-4">
                <Zap className="text-yellow-400" size={32} />
                <div>
                  <h4 className="text-xl font-bold text-white">Chiffres Clés</h4>
                  <p className="text-white/70">
                    Les entreprises investissant dans le sport d'entreprise constatent en moyenne une augmentation de <span className="text-green-300 font-bold">15-25%</span> de la productivité et une réduction de <span className="text-green-300 font-bold">30%</span> du turnover.
                  </p>
                </div>
              </div>
            </motion.div>
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
            <span className="bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
              Solutions Adaptées aux Entreprises
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

        {/* Études de Cas */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto mb-16"
        >
          <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-8">
              <Building className="text-white" size={24} />
              <h2 className="text-2xl md:text-3xl font-bold text-white">Études de Cas</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {caseStudies.map((study, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-white/5 backdrop-blur-lg rounded-2xl p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-white text-xl">{study.company}</h4>
                      <p className="text-white/60 text-sm">{study.industry}</p>
                    </div>
                    <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm font-medium">
                      {study.result}
                    </span>
                  </div>
                  <p className="text-white/80 italic">"{study.quote}"</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Packages Entreprise */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto mb-16"
        >
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            <span className="bg-gradient-to-r from-indigo-300 to-blue-300 bg-clip-text text-transparent">
              Solutions sur Mesure
            </span>
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Starter",
                description: "Pour les PME",
                price: "Sur devis",
                features: ["Jusqu'à 50 employés", "1 tournoi/mois", "Support de base", "App mobile"],
                color: "from-gray-500/20 to-gray-600/20"
              },
              {
                name: "Business",
                description: "Pour les entreprises",
                price: "Sur devis",
                features: ["Jusqu'à 200 employés", "Tournois illimités", "Support prioritaire", "Analytics avancés"],
                color: "from-indigo-500/20 to-blue-500/20",
                popular: true
              },
              {
                name: "Enterprise",
                description: "Pour les grands groupes",
                price: "Sur devis",
                features: ["Employés illimités", "Solution sur mesure", "Support 24/7", "Intégration API"],
                color: "from-blue-500/20 to-cyan-500/20"
              }
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`bg-gradient-to-br ${plan.color} backdrop-blur-xl border ${plan.popular ? 'border-yellow-400/50' : 'border-white/20'} rounded-2xl p-6 relative`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full text-xs font-bold text-white">
                    POPULAIRE
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-white/70">{plan.description}</p>
                  <div className="mt-4">
                    <span className="text-3xl font-bold text-white">{plan.price}</span>
                  </div>
                </div>
                
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-white/80">
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Link href="/">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full py-3 rounded-xl font-bold transition-all duration-300 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    {plan.popular ? '🌟 Demander un devis' : 'Demander un devis'}
                  </motion.button>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Final */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="bg-gradient-to-r from-indigo-500/20 to-blue-500/20 backdrop-blur-xl border border-white/20 rounded-3xl p-8 md:p-12">
            <Target className="text-white w-16 h-16 mx-auto mb-6" />
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Investissez dans <span className="text-indigo-300">votre capital humain</span>
            </h2>
            
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Le sport d'entreprise n'est pas une dépense, c'est un investissement stratégique qui rapporte à long terme.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-indigo-500 to-indigo-600 text-white hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 shadow-lg"
                >
                  📞 Planifier un appel
                </motion.button>
              </Link>
              
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-xl font-bold border-2 border-white/30 text-white hover:bg-white/10 transition-all duration-300 backdrop-blur-lg"
                >
                  🏢 Essai gratuit 30 jours
                </motion.button>
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Team Building", icon: "🤝" },
                { label: "Santé au travail", icon: "❤️" },
                { label: "Productivité", icon: "📈" },
                { label: "Rétention", icon: "👥" }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <p className="text-white/70 text-sm">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </StadiumBackground>
  );
}