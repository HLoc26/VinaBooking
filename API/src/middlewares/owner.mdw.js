import { User, ERole } from "../classes/index.js";

export default {
    // Middleware to check if the user is an accommodation owner
    isAccommodationOwner(req, res, next) {
        try {
            // User is already set by the decodeJwt middleware
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    error: {
                        code: 401,
                        message: "Authentication required"
                    }
                });
            }

            // Get user from database to check role
            User.findByPk(req.user.id)
                .then(user => {
                    if (!user || user.role !== ERole.ACCOMMODATION_OWNER) {
                        return res.status(403).json({
                            success: false,
                            error: {
                                code: 403,
                                message: "Access denied. Only accommodation owners can access this resource"
                            }
                        });
                    }
                    
                    // User is an accommodation owner, proceed
                    next();
                })
                .catch(error => {
                    console.error("Error verifying user role:", error);
                    return res.status(500).json({
                        success: false,
                        error: {
                            code: 500,
                            message: "Internal Server Error"
                        }
                    });
                });
        } catch (error) {
            console.error("Error in isAccommodationOwner middleware:", error);
            return res.status(500).json({
                success: false,
                error: {
                    code: 500,
                    message: "Internal Server Error"
                }
            });
        }
    }
};