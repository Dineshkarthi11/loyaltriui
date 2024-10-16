import React from "react";
import { Route, Navigate } from "react-router-dom";

const PrivateRoute = ({ element, path, condition }) => {
  return (
    <Route path={path} element={condition ? element : <Navigate to="/" />} />
  );
};

export default PrivateRoute;
