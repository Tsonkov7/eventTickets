import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CheckOut from "./pages/CheckOut";
import EventDetailsPage from "./pages/EventDetailPage";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/checkout" element={<CheckOut />} />
        <Route path="/events/:eventId" element={<EventDetailsPage />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </>
  );
}
