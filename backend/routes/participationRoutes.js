import express from "express";
import expressAsyncHandler from "express-async-handler";
import Match from "../models/matchModel.js";
import { isAuth } from "../utils.js";

const participationRouter = express.Router();

// 🏃 Rejoindre un match
participationRouter.post(
  "/join/:matchId",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    console.log("📥 Tentative d'inscription au match:", req.params.matchId);

    const match = await Match.findById(req.params.matchId)
      .populate("terrain", "nom ville adresse typeGazon capacite prixHeure") // ✅ on récupère la capacité
      .populate("joueurs", "_id name");

    if (!match) {
      console.log("❌ Match introuvable !");
      return res.status(404).send({ message: "Match non trouvé" });
    }

    if (match.statut !== "Ouvert") {
      return res.status(400).send({ message: "Match déjà complet ou terminé" });
    }

    const userId = req.user._id.toString();

    if (match.joueurs.some(j => j._id.toString() === userId)) {
      return res.status(400).send({ message: "Vous participez déjà à ce match" });
    }

    // ✅ Ajout du joueur
    match.joueurs.push(req.user._id);

    // 🧩 Debug
    console.log("Capacité du terrain:", match.terrain.capacite);
    console.log("Nombre de joueurs:", match.joueurs.length);

    // 🟡 Vérifie si match complet
    if (match.joueurs.length >= Number(match.terrain.capacite)) {
      console.log("✅ Match complet !");
      match.statut = "Complet";
    }

    await match.save();

    // 🔁 Recharge le match avec populate pour le front
    const updatedMatch = await Match.findById(match._id)
      .populate("terrain", "nom ville adresse typeGazon capacite prixHeure")
      .populate("joueurs", "name position")
      .populate("equipes", "nom joueurs score");

    res.send({
      message: "Inscription réussie ✅",
      match: updatedMatch,
    });
  })
);

export default participationRouter;

