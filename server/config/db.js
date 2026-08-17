// const mongoose = require("mongoose");

// async function connectDB() {
//     try{
//         await mongoose.connect(process.env.MONGO_URL);
//         console.log("Connected to MongoDB");
//     }catch(err){
//         console.error("Error connecting to MongoDB", err.message);
//         process.exit(1);
//     }
// }

// module.exports = connectDB;

const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;