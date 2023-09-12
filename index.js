const express = require("express");
const server = express();
const productsRouters = require("./routes/Products");
const categoriesRouters = require("./routes/Categories");
const brandsRouters = require("./routes/Brands");
const usersRouters = require("./routes/Users");
const authRouters = require("./routes/Auth");
const cartsRouters = require("./routes/Carts");
const ordersRouters = require("./routes/Orders");
const cors = require("cors");

require("./controller/Database");

server.use(
    cors({
        exposedHeaders: ["X-Total-Count"],
    })
);
server.use(express.json());
server.use("/products", productsRouters.routes);
server.use("/categories", categoriesRouters.routes);
server.use("/brands", brandsRouters.routes);
server.use("/users", usersRouters.routes);
server.use("/auth", authRouters.routes);
server.use("/cart", cartsRouters.routes);
server.use("/orders", ordersRouters.routes);

server.get("/", (req, res) => {
    res.json({ message: "Hello World" });
});

server.listen(8080, () => {
    console.log("Server is running...");
});
