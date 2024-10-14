import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import { useLogout } from "../hooks";
import { GlobalContext } from "../contexts/GlobalProvider";
import Sidebar from "../components/dashboard/Sidebar";
import Header from "../components/dashboard/Header";
import Footer from "../components/dashboard/Footer";

const DashboardLayout = () => {
  const logout = useLogout();

  return (
    <div className="lg:flex">
      <Sidebar logout={logout} />
      <div className="w-full lg:w-4/5 lg:h-screen lg:overflow-y-auto">
        <Header />
        <Outlet />
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
