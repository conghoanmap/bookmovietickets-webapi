import React, { createContext, useEffect, useState } from "react";
import { AccountService } from "../services";

const GlobalContext = createContext();

const GlobalProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchLoggedIn = async () => {
      const loggedIn = await AccountService.isAuthenticated();
      setIsAuthenticated(loggedIn);
    };

    fetchLoggedIn();
  }, []);

  //Fetch roles
  useEffect(() => {
    const fetchRoles = async () => {
      const response = await AccountService.GetRoles();
      setRoles(response.data);
    };

    fetchRoles();
  }, []);

  const exportValue = {
    isAuthenticated,
    setIsAuthenticated,
    roles,
    setRoles,
  };

  return (
    <GlobalContext.Provider value={exportValue}>{children}</GlobalContext.Provider>
  );
};

export { GlobalProvider, GlobalContext };
