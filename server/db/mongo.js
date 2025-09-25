import mongoose from "mongoose";

const connect = (dbUri = process.env.MONGODB_CONNECTION_STRING) => {
  return new Promise((resolve, reject) => {
    mongoose.connect(dbUri);
    mongoose.connection.on("connected", () => {
      console.log("Connected to Mongo");
    });
    mongoose.connection.on("error", () => {
      reject("Error while connecting to Mongo");
    });
    resolve();
  });
};

const disconnect = async () => {
  await mongoose.connection.disconnect();
};

export { connect, disconnect };
