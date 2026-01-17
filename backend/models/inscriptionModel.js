const inscriptionSchema = new mongoose.Schema({
  competition: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Competition",
    required: true,
  },

  equipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Equipe",
    required: true,
  },

  statut: {
    type: String,
    enum: ["INSCRIT", "ELIMINE", "QUALIFIE"],
    default: "INSCRIT",
  },
}, { timestamps: true });
