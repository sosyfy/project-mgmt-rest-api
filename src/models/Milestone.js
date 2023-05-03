import mongoose from "mongoose";
const Schema = mongoose.Schema;

const milestoneSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	budget: {
		type: Number,
		required: true
	},
	due_date: {
		type: Date,
		required: true
	},
	date_completed: {
		type: Date
	},
	status: {
		type: String,
		enum: ["on schedule", "behind" , "Completed" , "active"],
		default: "on schedule"
	},
	project_phase_id: {
		type: Schema.Types.ObjectId,
		ref: "ProjectPhase",
		required: true
	}
}, { timestamps: true });

const Milestone = mongoose.model("Milestone", milestoneSchema);

export default Milestone;
