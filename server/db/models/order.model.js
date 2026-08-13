import mongoose from "mongoose";
import { DATABASE_MODELS } from "../../constants.js";

const orderItemSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    eventName: { type: String, required: true },
    ticketType: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentIntentId: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "completed",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model(DATABASE_MODELS.ORDER, orderSchema);
export default Order;
