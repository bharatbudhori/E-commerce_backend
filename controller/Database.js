const mongoose = require("mongoose");
mongoose.connect(
  'mongodb+srv://bharat_budhori:hQ5PPG5lXbsKAeOA@cluster0.qkfksjm.mongodb.net/E-commerce?retryWrites=true&w=majority'
  ).then(() => {
    console.log("Connected to database!");
  }).catch(() => {
    console.log("Connection failed!");
  }
);