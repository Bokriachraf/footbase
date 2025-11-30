import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import Footballeur from '../models/footballeurModel.js';
import Match from '../models/matchModel.js';
import { generateToken } from '../utils.js';
import { isAuth, isAdmin } from '../utils.js';


const footballeurRouter = express.Router();

// --- INSCRIPTION ---
footballeurRouter.post(
  '/register',
  expressAsyncHandler(async (req, res) => {
    const { name, email, password, position, age, gouvernorat } = req.body;

    // Vérification âge
    if (age < 18 || age > 60) {
      res.status(400).send({ message: 'L’âge doit être compris entre 18 et 60 ans.' });
      return;
    }

    // Vérification doublon
    const existant = await Footballeur.findOne({ email });
    if (existant) {
      res.status(400).send({ message: 'Un compte avec cet e-mail existe déjà.' });
      return;
    }

    // Création du footballeur
    const footballeur = new Footballeur({
      name,
      email,
      password: bcrypt.hashSync(password, 8),
      position,
      age,
      gouvernorat,
    });

    const createdFootballeur = await footballeur.save();

    res.send({
      _id: createdFootballeur._id,
      name: createdFootballeur.name,
      email: createdFootballeur.email,
      position: createdFootballeur.position,
      age: createdFootballeur.age,
      gouvernorat: createdFootballeur.gouvernorat,
      isAdmin: createdFootballeur.isAdmin,
      token: generateToken(createdFootballeur),
    });
  })
);

// --- CONNEXION ---
footballeurRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const footballeur = await Footballeur.findOne({ email: req.body.email });
    if (footballeur && bcrypt.compareSync(req.body.password, footballeur.password)) {
      res.send({
        _id: footballeur._id,
        name: footballeur.name,
        email: footballeur.email,
        position: footballeur.position,
        age: footballeur.age,
        gouvernorat: footballeur.gouvernorat,
        isAdmin: footballeur.isAdmin,
        token: generateToken(footballeur),
      });
    } else {
      res.status(401).send({ message: 'Email ou mot de passe invalide' });
    }
  })
);


footballeurRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const footballeurs = await Footballeur.find({});
    res.send(footballeurs);
  })
);


footballeurRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const footballeur = await Footballeur.findById(req.params.id)
    if (footballeur) {
      if (footballeur.isAdmin) {
        res.status(400).send({ message: 'Impossible de supprimer un admin.' })
        return
      }
      await footballeur.deleteOne()
      res.send({ message: 'Utilisateur supprimé' })
    } else {
      res.status(404).send({ message: 'Utilisateur introuvable' })
    }
  })
)

footballeurRouter.get(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    
    // 1. Charger le footballeur + peupler les evaluations
    const footballeur = await Footballeur.findById(req.params.id)
      .select("-password")
      .populate({
  path: "evaluations",
  select: "note commentaire match evaluateur",
  populate: [
    { path: "match", select: "date heure terrain niveau statut" },
    { path: "evaluateur", select: "name position" },
  ],
});


    if (!footballeur) {
      return res.status(404).send({ message: "Footballeur non trouvé" });
    }

    // 2. Récupérer les matchs où ce footballeur est joueur
    const matchs = await Match.find({ joueurs: req.params.id })
      .populate("terrain", "nom ville")
      .populate("joueurs", "name position")
      .sort({ date: -1 });

    // 3. Retour propre
    res.send({
      ...footballeur.toObject(), // inclut averageRating & totalRatings (virtuals)
      matchs,
    });
  })
);

export default footballeurRouter;