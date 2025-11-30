 import express from "express";
 import expressAsyncHandler from "express-async-handler";
 import Evaluation from "../models/evaluationModel.js";
 import Footballeur from "../models/footballeurModel.js";
 import Match from "../models/matchModel.js";     
 import { io } from "../server.js";
 import { isAuth } from "../utils.js";
import Notification from "../models/notificationModel.js";

const evaluationRouter = express.Router();



// ⭐ ROUTE D'ÉVALUATION AVEC NOTIFICATION + CONTRÔLE DE STATUT
evaluationRouter.post(
  "/:matchId/:playerId",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { matchId, playerId } = req.params;
    const { note, commentaire } = req.body;
    const evaluateur = req.user._id;

    console.log("📥 Route POST /api/evaluations appelée");

    // ⛔ Interdiction de s'auto-évaluer
    if (playerId === evaluateur.toString()) {
      return res.status(400).send({ message: "Impossible de vous évaluer vous-même." });
    }

    // 🔎 Vérification du match
    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).send({ message: "Match introuvable." });
    }

    // ⛔ Tant que le match n'est pas terminé, aucune évaluation
    if (match.statut !== "Terminé") {
      return res.status(403).send({
        message: "L'évaluation ne sera disponible qu'après la fin du match.",
      });
    }

    // 🔎 Vérifier si le joueur existe
    const joueurEvalue = await Footballeur.findById(playerId);
    if (!joueurEvalue) {
      return res.status(404).send({ message: "Joueur introuvable." });
    }

    // 📌 Vérifier si l'évaluation existe déjà
    let evaluation = await Evaluation.findOne({
      match: matchId,
      evaluateur,
      evalue: playerId,
    });

    const isNew = !evaluation;

    // 🔄 Mise à jour si existe sinon création
    if (evaluation) {
      evaluation.note = note;
      evaluation.commentaire = commentaire;
      await evaluation.save();
    } else {
      evaluation = new Evaluation({
        match: matchId,
        evaluateur,
        evalue: playerId,
        note,
        commentaire,
      });
      await evaluation.save();

      // Ajouter l’ID de l’évaluation au joueur évalué
      await Footballeur.findByIdAndUpdate(playerId, {
        $addToSet: { evaluations: evaluation._id },
      });
    }

    // 🔔 Création d'une notification (DB)
    const notif = await Notification.create({
      user: playerId,
      title: "Nouvelle évaluation",
      message: isNew
        ? "Vous avez reçu une nouvelle évaluation."
        : "Votre évaluation a été mise à jour.",
      sourceUser: evaluateur,
      match: matchId,
      note,
      commentaire,
    });

    console.log("💾 Notification enregistrée :", notif._id);

    // 🔔 Notification via websocket
    io.to(playerId).emit("evaluationReceived", notif);
    console.log("📡 Notification envoyée via socket.io → room :", playerId);

    return res.status(201).send({
      message: isNew ? "Évaluation enregistrée" : "Évaluation mise à jour",
      evaluation,
    });
  })
);



evaluationRouter.get(
  "/check/:matchId/:evalueId",
  isAuth,
  async (req, res) => {
    try {
      const { matchId, evalueId } = req.params;

      const existing = await Evaluation.findOne({
        match: matchId,
        evaluateur: req.user._id,
        evalue: evalueId,
      });

      res.send({
        alreadyEvaluated: existing ? true : false,
      });

    } catch (error) {
      console.error("Erreur check evaluation:", error);
      res.status(500).send({ message: "Erreur interne serveur" });
    }
  }
);

export default evaluationRouter;

