import mongoose from "mongoose";

export default function() {
    
	mongoose.connect(process.env["DATABASE_CONNECTION_URL"], {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
		.then(() => 
			console.log("DATABASE_CONNECTION_SUCCESS")	
		)
		.catch((error) => {
			console.log(error);
			process.exit(1);
		});
    
}