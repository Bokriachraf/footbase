import express from "express";
import Competition from "../models/competitionModel.js";
import { isAuth } from '../utils.js';


const competitionRouter = express.Router();
// CREATE competition
competitionRouter.post("/", isAuth, async (req, res) => {
  try {
    const competition = new Competition({
      nom: req.body.nom,
      type: req.body.type,
      categorie: req.body.categorie,
      gouvernorat: req.body.gouvernorat,
      etablissement: req.body.etablissement,
      entreprise: req.body.entreprise,
      terrains: req.body.terrains,
      saison: req.body.saison,
      logo: req.body.logo,
      organisateur: req.user._id,
    });

    const createdCompetition = await competition.save();
    res.status(201).json(createdCompetition);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default competitionRouter;
