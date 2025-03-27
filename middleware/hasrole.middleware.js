const hasRole= (roles) => {
    // Convert single role to array
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    return (req, res, next) => {
        // Ensure user is authenticated
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
            }

            // Get user roles, ensure it's an array
            const userRoles = Array.isArray(req.user.roles) ? req.user.roles : [req.user.roles];
            
            // Check if user has at least one of the required roles
            const hasRequiredRole = allowedRoles.some(role => userRoles.includes(role));

            if(!hasRequiredRole) {
                return res.status(403).json({
                    success: false,
                    message: 'Forbidden'
                });
            }

            next();
        } catch (error) {
            next(error);
        }
    }
}

export default hasRole;