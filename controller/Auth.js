const User = require("../model/User");

exports.createUser = async (req, res) => {
    try {
        const user = new User(req.body);
        const doc = await user.save();
        res.status(201).json({ id: doc.id, role: doc.role });
    } catch (err) {
        res.status(400).json(err);
    }
};

exports.loginUser = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            res.status(400).json({ message: "User not found" });
        } else if (user.password === req.body.password) {
            res.status(201).json({
                id: user.id,
                role: user.role,
            });
        } else {
            res.status(400).json({ message: "Invalid Credentials" });
        }
    } catch (err) {
        res.status(400).json(err);
    }
};
