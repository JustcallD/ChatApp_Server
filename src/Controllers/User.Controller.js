import User from "../Models/User.Model.js";
import AsyncHandler from "../Utils/AsyncHandler.js";
// import ApiResponse from "../Utils/ApiResponse.js";
import ApiError from "../Utils/ApiError.js";
import ChatRoom from "../Models/chatRoom.Model.js";

const AllUserController = AsyncHandler(async (req, res, next) => {
  const currentUser = req.user;
  console.log(currentUser);
  try {
    const users = await User.find({ _id: { $ne: currentUser._id } });
    res.status(200).json(users);
  } catch (error) {
    next(ApiError.internalServerError(error.message));
  }
});

const createChatRoom = async (req, res, next) => {
  try {
    const { memberIds } = req.body;

    if (!memberIds || !Array.isArray(memberIds)) {
      return res.status(400).json({ error: "Invalid memberIds provided." });
    }

    const newChatRoom = await ChatRoom.create({
      members: memberIds,
    });

    res.status(201).json(newChatRoom);
  } catch (error) {
    next(error);
  }
};

export { createChatRoom, AllUserController };
