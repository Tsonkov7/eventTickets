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
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-white">
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
                className="no-underline group "
                key={event._id}
              >
                <div
                  className="relative mb-3 bg-black/30 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden border border-white/40
                shadow-white/40 hover:shadow-white/60"
                >
                  <div
                    className="absolute top-0 right-0 mt-4 mr-4 bg-blue-500 text-white text-sm font-bold py-2 px-4 rounded-full z-10
                  shadow-lg shadow-blue-500/50"
                  >
                    From ${startingPrice.toFixed(2)}
                  </div>
                  <img
                    src={event.imageUrl}
                    alt={event.name}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="p-5">
                    <h3
                      className="text-xl font-bold text-white mb-2"
                      style={{ textShadow: "0 0 8px rgba(255, 255, 255, 0.8)" }}
                    >
                      {event.name}
                    </h3>
                    <div className="text-md text-gray-300 mb-3">
                      <span className="font-medium">
                        {new Date(event.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                      <span className="text-gray-400"> at {event.venue}</span>
                    </div>
                    <p
                      className="text-sm text-gray-300 mb-4"
                      style={{ textShadow: "0 0 5px rgba(255, 255, 255, 0.5)" }}
                    >
                      {truncate(event.description, 90)}
                    </p>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                      <span
                        className="text-lg font-semibold text-green-300"
                        style={{
                          textShadow: "0 0 6px rgba(100, 255, 100, 0.7)",
                        }}
                      >
                        {totalTicketsAvailable > 0 ? `Available` : "Sold Out"}
                      </span>
                      <span
                        className="inline-block px-4 py-2 text-sm font-semibold text-white bg-blue-600 group-hover:bg-blue-800 rounded-lg transition-colors duration-300
                       shadow-md shadow-blue-600/40 hover:shadow-lg hover:shadow-blue-600/60"
                      >
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
