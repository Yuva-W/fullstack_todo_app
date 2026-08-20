const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const { deleteMyAccount } = require("../controllers/userController");

const router = express.Router();

router.delete(
    "/me",
    authMiddleware,
    deleteMyAccount
);

module.exports = router;