import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CheckOut from "./pages/CheckOut";
import EventDetailsPage from "./pages/EventDetailPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ErrorPage from "./pages/ErrorPage";
import EmailSent from "./pages/EmailSent";
import VerificationPage from "./pages/VerificationPage";
import ProtectedRoute from "./pages/ProtectedRoute";
import ProfilePage from "./pages/ProfilePage";
export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckOut />
            </ProtectedRoute>
          }
        />
        <Route path="/events/:eventId" element={<EventDetailsPage />} />
        <Route path="/verification" element={<VerificationPage />} />
        <Route path="/email-sent" element={<EmailSent />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </>
  );
}
