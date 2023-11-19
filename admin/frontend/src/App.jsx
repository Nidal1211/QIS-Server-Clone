import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { useSelector } from "react-redux";
import ProtectedRoute from "./components/ProtectedRoute";
import {
  Studiengang,
  Login,
  Topbar,
  Sidebar,
  Dashboard,
  Pruefungen,
  Professor,
  Students,
} from "./scenes";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {isAuthenticated && <Sidebar user={user} isSidebar={isSidebar} />}
          <main className="content">
            {isAuthenticated && (
              <Topbar user={user} setIsSidebar={setIsSidebar} />
            )}
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/pruefungen"
                element={
                  <ProtectedRoute>
                    <Pruefungen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/students"
                element={
                  <ProtectedRoute>
                    <Students />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/professor"
                element={
                  <ProtectedRoute>
                    <Professor />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/Studiengang"
                element={
                  <ProtectedRoute>
                    <Studiengang />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
