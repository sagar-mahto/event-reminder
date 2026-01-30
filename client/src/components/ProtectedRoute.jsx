import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

const ProtectedRoute = ({ children }) => {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    api.get("/auth/me")
      .then(() => setAuth(true))
      .catch(() => setAuth(false));
  }, []);

  if (auth === null) return null;
  return auth ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
