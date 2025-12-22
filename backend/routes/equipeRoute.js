import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Equipe from '../models/equipeModel.js';
import Match from '../models/matchModel.js';
import { isAuth } from '../utils.js';

const equipeRouter = express.Router();

/**
 * 🔹 Ajouter un joueur dans une équipe
 * 🔐 Réservé au capitaine
 * POST /api/equipes/:equipeId/add-player
 */
equipeRouter.post(
  '/:equipeId/add-player',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { playerId } = req.body;
    const userId = req.user._id;

    if (!playerId) {
      return res.status(400).send({ message: 'playerId requis' });
    }

    // 1️⃣ Charger l’équipe
    const equipe = await Equipe.findById(req.params.equipeId);

    if (!equipe) {
      return res.status(404).send({ message: 'Équipe non trouvée' });
    }

    // 2️⃣ Vérifier capitaine
    if (equipe.capitaine.toString() !== userId.toString()) {
      return res.status(403).send({
        message: 'Seul le capitaine peut ajouter des joueurs',
      });
    }

    // 3️⃣ Joueur déjà dans l’équipe ?
    if (equipe.joueurs.some(j => j.toString() === playerId)) {
      return res.status(400).send({
        message: 'Joueur déjà présent dans cette équipe',
      });
    }

    // 4️⃣ Vérifier que le joueur n’est PAS dans une autre équipe du match
    const match = await Match.findOne({ equipes: equipe._id }).populate({
      path: 'equipes',
      select: 'joueurs',
    });

    if (!match) {
      return res.status(404).send({ message: 'Match associé non trouvé' });
    }

    const alreadyInOtherTeam = match.equipes.some(eq =>
      eq.joueurs.some(j => j.toString() === playerId)
    );

    if (alreadyInOtherTeam) {
      return res.status(400).send({
        message: 'Ce joueur est déjà dans une autre équipe',
      });
    }

    // 5️⃣ Ajouter joueur
    equipe.joueurs.push(playerId);
    await equipe.save();

    // 6️⃣ Vérifier si match complet
    const totalPlayers = match.equipes.reduce(
      (sum, eq) => sum + eq.joueurs.length,
      0
    );

    if (totalPlayers >= match.terrain.capacite) {
      match.statut = 'Complet';
      await match.save();
    }

    res.send({
      message: 'Joueur ajouté avec succès ⚽',
      equipe,
    });
  })
);

// DELETE /api/equipes/:equipeId/remove-player
equipeRouter.delete(
  '/:equipeId/remove-player',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { playerId } = req.body;

    const equipe = await Equipe.findById(req.params.equipeId);
    if (!equipe) {
      return res.status(404).send({ message: 'Équipe introuvable' });
    }

    // 🔐 Capitaine uniquement
    if (equipe.capitaine.toString() !== req.user._id.toString()) {
      return res.status(403).send({ message: 'Action réservée au capitaine' });
    }

    equipe.joueurs = equipe.joueurs.filter(
      (j) => j.toString() !== playerId
    );

    await equipe.save();

    res.send({
      message: 'Joueur retiré de l’équipe',
      equipe,
    });
  })
);


export default equipeRouter;
