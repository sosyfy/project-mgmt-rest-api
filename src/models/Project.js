const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectSchema = new Schema({
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
	funding_sponsor: {
		type: String,
		required: true
	},
	ministry_id: {
		type: Schema.Types.ObjectId,
		ref: "Ministry",
		required: true
	}
}, { timestamps: true });

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;