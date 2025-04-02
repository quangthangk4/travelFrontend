import { Provider } from "react-redux";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PersistGate } from "redux-persist/integration/react";
import "./App.css";
import ProtectedRoute from "./auth/ProtectedRoute";
import { getAuthWithExpiry, getRoleFromToken } from "./auth/manageToken";
import SignIn from "./components/SignInandSignUp/SignIn";
import SignUp from "./components/SignInandSignUp/SignUp";
import Layout from "./layout/layout1";
import DepositPage from "./pages/DepositMoneyPage";
import Flight from "./pages/Flight";
import FlightHistoryPage from "./pages/FlightHistoryPage";
import FlightTicketDetail from "./pages/FlightTicketHistory";
import HomePage from "./pages/HomePage";
import PassengerInfor from "./pages/PassengerInfor";
import Profile from "./pages/Profile";
import SeatMap from "./pages/SeatMap";
import Aircraft from "./pages/admin/AirCraft";
import FlightAdmin from "./pages/admin/FlightAdmin";
import Airline from "./pages/admin/airline";
import store, { persistor } from "./store/store";

function App() {
  const token = getAuthWithExpiry("token");
  const isLoggedIn = !!token;
  const role = getRoleFromToken(token);

  return (
    <Provider store={store}>
      <ToastContainer
        className="toast-position"
        position="top-right"
        autoClose={5000}
      />
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <Routes>
            <Route
              path="/"
              element={<Layout isLoggedIn={isLoggedIn} role={role} />}
            >
              <Route index element={<HomePage />} />
              <Route path="/flight" element={<Flight />} />
              {!isLoggedIn && (
                <>
                  <Route path="sign-in" element={<SignIn />} />
                  <Route path="sign-up" element={<SignUp />} />
                </>
              )}

              <Route element={<ProtectedRoute />}>
                <Route path="sign-in" element={<Navigate to="/" />} />
                <Route path="sign-up" element={<Navigate to="/" />} />

                {role === "ROLE_ADMIN" ? (
                  <>
                    <Route
                      path="/passenger-infor"
                      element={<PassengerInfor />}
                    />
                    <Route path="/seat-map" element={<SeatMap />} />
                    <Route
                      path="/ticket-detail"
                      element={<FlightTicketDetail />}
                    />
                    <Route
                      path="/ticket-history"
                      element={<FlightHistoryPage />}
                    />
                    <Route path="profile" element={<Profile />} />
                    <Route path="/deposit-money" element={<DepositPage />} />
                    <Route path="/airline" element={<Airline />} />
                    <Route path="/aircraft" element={<Aircraft />} />
                    <Route path="/flight-admin" element={<FlightAdmin />} />
                  </>
                ) : (
                  <>
                    <Route
                      path="/passenger-infor"
                      element={<PassengerInfor />}
                    />
                    <Route path="/seat-map" element={<SeatMap />} />
                    <Route
                      path="/ticket-detail"
                      element={<FlightTicketDetail />}
                    />
                    <Route
                      path="/ticket-history"
                      element={<FlightHistoryPage />}
                    />
                    <Route path="profile" element={<Profile />} />
                    <Route path="/deposit-money" element={<DepositPage />} />

                    <Route path="/airline" element={<Navigate to="/" />} />
                    <Route path="/aircraft" element={<Navigate to="/" />} />
                    <Route path="/flight-admin" element={<Navigate to="/" />} />
                  </>
                )}
              </Route>
            </Route>
          </Routes>
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;
