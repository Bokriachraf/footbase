import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Invitation from '../models/invitationModel.js';
import Equipe from '../models/equipeModel.js';
import { isAuth } from '../utils.js';
 import { io } from "../server.js";  
 import Notification from "../models/notificationModel.js";
 import Match from '../models/matchModel.js';

const invitationRouter = express.Router();


invitationRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { equipeId, playerId, matchId } = req.body;

    /* =========================
       1️⃣ RÉCUPÉRATION MATCH
    ========================= */
    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).send({ message: 'Match introuvable' });
    }

    /* =========================
       2️⃣ RÉCUPÉRATION ÉQUIPE
    ========================= */
    const equipe = await Equipe.findById(equipeId);
    if (!equipe) {
      return res.status(404).send({ message: 'Équipe introuvable' });
    }

    if (equipe.capitaine.toString() !== req.user._id.toString()) {
      return res.status(403).send({ message: 'Capitaine uniquement' });
    }

    /* =========================
       3️⃣ CRÉATION INVITATION
    ========================= */
    const invitation = await Invitation.create({
      type: 'MATCH',
      match: match._id,
      equipe: equipeId,
      from: req.user._id,
      to: playerId,
      statut: 'EN_ATTENTE',
    });

    /* =========================
       4️⃣ CRÉATION NOTIFICATION
    ========================= */
    const notification = await Notification.create({
      user: playerId,
      type: 'INVITATION',
      title: 'Invitation à une équipe',
      match: match._id,
      invitation: invitation._id,
      equipe: equipeId,
      message: `⚽ ${req.user.name} 
      vous a invité à rejoindre une équipe pour un match le ${new Date(
        match.date
      ).toLocaleDateString()}`,
    });

 
    io.to(playerId.toString()).emit('invitationReceived', notification);
    console.log('📡 invitation envoyée via socket.io → room :', playerId);

    res.send({ invitation });
  })
);


// POST /api/invitations/free
invitationRouter.post(
  '/free',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { equipeId, playerId } = req.body;

    /* =========================
       1️⃣ RÉCUPÉRATION ÉQUIPE
    ========================= */
    const equipe = await Equipe.findById(equipeId);
    if (!equipe) {
      return res.status(404).send({ message: 'Équipe introuvable' });
    }

    if (equipe.capitaine.toString() !== req.user._id.toString()) {
      return res.status(403).send({ message: 'Capitaine uniquement' });
    }

    /* =========================
       2️⃣ CRÉATION INVITATION
    ========================= */
    const invitation = await Invitation.create({
      type: 'EQUIPE_LIBRE',
      equipe: equipeId,
      from: req.user._id,
      to: playerId,
      statut: 'EN_ATTENTE',
      type: 'EQUIPE_LIBRE',
    });

    /* =========================
       3️⃣ NOTIFICATION
    ========================= */
    const notification = await Notification.create({
      user: playerId,
      type: 'INVITATION',
      title: 'Invitation à une équipe',
      equipe: equipeId,
      invitation: invitation._id,
      message: `⚽ ${req.user.name} vous a invité à rejoindre son équipe`,
    });

    io.to(playerId.toString()).emit(
      'invitationReceived',
      notification
    );

    res.send({ invitation });
  })
);


invitationRouter.get(
  '/mine',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const invitations = await Invitation.find({
      to: req.user._id,
      statut: 'EN_ATTENTE',
    }).populate('equipe')
      .populate('from', 'nom prenom');

    res.send(invitations);
  })
);


invitationRouter.patch(
  "/:id/refuse",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const invitation = await Invitation.findById(req.params.id);

    if (!invitation)
      return res.status(404).send({ message: "Invitation introuvable" });

    // seul le joueur invité peut refuser
    if (invitation.to.toString() !== req.user._id.toString())
      return res.status(403).send({ message: "Non autorisé" });

    invitation.statut = "REFUSEE";
    await invitation.save();

    // 🔔 notif pour le capitaine
    const notif = await Notification.create({
      user: invitation.from, // capitaine
      type: "INVITATION",
      title: "Invitation refusée",
      message: `❌${req.user.name} a refusé votre invitation`,
      sourceUser: req.user._id,
    });

    // 🔴 SOCKET
    io
      .to(invitation.from.toString())
      .emit("invitationRefused", notif);

    res.send({ message: "Invitation refusée" });
  })
);

