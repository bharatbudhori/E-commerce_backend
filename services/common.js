const passport = require("passport");

exports.isAuthenticated = (req, res, done) => {
    return passport.authenticate("jwt");
};

exports.sanitizeUser = (user) => {
    return {
        id: user.id,
        role: user.role,
    };
};

exports.cookieExtractor = function (req) {
    var token = null;
    if (req && req.cookies) {
        token = req.cookies["jwt"];
    }
    // token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MDJlZDMwMzc5NDllNWZjODlhYzFkZCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY5NDg1NjU5Nn0.PR2n_ggqI6zz_CjbOChVRHSqwDPd_qQ3BfhoLpr8diE';
    return token;
};
