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
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">
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
                to={`/events/${event.id}`}
                className="no-underline"
                key={event.id}
              >
                <div className="flex items-start justify-between p-5 mb-4 bg-white rounded-lg shadow-md hover:shadow-xl hover:bg-gray-50 transition-all duration-300">
                  <img
                    src={event.imageUrl}
                    alt={event.name}
                    className="w-32 h-32 object-cover rounded-md mr-5"
                  />
                  <div className="flex-grow">
                    <h3 className="font-bold text-xl text-gray-900">
                      {event.name}
                    </h3>
                    <div className="text-md text-gray-600 mb-2">
                      {new Date(event.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}{" "}
                      at {event.venue}
                    </div>
                    <p className="text-sm text-gray-500 mb-3">
                      {truncate(event.description, 100)}
                    </p>
                    <div className="text-sm text-green-600 font-semibold">
                      Tickets Available: {totalTicketsAvailable}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-500">Starts from</span>
                    <div className="font-extrabold text-2xl text-blue-600">
                      ${startingPrice.toFixed(2)}
                    </div>
                    <span className="mt-4 inline-block px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-md">
                      View Details
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-10">
          <h3 className="text-2xl font-semibold text-gray-700">
            No Events Found
          </h3>
          <p className="text-gray-500 mt-2">
            We couldn't find any events matching "{searchTerm}". Try a different
            search.
          </p>
        </div>
      )}
    </div>
  );
};

export default EventList;
