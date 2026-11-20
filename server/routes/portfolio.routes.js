import express from "express";
import portfolioCtrl from "../controllers/portfolio.controller.js";
import authCtrl from "../controllers/auth.controller.js";

const router = express.Router();

router
  .route("/api/portfolio")
  .get(portfolioCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.requireAdmin, portfolioCtrl.update);

export default router;
