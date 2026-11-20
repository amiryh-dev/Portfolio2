import mongoose from "mongoose";

// A portfolio project. Shown on the Home and Projects pages, and on its own
// case-study page at /projects/:slug.
const OutcomeSchema = new mongoose.Schema(
  {
    value: { type: String, trim: true },
    label: { type: String, trim: true },
  },
  { _id: false },
);

const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: "Title is required",
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: "Slug (the page address) is required",
      match: [/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug can only contain lowercase letters, numbers and dashes"],
    },
    number: { type: String, trim: true },
    category: { type: String, trim: true },
    subtitle: { type: String, trim: true },
    period: { type: String, trim: true },
    role: { type: String, trim: true },
    company: { type: String, trim: true },
    description: {
      type: String,
      trim: true,
      required: "Description is required",
    },
    result: { type: String, trim: true },
    tags: [{ type: String, trim: true }],
    image: { type: String, trim: true },
    imageAlt: { type: String, trim: true },
    challenge: { type: String, trim: true },
    approach: [{ type: String, trim: true }],
    outcomes: [OutcomeSchema],
    takeaway: { type: String, trim: true },
    // Position in the list; lower numbers come first.
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.model("Project", ProjectSchema, "projects");
