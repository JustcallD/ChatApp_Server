import ChatRoom from "../Models/chatRoom.Model.js";
import { getUserSocketId } from "./users.js";

const handleUserToUserChat = (io, socket) => {
  socket.on("sendMessage", async ({ receiverId, message }) => {
    const senderId = socket.user._id;
    try {
      let chatRoom = await ChatRoom.findOne({
        members: { $all: [senderId, receiverId] },
      });

      if (!chatRoom) {
        chatRoom = await ChatRoom.create({
          members: [senderId, receiverId],
          messages: [{ sender: senderId, content: message }],
        });
      } else {
        chatRoom.messages.push({ sender: senderId, content: message });
        await chatRoom.save();
      }

      const senderSocketId = getUserSocketId(senderId);
      const receiverSocketId = getUserSocketId(receiverId);

      if (senderSocketId) {
        io.to(senderSocketId).emit("message", {
          senderId,
          message,
        });
      }

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("message", {
          senderId,
          message,
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });
};

export { handleUserToUserChat };
