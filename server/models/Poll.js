import mongoose from 'mongoose';

const optionSchema = new mongoose.Schema(
  {
    optionId: {
      type: String,
      required: true,
      trim: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    voteCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { _id: false }
);

const pollSchema = new mongoose.Schema(
  {
    pollId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    question: {
      type: String,
      required: [true, 'Question is required'],
      trim: true,
      maxlength: [200, 'Question cannot exceed 200 characters'],
    },
    options: {
      type: [optionSchema],
      validate: [
        {
          validator: function (opts) {
            return opts && opts.length >= 2 && opts.length <= 10;
          },
          message: 'A poll must have between 2 and 10 options',
        },
      ],
    },
    settings: {
      votingType: {
        type: String,
        enum: ['single', 'multiple'],
        default: 'single',
      },
      maxSelections: {
        type: Number,
        default: 1,
        min: 1,
        max: 10,
      },
      resultsVisibility: {
        type: String,
        enum: ['afterVote', 'always', 'afterClose'],
        default: 'afterVote',
      },
      allowVoteChange: {
        type: Boolean,
        default: false,
      },
    },
    totalVotes: {
      type: Number,
      default: 0,
      min: 0,
      index: true,
    },
    expiresAt: {
      type: Date,
      default: null,
      index: true,
    },
    status: {
      type: String,
      enum: ['active', 'closed', 'expired'],
      default: 'active',
      index: true,
    },
    managementTokenHash: {
      type: String,
      required: true,
      select: false, // Hidden by default from queries
    },
  },
  {
    timestamps: true,
  }
);

// Virtual property or helper to calculate effective status (accounting for expiresAt)
pollSchema.methods.getEffectiveStatus = function () {
  if (this.status === 'closed') return 'closed';
  if (this.expiresAt && new Date() > this.expiresAt) return 'expired';
  return 'active';
};

export const Poll = mongoose.model('Poll', pollSchema);
