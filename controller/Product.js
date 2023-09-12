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
    let query = Product.find({deleted : {$ne : true}});
    let totalProducts = Product.find({deleted : {$ne : true}});
    if (req.query.category) {
        query = query.where({ category: req.query.category });
        totalProducts = totalProducts.where({ category: req.query.category });
    }
    if (req.query.brand) {
        query = query.where({ brand: req.query.brand });
        totalProducts = totalProducts.where({ brand: req.query.brand });
    }
    if (req.query._sort && req.query._order) {
        query = query.sort({ [req.query._sort]: req.query._order });
    }

    const totalDocs = await totalProducts.count().exec();

    if (req.query._page && req.query._limit) {
        const page = parseInt(req.query._page);
        const limit = parseInt(req.query._limit);
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);
    }

    try {
        const product = await query.exec();
        res.set("X-Total-Count", totalDocs);
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json(err);
    }
};

exports.fetchProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json(err);
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json(err);
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json(err);
    }
};
