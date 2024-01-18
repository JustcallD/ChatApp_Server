const { Router } = require("express");
const router = Router();
const User = require("../models/Users");
const Connection = require("../models/Connections");
const Message = require("../models/Message");

router.post("/register", async (req, res) => {
  const email = req.body.email;
  console.log(email);
  try {
    if (!email) {
      return res.status(400).json("required email");
    }
    const existUser = await User.findOne({ email });
    if (existUser) {
      throw new Error("user exist");
    }
    const user = await User.create({
      email,
    });
    return res.status(201).json("user added");
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
router.post("/login", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
  res.status(200).json({ userId: user._id, email: user.email });
});

router.get("/connections/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const getConnections = await Connection.findOne({ user: id })
      .populate("connections", "email")
      .exec();

    res.status(200).json(getConnections);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/addMessages", async (req, res) => {
  // const { participant1, participant2, text } = req.body;
  // try {
  //   // Check if a message document already exists for the given participants
  //   let message = await Message.findOne({
  //     participants: { $all: [participant1, participant2] },
  //   });

  //   // If no existing message, create a new one
  //   if (!message) {
  //     message = await Message.create({
  //       participants: [participant1, participant2],
  //       messages: [],
  //     });
  //   }
  //   console.log(message);
  //   // Add the new message to the 'messages' array
  //   // message.messages.push({
  //   //   from: participant1,
  //   //   to: participant2,
  //   //   text: text,
  //   // });

  //   // // Save the updated message document
  //   // await message.save();

  //   console.log("Message added successfully");
  // } catch (error) {
  //   console.error("Error adding message:", error.message);
  // }
  const { participants, text } = req.body;

  try {
    // Check if a message document already exists for the given participants
    let message = await Message.findOne({
      participants: { $all: participants },
    });

    // If no existing message, create a new one
    if (!message) {
      message = await Message.create({
        participants: participants,
        messages: [],
      });
    }

    // Add the new message to the 'messages' array
    message.messages.push({
      from: participants[0],
      to: participants[1],
      text: text,
    });

    await message.save();

    res
      .status(200)
      .json({ message: "Message added successfully", data: message });
  } catch (error) {
    console.error("Error adding message:", error.message);
    res.status(500).json({ error: "Error adding message" });
  }
});

router.get("/getMessages", async (req, res) => {
  const participants = req.query.participants;
  // const { sender, receiver } = req.query;

  // console.log("{ sender, receiver }", participants);
  const message = await Message.findOne({
    participants: { $all: participants },
  });
  // console.log(message);
  res.status(200).json(message);
});

// router.post("/connection", async (req, res) => {
//   try {
//     const { userId, email } = req.body;
//     console.log("id", userId, "connection", email);
//     if (!userId && !email) {
//       res.status(404).json({ error: "userID or Email is empty" });
//     }

//     // const connectionUserId = await User.findOne({ email }).select("_id");
//     const connectionUser = await User.findOne({ email }).select("_id");
//     // if (connectionUser) {
//     //   res.status(500).json({ error: "invalid email" });
//     // }
//     const connectionUserId = connectionUser._id.toString();

//     console.log("connectionUserId", connectionUserId);

//     const updatedConnectionFrom = await Connection.findOneAndUpdate(
//       { user: userId },
//       { $addToSet: { connections: connectionUserId } },
//       { upsert: true, new: true }
//     );
//     if (updatedConnectionFrom) {
//       res.status(500).json({ error: "invalid Id" });
//     }
//     // const data = await Connection.findOneAndUpdate
//     const updatedConnectionTo = await Connection.findOneAndUpdate(
//       { user: connectionUserId },
//       { $addToSet: { connections: userId } },
//       { upsert: true, new: true }
//     );
//     res.status(200).json(updatedConnectionFrom);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

router.post("/connection", async (req, res) => {
  try {
    const { userId, email } = req.body;
    console.log("id", userId, "connection", email);

    // Check if either userId or email is empty
    if (!userId && !email) {
      res.status(400).json({ error: "userId or Email is empty" });
      return; // Stop further execution
    }

    const connectionUser = await User.findOne({ email }).select("_id");

    // Check if connectionUser is not found
    if (!connectionUser) {
      res.status(404).json({ error: "Invalid email" });
      return; // Stop further execution
    }

    const connectionUserId = connectionUser._id.toString();
    console.log("connectionUserId", connectionUserId);

    const updatedConnectionFrom = await Connection.findOneAndUpdate(
      { user: userId },
      { $addToSet: { connections: connectionUserId } },
      { upsert: true, new: true }
    );

    // Check if updatedConnectionFrom is not found
    if (!updatedConnectionFrom) {
      res.status(404).json({ error: "Invalid Id" });
      return; // Stop further execution
    }

    const updatedConnectionTo = await Connection.findOneAndUpdate(
      { user: connectionUserId },
      { $addToSet: { connections: userId } },
      { upsert: true, new: true }
    );

    res.status(200).json(updatedConnectionFrom);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
