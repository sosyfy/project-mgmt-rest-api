
import express from "express";

import { getSingleProjectDetails , createNewProject } from "../services/projectService.js";
import { authMiddleware } from "../middlewares/guards.js";
import { body, validationResult } from "express-validator";
import parseError from "../utils/parseError.js";

const router = express.Router();

router.get("/view/:id", authMiddleware, async (req, res) => {
	try {
		getSingleProjectDetails(req, res)
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
});
  
const validateProject = [
	body("name").trim().notEmpty().withMessage("Project name is required."),
	body("start_date").notEmpty().withMessage("Start date is required."),
	body("end_date").notEmpty().withMessage("End date is required."),
	body("budget").isNumeric().notEmpty().withMessage("Budget is required and must be a number."),
	body("funding_sponsor").trim().notEmpty().withMessage("Funding sponsor is required."),
];


router.post("/create", authMiddleware, validateProject, async ( req, res )=>{
	try {
		const { errors } = validationResult(req)

		if( errors.length > 0 ) {
			throw errors;
		}

		await createNewProject(req, res)
	} catch (error) {
		const message = parseError(error)
        
		//400 - bad request
		res.status(400).json({
			message
		})
	}
})
export default router
  