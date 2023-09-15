const express = require("express");
const { createUser, loginUser, check } = require("../controller/Auth");
const passport = require("passport");

const router = express.Router();

router
    .post("/signup", createUser)
    .post("/login", passport.authenticate('local'), loginUser)
    .get("/check", passport.authenticate('jwt'), check);

exports.routes = router;
