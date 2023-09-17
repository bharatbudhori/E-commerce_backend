const express = require("express");
const server = express();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const productsRouters = require("./routes/Products");
const categoriesRouters = require("./routes/Categories");
const brandsRouters = require("./routes/Brands");
const usersRouters = require("./routes/Users");
const authRouters = require("./routes/Auth");
const cartsRouters = require("./routes/Carts");
const ordersRouters = require("./routes/Orders");
const cors = require("cors");
const crypto = require("crypto");
const JwtStrategy = require("passport-jwt").Strategy;

const passport = require("passport");
const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./model/User");
const {
    isAuthenticated,
    sanitizeUser,
    cookieExtractor,
} = require("./services/common");

const SECRET_KEY = "SECRET_KEY";

const opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = SECRET_KEY;

require("./controller/Database");

server.use(express.static("build"));
server.use(cookieParser());

server.use(
    session({
        secret: "secret",
        resave: false,
        saveUninitialized: false,
        // store: new MongoStore({ mongooseConnection: mongoose.connection }),
    })
);

server.use(passport.authenticate("session"));
server.use(
    cors({
        exposedHeaders: ["X-Total-Count"],
    })
);
server.use(express.json());
server.use("/products", isAuthenticated(), productsRouters.routes);
server.use("/categories", isAuthenticated(), categoriesRouters.routes);
server.use("/brands", isAuthenticated(), brandsRouters.routes);
server.use("/users", isAuthenticated(), usersRouters.routes);
server.use("/auth", authRouters.routes);
server.use("/cart", isAuthenticated(), cartsRouters.routes);
server.use("/orders", isAuthenticated(), ordersRouters.routes);

passport.use(
    "local",
    new LocalStrategy({ usernameField: "email" }, async function (
        email,
        password,
        done
    ) {
        try {
            const user = await User.findOne({ email: email });

            if (!user) {
                done(null, false, { message: "Invalid Credentials" });
            }

            crypto.pbkdf2(
                password,
                user.salt,
                310000,
                32,
                "sha256",
                async function (err, hashedPassword) {
                    if (
                        !crypto.timingSafeEqual(user.password, hashedPassword)
                    ) {
                        done(null, false, { message: "Invalid Credentials" });
                    } else {
                        const token = jwt.sign(sanitizeUser(user), SECRET_KEY);
                        done(null, { token });
                    }
                }
            );
        } catch (err) {
            done(err);
        }
    })
);

passport.use(
    "jwt",
    new JwtStrategy(opts, async function (jwt_payload, done) {
        try {
            const user = await User.findOne({ _id: jwt_payload.id });
            if (user) {
                return done(null, sanitizeUser(user));
            } else {
                return done(null, false);
            }
        } catch (err) {
            return done(err, false);
        }
    })
);

passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, {
            id: user.id,
            role: user.role,
        });
    });
});

passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});

server.get("/", (req, res) => {
    res.json({ message: "Hello World" });
});

server.listen(8080, () => {
    console.log("Server is running...");
});
