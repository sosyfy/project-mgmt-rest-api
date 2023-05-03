import mongoose from "mongoose";
const Schema = mongoose.Schema;

const projectPhaseSchema = new Schema({
	project_id: {
		type: Schema.Types.ObjectId,
		ref: "Project",
		required: true
	},
	name: {
		type: String,
		required: true
	},
	start_date: {
		type: Date,
		required: true
	},
	end_date: {
		type: Date,
		required: true
	},
	budget: {
		type: Number,
		required: true
	}
}, { timestamps: true });

const ProjectPhase = mongoose.model("ProjectPhase", projectPhaseSchema);

export default ProjectPhase;
