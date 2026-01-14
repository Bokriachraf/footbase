import mongoose from 'mongoose';


const matchSchema = new mongoose.Schema({
  terrain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Terrain",
    required: true,
  },
  proprietaire: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Proprietaire",
    required: true,
  },

  mode: {
    type: String,
    enum: ["INDIVIDUEL", "EQUIPE"],
    default: "INDIVIDUEL",
  },

  capitaines: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Footballeur',
  },
],

  joueurs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Footballeur" }],

  equipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Equipe" }],

  date: { type: String, required: true },
  heure: { type: String, required: true },

  niveau: {
    type: String,
    enum: ["Débutant", "Intermédiaire", "Avancé"],
    default: "Intermédiaire",
  },

  statut: {
    type: String,
    enum: ["Ouvert", "Complet", "Terminé"],
    default: "Ouvert",
  },

  prixParJoueur: Number,

score: {
  equipeA: Number,
  equipeB: Number,
},
scoreFinal: {
  type: Boolean,
  default: false,
},
noteAttribuee: { type: Boolean, default: false },
});


const Match = mongoose.model("Match", matchSchema);
export default Match;