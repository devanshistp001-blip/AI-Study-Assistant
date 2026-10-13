import mongoose from 'mongoose';

const mcqSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    topic: {
      type: String,
      required: [true, 'Topic is required'],
      trim: true,
    },
    mcqs: [
      {
        questionText: {
          type: String,
          required: true,
        },
        options: {
          type: [String],
          required: true,
          validate: [
            (val) => val.length === 4,
            'MCQ must have exactly 4 options',
          ],
        },
        correctOptionIndex: {
          type: Number,
          required: true,
          min: 0,
          max: 3,
        },
        explanation: {
          type: String,
          required: true,
        },
      },
    ],
    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const MCQ = mongoose.model('MCQ', mcqSchema);
export default MCQ;
