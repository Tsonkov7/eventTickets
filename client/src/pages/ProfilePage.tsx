import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useNavigate } from "react-router";
import Header from "@/components/Header";

interface UserProfile {
  username: string;
  email: string;
}

interface OrderItem {
  eventName: string;
  ticketType: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  createdAt: string;
}

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, ordersRes] = await Promise.all([
          api.get("/users/profile"),
          api.get("/orders"),
        ]);
        setProfile(profileRes.data);
        setOrders(ordersRes.data);
      } catch (err) {
        navigate("/error");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="text-center p-8 text-gray-300">Loading profile...</div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="max-w-3xl mx-auto mt-3.5 p-8 space-y-8">
        <div className="bg-black/30 backdrop-blur-sm rounded-2xl shadow-lg border border-white/40 p-8">
          <h1 className="text-3xl font-bold text-white glow-text mb-2">
            Your Profile
          </h1>
          <p className="text-sm text-gray-400 mb-6">
            Account details and past orders.
          </p>

          {profile && (
            <div className="rounded-lg border border-gray-600 bg-neutral-900/50 p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-200">
                  Username
                </label>
                <div className="rounded-md border border-gray-600 bg-neutral-900 px-3 py-2 text-sm text-white mt-1">
                  {profile.username}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-200">
                  Email
                </label>
                <div className="rounded-md border border-gray-600 bg-neutral-900 px-3 py-2 text-sm text-white mt-1">
                  {profile.email}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-black/30 backdrop-blur-sm rounded-2xl shadow-lg border border-white/40 p-8">
          <h2 className="text-2xl font-bold text-white glow-text mb-4">
            Order History
          </h2>

          {orders.length === 0 ? (
            <p className="text-gray-400">No orders yet. Time to rave!</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="rounded-lg border border-gray-600 bg-neutral-900/50 p-4"
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                    <span className="font-semibold text-white">
                      ${order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                  <ul className="space-y-1 text-sm text-gray-300">
                    {order.items.map((item, idx) => (
                      <li key={idx}>
                        {item.quantity}x {item.ticketType} — {item.eventName}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
