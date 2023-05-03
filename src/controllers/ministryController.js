import express from "express";
import Ministry from "../models/Ministry";

const router = express.Router();

// Get all ministries
router.get("/ministries", async (req, res) => {
	try {
		const ministries = await Ministry.find({});
		res.json(ministries);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// Get ministry by ID
router.get("/ministries/:id", async (req, res) => {
	try {
		const ministry = await Ministry.findById(req.params.id);
		res.json(ministry);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// Create a new ministry
router.post("/ministries", async (req, res) => {
	try {
		const ministry = new Ministry(req.body);
		await ministry.save();
		res.status(201).json(ministry);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// Update a ministry
router.patch("/ministries/:id", async (req, res) => {
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
router.delete("/ministries/:id", async (req, res) => {
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
