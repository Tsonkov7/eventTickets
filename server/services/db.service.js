import mongoose from "mongoose";
import { DATABASE_COLLECTIONS } from "../constants.js";

const db = mongoose.connection;

const validateCollection = (collection, reject) => {
  if (
    !Object.keys(DATABASE_COLLECTIONS).some(function (property) {
      return DATABASE_COLLECTIONS[property] === collection;
    })
  ) {
    reject(`Invalid collection`);
  }
};

const DbService = {
  getOne: function (collection, filter) {
    return new Promise((resolve, reject) => {
      validateCollection(collection, reject);
      db.collection(collection)
        .findOne(filter)
        .then(resolve)
        .catch((error) => {
          reject(error.message);
        });
    });
  },

  getMany: function (collection, filter) {
    return new Promise(async (resolve, reject) => {
      validateCollection(collection, reject);
      let results = [];
      try {
        db.collection(collection).find(filter, async function (err, cursor) {
          if (err) return reject(err.message);
          await cursor.forEach((result) => {
            results.push(result);
          });
          resolve(results);
        });
      } catch (error) {
        reject(error.message);
      }
    });
  },

  getById: function (collection, id) {
    return new Promise((resolve, reject) => {
      validateCollection(collection, reject);
      db.collection(collection)
        .findOne({ _id: mongoose.Types.ObjectId(id) })
        .then(resolve)
        .catch((error) => {
          reject(error.message);
        });
    });
  },

  insertOne: function (collection, data) {
    return new Promise((resolve, reject) => {
      validateCollection(collection, reject);
      db.collection(collection)
        .insertOne(data)
        .then(resolve)
        .catch((error) => {
          reject(error.message);
        });
    });
  },

  updateOne: function (collection, filter, data) {
    return new Promise((resolve, reject) => {
      validateCollection(collection, reject);
      db.collection(collection)
        .findOneAndUpdate(filter, { $set: data })
        .then(resolve)
        .catch((error) => {
          reject(error.message);
        });
    });
  },

  pushUpdate: function (collection, filter, data) {
    return new Promise((resolve, reject) => {
      validateCollection(collection, reject);
      db.collection(collection)
        .findOneAndUpdate(filter, { $push: data })
        .then(resolve)
        .catch((error) => {
          reject(error.message);
        });
    });
  },

  pullUpdate: function (collection, filter, data) {
    return new Promise((resolve, reject) => {
      validateCollection(collection, reject);
      db.collection(collection)
        .findOneAndUpdate(filter, { $pull: data })
        .then(resolve)
        .catch((error) => {
          reject(error.message);
        });
    });
  },

  deleteOne: function (collection, filter) {
    return new Promise((resolve, reject) => {
      validateCollection(collection, reject);
      db.collection(collection)
        .findOneAndDelete(filter)
        .then(resolve)
        .catch((error) => {
          reject(error.message);
        });
    });
  },
};

export default DbService;
