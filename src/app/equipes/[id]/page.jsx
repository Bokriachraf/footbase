"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

import StadiumBackground from "@/components/StadiumBackground";
import Loader from "@/components/Loader";

import { getEquipeDetails } from "@/redux/actions/equipeActions";
import {
  sendFreeInvitation,
  listMyInvitations,
} from "@/redux/actions/invitationActions";
import { searchInvitablePlayers } from "@/redux/actions/footballeurActions";

export default function EquipeDetailsPage() {
  const { id: equipeId } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const { footballeurInfo } = useSelector(
    (state) => state.footballeurSignin
  );
  const { equipe, loading, error } = useSelector(
    (state) => state.equipeDetails
  );
  const { players } = useSelector(
    (state) => state.footballeurSearch
  );
  const { invitations } = useSelector(
    (state) => state.myInvitations
  );

  /* ===================== FETCH ===================== */
  useEffect(() => {
    if (!footballeurInfo) {
      router.push("/signin");
      return;
    }
    dispatch(getEquipeDetails(equipeId));
  }, [dispatch, equipeId, footballeurInfo, router]);

  useEffect(() => {
    if (showModal) {
      dispatch(searchInvitablePlayers(search));
      dispatch(listMyInvitations());
    }
  }, [dispatch, showModal, search]);

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader text="Chargement de l’équipe..." />
      </div>
    );

  if (error) return <p className="text-red-500">{error}</p>;
  if (!equipe) return <p>Équipe introuvable</p>;

  const isCaptain =
    equipe.capitaine?._id === footballeurInfo?._id;

  const titulaires = equipe.joueurs.slice(0, 7);
  const remplaçants = equipe.joueurs.slice(7, 9);

  const equipeComplete = titulaires.length === 7;
  const equipePleine = equipe.joueurs.length >= 9;

  const invitePlayer = (playerId) => {
    dispatch(sendFreeInvitation({ equipeId: equipe._id, playerId }));
    toast.success("Invitation envoyée ⚽");
    setShowModal(false);
  };

  return (
    <StadiumBackground>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto py-10 px-4 space-y-6"
      >
        <h1 className="text-4xl font-extrabold text-center text-yellow-400">
          🟡 {equipe.nom}
        </h1>

        <p className="text-center text-white/80">
          Capitaine :
          <span className="ml-2 font-bold text-yellow-300">
            {equipe.capitaine?.name}
          </span>
        </p>

        {/* ===================== TITULAIRES ===================== */}
        <div className="bg-black/60 border border-yellow-400/20 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-yellow-300 mb-3">
            🟢 Titulaires ({titulaires.length}/7)
          </h2>

          <ul className="space-y-2">
            {titulaires.map((j) => (
              <li
                key={j._id}
                className="flex justify-between text-white"
              >
                <span>{j.name}</span>
                <span className="text-yellow-300">
                  {j.position}
                </span>
              </li>
            ))}
          </ul>

          {equipeComplete && (
            <p className="mt-4 text-green-400 font-semibold">
              ✅ Équipe complète — vous pouvez vous inscrire à une
              compétition
            </p>
          )}
        </div>

        {/* ===================== REMPLAÇANTS ===================== */}
        <div className="bg-black/60 border border-blue-400/20 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-blue-300 mb-3">
            🔁 Remplaçants ({remplaçants.length}/2)
          </h2>

          {remplaçants.length === 0 && (
            <p className="text-white/60">
              Aucun remplaçant pour le moment
            </p>
          )}

          <ul className="space-y-2">
            {remplaçants.map((j) => (
              <li
                key={j._id}
                className="flex justify-between text-white"
              >
                <span>{j.name}</span>
                <span className="text-blue-300">
                  {j.position}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* ===================== INVITER ===================== */}
        {isCaptain && (
          <button
            disabled={equipePleine}
            onClick={() => setShowModal(true)}
            className={`w-full py-3 rounded-xl font-bold transition ${
              equipePleine
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-yellow-500 hover:bg-yellow-600 text-black"
            }`}
          >
            {equipePleine
              ? "Équipe complète (9/9)"
              : "➕ Inviter un joueur"}
          </button>
        )}
      </motion.div>

      {/* ===================== MODAL ===================== */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
            onClick={() => setShowModal(false)}
          >
            {/* <motion.div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 w-full max-w-lg"
            >
              <h2 className="text-xl font-bold mb-4 text-center">
                👥 Inviter un joueur
              </h2>

              <input
                type="text"
                placeholder="Rechercher un joueur..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border p-3 rounded-xl mb-4"
              />

              {players
                ?.filter((p) =>
                  p.name.toLowerCase().includes(search.toLowerCase())
                )
                .map((p) => {
                  const alreadyInvited = invitations?.some(
                    (i) => i.to === p._id
                  );
                  const alreadyInEquipe = equipe.joueurs.some(
                    (j) => j._id === p._id
                  );
                  if (alreadyInEquipe) return null;

                  return (
                    <div
                      key={p._id}
                      className="flex justify-between items-center border p-3 rounded-xl mb-2"
                    >
                      <div>
                        <strong>{p.name}</strong>
                        <span className="ml-2 text-gray-600">
                          ({p.position})
                        </span>
                      </div>

                      <button
                        disabled={alreadyInvited}
                        onClick={() => invitePlayer(p._id)}
                        className={`px-4 py-1 rounded-lg ${
                          alreadyInvited
                            ? "bg-gray-300 text-gray-500"
                            : "bg-green-600 text-white"
                        }`}
                      >
                        {alreadyInvited ? "Invité ✓" : "Inviter"}
                      </button>
                    </div>
                  );
                })}

              <button
                onClick={() => setShowModal(false)}
                className="mt-4 w-full bg-gray-300 py-3 rounded-xl font-bold"
              >
                Fermer
              </button>
            </motion.div> */}
            <motion.div
  initial={{ scale: 0.9 }}
  animate={{ scale: 1 }}
  exit={{ scale: 0.9 }}
  onClick={(e) => e.stopPropagation()}
  className="bg-white rounded-2xl w-full max-w-lg h-[90vh] flex flex-col"
>
  {/* HEADER */}
  <div className="p-6 border-b">
    <h2 className="text-xl font-bold text-center">
      👥 Inviter un joueur
    </h2>
  </div>

  {/* SEARCH FIXE */}
  <div className="p-4 border-b">
    <input
      type="text"
      placeholder="Rechercher un joueur..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full border p-3 rounded-xl"
    />
  </div>

  {/* LISTE SCROLLABLE */}
  <div className="flex-1 overflow-y-auto p-4 space-y-2">
    {players
      ?.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      )
      .map((p) => {
        const alreadyInvited = invitations?.some(
          (i) => i.to === p._id
        );
        const alreadyInEquipe = equipe.joueurs.some(
          (j) => j._id === p._id
        );

        if (alreadyInEquipe) return null;

        return (
          <div
            key={p._id}
            className="flex justify-between items-center border p-3 rounded-xl"
          >
            <div>
              <span className="font-semibold">{p.name}</span>
              <span className="text-gray-600 text-sm ml-2">
                ({p.position})
              </span>
            </div>

            <button
              disabled={alreadyInvited}
              onClick={() => invitePlayer(p._id)}
              className={`px-4 py-1 rounded-lg font-medium ${
                alreadyInvited
                  ? "bg-gray-300 text-gray-500"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {alreadyInvited ? "Invité ✓" : "Inviter"}
            </button>
          </div>
        );
      })}
  </div>

  {/* FOOTER */}
  <div className="p-4 border-t">
    <button
      onClick={() => setShowModal(false)}
      className="w-full bg-gray-300 hover:bg-gray-400 py-3 rounded-xl font-bold"
    >
      Fermer
    </button>
  </div>
</motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </StadiumBackground>
  );
}



// "use client";

// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams, useRouter } from "next/navigation";
// import { motion, AnimatePresence } from "framer-motion";
// import { toast } from "react-toastify";

// import StadiumBackground from "@/components/StadiumBackground";
// import Loader from "@/components/Loader";

// import { getEquipeDetails } from "@/redux/actions/equipeActions";
// import {
//   sendFreeInvitation,
//   listMyInvitations,
// } from "@/redux/actions/invitationActions";
// import { searchInvitablePlayers } from "@/redux/actions/footballeurActions";

// export default function EquipeDetailsPage() {
//   const { id: equipeId } = useParams();
//   const router = useRouter();
//   const dispatch = useDispatch();

//   /* ===================== LOCAL STATE ===================== */
//   const [showModal, setShowModal] = useState(false);
//   const [search, setSearch] = useState("");

//   /* ===================== REDUX ===================== */
//   const { footballeurInfo } = useSelector(
//     (state) => state.footballeurSignin
//   );

//   const { equipe, loading, error } = useSelector(
//     (state) => state.equipeDetails
//   );

//   const { players } = useSelector(
//     (state) => state.footballeurSearch
//   );

//   const { invitations } = useSelector(
//     (state) => state.myInvitations
//   );

//   /* ===================== FETCH ÉQUIPE ===================== */
//   useEffect(() => {
//     if (!footballeurInfo) {
//       router.push("/signin");
//       return;
//     }
//     if (equipeId) {
//       dispatch(getEquipeDetails(equipeId));
//     }
//   }, [dispatch, equipeId, footballeurInfo, router]);

//   /* ===================== INVITATIONS ===================== */
//   useEffect(() => {
//     if (showModal) {
//       dispatch(searchInvitablePlayers(search));
//       dispatch(listMyInvitations());
//     }
//   }, [dispatch, showModal, search]);

//   /* ===================== LOADING / ERROR ===================== */
//   if (loading) {
//     return (
//       <div className="flex justify-center py-20">
//         <Loader text="Chargement de l’équipe..." />
//       </div>
//     );
//   }

//   if (error) return <p className="text-red-500">{error}</p>;
//   if (!equipe) return <p>Équipe introuvable</p>;

//   /* ===================== LOGIQUE ÉQUIPE ===================== */
//   const isCaptain =
//     equipe.capitaine?.toString() === footballeurInfo?._id;

//   const joueurs = equipe.joueurs || [];

//   const titulaires = joueurs.slice(0, 7);
//   const remplacants = joueurs.slice(7, 9);

//   const titulairesFull = titulaires.length === 7;
//   const equipeMax = joueurs.length >= 9;

//   /* ===================== ACTIONS ===================== */
//   const invitePlayer = (playerId) => {
//     dispatch(
//       sendFreeInvitation({
//         equipeId: equipe._id,
//         playerId,
//       })
//     );
//     toast.success("Invitation envoyée ⚽");
//     setShowModal(false);
//   };

//   /* ===================== RENDER ===================== */
//   return (
//     <StadiumBackground>
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="max-w-4xl mx-auto py-10 px-4 space-y-6"
//       >
//         <h1 className="text-4xl font-extrabold text-center text-yellow-400">
//           🟡 {equipe.nom}
//         </h1>

//         <p className="text-center text-white/80">
//           Capitaine :{" "}
//           <span className="font-bold text-yellow-300">
//             {equipe.capitaine?.name}
//           </span>
//         </p>

//         {/* INFO ÉQUIPE */}
//         {titulairesFull && (
//           <div className="bg-green-600/20 border border-green-400 text-green-200 rounded-xl p-4 text-center text-sm">
//             ✅ Équipe complète (7 titulaires)  
//             <br />
//             👉 Vous pouvez maintenant inscrire l’équipe à une compétition  
//             <br />
//             🔁 Vous pouvez encore inviter <b>2 remplaçants</b>
//           </div>
//         )}

//         {/* TITULAIRES */}
//         <div className="bg-black/60 border border-yellow-400/20 rounded-2xl p-6">
//           <h2 className="text-xl font-bold text-yellow-300 mb-4">
//             🧤 Titulaires ({titulaires.length}/7)
//           </h2>

//           <ul className="space-y-2">
//             {titulaires.map((j) => (
//               <li
//                 key={j._id}
//                 className="flex justify-between text-white/90"
//               >
//                 <span>{j.name}</span>
//                 <span className="text-yellow-300">
//                   {j.position}
//                 </span>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* REMPLAÇANTS */}
//         <div className="bg-black/40 border border-blue-400/20 rounded-2xl p-6">
//           <h2 className="text-lg font-bold text-blue-300 mb-4">
//             🔁 Remplaçants ({remplacants.length}/2)
//           </h2>

//           {remplacants.length === 0 ? (
//             <p className="text-white/60 text-sm italic">
//               Aucun remplaçant pour le moment
//             </p>
//           ) : (
//             <ul className="space-y-2">
//               {remplacants.map((j) => (
//                 <li
//                   key={j._id}
//                   className="flex justify-between text-white/80"
//                 >
//                   <span>{j.name}</span>
//                   <span className="text-blue-300">
//                     {j.position}
//                   </span>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>

//         {/* BOUTON INVITER */}
//         {isCaptain && (
//           <button
//             disabled={equipeMax}
//             onClick={() => setShowModal(true)}
//             className={`w-full py-3 rounded-xl font-bold transition ${
//               equipeMax
//                 ? "bg-gray-500 cursor-not-allowed"
//                 : "bg-yellow-500 hover:bg-yellow-600 text-black"
//             }`}
//           >
//             {equipeMax
//               ? "Équipe complète (9/9)"
//               : "➕ Inviter un joueur"}
//           </button>
//         )}
//       </motion.div>

//       {/* ===================== MODAL INVITATION ===================== */}
//       <AnimatePresence>
//         {showModal && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
//             onClick={() => setShowModal(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.9 }}
//               animate={{ scale: 1 }}
//               exit={{ scale: 0.9 }}
//               onClick={(e) => e.stopPropagation()}
//               className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
//             >
//               <h2 className="text-xl font-bold mb-4 text-center">
//                 👥 Inviter un joueur
//               </h2>

//               <input
//                 type="text"
//                 placeholder="Rechercher un joueur..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="w-full border p-3 rounded-xl mb-4"
//               />

//               <div className="space-y-2 max-h-64 overflow-y-auto">
//                 {players
//                   ?.filter((p) =>
//                     p.name
//                       .toLowerCase()
//                       .includes(search.toLowerCase())
//                   )
//                   .map((p) => {
//                     const alreadyInvited = invitations?.some(
//                       (i) => i.to === p._id
//                     );

//                     const alreadyInEquipe = joueurs.some(
//                       (j) => j._id === p._id
//                     );

//                     if (alreadyInEquipe) return null;

//                     return (
//                       <div
//                         key={p._id}
//                         className="flex justify-between items-center border p-3 rounded-xl"
//                       >
//                         <div>
//                           <span className="font-semibold">
//                             {p.name}
//                           </span>
//                           <span className="text-gray-600 text-sm ml-2">
//                             ({p.position})
//                           </span>
//                         </div>
//                         <button
//                           disabled={alreadyInvited}
//                           onClick={() => invitePlayer(p._id)}
//                           className={`px-4 py-1 rounded-lg font-medium ${
//                             alreadyInvited
//                               ? "bg-gray-300 text-gray-500"
//                               : "bg-green-600 hover:bg-green-700 text-white"
//                           }`}
//                         >
//                           {alreadyInvited
//                             ? "Invité ✓"
//                             : "Inviter"}
//                         </button>
//                       </div>
//                     );
//                   })}
//               </div>

//               <button
//                 onClick={() => setShowModal(false)}
//                 className="mt-6 w-full bg-gray-300 hover:bg-gray-400 py-3 rounded-xl font-bold"
//               >
//                 Fermer
//               </button>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </StadiumBackground>
//   );
// }



// "use client";

// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams, useRouter } from "next/navigation";
// import { motion, AnimatePresence } from "framer-motion";
// import { toast } from "react-toastify";

// import StadiumBackground from "@/components/StadiumBackground";
// import Loader from "@/components/Loader";

// import { getEquipeDetails } from "@/redux/actions/equipeActions";
// import {
//   sendFreeInvitation,
//   listMyInvitations,
// } from "@/redux/actions/invitationActions";
// import { searchInvitablePlayers } from "@/redux/actions/footballeurActions";

// export default function EquipeDetailsPage() {
//   const { id: equipeId } = useParams();
//   const router = useRouter();
//   const dispatch = useDispatch();

//   /* =====================
//       LOCAL STATE
//   ===================== */
//   const [showModal, setShowModal] = useState(false);
//   const [search, setSearch] = useState("");

//   /* =====================
//       REDUX
//   ===================== */
//   const { footballeurInfo } = useSelector(
//     (state) => state.footballeurSignin
//   );

//   const { equipe, loading, error } = useSelector(
//     (state) => state.equipeDetails
//   );

//   const { players } = useSelector(
//     (state) => state.footballeurSearch
//   );

//   const { invitations } = useSelector(
//     (state) => state.myInvitations
//   );

//   /* =====================
//       FETCH ÉQUIPE
//   ===================== */
//   useEffect(() => {
//     if (!footballeurInfo) {
//       router.push("/signin");
//       return;
//     }
//     if (equipeId) {
//       dispatch(getEquipeDetails(equipeId));
//     }
//   }, [dispatch, equipeId, footballeurInfo, router]);

//   /* =====================
//       INVITATIONS
//   ===================== */
//   useEffect(() => {
//     if (showModal) {
//       dispatch(searchInvitablePlayers(search));
//       dispatch(listMyInvitations());
//     }
//   }, [dispatch, showModal, search]);

//   /* =====================
//       LOGIQUE UTILISATEUR
//   ===================== */
//   if (loading) {
//     return (
//       <div className="flex justify-center py-20">
//         <Loader text="Chargement de l’équipe..." />
//       </div>
//     );
//   }

//   if (error) return <p className="text-red-500">{error}</p>;
//   if (!equipe) return <p>Équipe introuvable</p>;

//   const isCaptain =
//     equipe.capitaine?.toString() === footballeurInfo?._id;

//   const equipeFull = (equipe.joueurs || []).length >= 7;

//   /* =====================
//       ACTIONS
//   ===================== */
//   const invitePlayer = (playerId) => {
//     dispatch(
//       sendFreeInvitation({
//         equipeId: equipe._id,
//         playerId,
//       })
//     );
//     toast.success("Invitation envoyée ⚽");
//     setShowModal(false);
//   };

//   /* =====================
//       RENDER
//   ===================== */
//   return (
//     <StadiumBackground>
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="max-w-4xl mx-auto py-10 px-4 space-y-6"
//       >
//         <h1 className="text-4xl font-extrabold text-center text-yellow-400">
//           🟡 {equipe.nom}
//         </h1>

//         <p className="text-center text-white/80">
//           Capitaine :{" "}
//           <span className="font-bold text-yellow-300">
//             {equipe.capitaine?.name}
//           </span>
//         </p>

//         {/* JOUEURS */}
//         <div className="bg-black/60 border border-yellow-400/20 rounded-2xl p-6">
//           <h2 className="text-xl font-bold text-yellow-300 mb-4">
//             👥 Joueurs ({equipe.joueurs.length}/7)
//           </h2>

//           <ul className="space-y-2">
//             {equipe.joueurs.map((j) => (
//               <li
//                 key={j._id}
//                 className="flex justify-between text-white/90"
//               >
//                 <span>{j.name}</span>
//                 <span className="text-yellow-300">
//                   {j.position}
//                 </span>
//               </li>
//             ))}
//           </ul>

//           {isCaptain && (
//             <button
//               disabled={equipeFull}
//               onClick={() => setShowModal(true)}
//               className={`mt-6 w-full py-3 rounded-xl font-bold transition ${
//                 equipeFull
//                   ? "bg-gray-500 cursor-not-allowed"
//                   : "bg-yellow-500 hover:bg-yellow-600 text-black"
//               }`}
//             >
//               {equipeFull
//                 ? "Équipe complète (7/7)"
//                 : "➕ Inviter un joueur"}
//             </button>
//           )}
//         </div>
//       </motion.div>

//       {/* =====================
//           MODAL INVITATION
//       ===================== */}
//       <AnimatePresence>
//         {showModal && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
//             onClick={() => setShowModal(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.9 }}
//               animate={{ scale: 1 }}
//               exit={{ scale: 0.9 }}
//               onClick={(e) => e.stopPropagation()}
//               className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
//             >
//               <h2 className="text-xl font-bold mb-4 text-center">
//                 👥 Inviter un joueur
//               </h2>

//               <input
//                 type="text"
//                 placeholder="Rechercher un joueur..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="w-full border p-3 rounded-xl mb-4"
//               />

//               <div className="space-y-2 max-h-64 overflow-y-auto">
//                 {players
//                   ?.filter((p) =>
//                     p.name
//                       .toLowerCase()
//                       .includes(search.toLowerCase())
//                   )
//                   .map((p) => {
//                     const alreadyInvited = invitations?.some(
//                       (i) => i.to === p._id
//                     );

//                     const alreadyInEquipe = equipe.joueurs.some(
//                       (j) => j._id === p._id
//                     );

//                     if (alreadyInEquipe) return null;

//                     return (
//                       <div
//                         key={p._id}
//                         className="flex justify-between items-center border p-3 rounded-xl"
//                       >
//                         <div>
//                           <span className="font-semibold">
//                             {p.name}
//                           </span>
//                           <span className="text-gray-600 text-sm ml-2">
//                             ({p.position})
//                           </span>
//                         </div>

//                         <button
//                           disabled={alreadyInvited}
//                           onClick={() => invitePlayer(p._id)}
//                           className={`px-4 py-1 rounded-lg font-medium ${
//                             alreadyInvited
//                               ? "bg-gray-300 text-gray-500"
//                               : "bg-green-600 hover:bg-green-700 text-white"
//                           }`}
//                         >
//                           {alreadyInvited
//                             ? "Invité ✓"
//                             : "Inviter"}
//                         </button>
//                       </div>
//                     );
//                   })}
//               </div>

//               <button
//                 onClick={() => setShowModal(false)}
//                 className="mt-6 w-full bg-gray-300 hover:bg-gray-400 py-3 rounded-xl font-bold"
//               >
//                 Fermer
//               </button>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </StadiumBackground>
//   );
// }



// "use client";

// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams, useRouter } from "next/navigation";
// import { toast } from "react-toastify";

// import Loader from "@/components/Loader";
// import InvitationModal from "@/components/InvitationModal";

// import { getEquipeDetails } from "@/redux/actions/equipeActions";
// import { sendInvitation } from "@/redux/actions/invitationActions";

// export default function EquipeDetailsPage() {
//   const { id } = useParams();
//   const router = useRouter();
//   const dispatch = useDispatch();

//   const [showInviteModal, setShowInviteModal] = useState(false);

//   // 🔐 Auth
//   const { footballeurInfo } = useSelector(
//     (state) => state.footballeurSignin
//   );

//   // 👥 Équipe
//   const equipeDetails = useSelector(
//     (state) => state.equipeDetails || {}
//   );
//   const { loading, error, equipe } = equipeDetails;

//   // 📩 Invitation
//   const invitationSend = useSelector(
//     (state) => state.invitationSend || {}
//   );
//   const { success: successInvite, error: errorInvite } = invitationSend;

//   // 🔄 Charger équipe
//   useEffect(() => {
//     if (!footballeurInfo) {
//       router.push("/signin");
//     } else {
//       dispatch(getEquipeDetails(id));
//     }
//   }, [dispatch, id, footballeurInfo, router]);

//   // 📩 Feedback invitation
//   useEffect(() => {
//     if (successInvite) {
//       toast.success("Invitation envoyée");
//       setShowInviteModal(false);
//     }
//     if (errorInvite) {
//       toast.error(errorInvite);
//     }
//   }, [successInvite, errorInvite]);

//   if (loading) return <Loader />;
//   if (error) return <p className="text-red-500">{error}</p>;
//   if (!equipe) return null;

//   const isCaptain = equipe.capitaine === footballeurInfo._id;

//   return (
//     <div className="max-w-3xl mx-auto mt-8">
//       {/* 🔙 Retour */}
//       <button
//         onClick={() => router.back()}
//         className="text-sm text-gray-500 mb-4"
//       >
//         ← Retour
//       </button>

//       {/* 🏷️ Infos équipe */}
//       <div className="bg-white shadow rounded-xl p-6">
//         <div className="flex justify-between items-center mb-4">
//           <h1 className="text-2xl font-bold">{equipe.nom}</h1>

//           {isCaptain && (
//             <button
//               onClick={() => setShowInviteModal(true)}
//               className="bg-green-600 text-white px-4 py-2 rounded-lg"
//             >
//               ➕ Inviter un joueur
//             </button>
//           )}
//         </div>

//         <p className="text-sm text-gray-500 mb-4">
//           Capitaine :{" "}
//           <strong>
//             {
//               equipe.joueurs.find(
//                 (j) => j._id === equipe.capitaine
//               )?.nom
//             }
//           </strong>
//         </p>

//         {/* 👥 Liste joueurs */}
//         <h2 className="font-semibold mb-2">Joueurs</h2>
//         <ul className="space-y-2">
//           {equipe.joueurs.map((joueur) => (
//             <li
//               key={joueur._id}
//               className="flex justify-between items-center border p-3 rounded-lg"
//             >
//               <span>
//                 {joueur.nom} {joueur.prenom}
//               </span>

//               {joueur._id === equipe.capitaine && (
//                 <span className="text-xs text-blue-600 font-semibold">
//                   Capitaine
//                 </span>
//               )}
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* 📩 MODAL INVITATION (réutilisé) */}
//       {showInviteModal && (
//         <InvitationModal
//           equipeId={equipe._id}
//           onClose={() => setShowInviteModal(false)}
//           onSubmit={(playerId) =>
//             dispatch(sendInvitation(equipe._id, playerId))
//           }
//         />
//       )}
//     </div>
//   );
// }
