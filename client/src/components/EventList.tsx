import React, { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../features/store.hooks";
import {
  fetchEvents,
  selectEvents,
  selectSearchTerm,
} from "../features/EventSlice";
import { Link } from "react-router-dom";
import type { Event } from "../features/EventSlice";

const EventList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.events);

  const allEvents = useAppSelector(selectEvents);
  const searchTerm = useAppSelector(selectSearchTerm);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchEvents());
    }
  }, [status, dispatch]);

  const filteredEvents = useMemo(() => {
    if (!searchTerm) {
      return allEvents;
    }
    return allEvents.filter(
      (event) =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.lineup.join(" ").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allEvents, searchTerm]);

  if (status === "loading")
    return <div className="text-center p-10">Loading events...</div>;
  if (status === "failed")
    return <div className="text-center p-10 text-red-500">Error: {error}</div>;

  const truncate = (str: string, num: number) => {
    if (str.length <= num) return str;
    return str.slice(0, num) + "...";
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-white border-b pb-2">
        Upcoming Events
      </h2>

      {filteredEvents.length > 0 ? (
        <div className="space-y-4">
          {filteredEvents.map((event: Event) => {
            const startingPrice = Math.min(
              ...event.tickets.map((ticket) => ticket.price)
            );
            const totalTicketsAvailable = event.tickets.reduce(
              (sum, ticket) => sum + ticket.ticketsAvailable,
              0
            );

            return (
              <Link
                to={`/events/${event._id}`}
                className="no-underline group"
                key={event._id}
              >
                <div className="relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                  <div className="absolute top-0 right-0 mt-4 mr-4 bg-blue-600 text-white text-sm font-bold py-2 px-4 rounded-full z-10">
                    From ${startingPrice.toFixed(2)}
                  </div>
                  <img
                    src={event.imageUrl}
                    alt={event.name}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105" // Zoom effect on hover
                  />
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {event.name}
                    </h3>
                    <div className="text-md text-gray-700 mb-3">
                      <span className="font-medium">
                        {new Date(event.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                      <span className="text-gray-500"> at {event.venue}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      {truncate(event.description, 90)}
                    </p>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                      <span className="text-xs font-semibold text-green-700">
                        {totalTicketsAvailable} Tickets Left
                      </span>
                      <span className="inline-block px-4 py-2 text-sm font-semibold text-white bg-blue-500 group-hover:bg-blue-700 rounded-lg transition-colors duration-300">
                        View Details
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-10">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-700">
            No Events Found
          </h3>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            We couldn't find any events matching "{searchTerm}". Try a different
            search.
          </p>
        </div>
      )}
    </div>
  );
};

export default EventList;
