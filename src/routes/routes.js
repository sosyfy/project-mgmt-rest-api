import express from "express";

//controllers
import authController from "../controllers/authController.js";
import ministryController from "../controllers/ministryController.js"
import projectController from "../controllers/projectController.js"

const router = express.Router();


router.use("/auth", authController)
router.use("/setup", ministryController)
router.use("/projects", projectController)



export default router;