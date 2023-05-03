
import express from "express";

import getSingleProjectDetails from "../services/projectService.js";
import { authMiddleware } from "../middlewares/guards.js";

const router = express.Router();

router.get("/projects/:id", authMiddleware, async (req, res) => {
	try {
		getSingleProjectDetails(req, res)
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
});
  
export default router
  