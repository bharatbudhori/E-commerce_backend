const passport = require("passport");

exports.isAuthenticated = (req, res, next) => {
    if (passport.authenticate('jwt')) {
        return next();
    }
    res.status(401).json({ message: "Unauthorized" });
};

exports.sanitizeUser = (user) => {
    return {
        id: user.id,
        role: user.role,
    };
};