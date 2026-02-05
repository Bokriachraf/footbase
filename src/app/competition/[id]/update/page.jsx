'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import StadiumBackground from '@/components/StadiumBackground';
import Loader from '@/components/Loader';

import {
  getCompetitionDetails,
  updateCompetition,
} from '@/redux/actions/competitionActions';

import { listTerrains } from '@/redux/actions/terrainActions';

export default function CompetitionUpdatePage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const router = useRouter();

  /* ================= REDUX ================= */
  const { competition, loading, error } = useSelector(
    (state) => state.competitionDetails
  );

  const { proprietaireInfo } = useSelector(
    (state) => state.proprietaireSignin || {}
  );

  const { terrains } = useSelector((state) => state.terrainList || {});

  const { loading: updating } = useSelector(
    (state) => state.competitionUpdate || {}
  );

  /* ================= LOCAL STATE ================= */
  const [calendarState, setCalendarState] = useState([]);
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [competitionTerrains, setCompetitionTerrains] = useState([]);

  /* ================= FETCH ================= */
  useEffect(() => {
    dispatch(getCompetitionDetails(id));
    dispatch(listTerrains());
  }, [dispatch, id]);

  /* ================= INIT ================= */
  useEffect(() => {
    if (!competition) return;

    setDateDebut(competition.dateDebut || '');
    setDateFin(competition.dateFin || '');
    setCompetitionTerrains(competition.terrains || []);

    if (competition.calendrier) {
      setCalendarState(
        competition.calendrier.map((tour) => ({
          tour: tour.tour,
          matchs: tour.matchs.map((m) => ({
            matchId: m.matchId?._id,
            date: m.matchId?.date || '',
            heure: m.matchId?.heure || '',
            terrain: m.matchId?.terrain || '',
            equipeA: m.equipeA,
            equipeB: m.equipeB,
          })),
        }))
      );
    }
  }, [competition]);

  /* ================= GUARD ================= */
  const isOrganisateur =
    proprietaireInfo &&
    competition?.organisateur?._id === proprietaireInfo._id;

  if (loading) return <Loader text="Chargement..." />;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!competition) return null;

  if (!isOrganisateur) {
    toast.error('Accès réservé à l’organisateur');
    router.push(`/competition/${id}`);
    return null;
  }

  /* ================= HELPERS ================= */
  const persistTerrains = async (newTerrains) => {
    await dispatch(
      updateCompetition(id, {
        terrains: newTerrains.map((t) => t._id),
      })
    );

    dispatch(getCompetitionDetails(id));
  };

  /* ================= TERRAIN ACTIONS ================= */
  const removeCompetitionTerrain = async (terrainId) => {
    const newList = competitionTerrains.filter(
      (t) => t._id !== terrainId
    );

    setCompetitionTerrains(newList);
    await persistTerrains(newList);
    toast.success('🏟️ Terrain supprimé');
  };

  const addCompetitionTerrain = async (terrain) => {
    if (competitionTerrains.some((t) => t._id === terrain._id)) return;

    const newList = [...competitionTerrains, terrain];
    setCompetitionTerrains(newList);
    await persistTerrains(newList);
    toast.success('🏟️ Terrain ajouté');
  };

  /* ================= MATCH HANDLERS ================= */
  const updateMatchField = (tIndex, mIndex, field, value) => {
    const copy = [...calendarState];
    copy[tIndex].matchs[mIndex][field] = value;
    setCalendarState(copy);
  };

  /* ================= SAVE GLOBAL ================= */
  const handleSave = async () => {
    await dispatch(
      updateCompetition(id, {
        dateDebut,
        dateFin,
        calendrier: calendarState.map((t) => ({
          tour: t.tour,
          matchs: t.matchs.map((m) => ({
            matchId: m.matchId,
            date: m.date || undefined,
            heure: m.heure || undefined,
            terrain: m.terrain || undefined,
          })),
        })),
      })
    );

    toast.success('✅ Compétition mise à jour');
    dispatch(getCompetitionDetails(id));
  };

  /* ================= RENDER ================= */
  return (
    <StadiumBackground>
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 text-white">

        <h1 className="text-3xl font-extrabold text-center text-yellow-400">
          ⚙️ Mise à jour de la compétition
        </h1>

        {/* === DATES === */}
        <div className="bg-white/10 p-6 rounded-xl space-y-4">
          <h2 className="text-lg font-bold text-yellow-300">
            📅 Dates de la compétition
          </h2>

          <input
            type="date"
            value={dateDebut}
            onChange={(e) => setDateDebut(e.target.value)}
            className="w-full p-2 rounded bg-gray-800"
          />

          <input
            type="date"
            value={dateFin}
            onChange={(e) => setDateFin(e.target.value)}
            className="w-full p-2 rounded bg-gray-800"
          />
        </div>

        {/* === TERRAINS COMPETITION === */}
        <div className="bg-white/10 p-6 rounded-xl space-y-6">
          <h2 className="text-lg font-bold text-yellow-300">
            🏟️ Terrains de la compétition
          </h2>

          {/* Terrains liés */}
          <div>
            <p className="font-semibold mb-2">Terrains actuels</p>
            {competitionTerrains.length === 0 && (
              <p className="text-gray-400">Aucun terrain</p>
            )}

            {competitionTerrains.map((t) => (
              <div
                key={t._id}
                className="flex justify-between bg-black/40 p-3 rounded mb-2"
              >
                <span>{t.nom}</span>
                <button
                  onClick={() => removeCompetitionTerrain(t._id)}
                  className="text-red-400 font-bold"
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>

          {/* Tous les terrains */}
          <div>
            <p className="font-semibold mb-2">Ajouter un terrain</p>

            {terrains
              ?.filter(
                (t) =>
                  !competitionTerrains.some(
                    (ct) => ct._id === t._id
                  )
              )
              .map((t) => (
                <div
                  key={t._id}
                  className="flex justify-between bg-black/30 p-3 rounded mb-2"
                >
                  <span>{t.nom}</span>
                  <button
                    onClick={() => addCompetitionTerrain(t)}
                    className="text-green-400 font-bold"
                  >
                    Ajouter
                  </button>
                </div>
              ))}
          </div>
        </div>

        {/* === CALENDRIER MATCHS === */}
        {calendarState.map((tour, tIndex) => (
          <div key={tIndex} className="bg-white/10 p-6 rounded-xl">
            <h2 className="text-center font-bold text-yellow-300 mb-4">
              🏆 {tour.tour.replaceAll('_', ' ')}
            </h2>

            {tour.matchs.map((m, mIndex) => (
              <div key={m.matchId} className="bg-black/40 p-4 rounded mb-4">
                <div className="flex justify-between mb-2">
                  <span>{m.equipeA?.nom || '—'}</span>
                  <span className="text-yellow-400">VS</span>
                  <span>{m.equipeB?.nom || '—'}</span>
                </div>

                <input
                  type="date"
                  value={m.date}
                  onChange={(e) =>
                    updateMatchField(tIndex, mIndex, 'date', e.target.value)
                  }
                  className="w-full p-2 rounded bg-gray-800 mb-2"
                />

                <input
                  type="time"
                  value={m.heure}
                  onChange={(e) =>
                    updateMatchField(tIndex, mIndex, 'heure', e.target.value)
                  }
                  className="w-full p-2 rounded bg-gray-800 mb-2"
                />

                <select
                  value={m.terrain}
                  onChange={(e) =>
                    updateMatchField(tIndex, mIndex, 'terrain', e.target.value)
                  }
                  className="w-full p-2 rounded bg-gray-800"
                >
                  <option value="">Choisir terrain</option>
                  {competitionTerrains.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.nom}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        ))}

        <button
          disabled={updating}
          onClick={handleSave}
          className="w-full py-3 rounded-xl font-bold bg-green-600"
        >
          {updating ? '⏳ Enregistrement...' : '💾 Enregistrer'}
        </button>
      </div>
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
//   updateCompetition,
// } from '@/redux/actions/competitionActions';

// import { listTerrains } from '@/redux/actions/terrainActions';

// export default function CompetitionUpdatePage() {
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const router = useRouter();

//   /* ================= REDUX ================= */
//   const { competition, loading, error } = useSelector(
//     (state) => state.competitionDetails
//   );

//   const { proprietaireInfo } = useSelector(
//     (state) => state.proprietaireSignin || {}
//   );

//   const { terrains } = useSelector((state) => state.terrainList || {});

//   const { loading: updating } = useSelector(
//     (state) => state.competitionUpdate || {}
//   );

//   /* ================= LOCAL STATE ================= */
//   const [calendarState, setCalendarState] = useState([]);
//   const [dateDebut, setDateDebut] = useState('');
//   const [dateFin, setDateFin] = useState('');
//   const [competitionTerrains, setCompetitionTerrains] = useState([]);

//   /* ================= FETCH ================= */
//   useEffect(() => {
//     dispatch(getCompetitionDetails(id));
//     dispatch(listTerrains());
//   }, [dispatch, id]);

//   /* ================= INIT ================= */
//   useEffect(() => {
//     if (competition) {
//       setDateDebut(competition.dateDebut || '');
//       setDateFin(competition.dateFin || '');
//       setCompetitionTerrains(competition.terrains || []);

//       if (competition.calendrier) {
//         setCalendarState(
//           competition.calendrier.map((tour) => ({
//             tour: tour.tour,
//             matchs: tour.matchs.map((m) => ({
//               matchId: m.matchId?._id,
//               date: m.matchId?.date || '',
//               heure: m.matchId?.heure || '',
//               terrain: m.matchId?.terrain || '',
//               equipeA: m.equipeA,
//               equipeB: m.equipeB,
//             })),
//           }))
//         );
//       }
//     }
//   }, [competition]);

//   /* ================= GUARD ================= */
//   const isOrganisateur =
//     proprietaireInfo &&
//     competition?.organisateur?._id === proprietaireInfo._id;

//   if (loading) return <Loader text="Chargement..." />;
//   if (error) return <p className="text-red-500">{error}</p>;
//   if (!competition) return null;

//   if (!isOrganisateur) {
//     toast.error('Accès réservé à l’organisateur');
//     router.push(`/competition/${id}`);
//     return null;
//   }

//   /* ================= MATCH HANDLERS ================= */
//   const updateMatchField = (tIndex, mIndex, field, value) => {
//     const copy = [...calendarState];
//     copy[tIndex].matchs[mIndex][field] = value;
//     setCalendarState(copy);
//   };

//   /* ================= TERRAIN COMPETITION ================= */
//   const removeCompetitionTerrain = (terrainId) => {
//     setCompetitionTerrains(
//       competitionTerrains.filter((t) => t._id !== terrainId)
//     );
//   };

//   const addCompetitionTerrain = (terrain) => {
//     if (competitionTerrains.find((t) => t._id === terrain._id)) return;
//     setCompetitionTerrains([...competitionTerrains, terrain]);
//   };

//   /* ================= SAVE ================= */
//   const handleSave = async () => {
//     await dispatch(
//       updateCompetition(id, {
//         dateDebut,
//         dateFin,
//         terrains: competitionTerrains.map((t) => t._id),
//         calendrier: calendarState.map((t) => ({
//           tour: t.tour,
//           matchs: t.matchs.map((m) => ({
//             matchId: m.matchId,
//             date: m.date || undefined,
//             heure: m.heure || undefined,
//             terrain: m.terrain || undefined,
//           })),
//         })),
//       })
//     );

//     toast.success('✅ Compétition mise à jour');
//     dispatch(getCompetitionDetails(id));
//   };

//   /* ================= RENDER ================= */
//   return (
//     <StadiumBackground>
//       <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 text-white">

//         <h1 className="text-3xl font-extrabold text-center text-yellow-400">
//           ⚙️ Mise à jour de la compétition
//         </h1>

//         {/* === DATES COMPETITION === */}
//         <div className="bg-white/10 p-6 rounded-xl space-y-4">
//           <h2 className="font-bold text-lg text-yellow-300">
//             📅 Dates de la compétition
//           </h2>

//           <input
//             type="date"
//             value={dateDebut}
//             onChange={(e) => setDateDebut(e.target.value)}
//             className="w-full p-2 rounded bg-gray-800"
//           />

//           <input
//             type="date"
//             value={dateFin}
//             onChange={(e) => setDateFin(e.target.value)}
//             className="w-full p-2 rounded bg-gray-800"
//           />
//         </div>

//         {/* === TERRAINS COMPETITION === */}
//         <div className="bg-white/10 p-6 rounded-xl space-y-6">
//           <h2 className="font-bold text-lg text-yellow-300">
//             🏟️ Terrains de la compétition
//           </h2>

//           {/* Terrains liés */}
//           <div>
//             <p className="font-semibold mb-2">Terrains actuels</p>
//             {competitionTerrains.length === 0 && (
//               <p className="text-gray-400">Aucun terrain</p>
//             )}

//             {competitionTerrains.map((t) => (
//               <div
//                 key={t._id}
//                 className="flex justify-between bg-black/40 p-3 rounded mb-2"
//               >
//                 <span>{t.nom}</span>
//                 <button
//                   onClick={() => removeCompetitionTerrain(t._id)}
//                   className="text-red-400 font-bold"
//                 >
//                   Supprimer
//                 </button>
//               </div>
//             ))}
//           </div>

//           {/* Tous les terrains */}
//           <div>
//             <p className="font-semibold mb-2">Ajouter un terrain</p>
//             {terrains
//               ?.filter(
//                 (t) =>
//                   !competitionTerrains.some((ct) => ct._id === t._id)
//               )
//               .map((t) => (
//                 <div
//                   key={t._id}
//                   className="flex justify-between bg-black/30 p-3 rounded mb-2"
//                 >
//                   <span>{t.nom}</span>
//                   <button
//                     onClick={() => addCompetitionTerrain(t)}
//                     className="text-green-400 font-bold"
//                   >
//                     Ajouter
//                   </button>
//                 </div>
//               ))}
//           </div>
//         </div>

//         {/* === CALENDRIER MATCHS (EXISTANT) === */}
//         {calendarState.map((tour, tIndex) => (
//           <div key={tIndex} className="bg-white/10 p-6 rounded-xl">
//             <h2 className="text-center font-bold text-yellow-300 mb-4">
//               🏆 {tour.tour.replaceAll('_', ' ')}
//             </h2>

//             {tour.matchs.map((m, mIndex) => (
//               <div key={m.matchId} className="bg-black/40 p-4 rounded mb-4">
//                 <div className="flex justify-between mb-2">
//                   <span>{m.equipeA?.nom || '—'}</span>
//                   <span className="text-yellow-400">VS</span>
//                   <span>{m.equipeB?.nom || '—'}</span>
//                 </div>

//                 <input
//                   type="date"
//                   value={m.date}
//                   onChange={(e) =>
//                     updateMatchField(tIndex, mIndex, 'date', e.target.value)
//                   }
//                   className="w-full p-2 rounded bg-gray-800 mb-2"
//                 />

//                 <input
//                   type="time"
//                   value={m.heure}
//                   onChange={(e) =>
//                     updateMatchField(tIndex, mIndex, 'heure', e.target.value)
//                   }
//                   className="w-full p-2 rounded bg-gray-800 mb-2"
//                 />

//                 <select
//                   value={m.terrain}
//                   onChange={(e) =>
//                     updateMatchField(tIndex, mIndex, 'terrain', e.target.value)
//                   }
//                   className="w-full p-2 rounded bg-gray-800"
//                 >
//                   <option value="">Choisir terrain</option>
//                   {competitionTerrains.map((t) => (
//                     <option key={t._id} value={t._id}>
//                       {t.nom}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             ))}
//           </div>
//         ))}

//         <button
//           disabled={updating}
//           onClick={handleSave}
//           className="w-full py-3 rounded-xl font-bold bg-green-600"
//         >
//           {updating ? '⏳ Enregistrement...' : '💾 Enregistrer'}
//         </button>
//       </div>
//     </StadiumBackground>
//   );
// }



// "use client";

// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams, useRouter } from "next/navigation";
// import { toast } from "react-toastify";

// import StadiumBackground from "@/components/StadiumBackground";
// import Loader from "@/components/Loader";

// import {
//   getCompetitionDetails,
//   updateCompetition,
// } from "@/redux/actions/competitionActions";

// export default function CompetitionUpdatePage() {
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const router = useRouter();

//   /* ================= REDUX ================= */
//   const { competition, loading, error } = useSelector(
//     (state) => state.competitionDetails
//   );

//   const { proprietaireInfo } = useSelector(
//     (state) => state.proprietaireSignin || {}
//   );

//   const { loading: updating } = useSelector(
//     (state) => state.competitionUpdate || {}
//   );

//   /* ================= LOCAL STATE ================= */
//   const [calendarState, setCalendarState] = useState([]);

//   /* ================= FETCH ================= */
//   useEffect(() => {
//     console.log("📥 getCompetitionDetails:", id);
//     dispatch(getCompetitionDetails(id));
//   }, [dispatch, id]);

//   /* ================= INIT CALENDAR ================= */
//   useEffect(() => {
//     if (competition?.calendrier) {
//       console.log("📅 Init calendarState");
//       setCalendarState(
//         competition.calendrier.map((tour) => ({
//           tour: tour.tour,
//           matchs: tour.matchs.map((m) => ({
//             matchId: m.matchId?._id,
//             date: m.matchId?.date || "",
//             heure: m.matchId?.heure || "",
//             terrain: m.matchId?.terrain || "",
//             equipeA: m.equipeA,
//             equipeB: m.equipeB,
//           })),
//         }))
//       );
//     }
//   }, [competition]);

//   /* ================= GUARD ================= */
//   const isOrganisateur =
//     proprietaireInfo &&
//     competition?.organisateur?._id === proprietaireInfo._id;

//   if (loading)
//     return (
//       <div className="flex justify-center py-20">
//         <Loader text="Chargement..." />
//       </div>
//     );

//   if (error) return <p className="text-red-500">{error}</p>;
//   if (!competition) return null;

//   if (!isOrganisateur) {
//     toast.error("Accès réservé à l’organisateur");
//     router.push(`/competition/${id}`);
//     return null;
//   }

//   /* ================= HANDLERS ================= */
//   const updateMatchField = (tourIndex, matchIndex, field, value) => {
//     console.log("✏️ updateMatchField", { tourIndex, matchIndex, field, value });

//     const copy = [...calendarState];
//     copy[tourIndex].matchs[matchIndex][field] = value;
//     setCalendarState(copy);
//   };

//   const handleSave = async () => {
//     console.log("💾 Saving competition update:", calendarState);

//     await dispatch(
//       updateCompetition(id, {
//         calendrier: calendarState.map((t) => ({
//           tour: t.tour,
//           matchs: t.matchs.map((m) => ({
//             matchId: m.matchId,
//             date: m.date || undefined,
//             heure: m.heure || undefined,
//             terrain: m.terrain || undefined,
//           })),
//         })),
//       })
//     );

//     toast.success("✅ Calendrier mis à jour");
//     dispatch(getCompetitionDetails(id));
//   };

//   /* ================= RENDER ================= */
//   return (
//     <StadiumBackground>
//       <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 text-white">

//         <h1 className="text-3xl font-extrabold text-center text-yellow-400">
//           ✏️ Planification des matchs
//         </h1>

//         {calendarState.map((tour, tIndex) => (
//           <div
//             key={tIndex}
//             className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 space-y-4"
//           >
//             <h2 className="text-xl font-bold text-yellow-300 text-center">
//               🏆 {tour.tour.replaceAll("_", " ")}
//             </h2>

//             {tour.matchs.map((m, mIndex) => (
//               <div
//                 key={m.matchId}
//                 className="bg-black/40 p-4 rounded-xl space-y-3"
//               >
//                 <div className="flex justify-between font-semibold">
//                   <span>{m.equipeA?.nom || "À définir"}</span>
//                   <span className="text-yellow-400">VS</span>
//                   <span>{m.equipeB?.nom || "À définir"}</span>
//                 </div>

//                 <input
//                   type="date"
//                   value={m.date}
//                   onChange={(e) =>
//                     updateMatchField(tIndex, mIndex, "date", e.target.value)
//                   }
//                   className="w-full p-2 rounded bg-gray-800"
//                 />

//                 <input
//                   type="time"
//                   value={m.heure}
//                   onChange={(e) =>
//                     updateMatchField(tIndex, mIndex, "heure", e.target.value)
//                   }
//                   className="w-full p-2 rounded bg-gray-800"
//                 />

//                 <select
//                   value={m.terrain}
//                   onChange={(e) =>
//                     updateMatchField(tIndex, mIndex, "terrain", e.target.value)
//                   }
//                   className="w-full p-2 rounded bg-gray-800"
//                 >
//                   <option value="">🏟️ Choisir un terrain</option>
//                   {competition.terrains.map((t) => (
//                     <option key={t._id} value={t._id}>
//                       {t.nom} – {t.ville}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             ))}
//           </div>
//         ))}

//         <button
//           disabled={updating}
//           onClick={handleSave}
//           className="w-full py-3 rounded-xl font-bold
//                      bg-gradient-to-r from-green-500 to-green-600"
//         >
//           {updating ? "⏳ Enregistrement..." : "💾 Enregistrer"}
//         </button>

//         <button
//           onClick={() => router.push(`/competition/${id}`)}
//           className="w-full py-3 rounded-xl bg-gray-700 font-bold"
//         >
//           ⬅️ Retour
//         </button>
//       </div>
//     </StadiumBackground>
//   );
// }


// "use client";

// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams, useRouter } from "next/navigation";
// import { toast } from "react-toastify";

// import StadiumBackground from "@/components/StadiumBackground";
// import Loader from "@/components/Loader";

// import {
//   getCompetitionDetails,
//   updateCompetition,
// } from "@/redux/actions/competitionActions";

// export default function CompetitionUpdatePage() {
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const router = useRouter();

//   /* ================= REDUX ================= */
//   const { competition, loading, error } = useSelector(
//     (state) => state.competitionDetails
//   );

//   const { proprietaireInfo } = useSelector(
//     (state) => state.proprietaireSignin || {}
//   );

//   const { loading: updating } = useSelector(
//     (state) => state.competitionUpdate || {}
//   );

//   /* ================= LOCAL STATE ================= */
//   const [dateDebut, setDateDebut] = useState("");
//   const [dateFin, setDateFin] = useState("");

//   const [competitionTerrains, setCompetitionTerrains] = useState([]);
//   const [calendarState, setCalendarState] = useState([]);

//   /* ================= FETCH ================= */
//   useEffect(() => {
//     dispatch(getCompetitionDetails(id));
//   }, [dispatch, id]);

//   /* ================= INIT ================= */
//   useEffect(() => {
//     if (!competition) return;

//     console.log("📦 INIT UPDATE PAGE", competition);

//     setDateDebut(competition.dateDebut || "");
//     setDateFin(competition.dateFin || "");

//     setCompetitionTerrains(
//       competition.terrains?.map((t) => t._id) || []
//     );

//     setCalendarState(
//       competition.calendrier?.map((tour) => ({
//         tour: tour.tour,
//         matchs: tour.matchs.map((m) => ({
//           matchId: m.matchId?._id,
//           date: m.matchId?.date || "",
//           heure: m.matchId?.heure || "",
//           terrain: m.matchId?.terrain || "",
//           equipeA: m.equipeA,
//           equipeB: m.equipeB,
//         })),
//       })) || []
//     );
//   }, [competition]);

//   /* ================= GUARD ================= */
//   const isOrganisateur =
//     proprietaireInfo &&
//     competition?.organisateur?._id === proprietaireInfo._id;

//   if (loading)
//     return (
//       <div className="flex justify-center py-20">
//         <Loader text="Chargement..." />
//       </div>
//     );

//   if (error) return <p className="text-red-500">{error}</p>;
//   if (!competition) return null;

//   if (!isOrganisateur) {
//     toast.error("Accès réservé à l’organisateur");
//     router.push(`/competition/${id}`);
//     return null;
//   }

//   /* ================= HANDLERS ================= */
//   const toggleCompetitionTerrain = (terrainId) => {
//     setCompetitionTerrains((prev) =>
//       prev.includes(terrainId)
//         ? prev.filter((id) => id !== terrainId)
//         : [...prev, terrainId]
//     );
//   };

//   const updateMatchField = (tIndex, mIndex, field, value) => {
//     const copy = [...calendarState];
//     copy[tIndex].matchs[mIndex][field] = value;
//     setCalendarState(copy);
//   };

//   const handleSave = async () => {
//     const payload = {
//       dateDebut,
//       dateFin,
//       terrains: competitionTerrains,
//       calendrier: calendarState.map((t) => ({
//         tour: t.tour,
//         matchs: t.matchs.map((m) => ({
//           matchId: m.matchId,
//           date: m.date || undefined,
//           heure: m.heure || undefined,
//           terrain: m.terrain || undefined,
//         })),
//       })),
//     };

//     console.log("📤 UPDATE PAYLOAD:", payload);

//     await dispatch(updateCompetition(id, payload));

//     toast.success("✅ Compétition mise à jour");
//     dispatch(getCompetitionDetails(id));
//   };

//   /* ================= RENDER ================= */
//   return (
//     <StadiumBackground>
//       <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 text-white">

//         <h1 className="text-3xl font-extrabold text-center text-yellow-400">
//           ⚙️ Gestion de la compétition
//         </h1>

//         {/* ================= PARAMÈTRES ================= */}
//         <section className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 space-y-4">
//           <h2 className="text-xl font-bold text-yellow-300">
//             📅 Paramètres généraux
//           </h2>

//           <div className="grid md:grid-cols-2 gap-4">
//             <div>
//               <label className="text-sm">Date début</label>
//               <input
//                 type="date"
//                 value={dateDebut}
//                 onChange={(e) => setDateDebut(e.target.value)}
//                 className="w-full p-2 rounded bg-gray-800"
//               />
//             </div>

//             <div>
//               <label className="text-sm">Date fin</label>
//               <input
//                 type="date"
//                 value={dateFin}
//                 onChange={(e) => setDateFin(e.target.value)}
//                 className="w-full p-2 rounded bg-gray-800"
//               />
//             </div>
//           </div>
//         </section>

//         {/* ================= TERRAINS COMPÉTITION ================= */}
//         <section className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 space-y-4">
//           <h2 className="text-xl font-bold text-yellow-300">
//             🏟️ Terrains autorisés pour la compétition
//           </h2>

//           <div className="grid md:grid-cols-2 gap-3">
//             {competition.terrains.map((t) => (
//               <label
//                 key={t._id}
//                 className="flex items-center gap-3 bg-black/40 p-3 rounded-lg cursor-pointer"
//               >
//                 <input
//                   type="checkbox"
//                   checked={competitionTerrains.includes(t._id)}
//                   onChange={() => toggleCompetitionTerrain(t._id)}
//                 />
//                 <span>
//                   {t.nom} — {t.ville}
//                 </span>
//               </label>
//             ))}
//           </div>
//         </section>

//         {/* ================= MATCHS ================= */}
//         <section className="space-y-6">
//           <h2 className="text-2xl font-bold text-center text-yellow-400">
//             🗓️ Planification des matchs
//           </h2>

//           {calendarState.map((tour, tIndex) => (
//             <div
//               key={tIndex}
//               className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 space-y-4"
//             >
//               <h3 className="text-lg font-bold text-yellow-300 text-center">
//                 🏆 {tour.tour.replaceAll("_", " ")}
//               </h3>

//               {tour.matchs.map((m, mIndex) => (
//                 <div
//                   key={m.matchId}
//                   className="bg-black/40 p-4 rounded-xl space-y-3"
//                 >
//                   <div className="flex justify-between font-semibold">
//                     <span>{m.equipeA?.nom}</span>
//                     <span className="text-yellow-400">VS</span>
//                     <span>{m.equipeB?.nom}</span>
//                   </div>

//                   <div className="grid md:grid-cols-3 gap-3">
//                     <input
//                       type="date"
//                       value={m.date}
//                       onChange={(e) =>
//                         updateMatchField(
//                           tIndex,
//                           mIndex,
//                           "date",
//                           e.target.value
//                         )
//                       }
//                       className="p-2 rounded bg-gray-800"
//                     />

//                     <input
//                       type="time"
//                       value={m.heure}
//                       onChange={(e) =>
//                         updateMatchField(
//                           tIndex,
//                           mIndex,
//                           "heure",
//                           e.target.value
//                         )
//                       }
//                       className="p-2 rounded bg-gray-800"
//                     />

//                     <select
//                       value={m.terrain}
//                       onChange={(e) =>
//                         updateMatchField(
//                           tIndex,
//                           mIndex,
//                           "terrain",
//                           e.target.value
//                         )
//                       }
//                       className="p-2 rounded bg-gray-800"
//                     >
//                       <option value="">🏟️ Terrain</option>
//                       {competition.terrains
//                         .filter((t) =>
//                           competitionTerrains.includes(t._id)
//                         )
//                         .map((t) => (
//                           <option key={t._id} value={t._id}>
//                             {t.nom} — {t.ville}
//                           </option>
//                         ))}
//                     </select>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ))}
//         </section>

//         {/* ================= ACTIONS ================= */}
//         <button
//           disabled={updating}
//           onClick={handleSave}
//           className="w-full py-4 rounded-xl font-bold
//                      bg-gradient-to-r from-green-500 to-green-600"
//         >
//           {updating ? "⏳ Enregistrement..." : "💾 Enregistrer les modifications"}
//         </button>

//         <button
//           onClick={() => router.push(`/competition/${id}`)}
//           className="w-full py-3 rounded-xl bg-gray-700 font-bold"
//         >
//           ⬅️ Retour
//         </button>
//       </div>
//     </StadiumBackground>
//   );
// }





// "use client";

// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams, useRouter } from "next/navigation";
// import { toast } from "react-toastify";

// import Loader from "@/components/Loader";

// import {
//   getCompetitionDetails,
//   updateCompetition,
// } from "@/redux/actions/competitionActions";

// import { listTerrains } from "@/redux/actions/terrainActions";

// export default function CompetitionUpdatePage() {
//   const dispatch = useDispatch();
//   const router = useRouter();
//   const { id } = useParams();

//   /* =======================
//      REDUX STATES
//   ======================= */

//   const { loading, error, competition } = useSelector(
//     (state) => state.competitionDetails
//   );

//   const { loading: loadingUpdate, success: successUpdate } = useSelector(
//     (state) => state.competitionUpdate
//   );

//   const { terrains } = useSelector((state) => state.terrainList);

//   const { userInfo } = useSelector((state) => state.userLogin);

//   /* =======================
//      LOCAL STATES
//   ======================= */

//   const [dateDebut, setDateDebut] = useState("");
//   const [dateFin, setDateFin] = useState("");
//   const [competitionTerrains, setCompetitionTerrains] = useState([]);

//   /* =======================
//      EFFECTS
//   ======================= */

//   useEffect(() => {
//     console.log("🔄 Fetch competition + terrains");
//     dispatch(getCompetitionDetails(id));
//     dispatch(listTerrains());
//   }, [dispatch, id]);

//   useEffect(() => {
//     if (competition) {
//       console.log("📦 Competition reçue :", competition);

//       setDateDebut(competition.dateDebut || "");
//       setDateFin(competition.dateFin || "");
//       setCompetitionTerrains(competition.terrains || []);
//     }
//   }, [competition]);

//   useEffect(() => {
//     if (successUpdate) {
//       toast.success("✅ Compétition mise à jour");
//       router.push(`/competition/${id}`);
//     }
//   }, [successUpdate, router, id]);

//   /* =======================
//      AUTH CHECK
//   ======================= */

//   if (
//     competition &&
//     userInfo &&
//     competition.organisateur !== userInfo._id
//   ) {
//     return (
//       <p className="text-center text-red-500 mt-10">
//         Accès refusé – vous n’êtes pas l’organisateur
//       </p>
//     );
//   }

//   /* =======================
//      HANDLERS
//   ======================= */

//   const addTerrain = (terrain) => {
//     console.log("➕ Ajout terrain :", terrain);

//     if (competitionTerrains.find((t) => t._id === terrain._id)) {
//       toast.info("Terrain déjà ajouté");
//       return;
//     }

//     setCompetitionTerrains([...competitionTerrains, terrain]);
//   };

//   const removeTerrain = (terrainId) => {
//     console.log("❌ Suppression terrain :", terrainId);

//     setCompetitionTerrains(
//       competitionTerrains.filter((t) => t._id !== terrainId)
//     );
//   };

//   const submitHandler = (e) => {
//     e.preventDefault();

//     const payload = {
//       dateDebut,
//       dateFin,
//       terrains: competitionTerrains.map((t) => t._id),
//     };

//     console.log("📤 Payload update competition :", payload);

//     dispatch(updateCompetition(id, payload));
//   };

//   /* =======================
//      RENDER
//   ======================= */

//   if (loading) return <Loader />;
//   if (error)
//     return (
//       <p className="text-center text-red-500 mt-10">{error}</p>
//     );

//   return (
//     <div className="max-w-5xl mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-6">
//         Modifier la compétition
//       </h1>

//       <form
//         onSubmit={submitHandler}
//         className="bg-white shadow rounded-lg p-6 space-y-6"
//       >
//         {/* Dates */}
//         <div className="grid md:grid-cols-2 gap-4">
//           <div>
//             <label className="block font-medium mb-1">
//               Date début
//             </label>
//             <input
//               type="date"
//               value={dateDebut}
//               onChange={(e) => setDateDebut(e.target.value)}
//               className="w-full border rounded p-2"
//             />
//           </div>

//           <div>
//             <label className="block font-medium mb-1">
//               Date fin
//             </label>
//             <input
//               type="date"
//               value={dateFin}
//               onChange={(e) => setDateFin(e.target.value)}
//               className="w-full border rounded p-2"
//             />
//           </div>
//         </div>

//         {/* Terrains */}
//         <div className="grid md:grid-cols-2 gap-6">
//           {/* Terrains de la compétition */}
//           <div>
//             <h2 className="font-semibold mb-2">
//               Terrains de la compétition
//             </h2>

//             {competitionTerrains.length === 0 && (
//               <p className="text-sm text-gray-500">
//                 Aucun terrain associé
//               </p>
//             )}

//             <ul className="space-y-2">
//               {competitionTerrains.map((terrain) => (
//                 <li
//                   key={terrain._id}
//                   className="flex justify-between items-center border p-2 rounded"
//                 >
//                   <span>{terrain.nom}</span>
//                   <button
//                     type="button"
//                     onClick={() => removeTerrain(terrain._id)}
//                     className="text-red-600 hover:underline"
//                   >
//                     Supprimer
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Tous les terrains */}
//           <div>
//             <h2 className="font-semibold mb-2">
//               Tous les terrains disponibles
//             </h2>

//             <ul className="space-y-2 max-h-80 overflow-y-auto">
//               {terrains &&
//                 terrains.map((terrain) => (
//                   <li
//                     key={terrain._id}
//                     className="flex justify-between items-center border p-2 rounded"
//                   >
//                     <span>{terrain.nom}</span>
//                     <button
//                       type="button"
//                       onClick={() => addTerrain(terrain)}
//                       className="text-blue-600 hover:underline"
//                     >
//                       Ajouter
//                     </button>
//                   </li>
//                 ))}
//             </ul>
//           </div>
//         </div>

//         {/* Submit */}
//         <div className="flex justify-end">
//           <button
//             type="submit"
//             disabled={loadingUpdate}
//             className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
//           >
//             {loadingUpdate ? "Mise à jour..." : "Enregistrer"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }
