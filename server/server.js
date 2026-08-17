// const bcrypt = require("bcrypt");

// const jwt = require("jsonwebtoken");
// const express = require("express");

// const app = express();

// app.use(express.json());

// async function register(req, res) {
//   const { name, email, password } = req.body;

//   // Hash Password

//   const hashedPassword = await bcrypt.hash(password, 10);

//   console.log(hashedPassword);
// }

// async function login(req, res) {
//   const { email, password } = req.body;

//   // Step 1: Find User
//   const user = await User.findOne({ email });

//   if (!user) {
//     return res.status(401).json({
//       message: "Invalid Credentials",
//     });
//   }

//   // Step 2: Compare Password
//   const isMatch = await bcrypt.compare(password, user.password);

//   if (!isMatch) {
//     return res.status(401).json({
//       message: "Invalid Credentials",
//     });
//   }

//   // Step 3: Generate JWT
//   const token = jwt.sign(
//     {
//       userId: user._id,
//       role: user.role,
//     },
//     process.env.JWT_SECRET,
//     {
//       expiresIn: "1h",
//     },
//   );

//   // Step 4: Send Response
//   res.status(200).json({
//     success: true,
//     message: "Login Successful",
//     token,
//   });
// }

// app.listen(3000, () => {
//   console.log("Server is running on port 3000");
// });

require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();
