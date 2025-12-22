import express from "express";
import expressAsyncHandler from "express-async-handler";
import Match from "../models/matchModel.js";
import { isAuth } from "../utils.js";
import { createAutoTeams } from "../utils/createAutoTeams.js";

const participationRouter = express.Router();

participationRouter.post(
  "/join/:matchId",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    console.log("📥 Tentative d'inscription au match:", req.params.matchId);

    // 1️⃣ Charger le match (léger)
    const match = await Match.findById(req.params.matchId)
      .populate("terrain", "nom ville capacite prixHeure");

if (match.mode === "EQUIPE" && match.equipes.length === 0) {
  const equipeA = await Equipe.create({
    nom: "Équipe A",
    capitaine: req.user._id,
    joueurs: [req.user._id],
    match: match._id,
  });

  const equipeB = await Equipe.create({
    nom: "Équipe B",
    joueurs: [],
    match: match._id,
  });

  match.equipes = [equipeA._id, equipeB._id];
  await match.save();
}


    if (!match) {
      return res.status(404).send({ message: "Match non trouvé" });
    }

    if (match.statut !== "Ouvert") {
      return res.status(400).send({ message: "Match déjà complet ou terminé" });
    }

    const userId = req.user._id.toString();

    if (match.joueurs.some(j => j.toString() === userId)) {
      return res.status(400).send({ message: "Vous participez déjà à ce match" });
    }

    // 2️⃣ Ajouter le joueur
    match.joueurs.push(req.user._id);

    const capacite = Number(match.terrain.capacite);
    console.log("Capacité du terrain:", capacite);
    console.log("Nombre de joueurs:", match.joueurs.length);

    // 3️⃣ Match complet ?
    let teamsCreated = false;

    if (match.joueurs.length >= capacite) {
      match.statut = "Complet";
    }

    await match.save(); // 🔴 ON SAUVE AVANT

    // 4️⃣ Si match complet → recharge COMPLET pour équilibrage
    if (
      match.statut === "Complet" &&
      match.mode === "INDIVIDUEL" &&
      match.equipes.length === 0
    ) {
      console.log("⚽ Création automatique des équipes...");

      const fullMatch = await Match.findById(match._id)
        .populate("terrain", "nom ville capacite prixHeure")
        .populate({
          path: "joueurs",
          populate: {
            path: "evaluations",
            select: "note",
          },
        });

      await createAutoTeams(fullMatch);
      teamsCreated = true;
    }

    // 5️⃣ Retourner match COMPLET pour le front
    const updatedMatch = await Match.findById(match._id)
    
      .populate("terrain", "nom ville capacite prixHeure")
  .populate({
    path: "joueurs",
    select: "name position",
    populate: {
      path: "evaluations",
      select: "note",
    },
  })
  .populate({
    path: "equipes",
    populate: {
      path: "joueurs",
      select: "name position",
      populate: {
        path: "evaluations",
        select: "note",
      },
    },
  });

    // .populate("terrain", "nom ville capacite prixHeure")
      // .populate({
      //   path: "joueurs",
      //   select: "name position averageRating",
      // })
      // .populate({
      //   path: "equipes",
      //   populate: {
      //     path: "joueurs",
      //     select: "name position averageRating",
      //   },
      // });

    res.send({
      message: teamsCreated
        ? "Inscription réussie + équipes générées ⚽"
        : "Inscription réussie ✅",
      match: updatedMatch,
    });
  })
);



export default participationRouter;




// import express from "express";
// import expressAsyncHandler from "express-async-handler";
// import Match from "../models/matchModel.js";
// import { isAuth } from "../utils.js";
// import { createAutoTeams } from "../utils/createAutoTeams.js"; // 🔥 NEW

// const participationRouter = express.Router();

// // 🏃 Rejoindre un match
// participationRouter.post(
//   "/join/:matchId",
//   isAuth,
//   expressAsyncHandler(async (req, res) => {
//     console.log("📥 Tentative d'inscription au match:", req.params.matchId);

