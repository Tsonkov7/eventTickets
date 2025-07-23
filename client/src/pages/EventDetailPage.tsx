import React, { useState } from 'react'; // Import useState
import { useParams, Link } from 'react-router-dom';
import { selectEvents } from '../features/EventSlice';
import { useAppSelector, useAppDispatch } from '../features/store.hooks';
import { addToCart } from '../features/CartSlice';
import type { Ticket } from '../features/EventSlice';
import Header from '../components/Header';

const EventDetailsPage: React.FC = () => {
  const { eventId } = useParams();
  const dispatch = useAppDispatch();
  const events = useAppSelector(selectEvents);
  const event = events.find((e) => e.id === Number(eventId));

  // 1. NEW: State to manage the quantity for each ticket type.
  // The key is the ticket type (e.g., "VIP"), the value is the quantity.
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  // 2. NEW: Handlers to update the quantity for a specific ticket.
  const handleQuantityChange = (ticketType: string, amount: number, maxTickets: number) => {
    setQuantities(prev => {
      const currentQuantity = prev[ticketType] || 1;
      let newQuantity = currentQuantity + amount;
      
      // Add constraints: quantity must be between 1 and available tickets.
      if (newQuantity < 1) newQuantity = 1;
      if (newQuantity > maxTickets) newQuantity = maxTickets;

      return { ...prev, [ticketType]: newQuantity };
    });
  };
  
  // 3. UPDATED: The handler now reads the quantity from state.
  const addToCartHandler = (ticket: Ticket) => {
    if (event) {
      const quantityToAdd = quantities[ticket.type] || 1;
      dispatch(addToCart({ event, ticket, quantity: quantityToAdd }));
      alert(`${quantityToAdd} x ${ticket.type} ticket(s) added to your cart.`);
    }
  };

  if (!event) {
    // ... (your existing not found logic)
    return <div>Event not found</div>;
  }

 // const totalTicketsAvailable = event.tickets.reduce((sum, ticket) => sum + ticket.ticketsAvailable, 0);

  return (
    <>
      <Header />
      <div className="mt-8 p-8 max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
        {/* Event Info Header */}
        <h1 className="text-4xl font-extrabold mb-3 text-gray-900">{event.name}</h1>
        {/* ... (rest of the header and description) ... */}
        <p className="text-gray-700 mb-8">{event.description}</p>

        {/* --- MAJOR UI CHANGE: Render tickets with counters --- */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold border-b pb-2 mb-4">Select Your Ticket</h3>
          {event.tickets.map((ticket) => {
            const currentQuantity = quantities[ticket.type] || 1;
            
            return (
              <div key={ticket.type} className="p-4 border rounded-lg flex flex-col sm:flex-row justify-between items-center bg-gray-50">
                {/* Ticket Details */}
                <div className="flex-grow mb-4 sm:mb-0">
                  <h4 className="text-xl font-semibold text-gray-800">{ticket.type}</h4>
                  <p className="text-lg font-bold text-blue-600">${ticket.price.toFixed(2)}</p>
                  <p className={`text-sm ${ticket.ticketsAvailable > 0 ? 'text-gray-600' : 'text-red-600 font-bold'}`}>
                    {ticket.ticketsAvailable > 0 ? `${ticket.ticketsAvailable} tickets left` : 'Sold Out!'}
                  </p>
                  {ticket.perks && (
                    <ul className="list-disc list-inside text-xs text-gray-500 mt-2">
                      {ticket.perks.map(perk => <li key={perk}>{perk}</li>)}
                    </ul>
                  )}
                </div>

                {/* 4. NEW: Counter and Add to Cart Button Section */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(ticket.type, -1, ticket.ticketsAvailable)}
                      disabled={currentQuantity <= 1 || ticket.ticketsAvailable === 0}
                      className="px-3 py-1 font-bold text-lg text-gray-700 hover:bg-gray-200 rounded-l-lg disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 font-semibold text-gray-800">{currentQuantity}</span>
                    <button
                      onClick={() => handleQuantityChange(ticket.type, 1, ticket.ticketsAvailable)}
                      disabled={currentQuantity >= ticket.ticketsAvailable || ticket.ticketsAvailable === 0}
                      className="px-3 py-1 font-bold text-lg text-gray-700 hover:bg-gray-200 rounded-r-lg disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => addToCartHandler(ticket)}
                    disabled={ticket.ticketsAvailable === 0}
                    className="py-2 px-5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <Link to="/" className="block text-center text-blue-600 hover:underline mt-8 font-medium">
          ← Back to all events
        </Link>
      </div>
    </>
  );
};

export default EventDetailsPage;