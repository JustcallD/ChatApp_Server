import mongoose from "mongoose";
import { DB_Name } from "../Constants/Constants.js";


const ConnectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.DB_Connect}${DB_Name}`
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
