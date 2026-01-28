import mongoose from "mongoose";

const competitionSchema = new mongoose.Schema(
  {
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

    gouvernorat: String,
    etablissement: String,
    entreprise: String,

    organisateur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Proprietaire",
      required: true,
    },

    terrains: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Terrain",
        required: true,
      },
    ],

    saison: String,
    logo: String,

    dateDebut: { type: String, required: true },
    dateFin: { type: String, required: true },

    nbEquipes: { type: Number, required: true },

    equipesInscrites: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Equipe",
      default: [], // ✅ CRUCIAL
    },

    status: {
      type: String,
      enum: ["BROUILLON", "OUVERT", "EN_COURS", "TERMINE"],
      default: "BROUILLON",
    },
  },
  { timestamps: true }
);


// const competitionSchema = new mongoose.Schema({
//   nom: { type: String, required: true },

//   type: {
//     type: String,
//     enum: ["CHAMPIONNAT", "TOURNOI"],
//     required: true,
//   },

//   categorie: {
//     type: String,
//     enum: ["REGIONAL", "SCOLAIRE", "ENTREPRISE", "LIBRE"],
//     required: true,
//   },

//   gouvernorat: { type: String },     // régional
//   etablissement: { type: String },   // scolaire
//   entreprise: { type: String },       // entreprise

//   organisateur: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Proprietaire",
//     required: true,
//   },

//   terrains: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Terrain",
//     required: true,
//   }],

//   saison: String,
//   logo: String,

//   dateDebut: { type: String, required: true },
//     dateFin: { type: String, required: true },

//     nbEquipes: { type: Number, required: true },

//        equipesInscrites: {
//       type: [mongoose.Schema.Types.ObjectId],
//       ref: "Equipe",
//       default: [], // ✅ CRUCIAL
//     },

//   status: {
//     type: String,
//     enum: ["BROUILLON", "OUVERT", "EN_COURS", "TERMINE"],
//     default: "BROUILLON",
//   },
// }, { timestamps: true });

const Competition = mongoose.model("Competition", competitionSchema);
export default Competition;