//     const match = await Match.findById(req.params.matchId)
//       .populate("terrain", "nom ville adresse typeGazon capacite prixHeure")
//       .populate("joueurs", "_id name rating"); // 🔥 rating utile

//     if (!match) {
//       return res.status(404).send({ message: "Match non trouvé" });
//     }

//     if (match.statut !== "Ouvert") {
//       return res.status(400).send({ message: "Match déjà complet ou terminé" });
//     }

//     const userId = req.user._id.toString();

//     if (match.joueurs.some(j => j._id.toString() === userId)) {
//       return res.status(400).send({ message: "Vous participez déjà à ce match" });
//     }

//     // ✅ Ajout du joueur
//     match.joueurs.push(req.user._id);

//     const capacite = Number(match.terrain.capacite);

//     console.log("Capacité du terrain:", capacite);
//     console.log("Nombre de joueurs:", match.joueurs.length);

//     // 🟡 Match complet
//     if (match.joueurs.length >= capacite) {
//       match.statut = "Complet";

//       // 🔥 AUTO-CRÉATION DES ÉQUIPES
//       if (match.mode === "INDIVIDUEL" && match.equipes.length === 0) {
//         console.log("⚽ Création automatique des équipes...");
//         await createAutoTeams(match);
//       }
//     }

//     await match.save();

//     // 🔁 Recharge pour le frontend
//     const updatedMatch = await Match.findById(match._id)
//       .populate("terrain", "nom ville adresse typeGazon capacite prixHeure")
//       .populate("joueurs", "name position rating")
//       .populate({
//         path: "equipes",
//         populate: {
//           path: "joueurs capitaine",
//           select: "name rating position"
//         }
//       });

//     res.send({
//       message: "Inscription réussie ✅",
//       match: updatedMatch,
//     });
//   })
// );

// export default participationRouter;




// import express from "express";
// import expressAsyncHandler from "express-async-handler";
// import Match from "../models/matchModel.js";
// import { isAuth } from "../utils.js";

// const participationRouter = express.Router();

// // 🏃 Rejoindre un match
// participationRouter.post(
//   "/join/:matchId",
//   isAuth,
//   expressAsyncHandler(async (req, res) => {
//     console.log("📥 Tentative d'inscription au match:", req.params.matchId);

//     const match = await Match.findById(req.params.matchId)
//       .populate("terrain", "nom ville adresse typeGazon capacite prixHeure") // ✅ on récupère la capacité
//       .populate("joueurs", "_id name");

//     if (!match) {
//       console.log("❌ Match introuvable !");
//       return res.status(404).send({ message: "Match non trouvé" });
//     }

//     if (match.statut !== "Ouvert") {
//       return res.status(400).send({ message: "Match déjà complet ou terminé" });
//     }

//     const userId = req.user._id.toString();

//     if (match.joueurs.some(j => j._id.toString() === userId)) {
//       return res.status(400).send({ message: "Vous participez déjà à ce match" });
//     }

//     // ✅ Ajout du joueur
//     match.joueurs.push(req.user._id);

//     // 🧩 Debug
//     console.log("Capacité du terrain:", match.terrain.capacite);
//     console.log("Nombre de joueurs:", match.joueurs.length);

//     // 🟡 Vérifie si match complet
//     if (match.joueurs.length >= Number(match.terrain.capacite)) {
//       console.log("✅ Match complet !");
//       match.statut = "Complet";
//     }

//     await match.save();

//     // 🔁 Recharge le match avec populate pour le front
//     const updatedMatch = await Match.findById(match._id)
//       .populate("terrain", "nom ville adresse typeGazon capacite prixHeure")
//       .populate("joueurs", "name position")
//       .populate("equipes", "nom joueurs score");

//     res.send({
//       message: "Inscription réussie ✅",
//       match: updatedMatch,
//     });
//   })
// );

// export default participationRouter;

