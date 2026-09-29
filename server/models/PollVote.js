import mongoose from 'mongoose';

const pollVoteSchema = new mongoose.Schema(
  {
    pollId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Poll',
      required: true,
      index: true,
    },
    voterId: {
      type: String,
      required: [true, 'voterId is required'],
      trim: true,
      index: true,
    },
    selectedOptionIds: {
      type: [String],
      required: [true, 'At least one option must be selected'],
      validate: [
        {
          validator: function (val) {
            return Array.isArray(val) && val.length > 0;
          },
          message: 'At least one option must be selected',
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index to prevent duplicate voting per voterId and pollId
pollVoteSchema.index({ pollId: 1, voterId: 1 }, { unique: true });

export const PollVote = mongoose.model('PollVote', pollVoteSchema);
