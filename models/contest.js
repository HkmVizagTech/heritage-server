const mongoose = require("mongoose");

const contestEntrySchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  name: {
    type: String, // snapshot name to preserve labels
    required: true,
  },
  participants: {
    type: Number,
    required: true,
    min: 1,
  },
});

const registrationSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HeritageRegistration",
      required: true,
    },
    schoolName: {
      type: String, // snapshot name of school
    },
    contests: {
      type: [contestEntrySchema],
      required: true,
    },
    totalParticipants: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Registration = mongoose.models.Registration || mongoose.model("Registration", registrationSchema);

module.exports = {
  Registration,
  contestEntrySchema, // ✅ export schema, NOT as a model
};
