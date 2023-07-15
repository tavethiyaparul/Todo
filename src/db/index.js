import mongoose from "mongoose";

const connectDB = async () => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(process.env.MONGOURL)
      .then(() => {
        console.log("Db connected successfully!");

        resolve();
      })
      .catch((err) => {
        console.log(err);

        reject();
      });
  });
};

export default connectDB;
