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
    (state) => state.footballeurSignin || {}
  );

  const { proprietaireInfo } = useSelector(
  (state) => state.proprietaireSignin || {}
);

const isOrganisateur =
  proprietaireInfo &&
  competition.organisateur?._id === proprietaireInfo._id;
  const {
    equipes,
    loading: loadingEquipes,
  } = useSelector((state) => state.myCaptainEquipes);

const isMatchOwner = (match) => {
  if (!proprietaireInfo || !match?.matchId?.proprietaire) return false;

  const ownerId = match.matchId.proprietaire._id
    ? match.matchId.proprietaire._id
    : match.matchId.proprietaire;

  return ownerId.toString() === proprietaireInfo._id.toString();
};


// const isMatchOwner = (match) => {
//   if (!proprietaireInfo || !match?.matchId?.proprietaire) return false;

//   const ownerId =
//     typeof match.matchId.proprietaire === "object"
//       ? match.matchId.proprietaire._id
//       : match.matchId.proprietaire;

//   return ownerId.toString() === proprietaireInfo._id.toString();
// };

const hasMatchStarted = (match) => {
  if (!match.matchId?.date || !match.matchId?.heure) return false;

  const [y, m, d] = match.matchId.date.split("-");
  const [h, min] = match.matchId.heure.split(":");

  const matchDate = new Date(y, m - 1, d, h, min);
  return new Date() >= matchDate;
};


// const hasMatchStarted = (match) => {
//   if (!match.matchId?.date || !match.matchId?.heure) return false;
//   const now = new Date();
//   const matchDate = new Date(`${match.matchId.date} ${match.matchId.heure}`);
//   return now >= matchDate;
// };


const [showScoreModal, setShowScoreModal] = useState(false);
const [selectedMatch, setSelectedMatch] = useState(null);
const [scoreA, setScoreA] = useState("");
const [scoreB, setScoreB] = useState("");

const openScoreModal = (match) => {
  setSelectedMatch(match);
  setScoreA("");
  setScoreB("");
  setShowScoreModal(true);
};

