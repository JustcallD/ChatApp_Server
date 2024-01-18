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

    // Save the updated message document
    await message.save();

    // console.log("Message added successfully:", message);
    res
      .status(200)
      .json({ message: "Message added successfully", data: message });
  } catch (error) {
    console.error("Error adding message:", error.message);
    res.status(500).json({ error: "Error adding message" });
  }
});
// router.get("/getMessages", async (req, res) => {
//   const { participants } = req.body;
//   console.log(participants);
//   const message = await Message.findOne({
//     participants: { $all: participants },
//   });

//   res.status(200).json(message);
// });
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
// router.get("/getMessages", async (req, res) => {
//   const { sender, receiver } = req.query; // Use req.query to get parameters from the URL
//   console.log("{ sender, receiver }", { sender, receiver });
//   const message = await Message.findOne({
//     participants: { $all: [sender, receiver] },
//   });

//   res.status(200).json(message);
// });

module.exports = router;
