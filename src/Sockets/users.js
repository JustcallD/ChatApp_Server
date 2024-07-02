const users = {};

const addUser = (userId, socketId) => {
  users[userId] = socketId;
};

const removeUser = (userId) => {
  delete users[userId];
};

const getUserSocketId = (userId) => {
  return users[userId];
};

export { users, addUser, removeUser, getUserSocketId };
