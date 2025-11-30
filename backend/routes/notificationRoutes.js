// backend/routes/notificationRoutes.js
import express from "express";
import expressAsyncHandler from "express-async-handler";
import { isAuth } from "../utils.js";
import Notification from "../models/notificationModel.js";

const notificationRouter = express.Router();

// GET /api/notifications/mine
notificationRouter.get(
  "/mine",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const notifs = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("sourceUser", "name nom image"); // optional populate
    res.json(notifs);
  })
);

// PATCH /api/notifications/read/:id  -> marque comme lu
notificationRouter.patch(
  "/read/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const notif = await Notification.findById(req.params.id);
    if (!notif) return res.status(404).send({ message: "Notification introuvable" });
    if (notif.user.toString() !== req.user._id.toString())
      return res.status(403).send({ message: "Non autorisé" });

    notif.read = true;
    await notif.save();
    res.json(notif);
  })
);

export default notificationRouter;


