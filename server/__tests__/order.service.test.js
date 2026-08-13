import { jest } from "@jest/globals";

jest.unstable_mockModule("../db/models/event.model.js", () => ({
  default: {
    findById: jest.fn(),
  },
}));

const Event = (await import("../db/models/event.model.js")).default;
const { validateAndPriceCartItems } = await import(
  "../services/order.service.js"
);

describe("validateAndPriceCartItems", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("rejects empty cart", async () => {
    await expect(validateAndPriceCartItems([])).rejects.toThrow("Cart is empty");
  });

  it("computes total from database prices", async () => {
    Event.findById.mockResolvedValue({
      _id: "event1",
      name: "Test Fest",
      tickets: [
        { type: "GA", price: 50, ticketsAvailable: 10 },
        { type: "VIP", price: 100, ticketsAvailable: 5 },
      ],
    });

    const { pricedItems, totalAmount } = await validateAndPriceCartItems([
      { eventId: "event1", ticketType: "GA", quantity: 2 },
    ]);

    expect(totalAmount).toBe(100);
    expect(pricedItems).toHaveLength(1);
    expect(pricedItems[0].price).toBe(50);
    expect(pricedItems[0].quantity).toBe(2);
  });

  it("rejects when insufficient inventory", async () => {
    Event.findById.mockResolvedValue({
      _id: "event1",
      name: "Test Fest",
      tickets: [{ type: "GA", price: 50, ticketsAvailable: 1 }],
    });

    await expect(
      validateAndPriceCartItems([
        { eventId: "event1", ticketType: "GA", quantity: 5 },
      ])
    ).rejects.toThrow("Not enough");
  });
});
