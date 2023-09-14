const { Order } = require("../model/Order");


exports.fetchOrdersByUser = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.params.userId });
        
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

exports.fetchAllOrders = async (req, res) => {
    let query = Order.find({deleted : {$ne : true}});
    let totalOrders = Order.find({deleted : {$ne : true}});

    if (req.query._sort && req.query._order) {
        query = query.sort({ [req.query._sort]: req.query._order });
    }

    const totalDocs = await totalOrders.count().exec();

    if (req.query._page && req.query._limit) {
        const page = parseInt(req.query._page);
        const limit = parseInt(req.query._limit);
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);
    }

    try {
        const Order = await query.exec();
        res.set("X-Total-Count", totalDocs);
        res.status(201).json(Order);
    } catch (err) {
        res.status(400).json(err);
    }
};