invitationRouter.patch(
  "/:id/accept",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const invitation = await Invitation.findById(req.params.id)
      .populate("equipe")
      .populate("match");

    if (!invitation)
      return res.status(404).send({ message: "Invitation introuvable" });

    if (invitation.to.toString() !== req.user._id.toString())
      return res.status(403).send({ message: "Non autorisé" });

    if (invitation.statut !== "EN_ATTENTE")
      return res.status(400).send({ message: "Invitation déjà traitée" });

    const userId = req.user._id;
    const equipe = invitation.equipe;

    if (!equipe)
      return res.status(404).send({ message: "Équipe introuvable" });

    /* =========================
       1️⃣ AJOUT À L'ÉQUIPE
    ========================= */
    const alreadyInEquipe = equipe.joueurs.some(
      (j) => j.toString() === userId.toString()
    );

    if (!alreadyInEquipe) {
      equipe.joueurs.push(userId);
      await equipe.save();
    }

    /* =========================
       2️⃣ SI INVITATION MATCH
    ========================= */
    if (invitation.type === "MATCH") {
      const match = invitation.match;

      if (!match)
        return res.status(404).send({ message: "Match introuvable" });

      const alreadyInMatch = match.joueurs.some(
        (j) => j.toString() === userId.toString()
      );

      if (!alreadyInMatch) {
        match.joueurs.push(userId);
      }

      if (
        equipe.capitaine.toString() === userId.toString() &&
        !match.capitaines.includes(userId)
      ) {
        match.capitaines.push(userId);
      }

      await match.save();

      // check équipes complètes
      const equipes = await Equipe.find({ match: match._id });
      const allFull =
        equipes.length === 2 &&
        equipes.every((eq) => eq.joueurs.length === 7);

      if (allFull) {
        match.statut = "Complet";
        await match.save();
      }
    }

    /* =========================
       3️⃣ MAJ INVITATION
    ========================= */
    invitation.statut = "ACCEPTEE";
    await invitation.save();

    /* =========================
       4️⃣ NOTIFICATION
    ========================= */
    const notif = await Notification.create({
      user: invitation.from,
      type: "INVITATION",
      title: "✔️ Invitation acceptée",
      message: `✔️ ${req.user.name} a accepté votre invitation`,
      sourceUser: userId,
      invitation: invitation._id,
      match: invitation.match || null,
    });

    io.to(invitation.from.toString()).emit("invitationAccepted", notif);

    res.send({
      message: "Invitation acceptée",
      equipe,
      match: invitation.match || null,
    });
  })
);


// invitationRouter.patch(
//   "/:id/accept",
//   isAuth,
//   expressAsyncHandler(async (req, res) => {
//     const invitation = await Invitation.findById(req.params.id)
//       .populate("equipe")
//       .populate("match");

//     if (!invitation) {
//       return res.status(404).send({ message: "Invitation introuvable" });
//     }

//     if (invitation.to.toString() !== req.user._id.toString()) {
//       return res.status(403).send({ message: "Non autorisé" });
//     }

//     if (invitation.statut !== "EN_ATTENTE") {
//       return res.status(400).send({ message: "Invitation déjà traitée" });
//     }

//     const userId = req.user._id;

   
//     const equipe = invitation.equipe;
//     if (!equipe) {
//       return res.status(404).send({ message: "Équipe introuvable" });
//     }

//     const alreadyInEquipe = equipe.joueurs.some(
//       (j) => j.toString() === userId.toString()
//     );

//     if (!alreadyInEquipe) {
//       equipe.joueurs.push(userId);
//       await equipe.save();
//     }

  
//     const match = invitation.match;
//     if (!match) {
//       return res.status(404).send({ message: "Match introuvable" });
//     }

//     const alreadyInMatch = match.joueurs.some(
//       (j) => j.toString() === userId.toString()
//     );

//     if (!alreadyInMatch) {
//       match.joueurs.push(userId);
//     }

//     // si le joueur est capitaine de cette équipe
//     if (
//       equipe.capitaine.toString() === userId.toString() &&
//       !match.capitaines.includes(userId)
//     ) {
//       match.capitaines.push(userId);
//     }

//     await match.save();

//     // ✅ CHECK ÉQUIPES COMPLÈTES
//       const equipes = await Equipe.find({ match: match._id });

//       const allFull =
//         equipes.length === 2 &&
//         equipes.every((eq) => eq.joueurs.length === 7);

//       if (allFull) {
//         match.statut = "Complet";
//         await match.save();
//       }

//     /* =========================
//        3️⃣ MAJ INVITATION
//     ========================= */
//     invitation.statut = "ACCEPTEE";
//     await invitation.save();

//     /* =========================
//        4️⃣ NOTIFICATION CAPITAINE
//     ========================= */
//     const notif = await Notification.create({
//       user: invitation.from,
//       type: "INVITATION",
//       title: "✔️ Invitation acceptée",
//       message: `✔️ ${req.user.name} a accepté votre invitation`,
//       sourceUser: userId,
//       invitation: invitation._id,
//       match: match._id,
//     });

//     /* =========================
//        5️⃣ SOCKET
//     ========================= */
//     io.to(invitation.from.toString()).emit("invitationAccepted", notif);

//     res.send({
//       message: "Invitation acceptée",
//       equipe,
//       match,
//     });
//   })
// );


export default invitationRouter;
