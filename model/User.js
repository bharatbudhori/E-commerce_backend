const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
    name: { type: String, require: true, default: "new user"},
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    role: { type: String, require: true, default: "user" },
    addresses: { type: [Schema.Types.Mixed] },
    orders: { type: [Schema.Types.Mixed] },
});

const virtual = UserSchema.virtual("id");
virtual.get(function () {
    return this._id;
});

UserSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    },
});

module.exports = mongoose.model("User", UserSchema);
