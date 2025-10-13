import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../constants";
import { useNavigate } from "react-router";
import Header from "@/components/Header";

interface UserProfile {
  username: string;
  email: string;
}

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/users/profile`);
        setProfile(response.data);
      } catch (err) {
        navigate("/error");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div className="text-center p-8">Loading profile...</div>;
  }

  return (
    <>
      <Header />
      <div className="max-w-2xl mx-auto mt-3.5 p-8 bg-black rounded-2xl shadow-inner animate-in">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
          <p className="text-sm text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>

        {profile && (
          <div className="space-y-6">
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none text-foreground">
                      Username
                    </label>
                    <div className="rounded-md border bg-background px-3 py-2 text-sm">
                      {profile.username}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      This is your public display name.
                    </p>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium leading-none text-foreground">
                      Email
                    </label>
                    <div className="rounded-md border bg-background px-3 py-2 text-sm">
                      {profile.email}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Your email address is used for account notifications.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProfilePage;
