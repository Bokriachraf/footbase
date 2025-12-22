import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Invitation from '../models/invitationModel.js';
import Equipe from '../models/equipeModel.js';
import { isAuth } from '../utils.js';

const invitationRouter = express.Router();

/**
 * 📤 Envoyer invitation (capitaine)
 */
invitationRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { equipeId, playerId } = req.body;

    const equipe = await Equipe.findById(equipeId);

    if (equipe.capitaine.toString() !== req.user._id.toString()) {
      return res.status(403).send({ message: 'Capitaine uniquement' });
    }

    const invitation = await Invitation.create({
      equipe: equipeId,
      from: req.user._id,
      to: playerId,
    });

    res.send({ invitation });
  })
);

/**
 * ✅ Accepter invitation
 */
invitationRouter.post(
  '/:id/accept',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const invitation = await Invitation.findById(req.params.id);

    if (!invitation || invitation.to.toString() !== req.user._id.toString()) {
      return res.status(403).send({ message: 'Accès refusé' });
    }

    invitation.statut = 'ACCEPTEE';
    await invitation.save();

    const equipe = await Equipe.findById(invitation.equipe);
    equipe.joueurs.push(req.user._id);
    await equipe.save();

    res.send({ equipe });
  })
);

export default invitationRouter;
