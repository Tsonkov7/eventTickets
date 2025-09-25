import mongoose from "mongoose";
import ticketSchema from "./ticket.model.js";
import { DATABASE_MODELS } from "../../constants.js";

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  venue: {
    type: String,
    required: true,
  },
  lineup: {
    type: [String],
    required: true,
  },
  tickets: {
    type: [ticketSchema],
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const Event = mongoose.model(DATABASE_MODELS.EVENT, eventSchema);
export default Event;
