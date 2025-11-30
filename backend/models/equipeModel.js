import mongoose from 'mongoose';

const equipeSchema = new mongoose.Schema({
  nom: { type: String, required: true }, // "Equipe A" ou "Equipe B"
  joueurs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Footballeur' }],
  score: { type: Number, default: 0 },
});

export default mongoose.model('Equipe', equipeSchema);
