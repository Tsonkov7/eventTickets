import axios from "axios";
import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../../constants";
import { useToast } from "@/hooks/useToast";
import ToastContainer from "@/components/ToastContainer";
import { useNavigate, useLocation, useSearchParams } from "react-router";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/features/AuthSlice";
import Header from "@/components/Header";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { toasts, addToast, removeToast } = useToast();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const location = useLocation();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const message = searchParams.get("message");
    if (message === "unauthorized") {
      setError("You have to log in to proceed.");
    }
  }, [searchParams, addToast]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        username,
        password,
      });

      const { token } = response.data;
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      dispatch(loginSuccess(token));
      addToast("Login successful!", "success");
      setUsername("");
      setPassword("");

      const from = location.state?.from?.pathname || "/profile";
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1500);
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred during login");
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
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white rounded-lg shadow-md p-4 sm:p-8 opacity-85 hover:opacity-100 transition-opacity duration-300"
        >
          <div>
            <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
              Login
            </h2>
            <label className="block text-gray-700 mb-1 font-medium">
              Username:
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                className="w-full px-3 py-2 border text-gray-900 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </label>
          </div>
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Password:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full px-3 py-2 border text-gray-900 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </label>
          </div>
          {error && (
            <div className="p-2 text-sm text-red-700 bg-red-100 border border-red-300 rounded">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="mt-4 text-sm text-center text-gray-600">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-600 hover:underline">
              Register
            </a>
          </p>
        </form>
      </div>

      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </>
  );
};

export default LoginPage;
