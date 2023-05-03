
import Milestone from "../models/Milestone.js";
import Project from "../models/Project.js";
import ProjectPhase from "../models/ProjectPhase.js";



export const getSingleProjectDetails = async (req, res) => {
	try {
		const project = await Project.findById(req.params.id)
			.populate({
				path: "ministry_id",
				select: "name"
			})
			.populate({
				path: "project_phases",
				select: ["name", "budget", "start_date", "end_date"],
				populate: {
					path: "milestones",
					select: ["name", "budget", "due_date", "date_completed", "status"],
					options: { sort: { due_date: 1 } }
				}
			});
  
		if (!project) {
			return res.status(404).json({ message: "Project not found" });
		}
  
		// Calculate total amount spent on the project so far
		let amountSpent= project.project_phases.reduce((total, phase) => total + phase.milestones.reduce((phaseTotal, milestone) => {
			return milestone.status === "Completed" ? phaseTotal + milestone.budget : phaseTotal;
		}, 0), 0);
  
		// Calculate number of days project is behind schedule
		const currentDate = new Date();
		let daysBehindSchedule = 0;
		for (const phase of project.project_phases) {
			for (const milestone of phase.milestones) {
				if (milestone.status === "behind" && milestone.due_date < currentDate) {
					daysBehindSchedule += Math.floor((currentDate - milestone.due_date) / (1000 * 60 * 60 * 24));
				}
			}
		}
  
		const projectDetails = {
			name: project.name,
			funding_sponsor: project.funding_sponsor,
			commencement_date: project.start_date,
			current_milestone: project.project_phases[0]?.milestones[0]?.name,
			last_update: project.updatedAt,
			amount_spent: amountSpent,
			budget: project.budget,
			project_phases: project.project_phases.map(phase => {
				return {
					name: phase.name,
					budget: phase.budget,
					start_date: phase.start_date,
					end_date: phase.end_date,
					milestones: phase.milestones.map(milestone => {
						let daysUntilDue = 0;
						if (!milestone.date_completed) {
							daysUntilDue = Math.floor((milestone.due_date - currentDate) / (1000 * 60 * 60 * 24));
							if (daysUntilDue < 0) {
								milestone.status = "behind";
								daysBehindSchedule += Math.abs(daysUntilDue);
							}
						}
						return {
							name: milestone.name,
							budget: milestone.budget,
							due_date: milestone.due_date,
							date_completed: milestone.date_completed,
							status: milestone.status,
							days_until_due: daysUntilDue
						};
					})
				};
			}),
			days_behind_schedule: daysBehindSchedule
		};
  
		res.json(projectDetails);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Server error" });
	}
};


export const createNewProject =  async (req, res) => {
	try {
		// create a new project
		const project = new Project({
			name: req.body.name,
			start_date: req.body.start_date,
			end_date: req.body.end_date,
			funding_sponsor: req.body.funding_sponsor,
			budget: req.body.budget,
			ministry_id: req.body.ministry_id
		});
		await project.save();
  
		// create project phases
		const phases = req.body.phases;
		for (let i = 0; i < phases.length; i++) {
			const phase = new ProjectPhase({
				project_id: project._id,
				name: phases[i].name,
				start_date: phases[i].start_date,
				end_date: phases[i].end_date,
				budget: phases[i].budget
			});
			await phase.save();
            
			project.project_phases.push(phase._id)

			await project.save()
			// create milestones for each phase
			const milestones = phases[i].milestones;
			for (let j = 0; j < milestones.length; j++) {
				const milestone = new Milestone({
					project_phase_id: phase._id,
					name: milestones[j].name,
					budget: milestones[j].budget,
					due_date: milestones[j].due_date
				});
				
				await milestone.save();
				phase.milestones.push(milestone._id)
				await phase.save()
			}
		}
  
		res.status(201).json({ message: "Project created successfully", project });
	} catch (error) {
		res.status(500).json({ message: "An error occurred while creating the project" });
	}
};
  