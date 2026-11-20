import PortfolioContent from "../models/portfolio-content.model.js";

const withoutCollections = ({ projects, qualifications, ...content }) => content;

const read = async (req, res) => {
  try {
    const portfolio = await PortfolioContent.findOne({ key: "main" }).lean();
    if (!portfolio) {
      return res.status(503).json({ error: "Portfolio content is not initialized." });
    }
    return res.json(portfolio.content);
  } catch (error) {
    console.error("Could not load portfolio content:", error);
    return res.status(500).json({ error: "Could not load portfolio content." });
  }
};

const update = async (req, res) => {
  // Projects and qualifications have their own collections and CRUD APIs
  // (/api/projects, /api/qualifications), so they are not stored here.
  const contentLists = ["navigation", "experience", "skillGroups", "services"];
  if (
    !req.body ||
    typeof req.body !== "object" ||
    Array.isArray(req.body) ||
    !req.body.profile ||
    !req.body.copy ||
    contentLists.some((key) => !Array.isArray(req.body[key]))
  ) {
    return res.status(400).json({
      error: "Portfolio content must include its profile, copy, and content lists.",
    });
  }

  try {
    const portfolio = await PortfolioContent.findOneAndUpdate(
      { key: "main" },
      { $set: { content: withoutCollections(req.body) } },
      { new: true, runValidators: true },
    ).lean();
    if (!portfolio) {
      return res.status(404).json({ error: "Portfolio content was not found." });
    }
    return res.json(portfolio.content);
  } catch (error) {
    console.error("Could not update portfolio content:", error);
    return res.status(500).json({ error: "Could not update portfolio content." });
  }
};

export default { read, update };
