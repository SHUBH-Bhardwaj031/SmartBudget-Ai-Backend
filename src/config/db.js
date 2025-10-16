import mongoose from "mongoose";
import { mongoURI } from "../utils/constants.js";
// mongoose
//   .connect(mongoURI)
//   .then(() => {
//     console.log("db is connected");
//   })
//   .catch((error) => {
//     console.log(error);
//     console.log("error in connecting with db");
//   });

async function connectDb() {
  try {
    await mongoose.connect(mongoURI);
    console.log("connected to database");
  } catch (e) {
    console.log(e);
    console.log("error in connecting db");
  }
}

connectDb();

export default connectDb;
