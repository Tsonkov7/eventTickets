import React, { useState, useMemo, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { selectEvents } from "../features/EventSlice";
import { useAppSelector, useAppDispatch } from "../features/store.hooks";
import { addToCart } from "../features/CartSlice";
import type { Ticket } from "../features/EventSlice";
import Header from "../components/Header";
import TicketCard from "../components/TicketCard";
import ToastContainer from "../components/ToastContainer";
import { useToast } from "../hooks/useToast";

const DEFAULT_QUANTITY = 1;
const MIN_QUANTITY = 1;

interface QuantityState {
  [ticketType: string]: number;
}

const EventDetailsPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const dispatch = useAppDispatch();
  const events = useAppSelector(selectEvents);
  const { toasts, addToast, removeToast } = useToast();

  const [quantities, setQuantities] = useState<QuantityState>({});

  // Memoized event lookup with proper error handling
  const event = useMemo(() => {
    if (!eventId || !events.length) return null;

    return events.find((e) => e._id === eventId) || null;
  }, [eventId, events]);

  const handleQuantityChange = useCallback(
    (ticketType: string, amount: number, maxTickets: number) => {
      setQuantities((prev) => {
        const currentQuantity = prev[ticketType] || DEFAULT_QUANTITY;
        const newQuantity = Math.max(
          MIN_QUANTITY,
          Math.min(maxTickets, currentQuantity + amount)
        );

        return { ...prev, [ticketType]: newQuantity };
      });
    },
    []
  );

  const handleAddToCart = useCallback(
    (ticket: Ticket) => {
      if (!event) {
        addToast("Event not found. Please try again.", "error");
        return;
      }

      const quantityToAdd = quantities[ticket.type] || DEFAULT_QUANTITY;

      if (quantityToAdd <= 0) {
        addToast("Invalid quantity selected.", "error");
        return;
      }

      if (quantityToAdd > ticket.ticketsAvailable) {
        addToast(
          `Only ${ticket.ticketsAvailable} tickets available for ${ticket.type}.`,
          "warning"
        );
        return;
      }

      try {
        dispatch(
          addToCart({
            event,
            ticket,
            quantity: quantityToAdd,
            imageUrl: event.imageUrl,
          })
        );
        addToast(
          `${quantityToAdd} × ${ticket.type} ticket${quantityToAdd > 1 ? "s" : ""} added to your cart!`,
          "success"
        );
      } catch {
        addToast("Failed to add tickets to cart. Please try again.", "error");
      }
    },
    [event, quantities, dispatch, addToast]
  );

  const createQuantityChangeHandler = useCallback(
    (ticket: Ticket) => {
      return (amount: number) =>
        handleQuantityChange(ticket.type, amount, ticket.ticketsAvailable);
    },
    [handleQuantityChange]
  );

  const createAddToCartHandler = useCallback(
    (ticket: Ticket) => {
      return () => handleAddToCart(ticket);
    },
    [handleAddToCart]
  );

  if (!events.length) {
    return (
      <>
        <Header />
        <div className="mt-8 p-8 max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded mb-4"></div>
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          </div>
        </div>
      </>
    );
  }

  if (!event) {
    return (
      <>
        <Header />
        <div className="mt-8 p-8 max-w-2xl mx-auto bg-white rounded-lg shadow-lg text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Event Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The event you're looking for doesn't exist or may have been removed.
          </p>
          <Link
            to="/"
            className="inline-block bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Back to Events
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="mt-4 mb-4 sm:mt-8 p-4 sm:p-6 md:p-8 max-w-lg mx-auto bg-black rounded-lg shadow-lg md:max-w-2xl lg:max-w-4xl border border-white/40 shadow-white/40 hover:shadow-white/60 transition-shadow duration-300">
        <header className="mb-6 md:mb-8">
          <h1
            className="text-3xl sm:text-4xl font-extrabold mb-3 text-white"
            style={{ textShadow: "0 0 8px rgba(255, 255, 255, 0.8)" }}
          >
            {event.name}
          </h1>
          <div className="text-sm text-gray-300 mb-4 space-y-1">
            <p>
              <strong className="text-gray-100">Date:</strong> {event.date}
            </p>
            <p>
              <strong className="text-gray-100">Venue:</strong> {event.venue}
            </p>
            {event.lineup && event.lineup.length > 0 && (
              <p>
                <strong className="text-gray-100">Lineup:</strong>{" "}
                {event.lineup.join(", ")}
              </p>
            )}
          </div>
          <p className="text-gray-300 leading-relaxed">{event.description}</p>
        </header>

        <section className="space-y-4">
          <h2
            className="text-xl sm:text-2xl font-bold border-b border-gray-700 pb-2 mb-4 text-white"
            style={{ textShadow: "0 0 8px rgba(255, 255, 255, 0.7)" }}
          >
            Select Your Tickets
          </h2>
          {event.tickets.map((ticket) => (
            <TicketCard
              key={ticket.type}
              ticket={ticket}
              quantity={quantities[ticket.type] || DEFAULT_QUANTITY}
              onQuantityChange={createQuantityChangeHandler(ticket)}
              onAddToCart={createAddToCartHandler(ticket)}
            />
          ))}
        </section>

        <nav className="mt-6 md:mt-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center text-blue-400 hover:text-blue-300 hover:underline font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1"
          >
            <span aria-hidden="true">←</span>
            <span className="ml-1">Back to all events</span>
          </Link>
        </nav>
      </main>

      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </>
  );
};

export default EventDetailsPage;
