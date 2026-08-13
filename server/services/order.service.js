import Event from "../db/models/event.model.js";
import Order from "../db/models/order.model.js";

export async function validateAndPriceCartItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Cart is empty");
  }

  const pricedItems = [];
  let totalAmount = 0;

  for (const item of items) {
    const { eventId, ticketType, quantity } = item;

    if (!eventId || !ticketType || !quantity || quantity <= 0) {
      throw new Error("Invalid cart item");
    }

    const event = await Event.findById(eventId);
    if (!event) {
      throw new Error(`Event not found: ${eventId}`);
    }

    const ticket = event.tickets.find((t) => t.type === ticketType);
    if (!ticket) {
      throw new Error(`Ticket type "${ticketType}" not found for ${event.name}`);
    }

    if (ticket.ticketsAvailable < quantity) {
      throw new Error(
        `Not enough "${ticketType}" tickets available for ${event.name}`
      );
    }

    const lineTotal = ticket.price * quantity;
    totalAmount += lineTotal;

    pricedItems.push({
      eventId: event._id,
      eventName: event.name,
      ticketType: ticket.type,
      price: ticket.price,
      quantity,
    });
  }

  return { pricedItems, totalAmount };
}

export async function fulfillOrder(userId, paymentIntentId, pricedItems, totalAmount) {
  const existingOrder = await Order.findOne({ paymentIntentId });
  if (existingOrder) {
    return existingOrder;
  }

  for (const item of pricedItems) {
    const event = await Event.findById(item.eventId);
    if (!event) {
      throw new Error(`Event not found during fulfillment: ${item.eventId}`);
    }

    const ticket = event.tickets.find((t) => t.type === item.ticketType);
    if (!ticket || ticket.ticketsAvailable < item.quantity) {
      throw new Error(
        `Insufficient inventory for ${item.ticketType} at ${item.eventName}`
      );
    }

    ticket.ticketsAvailable -= item.quantity;
    await event.save();
  }

  const order = await Order.create({
    user: userId,
    items: pricedItems,
    totalAmount,
    paymentIntentId,
    status: "completed",
  });

  return order;
}
