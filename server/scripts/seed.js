import mongoose from "mongoose";
import dotenv from "dotenv";
import Event from "./db/models/event.model.js";

dotenv.config();

const sampleEvents = [
  {
    name: "Neon Horizon Festival",
    date: new Date("2026-09-15T20:00:00Z"),
    venue: "Skyline Arena, Miami",
    lineup: ["DJ Pulse", "Luna Wave", "Echo Drive"],
    imageUrl: "/images/event1.jpg",
    description:
      "A night of electronic beats under neon lights. Three stages, immersive visuals, and world-class DJs.",
    tickets: [
      { type: "General Admission", price: 89, ticketsAvailable: 500 },
      { type: "VIP", price: 199, ticketsAvailable: 100, perks: ["Front row", "Free drinks"] },
    ],
  },
  {
    name: "Midnight Rave",
    date: new Date("2026-10-22T22:00:00Z"),
    venue: "Warehouse 47, Berlin",
    lineup: ["Techno King", "Bass Queen", "Synth Lord"],
    imageUrl: "/images/event2.jpg",
    description:
      "Underground techno experience in an industrial warehouse. Pure bass, pure energy.",
    tickets: [
      { type: "Early Bird", price: 45, ticketsAvailable: 200 },
      { type: "Standard", price: 65, ticketsAvailable: 800 },
    ],
  },
  {
    name: "Cosmic Beats",
    date: new Date("2026-11-08T19:00:00Z"),
    venue: "Star Dome, Los Angeles",
    lineup: ["Galaxy Sound", "Nova Drop", "Orbit"],
    imageUrl: "/images/event3.jpg",
    description:
      "An interstellar journey through house, trance, and progressive. Planetarium visuals included.",
    tickets: [
      { type: "General Admission", price: 75, ticketsAvailable: 600 },
      { type: "Premium", price: 150, ticketsAvailable: 150, perks: ["Lounge access", "Merch pack"] },
    ],
  },
];

async function seed() {
  const uri = process.env.MONGODB_CONNECTION_STRING;
  if (!uri) {
    console.error("MONGODB_CONNECTION_STRING is required");
    process.exit(1);
  }

  await mongoose.connect(uri);
  await Event.deleteMany({});
  await Event.insertMany(sampleEvents);
  console.log(`Seeded ${sampleEvents.length} events`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
