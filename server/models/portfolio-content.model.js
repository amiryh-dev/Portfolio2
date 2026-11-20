import mongoose from "mongoose";

const PortfolioContentSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    content: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true, collection: "portfolio_content" },
);

export default mongoose.model("PortfolioContent", PortfolioContentSchema);
