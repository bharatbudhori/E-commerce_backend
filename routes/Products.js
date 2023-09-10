const express = require("express");
const { createProduct, fetchAllProducts } = require("../controller/Product");

const router = express.Router();

router.post("/", createProduct);
router.get("/", fetchAllProducts);

exports.routes = router;