const submitScore = async () => {
  if (!scoreA || !scoreB) {
    toast.error("Veuillez saisir les deux scores");
    return;
  }

  try {
    await dispatch(
      updateMatchScore(selectedMatch.matchId._id, {
        equipeA: Number(scoreA),
        equipeB: Number(scoreB),
      })
    );

    toast.success("✅ Score enregistré");
    setShowScoreModal(false);
    dispatch(getCompetitionDetails(id));
  } catch {
    toast.error("❌ Erreur lors de l’enregistrement du score");
  }
};

  /* ================= FETCH ================= */
  useEffect(() => {
    dispatch(getCompetitionDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (footballeurInfo) {
      dispatch(getMyCaptainEquipes());
    }
  }, [dispatch, footballeurInfo]);

  /* ================= GUARDS ================= */
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

  const handleEquipeSelect = async (equipeId) => {
    try {
      const res = await dispatch(
        registerEquipeCompetition(competition._id, equipeId)
      );

      setShowEquipeModal(false);
      await dispatch(getCompetitionDetails(id));

      if (res.calendrierGenere) {
        toast.success("🎉 Inscription réussie & calendrier généré !");
      } else {
        toast.success("✅ Équipe inscrite avec succès");
      }
    } catch {
      toast.error("❌ Erreur lors de l'inscription");
    }
  };

const renderEquipe = (equipe, fromMatch) => {
  if (equipe) return equipe.nom;

  if (fromMatch?.equipeA && fromMatch?.equipeB) {
    return `Vainqueur de ${fromMatch.equipeA.nom} vs ${fromMatch.equipeB.nom}`;
  }

  return "À définir";
};

  /* ================= RENDER ================= */
  return (
    <StadiumBackground>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <h1 className="text-3xl font-extrabold text-center text-yellow-400">
          {competition.nom}
        </h1>

        {/* ================= INFOS ================= */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 space-y-3 text-white/90">
          <p>🏷️ Type : {competition.type}</p>
          <p>📌 Catégorie : {competition.categorie}</p>
          <p>
            👥 Équipes : {equipesInscrites.length} / {competition.nbEquipes}
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



     {/* ================= CALENDRIER ================= */}

        {competition.calendrier?.length > 0 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 space-y-6 text-white">
            <h2 className="text-2xl font-bold text-yellow-400 text-center">
              📅 Calendrier de la compétition
            </h2>

            {competition.calendrier.map((tour, index) => (
              <div key={index} className="space-y-3">
                <h3 className="text-lg font-semibold text-center text-yellow-300">
                  🏆 {tour.tour.replaceAll("_", " ")}
                </h3>

                {tour.matchs.map((match, i) => {
                  // const hasDate = match.date && match.heure;
                   const hasDate = match.matchId?.date && match.matchId?.heure;
                  return (
                    <div
                      key={i}
                      className="bg-black/40 p-4 rounded-xl space-y-2"
                    >



<div
  className="
    flex flex-col gap-2 text-center
    sm:flex-row sm:items-center sm:justify-between
    sm:gap-4
  "
>
  <span
    className="
      text-sm sm:text-base
      font-semibold
      text-blue-300
      break-words
    "
  >
    {renderEquipe(match.equipeA, match.fromMatchA)}
  </span>

  <span
    className="
      text-xs sm:text-sm
      font-bold
      text-yellow-400
      shrink-0
    "
  >
    VS
  </span>

  <span
    className="
      text-sm sm:text-base
      font-semibold
      text-red-300
      break-words
    "
  >
    {renderEquipe(match.equipeB, match.fromMatchB)}
  </span>
</div>




                      {/* DATE / HEURE */}
                     
                     {match.matchId?.date && match.matchId?.heure ? (
                      <div className="text-center text-sm text-green-400">
                        📅 {match.matchId.date} &nbsp; ⏰ {match.matchId.heure}
                     </div>
                        ) : (
                      <div className="text-center text-sm text-white/60 italic">
                       ⏳ Date et heure pas encore fixées
                      </div>
                      )}
  
                    {match.matchId?.terrain ? (
                       <div className="text-center text-sm text-green-400">
                        🏟️ {match.matchId.terrain.nom}
                              <br />
                      📍 {match.matchId.terrain.adresse}
                            </div>
                                ) : (
                           <div className="text-center text-sm text-white/60 italic">
                                 Le terrain pas encore fixé
                               </div>
                            )}  
                            {isMatchOwner(match) &&
  hasMatchStarted(match) && (
    <div className="flex justify-center pt-2">
      <button
        onClick={() => openScoreModal(match)}
        className="px-4 py-2 rounded-lg
                   bg-gradient-to-r from-green-500 to-green-600
                   text-black font-bold text-sm
                   hover:from-green-600 hover:to-green-700"
      >
        ➕ Ajouter le score
      </button>
    </div>
)}
     
          
                    </div>
                  );
                })}                
              </div>
            ))}
          </div>          
        )}


        {/* ================= ACTION ORGANISATEUR ================= */}
{isOrganisateur && (
  <div className="flex justify-center">
    <button
      onClick={() =>
        router.push(`/competition/${competition._id}/update`)
      }
      className="px-6 py-3 rounded-xl
                 bg-gradient-to-r from-blue-500 to-blue-600
                 text-white font-bold
                 hover:from-blue-600 hover:to-blue-700
                 transition"
    >
      ✏️ Modifier la compétition
    </button>
  </div>
)}

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
          {captainAlreadyRegistered ? "✅ Déjà inscrit" : "S’inscrire"}
        </button>€

        <button
          onClick={() => router.push("/competition")}
          className="w-full py-3 rounded-xl bg-gray-700 text-white font-bold"
        >
          ⬅️ Retour
        </button>
      </div>

   {showScoreModal && selectedMatch && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
    <div className="bg-gray-900 p-6 rounded-xl w-full max-w-sm space-y-4">
      <h2 className="text-xl font-bold text-white text-center">
        ⚽ Ajouter le score
      </h2>

      <div className="flex justify-between items-center gap-4">
        <input
          type="number"
          min="0"
          value={scoreA}
          onChange={(e) => setScoreA(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 text-white text-center"
          placeholder="Score A"
        />
        <span className="text-yellow-400 font-bold">VS</span>
        <input
          type="number"
          min="0"
          value={scoreB}
          onChange={(e) => setScoreB(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 text-white text-center"
          placeholder="Score B"
        />
      </div>

      <button
        onClick={submitScore}
        className="w-full py-2 rounded-lg bg-green-500 text-black font-bold"
      >
        ✅ Valider le score
      </button>

      <button
        onClick={() => setShowScoreModal(false)}
        className="w-full py-2 rounded-lg bg-gray-600 text-white"
      >
        Annuler
      </button>
    </div>
  </div>
)}


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

        // {competition.calendrier?.length > 0 && (
        //   <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 space-y-6 text-white">
        //     <h2 className="text-2xl font-bold text-yellow-400 text-center">
        //       📅 Calendrier de la compétition
        //     </h2>

        //     {competition.calendrier.map((tour, index) => (
        //       <div key={index} className="space-y-3">
        //         <h3 className="text-lg font-semibold text-center text-yellow-300">
        //           🏆 {tour.tour.replaceAll("_", " ")}
        //         </h3>

        //         {tour.matchs.map((match, i) => {
        //           // const hasDate = match.date && match.heure;
        //            const hasDate = match.matchId?.date && match.matchId?.heure;
        //           return (
        //             <div
        //               key={i}
        //               className="bg-black/40 p-4 rounded-xl space-y-2"
        //             >
        //               <div className="flex justify-between items-center font-semibold">
        //                 <span>{match.equipeA?.nom || "À définir"}</span>
        //                 <span className="text-yellow-400">VS</span>
        //                 <span>{match.equipeB?.nom || "À définir"}</span>
        //               </div>

        //               {/* DATE / HEURE */}
                     
        //              {match.matchId?.date && match.matchId?.heure ? (
        //               <div className="text-center text-sm text-green-400">
        //                 📅 {match.matchId.date} &nbsp; ⏰ {match.matchId.heure}
        //              </div>
        //                 ) : (
        //               <div className="text-center text-sm text-white/60 italic">
        //                ⏳ Date et heure pas encore fixées
        //               </div>
        //               )}
  
        //             {match.matchId?.terrain ? (
        //                <div className="text-center text-sm text-green-400">
        //                 🏟️ {match.matchId.terrain.nom}
        //                       <br />
        //               📍 {match.matchId.terrain.adresse}
        //                     </div>
        //                         ) : (
        //                    <div className="text-center text-sm text-white/60 italic">
        //                          Le terrain pas encore fixé
        //                        </div>
        //                     )}                    
        //             </div>
        //           );
        //         })}
        //       </div>
        //     ))}
        //   </div>
        // )}
