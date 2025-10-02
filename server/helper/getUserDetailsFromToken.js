const jwt = require("jsonwebtoken");
const User = require("../models/user");

require('dotenv').config();

exports.getUserDetailsFromToken = async (token) => {
    if (!token) {
        throw new Error("Token not provided");
    }

    try {
        console.log('token ->',token)
        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const user = await User.findById(decode.id).select("-password");

        if (!user) {
            throw new Error("User not found");
        }

        return user;
    } catch (err) {
        console.error("Error in getUserDetailsFromToken:", err.message);
        throw new Error("Invalid or expired token");
    }
};
