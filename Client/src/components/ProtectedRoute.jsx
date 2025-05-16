// components/ProtectedRoute.jsx
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../components/context/UserContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { userInfo } = useContext(UserContext);

  // لو مش مسجل دخول
  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  // لو مسجل دخول لكن مش عنده صلاحية
  if (
    allowedRoles &&
    allowedRoles.length > 0 &&
    !allowedRoles.some((role) => userInfo.roles.includes(role))
  ) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default ProtectedRoute;
