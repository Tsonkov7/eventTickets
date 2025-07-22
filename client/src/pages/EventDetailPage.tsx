import { useParams, Link } from 'react-router-dom';
import { selectEvents } from '../features/EventSlice';
import { useAppSelector, useAppDispatch } from '../features/store.hooks';
import { addToCart } from '../features/CartSlice';
import type { Ticket } from '../features/EventSlice'; // Import both Event and Ticket types
import Header from '../components/Header';

const EventDetailsPage: React.FC = () => {
  const { eventId } = useParams();
  const dispatch = useAppDispatch();
  const events = useAppSelector(selectEvents);
  const event = events.find((e) => e.id === Number(eventId));

  // 1. UPDATED: The handler now takes a specific 'ticket' and dispatches it with the event.
  const addToCartHandler = (ticket: Ticket) => {
    if (event) { // Ensure the event exists before dispatching
      dispatch(addToCart({ event, ticket }));
      // Optional: Add a confirmation message here
      // alert(`${ticket.type} ticket for ${event.name} added to cart!`);
    }
  };

  if (!event) {
    return (
      <>
        <Header />
        <div className="text-center p-10">
          <h2 className="text-2xl font-bold mb-4">Event Not Found</h2>
          <p>The event you are looking for does not exist.</p>
          <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">
            Back to Events
          </Link>
        </div>
      </>
    );
  }

  // 2. NEW: Calculate the total tickets available by summing up all ticket types.
  const totalTicketsAvailable = event.tickets.reduce((sum, ticket) => sum + ticket.ticketsAvailable, 0);

  return (
    <>
      <Header />
      <div className="mt-8 p-8 max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-extrabold mb-3 text-gray-900">{event.name}</h1>
        <div className="flex items-center text-lg text-gray-700 mb-5">
          {/* Removed the single price display */}
          <span>{new Date(event.date).toLocaleDateString()} <span className="font-medium">at</span> {event.venue}</span>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Total Tickets Available: <span className="font-semibold text-green-600">{totalTicketsAvailable}</span>
        </p>
        <p className="text-gray-700 mb-8">{event.description}</p>

        {/* --- 3. MAJOR CHANGE: Map over ticket types and render each one --- */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold border-b pb-2 mb-4">Select Your Ticket</h3>
          {event.tickets.map((ticket) => (
            <div key={ticket.type} className="p-4 border rounded-lg flex justify-between items-center bg-gray-50">
              <div>
                <h4 className="text-xl font-semibold text-gray-800">{ticket.type}</h4>
                <p className="text-lg font-bold text-blue-600">${ticket.price.toFixed(2)}</p>
                <p className={`text-sm ${ticket.ticketsAvailable > 0 ? 'text-gray-600' : 'text-red-600 font-bold'}`}>
                  {ticket.ticketsAvailable > 0 ? `${ticket.ticketsAvailable} tickets left` : 'Sold Out!'}
                </p>
                {/* Display VIP perks if they exist */}
                {ticket.perks && (
                  <ul className="list-disc list-inside text-xs text-gray-500 mt-2">
                    {ticket.perks.map(perk => <li key={perk}>{perk}</li>)}
                  </ul>
                )}
              </div>
              {/* 4. This button now adds a specific ticket to the cart */}
              <button
                onClick={() => addToCartHandler(ticket)}
                disabled={ticket.ticketsAvailable === 0}
                className="py-2 px-5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {ticket.ticketsAvailable > 0 ? 'Add to Cart' : 'Sold Out'}
              </button>
            </div>
          ))}
        </div>
        {/* --- End of major change --- */}

        <Link
          to="/"
          className="block text-center text-blue-600 hover:underline mt-8 font-medium"
        >
          ← Back to all events
        </Link>
      </div>
    </>
  );
};

export default EventDetailsPage;