import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/calendar/calendar";
import {  useSelector } from "react-redux";
import store from "./redux/store";
import ProtectedRoute from "./components/ProtectedRoute";
import { getUserDetails } from "./redux/users/actions";
import {
  Categories,
  Login,
  Topbar,
  Sidebar,
  Dashboard,
  ExamManagenemt,
  Notenspiegel,
  MyExams,
  Bar,
  Form,
  Line,
  Pie,
  FAQ,
  Geography,
  Store,
  Products,
  Product,
} from "./scenes";


function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const { isAuthenticated, user} = useSelector((state) => state.user);


  useEffect(() => {
    store.dispatch(getUserDetails());
  }, []);

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
              <Route path="/store" element={<Store />} />{" "}
              <Route
                path="/products"
                element={
                  <ProtectedRoute>
                    <Products />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/products/:id"
                element={
                  <ProtectedRoute>
                    <Product />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/exam-managenemt"
                element={
                  <ProtectedRoute>
                    <ExamManagenemt />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/anmeldeliste"
                element={
                  <ProtectedRoute>
                    <MyExams />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/categories"
                element={
                  <ProtectedRoute>
                    <Categories />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/invoices"
                element={
                  <ProtectedRoute>
                    <Notenspiegel />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/form"
                element={
                  <ProtectedRoute>
                    <Form />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/bar"
                element={
                  <ProtectedRoute>
                    <Bar />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/pie"
                element={
                  <ProtectedRoute>
                    <Pie />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/line"
                element={
                  <ProtectedRoute>
                    <Line />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/faq"
                element={
                  <ProtectedRoute>
                    <FAQ />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/calendar"
                element={
                  <ProtectedRoute>
                    <Calendar />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/geography"
                element={
                  <ProtectedRoute>
                    <Geography />
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
