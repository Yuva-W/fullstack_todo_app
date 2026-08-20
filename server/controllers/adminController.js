const User = require("../models/user");

const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().select("-password");

        res.status(200).json({
            success : true,
            count : users.length,
            users
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllUsers
};