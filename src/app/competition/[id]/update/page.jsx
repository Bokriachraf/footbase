"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import StadiumBackground from "@/components/StadiumBackground";
import Loader from "@/components/Loader";

import {
  getCompetitionDetails,
  updateCompetition,
} from "@/redux/actions/competitionActions";

export default function CompetitionUpdatePage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  /* ================= REDUX ================= */
  const { loading, competition, error } = useSelector(
    (state) => state.competitionDetails
  );

  const { proprietaireInfo } = useSelector(
    (state) => state.proprietaireSignin || {}
  );

  const {
    loading: loadingUpdate,
    success: successUpdate,
    error: errorUpdate,
  } = useSelector((state) => state.competitionUpdate || {});

  /* ================= LOCAL STATE ================= */
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [nbEquipes, setNbEquipes] = useState(8);
  const [terrains, setTerrains] = useState([]);
  const [localCalendrier, setLocalCalendrier] = useState([]);

  /* ================= FETCH ================= */
  useEffect(() => {
    console.log("📡 Fetch competition:", id);
    dispatch(getCompetitionDetails(id));
  }, [dispatch, id]);

  /* ================= INIT FORM ================= */
  useEffect(() => {
    if (competition?._id) {
      console.log("🟢 Competition loaded");

      setDateDebut(competition.dateDebut);
      setDateFin(competition.dateFin);
      setNbEquipes(competition.nbEquipes);
      setTerrains(competition.terrains || []);

      // 🔥 CLONE PROFOND (ANTI-MUTATION REDUX)
      const clonedCalendrier = JSON.parse(
        JSON.stringify(competition.calendrier || [])
      );
      setLocalCalendrier(clonedCalendrier);

      console.log("📅 Calendrier cloné:", clonedCalendrier);
    }
  }, [competition]);

  /* ================= ACCESS CONTROL ================= */
  useEffect(() => {
    if (
      competition?.organisateur?._id &&
      proprietaireInfo?._id &&
      competition.organisateur._id !== proprietaireInfo._id
    ) {
      toast.error("Accès refusé");
      router.push(`/competition/${id}`);
    }
  }, [competition, proprietaireInfo, router, id]);

  /* ================= UPDATE FEEDBACK ================= */
  useEffect(() => {
    if (successUpdate) {
      toast.success("Compétition mise à jour");
      router.push(`/competition/${id}`);
    }
    if (errorUpdate) {
      toast.error(errorUpdate);
    }
  }, [successUpdate, errorUpdate, router, id]);

  /* ================= HANDLERS ================= */
  const handleMatchChange = (tourIndex, matchIndex, field, value) => {
    setLocalCalendrier((prev) =>
      prev.map((tour, tIndex) =>
        tIndex !== tourIndex
          ? tour
          : {
              ...tour,
              matchs: tour.matchs.map((match, mIndex) =>
                mIndex !== matchIndex
                  ? match
                  : { ...match, [field]: value }
              ),
            }
      )
    );
  };

  const submitHandler = (e) => {
    e.preventDefault();

    const payload = {
      dateDebut,
      dateFin,
      nbEquipes,
      terrains: terrains.map((t) => t._id || t),
      calendrier: localCalendrier,
    };

    console.log("📦 Payload UPDATE:", payload);

    dispatch(updateCompetition(id, payload));
  };

  /* ================= GUARDS ================= */
  if (loading || !competition) {
    return <Loader text="Chargement..." />;
  }

  /* ================= RENDER ================= */
  return (
    <StadiumBackground>
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 text-white">
        <h1 className="text-3xl font-extrabold text-center text-yellow-400">
          ✏️ Modifier la compétition
        </h1>

        <form
          onSubmit={submitHandler}
          className="bg-black/60 border border-yellow-400/20 rounded-2xl p-6 space-y-6"
        >
          {/* ================= DATES ================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Date début</label>
              <input
                type="date"
                value={dateDebut}
                onChange={(e) => setDateDebut(e.target.value)}
                className="w-full p-2 rounded bg-gray-900"
              />
            </div>

            <div>
              <label className="block mb-1">Date fin</label>
              <input
                type="date"
                value={dateFin}
                onChange={(e) => setDateFin(e.target.value)}
                className="w-full p-2 rounded bg-gray-900"
              />
            </div>
          </div>

          {/* ================= CALENDRIER ================= */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-yellow-300">
              📅 Calendrier
            </h2>

            {localCalendrier.map((tour, tIndex) => (
              <div
                key={tIndex}
                className="border border-white/10 rounded-xl p-4"
              >
                <h3 className="font-bold mb-3">{tour.tour}</h3>

                {tour.matchs.map((match, mIndex) => (
                  <div
                    key={mIndex}
                    className="flex flex-col md:flex-row md:items-center gap-3 mb-3"
                  >
                    <span className="md:w-1/3">
                      {match.equipeA?.nom} vs{" "}
                      {match.equipeB?.nom}
                    </span>

                    <input
                      type="date"
                      value={match.date || ""}
                      onChange={(e) =>
                        handleMatchChange(
                          tIndex,
                          mIndex,
                          "date",
                          e.target.value
                        )
                      }
                      className="p-2 rounded bg-gray-900"
                    />

                    <input
                      type="time"
                      value={match.heure || ""}
                      onChange={(e) =>
                        handleMatchChange(
                          tIndex,
                          mIndex,
                          "heure",
                          e.target.value
                        )
                      }
                      className="p-2 rounded bg-gray-900"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={loadingUpdate}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold"
          >
            💾 Enregistrer
          </button>
        </form>
      </div>
    </StadiumBackground>
  );
}



// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { useDispatch, useSelector } from "react-redux";
// import { toast } from "react-toastify";

// import Loader from "@/components/Loader";
// import {
//   getCompetitionDetails,
//   updateCompetition,
// } from "@/redux/actions/competitionActions";

// export default function CompetitionUpdatePage() {
//   const { id } = useParams();
//   const router = useRouter();
//   const dispatch = useDispatch();

//   /* ==========================
//      REDUX STATES
//   ========================== */
//   const competitionDetails = useSelector(
//     (state) => state.competitionDetails
//   );
//   const { loading, error, competition } = competitionDetails;

//  const proprietaireSignin = useSelector(
//   (state) => state.proprietaireSignin
// );

// const proprietaireInfo = proprietaireSignin?.proprietaireInfo;

// console.log("🧑‍💼 proprietaireSignin:", proprietaireSignin);
// console.log("🧑‍💼 proprietaireInfo:", proprietaireInfo);

//   const competitionUpdate = useSelector(
//     (state) => state.competitionUpdate || {}
//   );
//   const {
//     loading: loadingUpdate,
//     success: successUpdate,
//     error: errorUpdate,
//   } = competitionUpdate;

//   /* ==========================
//      LOCAL STATE (FORM)
//   ========================== */
//   const [dateDebut, setDateDebut] = useState("");
//   const [dateFin, setDateFin] = useState("");
//   const [nbEquipes, setNbEquipes] = useState(8);
//   const [terrains, setTerrains] = useState([]);
//   const [calendrier, setCalendrier] = useState([]);

//   /* ==========================
//      DEBUG – INITIAL RENDER
//   ========================== */
//   console.log("🟡 CompetitionUpdatePage render");
//   console.log("➡️ competition:", competition);
//   console.log("➡️ proprietaireInfo:", proprietaireInfo);

//   /* ==========================
//      FETCH COMPETITION
//   ========================== */
//   useEffect(() => {
//     console.log("🟠 useEffect FETCH competition id:", id);
//     dispatch(getCompetitionDetails(id));
//   }, [dispatch, id]);

//   /* ==========================
//      FILL FORM WHEN DATA READY
//   ========================== */
//   useEffect(() => {
//     if (competition && competition._id) {
//       console.log("🟢 Competition loaded:", competition);

//       setDateDebut(competition.dateDebut);
//       setDateFin(competition.dateFin);
//       setNbEquipes(competition.nbEquipes);
//       setTerrains(competition.terrains || []);
//       setCalendrier(competition.calendrier || []);

//       console.log("📅 calendrier initial:", competition.calendrier);
//     }
//   }, [competition]);

//   /* ==========================
//      ACCESS CONTROL
//   ========================== */
//   useEffect(() => {
    
//     if (
//       competition &&
//       competition.organisateur &&
//       proprietaireInfo
//     ) {
//       console.log("🔐 Checking access...");
//       console.log(
//         "organisateur:",
//         competition.organisateur._id
//       );
//       console.log(
//         "connected:",
//         proprietaireInfo._id
//       );

//       if (
//         competition.organisateur._id !==
//         proprietaireInfo._id
//       ) {
//         toast.error("Accès refusé");
//         router.push(`/competition/${id}`);
//       }
//     }
//   }, [competition, proprietaireInfo, router, id]);

//   /* ==========================
//      UPDATE SUCCESS / ERROR
//   ========================== */
//   useEffect(() => {
//     if (successUpdate) {
//       console.log("✅ Update success");
//       toast.success("Compétition mise à jour");
//       router.push(`/competition/${id}`);
//     }

//     if (errorUpdate) {
//       console.error("❌ Update error:", errorUpdate);
//       toast.error(errorUpdate);
//     }
//   }, [successUpdate, errorUpdate, router, id]);

//   /* ==========================
//      SUBMIT HANDLER
//   ========================== */
//   const submitHandler = (e) => {
//     e.preventDefault();

//     console.log("🟣 SUBMIT UPDATE");

//     const payload = {
//       dateDebut,
//       dateFin,
//       nbEquipes,
//       terrains: terrains.map((t) => t._id || t),
//       calendrier: calendrier.map((tour) => ({
//         tour: tour.tour,
//         matchs: tour.matchs.map((m) => ({
//           _id: m._id,
//           date: m.date,
//           heure: m.heure,
//         })),
//       })),
//     };

//     console.log("📦 Payload envoyé:", payload);

//     dispatch(updateCompetition(id, payload));
//   };

//   /* ==========================
//      GUARDS
//   ========================== */
//   if (loading || !competition || !competition.organisateur) {
//     return <Loader />;
//   }

//   /* ==========================
//      RENDER
//   ========================== */
//   return (
//     <div className="container mx-auto py-6">
//       <h1 className="text-2xl font-bold mb-6">
//         Modifier la compétition
//       </h1>

//       <form onSubmit={submitHandler} className="space-y-6">
//         {/* ================= DATES ================= */}
//         <div>
//           <label>Date début</label>
//           <input
//             type="date"
//             value={dateDebut}
//             onChange={(e) => setDateDebut(e.target.value)}
//             className="input"
//           />
//         </div>

//         <div>
//           <label>Date fin</label>
//           <input
//             type="date"
//             value={dateFin}
//             onChange={(e) => setDateFin(e.target.value)}
//             className="input"
//           />
//         </div>

//         {/* ================= NB EQUIPES ================= */}
//         <div>
//           <label>Nombre d’équipes</label>
//           <select
//             value={nbEquipes}
//             onChange={(e) => setNbEquipes(Number(e.target.value))}
//             className="input"
//           >
//             <option value={8}>8</option>
//             <option value={16}>16</option>
//             <option value={32}>32</option>
//           </select>
//         </div>

//         {/* ================= CALENDRIER ================= */}
//         <div>
//           <h2 className="text-xl font-semibold mb-2">
//             Calendrier
//           </h2>

//           {calendrier.map((tour, tourIndex) => (
//             <div key={tourIndex} className="mb-4">
//               <h3 className="font-bold">{tour.tour}</h3>

//               {tour.matchs.map((match, matchIndex) => (
//                 <div
//                   key={matchIndex}
//                   className="flex gap-2 items-center mb-2"
//                 >
//                   <span>
//                     {match.equipeA?.nom} vs{" "}
//                     {match.equipeB?.nom}
//                   </span>

//                   <input
//                     type="date"
//                     value={match.date || ""}
//                     onChange={(e) => {
//                       const newCal = [...calendrier];
//                       newCal[tourIndex].matchs[matchIndex].date =
//                         e.target.value;
//                       setCalendrier(newCal);
//                     }}
//                   />

//                   <input
//                     type="time"
//                     value={match.heure || ""}
//                     onChange={(e) => {
//                       const newCal = [...calendrier];
//                       newCal[tourIndex].matchs[matchIndex].heure =
//                         e.target.value;
//                       setCalendrier(newCal);
//                     }}
//                   />
//                 </div>
//               ))}
//             </div>
//           ))}
//         </div>

//         <button
//           type="submit"
//           disabled={loadingUpdate}
//           className="btn-primary"
//         >
//           Enregistrer
//         </button>
//       </form>
//     </div>
//   );
// }



// "use client";

// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams, useRouter } from "next/navigation";
// import { toast } from "react-toastify";

// import Loader from "@/components/Loader";
// import StadiumBackground from "@/components/StadiumBackground";
// import { getCompetitionDetails, updateCompetition } from "@/redux/actions/competitionActions";

// export default function CompetitionUpdatePage() {
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const router = useRouter();

//   const { competition, loading } = useSelector(
//     (state) => state.competitionDetails
//   );

//   const { proprietaireInfo } = useSelector(
//     (state) => state.proprietaireSignin
//   );

//   const [dateDebut, setDateDebut] = useState("");
//   const [dateFin, setDateFin] = useState("");
//   const [terrains, setTerrains] = useState([]);
//   const [calendrier, setCalendrier] = useState([]);

//   /* ================= FETCH ================= */
//   useEffect(() => {
//     dispatch(getCompetitionDetails(id));
//   }, [dispatch, id]);

//   /* ================= INIT FORM ================= */
//   useEffect(() => {
//     if (competition) {
//       setDateDebut(competition.dateDebut);
//       setDateFin(competition.dateFin);
//       setTerrains(competition.terrains.map((t) => t._id));
//       setCalendrier(competition.calendrier || []);
//     }
//   }, [competition]);

//   /* ================= GUARD ================= */
//   if (loading || !competition)
//     return <Loader text="Chargement..." />;

//   if (
//     competition.organisateur._id !== proprietaireInfo?._id
//   ) {
//     toast.error("Accès refusé");
//     router.push(`/competition/${id}`);
//     return null;
//   }

//   /* ================= HANDLERS ================= */
//   const handleMatchChange = (tourIndex, matchIndex, field, value) => {
//     const updated = [...calendrier];
//     updated[tourIndex].matchs[matchIndex][field] = value;
//     setCalendrier(updated);
//   };

//   const submitHandler = () => {
//     dispatch(
//       updateCompetition(id, {
//         dateDebut,
//         dateFin,
//         terrains,
//         calendrier,
//       })
//     );

//     toast.success("Compétition mise à jour");
//     router.push(`/competition/${id}`);
//   };
// console.log("organisateur =", competition.organisateur);
// console.log("user =", proprietaireInfo);
// console.log("organisateurid =", competition.organisateur._id);

//   /* ================= RENDER ================= */
//   return (
//     <StadiumBackground>
//       <div className="max-w-5xl mx-auto p-6 space-y-8 text-white">

//         <h1 className="text-2xl font-bold text-yellow-400 text-center">
//           Modifier la compétition
//         </h1>

//         {/* ===== INFOS GENERALES ===== */}
//         <div className="bg-white/10 p-6 rounded-xl space-y-4">
//           <h2 className="font-bold text-lg">📅 Informations générales</h2>

//           <input
//             type="date"
//             value={dateDebut}
//             onChange={(e) => setDateDebut(e.target.value)}
//             className="w-full p-2 rounded text-black"
//           />

//           <input
//             type="date"
//             value={dateFin}
//             onChange={(e) => setDateFin(e.target.value)}
//             className="w-full p-2 rounded text-black"
//           />
//         </div>

//         {/* ===== CALENDRIER ===== */}
//         {competition.calendrier.length > 0 && (
//           <div className="bg-black/60 p-6 rounded-xl space-y-6">
//             <h2 className="text-lg font-bold text-yellow-300">
//               🗓️ Calendrier des matchs
//             </h2>

//             {calendrier.map((tour, tourIndex) => (
//               <div key={tourIndex} className="space-y-3">
//                 <h3 className="font-bold text-white">{tour.tour}</h3>

//                 {tour.matchs.map((match, matchIndex) => (
//                   <div
//                     key={matchIndex}
//                     className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white/5 p-4 rounded-lg"
//                   >
//                     <p>
//                       ⚽ {match.equipeA?.nom} vs {match.equipeB?.nom}
//                     </p>

//                     <input
//                       type="date"
//                       value={match.date || ""}
//                       onChange={(e) =>
//                         handleMatchChange(
//                           tourIndex,
//                           matchIndex,
//                           "date",
//                           e.target.value
//                         )
//                       }
//                       className="p-2 rounded text-black"
//                     />

//                     <input
//                       type="time"
//                       value={match.heure || ""}
//                       onChange={(e) =>
//                         handleMatchChange(
//                           tourIndex,
//                           matchIndex,
//                           "heure",
//                           e.target.value
//                         )
//                       }
//                       className="p-2 rounded text-black"
//                     />
//                   </div>
//                 ))}
//               </div>
//             ))}
//           </div>
//         )}

//         {/* ===== ACTIONS ===== */}
//         <button
//           onClick={submitHandler}
//           className="w-full py-3 bg-yellow-500 text-black font-bold rounded-xl"
//         >
//           💾 Enregistrer les modifications
//         </button>
//       </div>
//     </StadiumBackground>
//   );
// }
