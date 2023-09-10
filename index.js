const express = require("express");
const server = express();
const productsRouters = require("./routes/Products");

require("./controller/Database");

server.use(express.json());
server.use("/products", productsRouters.routes);

server.get("/", (req, res) => {
    res.json({ message: "Hello World" });
});

server.listen(8080, () => {
    console.log("Server is running...");
});

