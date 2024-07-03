import mongoose from "mongoose";


const ConnectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      process.env.CONNECT_DB
    );
    console.log(
      `\nMongoDB Connected! Db host: ${connectionInstance.connection.host}\n`
    );
  } catch (error) {
    console.log("MongoDB connection error: ", error);
    process.exit(1);
  }
};

export default ConnectDB;
