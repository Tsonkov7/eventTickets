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
          className="w-full max-w-md bg-black rounded-lg p-4 sm:p-8 border border-white/40 shadow-lg shadow-white/40 hover:shadow-white/60 transition-all duration-300"
          onSubmit={handleSubmit}
        >
          <div className="space-y-6">
            <h2
              className="text-3xl font-bold text-center text-white"
              style={{ textShadow: "0 0 8px rgba(255, 255, 255, 0.8)" }}
            >
              Register
            </h2>

            {/* Display success or error messages */}
            {error && (
              <p className="text-red-300 bg-red-900/50 border border-red-500/30 rounded px-3 py-2 text-sm text-center">
                {error}
              </p>
            )}
            {success && (
              <p className="text-green-300 bg-green-900/50 border border-green-500/30 rounded px-3 py-2 text-sm text-center">
                {success}
              </p>
            )}

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-gray-300 mb-1 font-medium"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full px-3 py-2 border text-white bg-neutral-900 border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="username"
                  className="block text-gray-300 mb-1 font-medium"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  className="w-full px-3 py-2 border text-white bg-neutral-900 border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-gray-300 mb-1 font-medium"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full px-3 py-2 border text-white bg-neutral-900 border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-gray-300 mb-1 font-medium"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  className="w-full px-3 py-2 border text-white bg-neutral-900 border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all duration-300 disabled:opacity-60 disabled:bg-gray-600 disabled:shadow-none shadow-md shadow-blue-500/40 hover:shadow-lg hover:shadow-blue-500/60"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>

            <p className="mt-4 text-sm text-center text-gray-400">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-400 hover:underline">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </>
  );
};

export default RegisterPage;
