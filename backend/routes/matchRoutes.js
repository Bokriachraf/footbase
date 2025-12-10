import express from "express";
import mongoose from "mongoose";
import expressAsyncHandler from "express-async-handler";
import Match from "../models/matchModel.js";
import Terrain from "../models/terrainModel.js";
import Equipe from "../models/equipeModel.js"; 
import Evaluation from "../models/evaluationModel.js";
import Footballeur from "../models/footballeurModel.js";

import { isAuth , isAdmin} from "../utils.js";

const matchRouter = express.Router();

// ➕ Créer un match (propriétaire via son terrain)
matchRouter.post(
  "/create",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { terrainId, date, heure, niveau, prixParJoueur } = req.body;

    const terrain = await Terrain.findById(terrainId);
    if (!terrain) {
      return res.status(404).send({ message: "Terrain non trouvé" });
    }

    const match = new Match({
      terrain: terrain._id,
      date,
      heure,
      niveau,
      prixParJoueur,
      statut: "Ouvert",
      proprietaire: req.user._id,
    });

    const createdMatch = await match.save();
    res.status(201).send(createdMatch);
  })
);

// 📋 Liste des matchs disponibles
matchRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    const matchs = await Match.find()
      .populate("terrain", "nom ville")
      .populate("joueurs", "name position rating");
    res.send(matchs);
  })
);

// 🟢 Matchs du propriétaire connecté
matchRouter.get(
  "/mine",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const matchs = await Match.find({ proprietaire: req.user._id })
      .populate("terrain")
      .populate("joueurs");

    res.send(matchs);
  })
);


matchRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const match = await Match.findById(req.params.id)
      .populate("terrain")
      .populate({
        path: "joueurs",
        select: "-password",
        populate: {
          path: "evaluations",
          select: "note"
        }
      });

    if (!match) {
      return res.status(404).send({ message: "Match non trouvé" });
    }

    // --- AUTO UPDATE STATUT ---
    try {
      const now = new Date();
      const matchDateTime = new Date(`${match.date} ${match.heure}`);
      const matchEnd = new Date(matchDateTime.getTime() + 10 * 60 * 1000);

      if (now > matchEnd && match.statut !== "Terminé") {
        match.statut = "Terminé";
        await match.save();
      }
    } catch (error) {
      console.error("Erreur auto-update statut :", error);
    }

    res.send(match);
  })
);



matchRouter.put('/:id/score', isAuth, isAdmin, async (req, res) => {
  const match = await Match.findById(req.params.id);
  if (!match) return res.status(404).send('Match introuvable');

  const { scoreA, scoreB } = req.body;
  match.scoreFinal = `${scoreA} - ${scoreB}`;

  const [equipeA, equipeB] = await Promise.all([
    Equipe.findById(match.equipes[0]),
    Equipe.findById(match.equipes[1]),
  ]);

  equipeA.score = scoreA;
  equipeB.score = scoreB;
  await Promise.all([equipeA.save(), equipeB.save(), match.save()]);

  res.json({ message: 'Score enregistré', match });
});

// 🧮 Mise à jour des moyennes de tous les joueurs après un match
matchRouter.put(
  "/:id/evaluations/updateRatings",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params;

    // Récupère toutes les évaluations liées à ce match
    const evaluations = await Evaluation.find({ match: id });

    if (evaluations.length === 0) {
      return res.status(404).send({ message: "Aucune évaluation trouvée pour ce match" });
    }

    // Regrouper les notes par joueur évalué
    const grouped = {};
    evaluations.forEach((evalObj) => {
      const playerId = evalObj.evalue.toString();
      if (!grouped[playerId]) {
        grouped[playerId] = [];
      }
      grouped[playerId].push(evalObj.note);
    });

    // Calcul des moyennes et mise à jour des footballeurs
    const updates = Object.entries(grouped).map(async ([playerId, notes]) => {
      const totalRatings = notes.length;
      const avgRating = notes.reduce((sum, n) => sum + n, 0) / totalRatings;

      // Met à jour le footballeur
      await Footballeur.findByIdAndUpdate(playerId, {
        rating: avgRating.toFixed(2),
        totalRatings,
      });
    });

    await Promise.all(updates);

    res.send({
      message: "Mises à jour des moyennes réussies ✅",
      totalJoueurs: Object.keys(grouped).length,
    });
  })
);



