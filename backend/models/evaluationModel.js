
import mongoose from 'mongoose';

const evaluationSchema = new mongoose.Schema({
  match: { type: mongoose.Schema.Types.ObjectId, ref: 'Match', required: true },
  evaluateur: { type: mongoose.Schema.Types.ObjectId, ref: 'Footballeur', required: true },
  evalue: { type: mongoose.Schema.Types.ObjectId, ref: 'Footballeur', required: true },
  note: { type: Number, min: 1, max: 5, required: true },
  commentaire: { type: String },
}, { timestamps: true });

// Empêche qu’un joueur évalue plusieurs fois le même joueur dans le même match
evaluationSchema.index({ match: 1, evaluateur: 1, evalue: 1 }, { unique: true });

export default mongoose.model('Evaluation', evaluationSchema);

