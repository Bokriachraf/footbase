"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCompetitionDetails } from "@/redux/actions/competitionActions";

export default function CompetitionDetailsPage({ params }) {
  const { id } = params;
  const dispatch = useDispatch();

  const { loading, error, competition } = useSelector(
    (state) => state.competitionDetails
  );

  useEffect(() => {
    dispatch(getCompetitionDetails(id));
  }, [dispatch, id]);

  if (loading) return <p className="text-center mt-6">Chargement...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-center">
        {competition.nom}
      </h1>

      <div className="mt-4 space-y-2 text-sm text-white/80">
        <p>📅 Début : {competition.dateDebut}</p>
        <p>🏁 Fin : {competition.dateFin}</p>
        <p>👥 Équipes max : {competition.nbEquipes}</p>
        <p>📍 Terrain : {competition.terrain?.nom}</p>
      </div>

      <button
        className="
          mt-6 w-full py-3 rounded-xl
          bg-green-500 text-black font-bold
          hover:bg-green-400 transition
        "
      >
        ✅ S’inscrire à la compétition
      </button>
    </div>
  );
}
