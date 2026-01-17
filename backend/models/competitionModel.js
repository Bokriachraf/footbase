import mongoose from "mongoose";

const competitionSchema = new mongoose.Schema({
  nom: { type: String, required: true },

  type: {
    type: String,
    enum: ["CHAMPIONNAT", "TOURNOI"],
    required: true,
  },

  categorie: {
    type: String,
    enum: ["REGIONAL", "SCOLAIRE", "ENTREPRISE", "LIBRE"],
    required: true,
  },

  gouvernorat: { type: String },     // régional
  etablissement: { type: String },   // scolaire
  entreprise: { type: String },       // entreprise

  organisateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Proprietaire",
    required: true,
  },

  terrains: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Terrain",
    required: true,
  }],

  saison: String,
  logo: String,

  status: {
    type: String,
    enum: ["BROUILLON", "OUVERT", "EN_COURS", "TERMINE"],
    default: "BROUILLON",
  },
}, { timestamps: true });

const Competition = mongoose.model("Competition", competitionSchema);
export default Competition;
