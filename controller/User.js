const User = require("../model/User");

exports.fetchUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id, { password: 0 });
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json(err);
    }
};

exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json(err);
    }
};
