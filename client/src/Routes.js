import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";

// Errors
import ErrorBad from "./pages/errors/bad";
import ErrorNull from "./pages/errors/null";

// Dashboard
import Dashboard from "./pages/platforms";

// Sessions
import Login from "./pages/sessions/login";

// Platforms
import Platforms from "./platformRoutes";

// Profile
import UserProfile from "./components/profile";

import { BASE } from "./components/utilities";
import { useSelector } from "react-redux";

const Routers = () => {
  const { token, auth } = useSelector(({ auth }) => auth);

  const handleRoutes = () =>
    token &&
    Platforms.map(route => {
      if (route.children) {
        return route.children?.map(child => (
          <Route
            path={`${route.path}/${child.path}`}
            key={`${route.path}/${child.path}`}
            element={child.element}
          />
        ));
      } else {
        return (
          <Route path={route.path} key={route.path} element={route.element} />
        );
      }
    });

  return (
    <Routes>
      {/* Initial */}
      {/* <Route path="/" element={<Initial />} /> */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Platforms */}
      <Route path={BASE} element={<Dashboard />}>
        <Route
          path="profile"
          element={<UserProfile auth={auth} view={false} />}
        />

        {handleRoutes()}

        {/* Error 400 */}
        <Route path="" element={<ErrorBad />} />
      </Route>

      {/* Sessions */}
      <Route path="login" element={<Login />} />
      {/* <Route path="register" element={<Register />} /> */}

      {/* Error 404 */}
      <Route path="*" element={<ErrorNull />} />
    </Routes>
  );
};

export default Routers;
