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
		enum: ["on schedule", "behind"],
		default: "on schedule"
	},
	project_id: {
		type: Schema.Types.ObjectId,
		ref: "Project",
		required: true
	}
}, { timestamps: true });

const Milestone = mongoose.model("Milestone", milestoneSchema);

export default Milestone;