matchRouter.put(
  "/:id/terminer",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(404).send({ message: "Match introuvable" });
    }

    match.statut = "Terminé";
    await match.save();

    // Appel de la mise à jour des moyennes
    const evaluations = await Evaluation.find({ match: match._id });

    if (evaluations.length > 0) {
      const grouped = {};
      evaluations.forEach((evalObj) => {
        const playerId = evalObj.evalue.toString();
        if (!grouped[playerId]) {
          grouped[playerId] = [];
        }
        grouped[playerId].push(evalObj.note);
      });

      const updates = Object.entries(grouped).map(async ([playerId, notes]) => {
        const totalRatings = notes.length;
        const avgRating = notes.reduce((sum, n) => sum + n, 0) / totalRatings;
        await Footballeur.findByIdAndUpdate(playerId, {
          rating: avgRating.toFixed(2),
          totalRatings,
        });
      });

      await Promise.all(updates);
    }

    res.send({ message: "Match terminé et moyennes mises à jour ✅" });
  })
);


matchRouter.get("/:id/classement", async (req, res) => {
  try {
    const matchId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(matchId)) {
      return res.status(400).json({ message: "ID match invalide" });
    }

    console.log("🔍 Match ID reçu :", matchId);

    const evaluations = await Evaluation.aggregate([
      { $match: { match: new mongoose.Types.ObjectId(matchId) } },
      {
        $group: {
          _id: "$evalue",
          moyenne: { $avg: "$note" },
          nbEvaluations: { $sum: 1 }
        }
      },
      { $sort: { moyenne: -1 } }
    ]);

    console.log("📝 Evaluations trouvées :", evaluations);

    if (evaluations.length === 0) {
      return res.json([]);
    }

    // Récupération safe des joueurs
    const ids = evaluations.map(e => e._id).filter(id => mongoose.Types.ObjectId.isValid(id));

    const joueurs = await Footballeur.find({ _id: { $in: ids } }).lean();

    console.log("👥 Joueurs trouvés :", joueurs);

    const classement = evaluations.map(e => ({
      joueur: joueurs.find(j => j._id.toString() === e._id.toString()) || null,
      moyenne: e.moyenne,
      nbEvaluations: e.nbEvaluations
    }));

    res.json(classement);

  } catch (err) {
    console.error("❌ ERREUR dans /matchs/:id/classement :", err);
    res.status(500).json({ message: err.message });
  }
});


// PUT update match (propriétaire propriétaire du match)
matchRouter.put(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const matchId = req.params.id;
    const { terrainId, date, heure, niveau, prixParJoueur, statut } = req.body;

    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({ message: "Match non trouvé" });
    }

    // Vérifier que le propriétaire du match est bien celui connecté
    if (!match.proprietaire || match.proprietaire.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Accès refusé — vous n'êtes pas le propriétaire de ce match" });
    }

    if (terrainId) {
      const terrain = await Terrain.findById(terrainId);
      if (!terrain) return res.status(404).json({ message: "Terrain non trouvé" });
      match.terrain = terrain._id;
    }
    if (date !== undefined) match.date = date;
    if (heure !== undefined) match.heure = heure;
    if (niveau !== undefined) match.niveau = niveau;
    if (prixParJoueur !== undefined) match.prixParJoueur = prixParJoueur;
    if (statut !== undefined) match.statut = statut;

    const updated = await match.save();
    // populate useful fields before returning
    const populated = await Match.findById(updated._id).populate("terrain");
    res.json(populated);
  })
);


// 🗑️ Supprimer un match (uniquement par son propriétaire)
matchRouter.delete(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const matchId = req.params.id;

    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).send({ message: "Match introuvable" });
    }

    // Sécurité : seul le propriétaire peut supprimer
    if (match.proprietaire.toString() !== req.user._id.toString()) {
      return res.status(403).send({ message: "Accès refusé" });
    }

    await Match.findByIdAndDelete(matchId);

    res.send({ message: "Match supprimé avec succès" });
  })
);


// DELETE a match (propriétaire)
// matchRouter.delete(
//   "/:id",
//   isAuth,
//   expressAsyncHandler(async (req, res) => {
//     const match = await Match.findById(req.params.id);
//     if (!match) return res.status(404).json({ message: "Match non trouvé" });

//     if (!match.proprietaire || match.proprietaire.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: "Accès refusé — vous n'êtes pas le propriétaire de ce match" });
//     }

//     await match.remove();
//     res.json({ message: "Match supprimé avec succès" });
//   })
// );



export default matchRouter;



