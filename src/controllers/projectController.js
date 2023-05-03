
import express from "express";

import getSingleProjectDetails from "../services/projectService";
import { authMiddleware } from "../middlewares/guards";

const router = express.Router();

router.get("/:id", authMiddleware, async (req, res) => {
	try {
		getSingleProjectDetails(req, res)
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
});
  
export default router
  