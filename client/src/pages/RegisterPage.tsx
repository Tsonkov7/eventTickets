import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../constants";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!username || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/auth/register`, {
        email,
        username,
        password,
      });

      setSuccess(
        "Registration successful! Please check your email to verify your account."
      );
      setUsername("");
      setPassword("");
      setConfirmPassword("");

      navigate("/email-sent");
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred during registration");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="flex min-h-screen items-center justify-center px-2 sm:px-4">
        <form
          className="w-full max-w-md bg-white rounded-lg shadow-md p-4 sm:p-8 opacity-85 hover:opacity-100 transition-opacity duration-300"
          onSubmit={handleSubmit}
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">
            Register
          </h2>
          {/* Display success or error messages */}
          {error && (
            <p className="mb-4 text-red-600 bg-red-100 rounded px-3 py-2 text-sm text-center">
              {error}
            </p>
          )}
          {success && (
            <p className="mb-4 text-green-600 bg-green-100 rounded px-3 py-2 text-sm text-center">
              {success}
            </p>
          )}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 mb-1 font-medium"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2 border text-gray-900 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <label
              htmlFor="username"
              className="block text-gray-700 mb-1 font-medium mt-4 sm:mt-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 mb-1 font-medium"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="block text-gray-700 mb-1 font-medium"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition-colors duration-200 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
          <p className="mt-4 text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default RegisterPage;
