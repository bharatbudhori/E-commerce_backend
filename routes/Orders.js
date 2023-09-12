const express = require("express");
const { fetchOrdersByUser, createOrder, updateOrder, deleteOrder } = require("../controller/Order");

const router = express.Router();

router
    .get("/", fetchOrdersByUser)
    .post("/", createOrder)
    .patch("/:id", updateOrder)
    .delete("/:id", deleteOrder);

exports.routes = router;
