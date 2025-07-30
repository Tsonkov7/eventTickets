import React, { useState } from "react"; // Import useState
import { useParams, Link } from "react-router-dom";
import { selectEvents } from "../features/EventSlice";
import { useAppSelector, useAppDispatch } from "../features/store.hooks";
import { addToCart } from "../features/CartSlice";
import type { Ticket } from "../features/EventSlice";
import Header from "../components/Header";

const EventDetailsPage: React.FC = () => {
  const { eventId } = useParams();
  const dispatch = useAppDispatch();
  const events = useAppSelector(selectEvents);
  const event = events.find((e) => e.id === Number(eventId));

  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  const handleQuantityChange = (
    ticketType: string,
    amount: number,
    maxTickets: number
  ) => {
    setQuantities((prev) => {
      const currentQuantity = prev[ticketType] || 1;
      let newQuantity = currentQuantity + amount;

      if (newQuantity < 1) newQuantity = 1;
      if (newQuantity > maxTickets) newQuantity = maxTickets;

      return { ...prev, [ticketType]: newQuantity };
    });
  };

  const addToCartHandler = (ticket: Ticket) => {
    if (event) {
      const quantityToAdd = quantities[ticket.type] || 1;
      dispatch(
        addToCart({
          event,
          ticket,
          quantity: quantityToAdd,
          imageUrl: event.imageUrl,
        })
      );
      alert(`${quantityToAdd} x ${ticket.type} ticket(s) added to your cart.`);
    }
  };

  if (!event) {
    return <div>Event not found</div>;
  }

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* --- Main Content Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-x-12">
          {/* Left Column: Image & Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6 sm:p-8">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
                {event.name}
              </h1>
              <img
                src={event.imageUrl}
                alt={event.name}
                className="w-full h-auto object-cover rounded-lg mb-6 shadow-sm"
              />
              {/* Using Tailwind's Typography plugin for beautiful text styling */}
              <div className="prose prose-lg max-w-none text-gray-700">
                <p>{event.description}</p>
              </div>
            </div>{" "}
            <div className="mb-6">
              <Link
                to="/"
                className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
              >
                ← Back to all events
              </Link>
            </div>
          </div>

          {/* Right Column (Sticky): Ticket Selection */}
          <div className="lg:col-span-1 mt-8 lg:mt-0">
            <div className="lg:sticky lg:top-8 bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-4 mb-5">
                Select Tickets
              </h2>
              <div className="space-y-4">
                {event.tickets.map((ticket) => {
                  const currentQuantity = quantities[ticket.type] || 1;
                  const isSoldOut = ticket.ticketsAvailable === 0;

                  return (
                    <div
                      key={ticket.type}
                      className={`border rounded-lg transition-all duration-300 ${isSoldOut ? "bg-gray-100 opacity-70" : "bg-white hover:border-blue-500 hover:shadow-sm"}`}
                    >
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-grow mr-4">
                            <h3 className="text-lg font-semibold text-gray-800">
                              {ticket.type}
                            </h3>
                            <p
                              className={`text-sm ${isSoldOut ? "text-red-600 font-bold" : "text-gray-500"}`}
                            >
                              {isSoldOut
                                ? "Sold Out"
                                : `${ticket.ticketsAvailable} tickets left`}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-xl font-bold text-blue-600">
                              ${ticket.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        {ticket.perks && (
                          <ul className="list-disc list-inside text-xs text-gray-500 mt-2 space-y-1">
                            {ticket.perks.map((perk) => (
                              <li key={perk}>{perk}</li>
                            ))}
                          </ul>
                        )}
                      </div>

                      {!isSoldOut && (
                        <div className="bg-gray-50 border-t px-4 py-3 flex items-center justify-between">
                          {/* Quantity Selector */}
                          <div className="flex items-center border rounded-md bg-white">
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  ticket.type,
                                  -1,
                                  ticket.ticketsAvailable
                                )
                              }
                              disabled={currentQuantity <= 1}
                              className="px-3 py-1 font-mono text-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 rounded-l-md"
                            >
                              -
                            </button>
                            <span className="px-4 py-1 font-semibold text-base text-gray-800">
                              {currentQuantity}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  ticket.type,
                                  1,
                                  ticket.ticketsAvailable
                                )
                              }
                              disabled={
                                currentQuantity >= ticket.ticketsAvailable
                              }
                              className="px-3 py-1 font-mono text-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 rounded-r-md"
                            >
                              +
                            </button>
                          </div>
                          {/* Add to Cart Button */}
                          <button
                            onClick={() => addToCartHandler(ticket)}
                            className="py-2 px-5 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm"
                          >
                            Add
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventDetailsPage;
