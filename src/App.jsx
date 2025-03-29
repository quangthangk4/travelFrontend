import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./layout/layout1";
import Flight from "./pages/Flight";
import FlightTicketDetail from "./pages/FlightTicketHistory";
import HomePage from "./pages/HomePage";
import PassengerInfor from "./pages/PassengerInfor";
import SeatMap from "./pages/SeatMap";
import FlightHistoryPage from "./pages/FlightHistoryPage";
import SignIn from "./components/SignInandSignUp/SignIn";
import SignUp from "./components/SignInandSignUp/SignUp";
import Profile from "./pages/Profile";
import Test from "./pages/Test";
import { Provider } from "react-redux";
import store, { persistor } from "./store/store";
import { PersistGate } from "redux-persist/integration/react";

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="/flight" element={<Flight />} />
              <Route path="/passenger-infor" element={<PassengerInfor />} />
              <Route path="/seat-map" element={<SeatMap />} />
              <Route path="/ticket-detail" element={<FlightTicketDetail />} />
              <Route path="/ticket-history" element={<FlightHistoryPage />} />
              <Route path="profile" element={<Profile />} />
              <Route path="/test" element={<Test />} />
            </Route>
            <Route path="sign-in" element={<SignIn />} />
            <Route path="sign-up" element={<SignUp />} />
          </Routes>
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;
