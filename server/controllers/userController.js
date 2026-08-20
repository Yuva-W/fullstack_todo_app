const User = require("../models/user");
const Todo = require("../models/todo");

// const deleteMyAccount = async (req, res, next) => {
//     try {
//         const userId = req.user.userId;

//         await Todo.deleteMany({
//             user: userId
//         });

//         const user = await User.findByIdAndDelete(userId);

//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found"
//             });
//         }

//         res.status(200).json({
//             success: true,
//             message: "Account and all todos deleted successfully"
//         });
//     } catch (error) {
//         next(error);
//     }
// };

const deleteMyAccount = async (req, res, next) => {
    const session = await User.startSession();

    try {
        const userId = req.user.userId;

        session.startTransaction();

        await Todo.deleteMany(
            { user: userId },
            { session }
        );

        const user = await User.findByIdAndDelete(
            userId,
            { session }
        );

        if (!user) {
            await session.abortTransaction();

            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        await session.commitTransaction();

        res.status(200).json({
            success: true,
            message: "Account and all todos deleted successfully"
        });
    } catch (error) {
        await session.abortTransaction();
        next(error);
    } finally {
        session.endSession();
    }
};

module.exports = {
    deleteMyAccount
};