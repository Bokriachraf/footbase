"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { createFreeEquipe } from "@/redux/actions/equipeActions";

export default function CreateEquipePage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [nom, setNom] = useState("");
  const { footballeurInfo } = useSelector(
    (state) => state.footballeurSignin
  );

  const { loading, error } = useSelector(
    (state) => state.equipeCreate || {}
  );

  // 🔐 sécurité
  useEffect(() => {
    if (!footballeurInfo) {
      router.push("/signin");
    }
  }, [footballeurInfo, router]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!nom.trim()) {
      toast.error("Nom d’équipe requis");
      return;
    }

    try {
      const equipe = await dispatch(createFreeEquipe(nom.trim()));

      toast.success("✅ Équipe créée avec succès");
      router.push(`/equipes/${equipe._id}`);
    } catch (err) {
      // erreur déjà gérée par Redux
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-12 p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Créer une équipe
      </h1>

      <p className="text-sm text-gray-600 mb-6 text-center">
        Vous deviendrez automatiquement <strong>capitaine</strong>
      </p>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={submitHandler}>
        <label className="block mb-2 font-medium">
          Nom de l’équipe
        </label>

        <input
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          className="w-full p-3 border rounded-lg mb-5"
          disabled={loading}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg disabled:opacity-50"
        >
          {loading ? "Création..." : "Créer l’équipe"}
        </button>
      </form>
    </div>
  );
}



// "use client";

// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useRouter } from "next/navigation";
// import { motion, AnimatePresence } from "framer-motion";
// import { toast } from "react-toastify";

// import StadiumBackground from "@/components/StadiumBackground";
// import Loader from "@/components/Loader";

// import { createEquipe } from "@/redux/actions/equipeActions";
// import { searchInvitablePlayers } from "@/redux/actions/footballeurActions";
// import { sendInvitation, listMyInvitations } from "@/redux/actions/invitationActions";

// export default function CreateEquipePage() {
//   const dispatch = useDispatch();
//   const router = useRouter();

//   /* =====================
//       LOCAL STATE
//   ===================== */
//   const [nom, setNom] = useState("");
//   const [niveau, setNiveau] = useState("intermediaire");
//   const [showInviteModal, setShowInviteModal] = useState(false);
//   const [search, setSearch] = useState("");

//   /* =====================
//       REDUX STATE
//   ===================== */
//   const { footballeurInfo } = useSelector(
//     (state) => state.footballeurSignin
//   );

//   const { loading, equipe, error } = useSelector(
//     (state) => state.equipeCreate
//   );

//   const { players } = useSelector(
//     (state) => state.footballeurSearch
//   );

//   const { invitations } = useSelector(
//     (state) => state.myInvitations
//   );

//   /* =====================
//       GUARDS
//   ===================== */
//   useEffect(() => {
//     if (!footballeurInfo) {
//       router.push("/signin");
//     }
//   }, [footballeurInfo, router]);

//   useEffect(() => {
//     if (equipe?._id) {
//       toast.success("✅ Équipe créée avec succès");
//       setShowInviteModal(true);
//     }
//   }, [equipe]);

//   /* =====================
//       FETCH INVITABLE
//   ===================== */
//   useEffect(() => {
//     if (showInviteModal) {
//       dispatch(searchInvitablePlayers(search));
//       dispatch(listMyInvitations());
//     }
//   }, [dispatch, showInviteModal, search]);

//   /* =====================
//       HANDLERS
//   ===================== */
//   const handleCreateEquipe = () => {
//     if (!nom.trim()) {
//       toast.error("Veuillez saisir un nom d’équipe");
//       return;
//     }

//     dispatch(
//       createEquipe({
//         nom,
//         niveau,
//       })
//     );
//   };

//   const invitePlayer = (playerId) => {
//     if (!equipe?._id) return;

//     dispatch(
//       sendInvitation({
//         equipeId: equipe._id,
//         playerId,
//       })
//     );

//     toast.success("Invitation envoyée !");
//   };

//   /* =====================
//       RENDER
//   ===================== */
//   if (loading) {
//     return (
//       <div className="flex justify-center py-20">
//         <Loader text="Création de l’équipe..." />
//       </div>
//     );
//   }

//   return (
//     <StadiumBackground>
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="max-w-xl mx-auto py-10 px-4 space-y-6"
//       >
//         <h1 className="text-4xl font-extrabold text-center text-yellow-400">
//           👥 Créer mon équipe
//         </h1>

//         <div className="bg-black/60 backdrop-blur-lg rounded-2xl p-6 border border-yellow-400/20 space-y-4">
//           <div>
//             <label className="block text-white/80 mb-1">
//               Nom de l’équipe
//             </label>
//             <input
//               type="text"
//               value={nom}
//               onChange={(e) => setNom(e.target.value)}
//               placeholder="Ex : FC FootBase"
//               className="w-full p-3 rounded-xl bg-black/70 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
//             />
//           </div>

//           <div>
//             <label className="block text-white/80 mb-1">
//               Niveau
//             </label>
//             <select
//               value={niveau}
//               onChange={(e) => setNiveau(e.target.value)}
//               className="w-full p-3 rounded-xl bg-black/70 border border-white/20 text-white"
//             >
//               <option value="debutant">Débutant</option>
//               <option value="intermediaire">Intermédiaire</option>
//               <option value="avance">Avancé</option>
//             </select>
//           </div>

//           <button
//             onClick={handleCreateEquipe}
//             className="w-full py-3 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-black font-bold transition"
//           >
//             ➕ Créer l’équipe
//           </button>

//           {error && (
//             <p className="text-red-500 text-sm text-center">{error}</p>
//           )}
//         </div>
//       </motion.div>

//       {/* =====================
//           MODAL INVITATION
//       ===================== */}
//       <AnimatePresence>
//         {showInviteModal && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
//             onClick={() => setShowInviteModal(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.9 }}
//               animate={{ scale: 1 }}
//               exit={{ scale: 0.9 }}
//               className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <h2 className="text-xl font-bold mb-4 text-center">
//                 👥 Inviter des joueurs
//               </h2>

//               <input
//                 type="text"
//                 placeholder="Rechercher un joueur..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="w-full border p-3 rounded-xl mb-4"
//               />

//               <div className="space-y-2 max-h-64 overflow-y-auto">
//                 {players?.map((p) => {
//                   const alreadyInvited = invitations?.some(
//                     (i) => i.to === p._id
//                   );

//                   return (
//                     <div
//                       key={p._id}
//                       className="flex justify-between items-center border p-3 rounded-xl"
//                     >
//                       <div>
//                         <span className="font-semibold">{p.name}</span>
//                         <span className="text-gray-600 text-sm ml-2">
//                           ({p.position})
//                         </span>
//                       </div>
//                       <button
//                         disabled={alreadyInvited}
//                         onClick={() => invitePlayer(p._id)}
//                         className={`px-4 py-1 rounded-lg font-medium transition ${
//                           alreadyInvited
//                             ? "bg-gray-300 text-gray-500"
//                             : "bg-green-600 hover:bg-green-700 text-white"
//                         }`}
//                       >
//                         {alreadyInvited ? "Invité ✓" : "Inviter"}
//                       </button>
//                     </div>
//                   );
//                 })}
//               </div>

//               <button
//                 onClick={() => router.push("/competitions")}
//                 className="mt-6 w-full bg-yellow-500 hover:bg-yellow-600 py-3 rounded-xl font-bold"
//               >
//                 ✔️ Terminer
//               </button>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </StadiumBackground>
//   );
// }
