import express from "express";
import Ministry from "../models/Ministry";
import Project from "../models/Project";
import { authMiddleware } from "../middlewares/guards";

const router = express.Router();

// Get all ministries and their project statistics
router.get("/ministries", authMiddleware, async (req, res) => {
	try {
		const ministries = await Ministry.find();
		const ministryStats = await Promise.all(
			ministries.map(async (ministry) => {
				const projects = await Project.find({ ministry_id: ministry._id });
				const ongoingProjects = projects.filter(
					(project) =>
						project.end_date > Date.now() && project.start_date <= Date.now()
				);


				const completedProjects = projects.filter(
					(project) => project.end_date <= Date.now()
				);


				const dueProjects = projects.filter(
					(project) =>
						project.end_date > Date.now() &&
                        project.start_date > Date.now() &&
                        project.start_date < project.end_date
				);

				const moneyUsed = projects.reduce(
					(total, project) => total + project.budget,0);


				const projectsTotalValue = projects.reduce(
					(total, project) => total + project.budget,0);

				return {
					ministry: ministry,
					numProjects: projects.length,
					numOngoingProjects: ongoingProjects.length,
					numCompletedProjects: completedProjects.length,
					numDueProjects: dueProjects.length,
					moneyUsed: moneyUsed,
					projectsTotalValue: projectsTotalValue,
				};
			})
		);
		res.status(200).json(ministryStats);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// Get ministry by ID
router.get("/ministries/:id",authMiddleware , async (req, res) => {
	try {
		const ministry = await Ministry.findById(req.params.id);
		res.json(ministry);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// Create a new ministry
router.post("/ministries", authMiddleware , async (req, res) => {
	try {
		const ministry = new Ministry(req.body);
		await ministry.save();
		res.status(201).json(ministry);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// Update a ministry
router.patch("/ministries/:id", authMiddleware , async (req, res) => {
	try {
		const ministry = await Ministry.findById(req.params.id);
		if (!ministry) {
			return res.status(404).json({ error: "Ministry not found" });
		}
		Object.assign(ministry, req.body);
		await ministry.save();
		res.json(ministry);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// Delete a ministry
router.delete("/ministries/:id", authMiddleware, async (req, res) => {
	try {
		const ministry = await Ministry.findByIdAndDelete(req.params.id);
		if (!ministry) {
			return res.status(404).json({ error: "Ministry not found" });
		}
		res.sendStatus(204);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

export default router;
