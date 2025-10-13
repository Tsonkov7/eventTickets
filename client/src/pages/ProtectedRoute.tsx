import React, { type ReactElement } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

import { selectAuth } from "../features/AuthSlice";

interface ProtectedRouteProps {
  children: ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isLoggedIn = useSelector(selectAuth);

  const location = useLocation();

  if (!isLoggedIn) {
    return (
      <Navigate
        to="/login?message=unauthorized"
        state={{ from: location }}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;
