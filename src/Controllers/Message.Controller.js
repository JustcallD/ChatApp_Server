import ChatRoom from "../Models/chatRoom.Model.js";
import AsyncHandler from "../Utils/AsyncHandler.js";

export const AllMessageController = AsyncHandler(async (req, res) => {
  const currentUser = req.user;
  const { receiverId } = req.params;

  try {
    let chatRoom = await ChatRoom.findOne({
      members: { $all: [currentUser._id, receiverId] },
    })
      .populate({
        path: "messages.sender",
        select: "_id username",
      })
      .select("messages");

    res.status(200).json(chatRoom);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
