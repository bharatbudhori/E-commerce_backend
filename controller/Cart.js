const { Cart } = require("../model/Cart");

exports.fetchCartByUser = async (req, res) => {
    try {
        const cart = await Cart.find({ user: req.query.user })
            .populate("user")
            .populate("product");
        res.status(201).json(cart);
    } catch (err) {
        res.status(400).json(err);
    }
};

exports.addToCart = async (req, res) => {
    try {
        const cart = new Cart(req.body);
        const doc = await cart.save();
        const result = await doc.populate("product");
        res.status(201).json(result);
    } catch (err) {
        res.status(400).json(err);
    }
};

exports.deleteFromCart = async (req, res) => {
    try {
        const cart = await Cart.findByIdAndDelete(req.params.id);
        res.status(201).json(cart);
    } catch (err) {
        res.status(400).json(err);
    }
};

exports.updateCart = async (req, res) => {
    try {
        const cart = await Cart.findByIdAndUpdate(req.params.id, req.body, { new: true });
        const result = await cart.populate("product");
        res.status(201).json(result);
    } catch (err) {
        res.status(400).json(err);
    }
};
