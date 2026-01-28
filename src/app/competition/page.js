'use client';

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import StadiumBackground from "@/components/StadiumBackground";
import Loader from "@/components/Loader";
import { listCompetitions } from "@/redux/actions/competitionActions";

export default function CompetitionPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { competitions, loading, error } = useSelector(
    (state) => state.competitionList
  );

  useEffect(() => {
    dispatch(listCompetitions());
  }, [dispatch]);

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader text="Chargement des compétitions..." />
      </div>
    );

  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <StadiumBackground>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <h1 className="text-3xl font-extrabold text-center text-yellow-400">
          🏆 Compétitions
        </h1>

        <div className="grid gap-4">
          {competitions.map((comp) => {
            const isFull =
              comp.equipesInscrites.length >= comp.nbEquipes;

            return (
              <motion.div
                key={comp._id}
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push(`/competition/${comp._id}`)}
                className="bg-black/60 border border-yellow-400/20 rounded-2xl p-4 cursor-pointer"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold text-yellow-300">
                    {comp.nom}
                  </h2>

                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      isFull
                        ? "bg-red-600"
                        : "bg-green-600"
                    }`}
                  >
                    {isFull ? "Complet" : "Ouvert"}
                  </span>
                </div>

                <p className="text-white/80 text-sm mt-1">
                  {comp.type} • {comp.categorie}
                </p>

                <p className="text-white/70 text-sm mt-2">
                  Équipes : {comp.equipesInscrites.length} / {comp.nbEquipes}
                </p>

                <p className="text-white/60 text-xs mt-1">
                  📅 {comp.dateDebut} → {comp.dateFin}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </StadiumBackground>
  );
}



// "use client";

// import Link from "next/link";
// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { listCompetitions } from "@/redux/actions/competitionActions";

// export default function CompetitionPage() {
//   const dispatch = useDispatch();

//   const { loading, error, competitions } = useSelector(
//     (state) => state.competitionList
//   );

//   useEffect(() => {
//     dispatch(listCompetitions());
//   }, [dispatch]);

//   return (
//     <div className="p-4 max-w-5xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4 text-center">
//         🏆 Compétitions disponibles
//       </h1>

//       {loading && <p className="text-center">Chargement...</p>}
//       {error && <p className="text-center text-red-500">{error}</p>}

//       <div className="grid gap-4 sm:grid-cols-2">
//         {competitions.map((competition) => (
//           <Link
//             key={competition._id}
//             href={`/competition/${competition._id}`}
//             className="
//               block rounded-2xl p-4
//               bg-white/10 backdrop-blur
//               border border-white/20
//               hover:scale-[1.02]
//               transition-all
//             "
//           >
//             <h2 className="text-lg font-semibold">
//               {competition.nom}
//             </h2>

//             <p className="text-sm text-white/70 mt-1">
//               📅 Début : {competition.dateDebut}
//             </p>

//             <p className="text-sm text-white/70">
//               👥 Équipes max : {competition.nbEquipes}
//             </p>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// }
