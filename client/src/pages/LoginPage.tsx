import React, { useState, useEffect } from "react";
import { api, setAuthToken } from "@/lib/api";
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
      const response = await api.post("/auth/login", {
        username,
        password,
      });

      const { token } = response.data;
      localStorage.setItem("token", token);
      setAuthToken(token);
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
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data
      ) {
        setError(String(error.response.data.message));
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
          className="w-full max-w-md bg-black/30 backdrop-blur-sm rounded-lg p-4 sm:p-8 border border-white/40 shadow-lg shadow-white/40 hover:shadow-white/60 transition-all duration-300"
        >
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-center text-white glow-text">
              Login
            </h2>

            <div className="space-y-2">
              <label className="block text-gray-300 mb-1 font-medium">
                Username:
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                className="w-full px-3 py-2 border text-white bg-neutral-900 border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-gray-300 mb-1 font-medium">
                Password:
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full px-3 py-2 border text-white bg-neutral-900 border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {error && (
              <div className="p-3 text-sm text-red-300 bg-red-900/50 border border-red-500/30 rounded">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all duration-300 shadow-md shadow-blue-500/40 hover:shadow-lg hover:shadow-blue-500/60 disabled:bg-gray-600 disabled:shadow-none"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <p className="mt-4 text-sm text-center text-gray-400">
              Don't have an account?{" "}
              <a href="/register" className="text-blue-400 hover:underline">
                Register
              </a>
            </p>
          </div>
        </form>
      </div>
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </>
  );
};

export default LoginPage;
