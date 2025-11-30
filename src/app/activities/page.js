'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaTruckLoading, FaHandsHelping, FaChartLine } from 'react-icons/fa';

const activites = [
  {
    title: 'Commissionnaire en douane',
    description:
      "Représentation des importateurs/exportateurs auprès des douanes pour toutes les démarches liées aux biens.",
    icon: FaTruckLoading,
  },
  {
    title: "Assistance au dédouanement",
    description:
      "Aide à l'élaboration, la soumission et le suivi des déclarations douanières à l’import/export.",
    icon: FaHandsHelping,
  },
  {
    title: "Études et conseils en transit",
    description:
      "Optimisation des processus douaniers pour fluidifier les opérations de transport international.",
    icon: FaChartLine,
  },
];

export default function ActivitesPage() {
  return (
    <div className="min-h-screen pt-24 pb-24 px-6 bg-gradient-to-br from-blue-50 to-blue-100 text-gray-800">
      <div className="max-w-5xl mx-auto space-y-12">
        <motion.h1
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center"
        >
          Nos Activités
        </motion.h1>

        <div className="grid gap-10 md:grid-cols-3">
          {activites.map(({ title, description, icon: Icon }, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300 ease-in-out text-center flex flex-col items-center"
            >
              <div className="text-yellow-500 mb-4 w-20 h-20 flex items-center justify-center text-5xl">
                <Icon />
              </div>
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-sm">{description}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/contact"
            className="bg-yellow-500 text-black font-semibold py-3 px-6 rounded hover:bg-yellow-600 transition duration-300"
          >
            Nous contacter
          </Link>
        </div>
      </div>
    </div>
  );
}

