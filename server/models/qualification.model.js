import mongoose from "mongoose";

// Education / qualifications, shown on the Education page.
const QualificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: "Title is required",
    },
    institution: {
      type: String,
      trim: true,
      required: "Institution is required",
    },
    date: { type: String, trim: true },
    status: { type: String, trim: true },
    // Name of the icon shown on the Education page (Cpu, Languages or BookOpen).
    icon: {
      type: String,
      enum: ["Cpu", "Languages", "BookOpen"],
      default: "BookOpen",
    },
    description: { type: String, trim: true },
    subjects: [{ type: String, trim: true }],
    // Position in the list; lower numbers come first.
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.model(
  "Qualification",
  QualificationSchema,
  "qualifications"
);
