import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ministrySchema = new Schema({
	name: {
		type: String,
		required: true
	}
}, { timestamps: true });

const Ministry = mongoose.model("Ministry", ministrySchema);

export default Ministry;
