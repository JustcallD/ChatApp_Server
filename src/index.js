import dotenv from "dotenv";

import ConnectDB from "./Config/DB_Config.js";

import Server from "./App.js";

dotenv.config();

ConnectDB()
  .then(
    Server.listen(process.env.PORT || 4002, () => {
      console.log(
        `Server is running at port : http://localhost:${
          process.env.PORT || 4002
        } \n`
      );
    })
  )
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });
