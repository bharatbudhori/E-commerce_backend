const { Order } = require("../model/Order");


exports.fetchOrdersByUser = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.query.user });
        
        res.status(201).json(orders);
    } catch (err) {
        res.status(400).json(err);
    }
};

exports.createOrder = async (req, res) => {
    try {
        const order = new Order(req.body);
        const doc = await order.save();
        res.status(201).json(doc);
    } catch (err) {
        res.status(400).json(err);
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        res.status(201).json(order);
    } catch (err) {
        res.status(400).json(err);
    }
};

exports.updateOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(201).json(order);
    } catch (err) {
        res.status(400).json(err);
    }
};
