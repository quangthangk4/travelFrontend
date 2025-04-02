import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import { useDispatch } from "react-redux";
import { resetFlight } from "../store/tripSlice";

const layout = ({isLoggedIn, role}) => {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const keepDataPages = ["/passenger-infor", "/flight", "/seat-map"];

    if (!keepDataPages.includes(location.pathname)) {
      dispatch(resetFlight());
    }
  }, [location.pathname, dispatch]);

  return (
    <div className="scroll-smooth">
      <Header isLoggedIn={isLoggedIn} role={role} />
      <section className="mt-25 content lg:mx-15 sm:mx-5">
        <Outlet />
      </section>

      <div className="mt-64 lg:mx-15 sm:mx-5">
        <Footer />
      </div>
    </div>
  );
};

export default layout;
