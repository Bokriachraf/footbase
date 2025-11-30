import express from "express";
import expressAsyncHandler from "express-async-handler";
import Terrain from "../models/terrainModel.js";
import { isAuth } from "../utils.js";

const terrainRouter = express.Router();

// ➕ Créer un terrain (propriétaire connecté)
terrainRouter.post(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const terrain = new Terrain({
      nom: req.body.nom,
      adresse: req.body.adresse,
      ville: req.body.ville,
      typeGazon: req.body.typeGazon,
      capacite: req.body.capacite,
      prixHeure: req.body.prixHeure,
      proprietaire: req.user._id,
    });

    const createdTerrain = await terrain.save();
    res.status(201).send(createdTerrain);
  })
);

// 📋 Lister tous les terrains (public)
terrainRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    const terrains = await Terrain.find().populate("proprietaire", "nom email");
    res.send(terrains);
  })
);

// 📋 Terrains du propriétaire connecté
terrainRouter.get(
  "/mine",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const terrains = await Terrain.find({ proprietaire: req.user._id });
    res.send(terrains);
  })
);

export default terrainRouter;
