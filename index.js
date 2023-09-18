require("dotenv").config();
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
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const {
    isAuthenticated,
    sanitizeUser,
    cookieExtractor,
} = require("./services/common");
const path = require("path");

const endpointSecret = process.env.ENDPOINT_SECRET;

server.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    (request, response) => {
        let event = request.body;
        // Only verify the event if you have an endpoint secret defined.
        // Otherwise use the basic event deserialized with JSON.parse
        if (endpointSecret) {
            // Get the signature sent by Stripe
            const signature = request.headers["stripe-signature"];
            try {
                event = stripe.webhooks.constructEvent(
                    request.body,
                    signature,
                    endpointSecret
                );
            } catch (err) {
                console.log(
                    `⚠️  Webhook signature verification failed.`,
                    err.message
                );
                return response.sendStatus(400);
            }
        }

        // Handle the event
        switch (event.type) {
            case "payment_intent.succeeded":
                const paymentIntent = event.data.object;
                console.log(
                    `PaymentIntent for ${paymentIntent.amount} was successful!`
                );
                // Then define and call a method to handle the successful payment intent.
                // handlePaymentIntentSucceeded(paymentIntent);
                break;
            case "payment_method.attached":
                const paymentMethod = event.data.object;
                // Then define and call a method to handle the successful attachment of a PaymentMethod.
                // handlePaymentMethodAttached(paymentMethod);
                break;
            default:
                // Unexpected event type
                console.log(`Unhandled event type ${event.type}.`);
        }

        // Return a 200 response to acknowledge receipt of the event
        response.send();
    }
);

const opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.JWT_SECRET_KEY;

require("./controller/Database");

server.use(express.static(path.resolve(__dirname, "build")));
server.use(cookieParser());

server.use(
    session({
        secret: process.env.SESSION_SECRET_KEY,
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

// server.use(express.raw({ type: "application/json" }));
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
                        const token = jwt.sign(
                            sanitizeUser(user),
                            process.env.JWT_SECRET_KEY
                        );
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

//stripe payment

server.post("/create-payment-intent", async (req, res) => {
    const { items } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.totalAmount * 100,
        currency: "inr",
        automatic_payment_methods: {
            enabled: true,
        },
    });
    res.send({
        clientSecret: paymentIntent.client_secret,
    });
});

server.get("/", (req, res) => {
    res.json({ message: "Hello World" });
});

server.listen(process.env.PORT, () => {
    console.log("Server is running...");
});
