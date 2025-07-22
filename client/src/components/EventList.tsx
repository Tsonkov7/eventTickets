import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../features/store.hooks';
import { fetchEvents } from '../features/EventSlice';
import { Link } from 'react-router-dom';
import type { Event } from '../features/EventSlice'; // It's good practice to import types

const ProductsList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { events, status, error } = useAppSelector((state) => state.events);

  useEffect(() => {
    // Only fetch events if they haven't been fetched yet
    if (status === 'idle') {
      dispatch(fetchEvents());
    }
  }, [status, dispatch]);

  if (status === 'loading') return <div className="text-center p-10">Loading events...</div>;
  if (status === 'failed') return <div className="text-center p-10 text-red-500">Error: {error}</div>;

  // Helper function to truncate long text
  const truncate = (str: string, num: number) => {
    if (str.length <= num) {
      return str;
    }
    return str.slice(0, num) + '...';
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">Upcoming Events</h2>
      <div className="space-y-4">
        {events.map((event: Event) => {
          // --- 1. KEY CHANGE: Calculate starting price and total tickets ---
          const startingPrice = Math.min(...event.tickets.map(ticket => ticket.price));
          const totalTicketsAvailable = event.tickets.reduce((sum, ticket) => sum + ticket.ticketsAvailable, 0);

          return (
            <Link to={`/events/${event.id}`} className="no-underline" key={event.id}>
              <div
                className="flex items-start justify-between p-5 mb-4 bg-white rounded-lg shadow-md hover:shadow-xl hover:bg-gray-50 transition-all duration-300"
              >
                {/* Event Image */}
                <img src={event.imageUrl} alt={event.name} className="w-32 h-32 object-cover rounded-md mr-5" />
                
                {/* Event Details */}
                <div className="flex-grow">
                  <h3 className="font-bold text-xl text-gray-900">{event.name}</h3>
                  <div className="text-md text-gray-600 mb-2">
                    {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {event.venue}
                  </div>
                  {/* --- 2. UPDATED: Display truncated description --- */}
                  <p className="text-sm text-gray-500 mb-3">{truncate(event.description, 100)}</p>
                  <div className="text-sm text-green-600 font-semibold">
                    Tickets Available: {totalTicketsAvailable}
                  </div>
                </div>

                {/* Pricing Info */}
                <div className="text-right">
                    {/* --- 3. UPDATED: Display the calculated starting price --- */}
                    <span className="text-sm text-gray-500">Starts from</span>
                    <div className="font-extrabold text-2xl text-blue-600">${startingPrice.toFixed(2)}</div>
                    <span className="mt-4 inline-block px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-md">
                      View Details
                    </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ProductsList;