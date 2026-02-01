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
    type: {
    type: String,
    enum: ["AMICAL", "COMPETITION"],
    default: "AMICAL",
  },

  capitaines: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Footballeur',
  },
],

  joueurs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Footballeur" }],

  equipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Equipe" }],

  date: { type: String, default: null },
  heure: { type: String, default: null },

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

competition: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Competition",
},
 equipeA: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Equipe",
},
equipeB: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Equipe",
}, 
vainqueur: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Equipe",
},
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