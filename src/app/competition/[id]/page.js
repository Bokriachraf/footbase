"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";

import StadiumBackground from "@/components/StadiumBackground";
import Loader from "@/components/Loader";

import {
  getCompetitionDetails,
  registerEquipeCompetition,
} from "@/redux/actions/competitionActions";

import { getMyCaptainEquipes } from "@/redux/actions/equipeActions";

export default function CompetitionDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const router = useRouter();

  const [showEquipeModal, setShowEquipeModal] = useState(false);

  /* ================= REDUX ================= */
  const { competition, loading, error } = useSelector(
    (state) => state.competitionDetails
  );

  const { footballeurInfo } = useSelector(
    (state) => state.footballeurSignin
  );

  const {
    equipes,
    loading: loadingEquipes,
  } = useSelector((state) => state.myCaptainEquipes);

  /* ================= FETCH ================= */
  useEffect(() => {
    dispatch(getCompetitionDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (footballeurInfo) {
      dispatch(getMyCaptainEquipes());
    }
  }, [dispatch, footballeurInfo]);

  /* ================= STATES ================= */
  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader text="Chargement de la compétition..." />
      </div>
    );

  if (error) return <p className="text-red-500">{error}</p>;
  if (!competition) return null;

  const equipesInscrites = competition.equipesInscrites || [];
  const isFull = equipesInscrites.length >= competition.nbEquipes;
  const equipesInscritesIds = equipesInscrites.map((e) => e._id);

  const captainAlreadyRegistered = equipes?.some((eq) =>
    equipesInscritesIds.includes(eq._id)
  );

  /* ================= ACTIONS ================= */
  const handleInscription = () => {
    if (!footballeurInfo) {
      toast.info("Veuillez vous connecter");
      router.push("/signin");
      return;
    }

    if (isFull) {
      toast.error("Compétition complète");
      return;
    }

    dispatch(getMyCaptainEquipes());
    setShowEquipeModal(true);
  };

  const handleEquipeSelect = (equipeId) => {
    dispatch(registerEquipeCompetition(competition._id, equipeId));
    setShowEquipeModal(false);
  };

  /* ================= RENDER ================= */
  return (
    <StadiumBackground>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <h1 className="text-3xl font-extrabold text-center text-yellow-400">
          {competition.nom}
        </h1>

        {/* INFOS */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 space-y-3 text-white/90">
          <p>🏷️ Type : {competition.type}</p>
          <p>📌 Catégorie : {competition.categorie}</p>
          <p>
            👥 Équipes : {equipesInscrites.length} /{" "}
            {competition.nbEquipes}
          </p>
          <p>
            📅 Saison : {competition.dateDebut} → {competition.dateFin}
          </p>
          <p>📊 Statut : {competition.status}</p>
        </div>

        {/* ================= ÉQUIPES INSCRITES ================= */}
        <div className="bg-black/60 border border-yellow-400/20 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-yellow-300 mb-4">
            📋 Équipes inscrites
          </h2>

          {equipesInscrites.length === 0 ? (
            <p className="text-white/70 text-center">
              Aucune équipe inscrite pour le moment
            </p>
          ) : (
            <ul className="space-y-3">
              {equipesInscrites.map((eq) => (
                <li
                  key={eq._id}
                  className="flex justify-between items-center bg-white/5 p-4 rounded-xl"
                >
                  <div className="text-white">
                    <p className="font-bold">⚽ {eq.nom}</p>
                    <p className="text-sm text-white/70">
                      Capitaine :{" "}
                      {eq.capitaine?.name || "—"}
                    </p>
                  </div>

                  <button
                    onClick={() => router.push(`/equipes/${eq._id}`)}
                    className="px-4 py-2 rounded-lg bg-yellow-500 text-black font-bold hover:bg-yellow-600"
                  >
                    Voir
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ================= INSCRIPTION ================= */}
        <button
          disabled={isFull || captainAlreadyRegistered}
          onClick={handleInscription}
          className={`w-full py-3 rounded-xl font-bold
            ${
              isFull || captainAlreadyRegistered
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black"
            }
          `}
        >
          {captainAlreadyRegistered
            ? "✅ Déjà inscrit"
            : "S’inscrire"}
        </button>

        <button
          onClick={() => router.push("/competition")}
          className="w-full py-3 rounded-xl bg-gray-700 text-white font-bold"
        >
          ⬅️ Retour
        </button>
      </div>

      {/* ================= MODAL CHOIX ÉQUIPE ================= */}
      {showEquipeModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl w-full max-w-md space-y-4">
            <h2 className="text-xl font-bold text-white text-center">
              Choisir une équipe
            </h2>

            {loadingEquipes ? (
              <Loader text="Chargement des équipes..." />
            ) : equipes.length > 0 ? (
              equipes.map((eq) => (
                <button
                  key={eq._id}
                  onClick={() => handleEquipeSelect(eq._id)}
                  className="w-full py-2 rounded-lg bg-yellow-500 text-black font-bold"
                >
                  ⚽ {eq.nom}
                </button>
              ))
            ) : (
              <div className="text-center space-y-3">
                <p className="text-white">
                  Vous n’avez aucune équipe
                </p>
                <button
                  onClick={() => router.push("/equipes/create")}
                  className="w-full py-2 rounded-lg bg-green-500 text-black font-bold"
                >
                  ➕ Créer une équipe
                </button>
              </div>
            )}

            <button
              onClick={() => setShowEquipeModal(false)}
              className="w-full py-2 rounded-lg bg-gray-600 text-white"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </StadiumBackground>
  );
}



// 'use client';

// import { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useParams, useRouter } from 'next/navigation';
// import { toast } from 'react-toastify';

// import StadiumBackground from '@/components/StadiumBackground';
// import Loader from '@/components/Loader';

// import {
//   getCompetitionDetails,
//   registerEquipeCompetition,
// } from '@/redux/actions/competitionActions';

// import { getMyCaptainEquipes } from '@/redux/actions/equipeActions';

// export default function CompetitionDetailsPage() {
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const router = useRouter();

//   const [showEquipeModal, setShowEquipeModal] = useState(false);

//   const { competition, loading, error } = useSelector(
//     (state) => state.competitionDetails
//   );

//   const { footballeurInfo } = useSelector(
//     (state) => state.footballeurSignin
//   );

//   const {
//     equipes,
//     loading: loadingEquipes,
//   } = useSelector((state) => state.myCaptainEquipes);

//   useEffect(() => {
//     dispatch(getCompetitionDetails(id));
//   }, [dispatch, id]);

//   useEffect(() => {
//   if (footballeurInfo) {
//     dispatch(getMyCaptainEquipes());
//   }
// }, [dispatch, footballeurInfo]);

//   if (loading)
//     return (
//       <div className="flex justify-center py-20">
//         <Loader text="Chargement de la compétition..." />
//       </div>
//     );

//   if (error) return <p className="text-red-500">{error}</p>;
//   if (!competition) return null;

//   const equipesInscrites = competition.equipesInscrites || [];
//   const isFull = equipesInscrites.length >= competition.nbEquipes;
//   const equipesInscritesIds = equipesInscrites.map((e) => e._id);

// const captainAlreadyRegistered =
//   equipes?.some((eq) => equipesInscritesIds.includes(eq._id));
//   const handleInscription = () => {
//     if (!footballeurInfo) {
//       toast.info('Veuillez vous connecter');
//       router.push('/signin');
//       return;
//     }

//     if (isFull) {
//       toast.error('Compétition complète');
//       return;
//     }

//     dispatch(getMyCaptainEquipes());
//     setShowEquipeModal(true);
//   };

//   const handleEquipeSelect = (equipeId) => {
//     dispatch(registerEquipeCompetition(competition._id, equipeId));
//     setShowEquipeModal(false);
//   };

//   return (
//     <StadiumBackground>
//       <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
//         <h1 className="text-3xl font-extrabold text-center text-yellow-400">
//           {competition.nom}
//         </h1>

//         <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 space-y-3 text-white/90">
//           <p>🏷️ Type : {competition.type}</p>
//           <p>📌 Catégorie : {competition.categorie}</p>
//           <p>
//             👥 Équipes : {equipesInscrites.length} /{' '}
//             {competition.nbEquipes}
//           </p>
//           <p>
//             📅 Saison : {competition.dateDebut} →{' '}
//             {competition.dateFin}
//           </p>
//           <p>📊 Statut : {competition.status}</p>
//         </div>

// <button
//   disabled={isFull || captainAlreadyRegistered}
//   onClick={handleInscription}
//   className={`w-full py-3 rounded-xl font-bold
//     ${
//       isFull || captainAlreadyRegistered
//         ? "bg-gray-500 cursor-not-allowed"
//         : "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black"
//     }
//   `}
// >
//   {captainAlreadyRegistered
//     ? "✅ Déjà inscrit"
//     : "S’inscrire"}
// </button>

//         <button
//           onClick={() => router.push('/competition')}
//           className="w-full py-3 rounded-xl bg-gray-700 text-white font-bold"
//         >
//           ⬅️ Retour
//         </button>
//       </div>

//       {/* ================= MODAL ================= */}
//       {showEquipeModal && (
//         <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
//           <div className="bg-gray-900 p-6 rounded-xl w-full max-w-md space-y-4">
//             <h2 className="text-xl font-bold text-white text-center">
//               Choisir une équipe
//             </h2>

//             {loadingEquipes ? (
//               <Loader text="Chargement des équipes..." />
//             ) : equipes.length > 0 ? (
//               equipes.map((eq) => (
//                 <button
//                   key={eq._id}
//                   onClick={() => handleEquipeSelect(eq._id)}
//                   className="w-full py-2 rounded-lg bg-yellow-500 text-black font-bold"
//                 >
//                   ⚽ {eq.nom}
//                 </button>
//               ))
//             ) : (
//               <div className="text-center space-y-3">
//                 <p className="text-white">
//                   Vous n’avez aucune équipe
//                 </p>
//                 <button
//                   onClick={() => router.push('/equipes/create')}
//                   className="w-full py-2 rounded-lg bg-green-500 text-black font-bold"
//                 >
//                   ➕ Créer une équipe
//                 </button>
//               </div>
//             )}

//             <button
//               onClick={() => setShowEquipeModal(false)}
//               className="w-full py-2 rounded-lg bg-gray-600 text-white"
//             >
//               Annuler
//             </button>
//           </div>
//         </div>
//       )}
//     </StadiumBackground>
//   );
// }



// 'use client';

// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams, useRouter } from "next/navigation";
// import { toast } from "react-toastify";

// import StadiumBackground from "@/components/StadiumBackground";
// import Loader from "@/components/Loader";

// import {
//   getCompetitionDetails,
//   registerEquipeCompetition,
// } from "@/redux/actions/competitionActions";

// export default function CompetitionDetailsPage() {
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const router = useRouter();

//   const { competition, loading, error } = useSelector(
//     (state) => state.competitionDetails
//   );

//   const { footballeurInfo } = useSelector(
//     (state) => state.footballeurSignin
//   );

//   useEffect(() => {
//     dispatch(getCompetitionDetails(id));
//   }, [dispatch, id]);

//   if (loading)
//     return (
//       <div className="flex justify-center py-20">
//         <Loader text="Chargement de la compétition..." />
//       </div>
//     );

//   if (error) return <p className="text-red-500">{error}</p>;
//   if (!competition) return null;

// const equipesInscrites = competition?.equipesInscrites || [];

// const isFull =
//   equipesInscrites.length >= competition.nbEquipes;

//   // const isFull =
//   //   competition.equipesInscrites.length >= competition.nbEquipes;

//   const handleInscription = () => {
//     if (!footballeurInfo) {
//       toast.info("Veuillez vous connecter");
//       router.push("/signin");
//       return;
//     }

//     if (isFull) {
//       toast.error("Compétition complète");
//       return;
//     }

//     dispatch(getMyCaptainEquipes());
//   setShowEquipeModal(true);

//     // dispatch(
//     //   registerEquipeCompetition(
//     //     competition._id,
//     //     footballeurInfo.equipe // ⚠️ ID équipe
//     //   )
//     // );
//   };

//   return (
//     <StadiumBackground>
//       <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
//         <h1 className="text-3xl font-extrabold text-center text-yellow-400">
//           {competition.nom}
//         </h1>

//         <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 space-y-3 text-white/90">
//           <p>🏷️ Type : {competition.type}</p>
//           <p>📌 Catégorie : {competition.categorie}</p>
//          <p>
//   👥 Équipes : {equipesInscrites.length} / {competition.nbEquipes}
// </p>
         
//           {/* <p>
//             👥 Équipes : {competition.equipesInscrites.length} /{" "}
//             {competition.nbEquipes}
//           </p> */}
//           <p>
//             📅 Saison : {competition.dateDebut} → {competition.dateFin}
//           </p>
//           <p>📊 Statut : {competition.status}</p>
//         </div>

//         <button
//           disabled={isFull || competition.status !== "OUVERT"}
//           onClick={handleInscription}
//           className={`w-full py-3 rounded-xl font-bold ${
//             isFull
//               ? "bg-gray-600 text-gray-300"
//               : "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black"
//           }`}
//         >
//           {isFull ? "🚫 Compétition complète" : "✅ S’inscrire"}
//         </button>

//         <button
//           onClick={() => router.push("/competition")}
//           className="w-full py-3 rounded-xl bg-gray-700 text-white font-bold"
//         >
//           ⬅️ Retour
//         </button>
//       </div>
//     </StadiumBackground>
//   );
// }
