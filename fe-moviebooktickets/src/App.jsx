import { useContext, useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { DashboardLayout, DefaultLayout } from "./layouts";
import {
  AdminNotFound,
  Dashboard,
  Home,
  Login,
  Movie,
  NotFound,
  Register,
  UserManager,
  MovieManager,
  ShowTimeManager
} from "./pages";
import React from "react";
import { GlobalContext } from "./contexts/GlobalProvider";
import MovieDetail from "./pages/MovieDetail";
import PickSeat from "./pages/PickSeat";
import SuccessBooking from "./pages/SuccessBooking";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import HistoryBooking from "./pages/HistoryBooking";

const App = () => {
  const context = useContext(GlobalContext);
  
  return (

    <Routes>
      {/* Default */}
      <Route element={<DefaultLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/movie" element={<Movie />} />
        <Route path="/movie-detail/:movieId" element={<MovieDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/history-booking" element={<HistoryBooking />} />
        {context.isAuthenticated && (
          <Route path="/success-booking" element={<SuccessBooking />} />
        )}
        {context.isAuthenticated && (
          <Route
            path="/pick-seat/:showTimeId/:priceTicket"
            element={<PickSeat />}
          />
        )}
        {!context.isAuthenticated && (
          <Route path="/login" element={<Login />} />
        )}
        {!context.isAuthenticated && (
          <Route path="/register" element={<Register />} />
        )}
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Dashboard */}
      {context.isAuthenticated ? (
        context.roles.includes("Admin") && (
          <Route element={<DashboardLayout />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/*" element={<AdminNotFound />} />
            <Route path="/admin/movie-manager" element={<MovieManager />} />
            <Route path="/admin/user-manager" element={<UserManager />} />
            <Route path="/admin/showtime-manager" element={<ShowTimeManager />} />
          </Route>
        )
      ) : (
        <Route element={<DefaultLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>
      )}
    </Routes>
  );
};

export default App;
