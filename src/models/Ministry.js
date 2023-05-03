import { Schema, model } from "mongoose";

const ministrySchema = new Schema({
	name: {
		type: String,
		required: true
	}
}, { timestamps: true });

const Ministry = model("Ministry", ministrySchema);

export default Ministry;
