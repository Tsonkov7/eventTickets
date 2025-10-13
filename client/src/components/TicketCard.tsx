import React from "react";
import type { Ticket } from "../features/EventSlice";

interface TicketCardProps {
  ticket: Ticket;
  quantity: number;
  onQuantityChange: (amount: number) => void;
  onAddToCart: () => void;
  disabled?: boolean;
}

const TicketCard: React.FC<TicketCardProps> = ({
  ticket,
  quantity,
  onQuantityChange,
  onAddToCart,
  disabled = false,
}) => {
  const isOutOfStock = ticket.ticketsAvailable === 0;
  const isDisabled = disabled || isOutOfStock;

  return (
    <div className="p-4 border border-gray-700 rounded-lg flex flex-col sm:flex-row justify-between items-center bg-neutral-900 shadow-md shadow-white/10">
      <div className="flex-grow mb-4 sm:mb-0">
        <h4
          className="text-xl font-semibold text-white"
          style={{ textShadow: "0 0 8px rgba(255, 255, 255, 0.7)" }}
        >
          {ticket.type}
        </h4>
        <p
          className="text-lg font-bold text-blue-400"
          aria-label={`Price: $${ticket.price.toFixed(2)}`}
        >
          ${ticket.price.toFixed(2)}
        </p>
        <p
          className={`text-sm ${
            ticket.ticketsAvailable > 0
              ? "text-gray-400"
              : "text-red-500 font-bold"
          }`}
          aria-live="polite"
        >
          {ticket.ticketsAvailable > 0 ? `Tickets available` : "Sold Out!"}
        </p>
        {ticket.perks && ticket.perks.length > 0 && (
          <div className="mt-2">
            <h5 className="text-xs font-semibold text-gray-300 mb-1">
              Perks included:
            </h5>
            <ul
              className="list-disc list-inside text-xs text-gray-400"
              role="list"
            >
              {ticket.perks.map((perk, index) => (
                <li key={`${ticket.type}-perk-${index}`}>{perk}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-3">
        <div
          className="flex items-center hover:bg-black border border-gray-600 rounded-lg"
          role="group"
          aria-label="Quantity selector"
        >
          <button
            onClick={() => onQuantityChange(-1)}
            disabled={quantity <= 1 || isDisabled}
            className="px-3 py-3 font-bold text-lg text-gray-300 hover:bg-gray-700"
            aria-label="Decrease quantity"
            type="button"
          >
            -
          </button>
          <span
            className="px-4 py-1 font-semibold text-white min-w-[3rem] text-center  bg-neutral-900 rounded-l-md"
            aria-label={`Quantity: ${quantity}`}
          >
            {quantity}
          </span>
          <button
            onClick={() => onQuantityChange(1)}
            disabled={quantity >= ticket.ticketsAvailable || isDisabled}
            className="px-3 py-3 font-bold text-lg text-gray-300 hover:bg-gray-700 rounded-r-md"
            aria-label="Increase quantity"
            type="button"
          >
            +
          </button>
        </div>
        <button
          onClick={onAddToCart}
          disabled={isDisabled}
          className="py-2 px-5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md shadow-blue-500/40 hover:shadow-lg hover:shadow-blue-500/60 disabled:bg-gray-600 disabled:shadow-none disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          aria-label={`Add ${quantity} ${ticket.type} ticket${quantity > 1 ? "s" : ""} to cart`}
          type="button"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default TicketCard;
