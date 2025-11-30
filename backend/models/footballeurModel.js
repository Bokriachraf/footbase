import mongoose from 'mongoose';

const footballeurSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false},
    position: { type: String, required: true  },
    age: { type: Number, required: true },
    gouvernorat: { type: String, required: true },
    evaluations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Evaluation' }],
  },
  {
    timestamps: true,
  }
);
footballeurSchema.virtual("averageRating").get(function () {
  if (!this.evaluations || this.evaluations.length === 0) return 0;

  // Si les evaluations sont des ObjectId non populés, pas de note → renvoie 0
  if (!this.evaluations[0].note) return 0;

  const total = this.evaluations.reduce((acc, e) => acc + e.note, 0);
  return (total / this.evaluations.length).toFixed(2);
});

footballeurSchema.virtual("totalRatings").get(function () {
  return this.evaluations ? this.evaluations.length : 0;
});

footballeurSchema.set("toObject", { virtuals: true });
footballeurSchema.set("toJSON", { virtuals: true });
const Footballeur = mongoose.model('Footballeur', footballeurSchema);
export default Footballeur;
