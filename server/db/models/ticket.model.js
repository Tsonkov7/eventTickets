import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  ticketsAvailable: {
    type: Number,
    required: true,
  },
  perks: {
    type: [String],
    required: false,
  },
});

export default ticketSchema;
