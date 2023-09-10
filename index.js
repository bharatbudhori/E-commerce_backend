const express = require("express");
const server = express();
const productsRouters = require("./routes/Products");
const categoriesRouters = require("./routes/Categories");
const brandsRouters = require("./routes/Brands");
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

server.get("/", (req, res) => {
    res.json({ message: "Hello World" });
});

server.listen(8080, () => {
    console.log("Server is running...");
});
