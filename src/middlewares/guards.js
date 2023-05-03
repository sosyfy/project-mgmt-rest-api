import jwt from "jsonwebtoken";
 
export const hasUser = () => {
    
	return (req, res, next) => {
        
		if( req.user && req.user.isConfirmed ) {
			next();
		} else {
			//401 - unauthorized
			res.status(401).json({
				message: "Please login!"
			})
		}
	}
}

export const isGuest = () => {
    
	return (req, res, next) => {
        
		if( !req.user || req.user && !req.user.isConfirmed ) {
			next();
		} else {
			//400 - bad request
			res.status(400).json({
				message: "You are already logged in!"
			})
		}
	}
}

export const hasRole = () => {
    
	return (req, res, next) => {
        
		if( req.user && req.user.isConfirmed && req.user.roles.includes("admin") ) {
			next();
		} else {
			res.status(400).json({
				message: "You don't have permission to perform this action!"
			})
		}
	}
}




export const authMiddleware = (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (!authHeader) {
		return res.status(401).json({ message: "Missing authorization header" });
	}

	const token = authHeader.split(" ")[1];

	jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
		if (err) {
			return res.status(401).json({ message: "Invalid token" });
		}

		req.userId = decoded.userId;
		next();
	});
};