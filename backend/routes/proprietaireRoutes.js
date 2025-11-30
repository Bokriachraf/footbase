import express from "express";
import bcrypt from "bcryptjs";
import expressAsyncHandler from "express-async-handler";
import Proprietaire from "../models/proprietaireModel.js";
import Terrain from "../models/terrainModel.js"; // ✅ Import ajouté
import { generateToken } from "../utils.js";

const proprietaireRouter = express.Router();

// 🧾 Inscription propriétaire
proprietaireRouter.post(
  "/register",
  expressAsyncHandler(async (req, res) => {
    const { nom, email, password, telephone, gouvernorat, terrain } = req.body;

    const exist = await Proprietaire.findOne({ email });
    if (exist) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newProprietaire = await Proprietaire.create({
      nom,
      email,
      password: hashedPassword,
      telephone,
      gouvernorat,
    });

    // ✅ Création du terrain associé
    const newTerrain = await Terrain.create({
      nom: terrain.nom,
      adresse: terrain.adresse,
      ville: terrain.ville,
      typeGazon: terrain.typeGazon,
      capacite: terrain.capacite,
      prixHeure: terrain.prixHeure,
      proprietaire: newProprietaire._id,
    });

    // ✅ Lier le terrain au propriétaire
    newProprietaire.terrains = [newTerrain._id];
    await newProprietaire.save();

    res.status(201).json({
      _id: newProprietaire._id,
      nom: newProprietaire.nom,
      email: newProprietaire.email,
      telephone: newProprietaire.telephone,
      gouvernorat: newProprietaire.gouvernorat,
      terrain: newTerrain,
      token: generateToken(newProprietaire),
    });
  })
);

// 🔐 Connexion
proprietaireRouter.post(
  "/signin",
  expressAsyncHandler(async (req, res) => {
    const proprietaire = await Proprietaire.findOne({ email: req.body.email });

    if (
      proprietaire &&
      bcrypt.compareSync(req.body.password, proprietaire.password)
    ) {
      res.send({
        _id: proprietaire._id,
        nom: proprietaire.nom,
        email: proprietaire.email,
        telephone: proprietaire.telephone,
        gouvernorat: proprietaire.gouvernorat,
        token: generateToken(proprietaire),
      });
    } else {
      res.status(401).send({ message: "Email ou mot de passe invalide" });
    }
  })
);

export default proprietaireRouter;
