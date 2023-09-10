const Product = require("../model/Product");

exports.createProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        const doc = await product.save();
        res.status(201).json(doc);
    } catch (err) {
        res.status(400).json(err);
    }
};

exports.fetchAllProducts = async (req, res) => {
    let query = Product.find({});
    if (req.query.category) {
        query = query.where({ category: req.query.category });
    }
    if (req.query.brand) {
        query = query.where({ brand: req.query.brand });
    }
    if (req.query._sort && req.query._order) {
        query = query.sort({ [req.query._sort]: req.query._order });
    }

    if (req.query._page && req.query._limit) {
        const page = parseInt(req.query._page);
        const limit = parseInt(req.query._limit);
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);
    }

    try {
        const product = await query.exec();
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json(err);
    }
};
