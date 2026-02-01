import mongoose from "mongoose";
import calendrierSchema from "./calendrierModel.js";


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

     phaseType: {
    type: String,
    enum: ["AVEC_GROUPES", "SANS_GROUPES"],
    required: true,
  },

    status: {
      type: String,
      enum: ["EN_ATTENTE", "CALENDRIER_GENERE", "EN_COURS", "TERMINE"],
      default: "EN_ATTENTE",
    },

 calendrier: {
  type: [calendrierSchema],
  default: [],
},

  groupes: {
    type: [mongoose.Schema.Types.Mixed],
    default: [],
  },

  classement: {
    type: [mongoose.Schema.Types.Mixed],
    default: [],
  },
  },


  { timestamps: true }
);



const Competition = mongoose.model("Competition", competitionSchema);
export default Competition;
