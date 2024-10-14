import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import { GlobalContext } from "../contexts/GlobalProvider";
import { useLogout } from "../hooks";
import Header from "../components/default/Header";
import Footer from "../components/default/Footer";

const DefaultLayout = (props) => {
  const context = useContext(GlobalContext);
  const logout = useLogout();
  return (
    <div>
      <Header isAuthenticated={context.isAuthenticated} logout={logout} />
      <Outlet />
      <Footer />
    </div>
  );
};

export default DefaultLayout;
