import mongoose from 'mongoose';

const invitationSchema = new mongoose.Schema(
  {  match: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Match',
      required: true,
    },
    equipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipe' },
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'Footballeur' },
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'Footballeur' },
    statut: {
      type: String,
      enum: ['EN_ATTENTE', 'ACCEPTEE', 'REFUSEE'],
      default: 'EN_ATTENTE',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Invitation', invitationSchema);
