import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { baseURL } from "../config";

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user && currentUser) {
      const getUser = async () => {
        const res = await axios.get(`${baseURL}/auth/isLogedIn`);
        res && setUser(currentUser);
      };
      getUser();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  const login = (user) => {
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
    console.log(user);
  };

  const logout = () => {
    setUser(null);
    localStorage.clear();
  };

  const logError = (err) => {
    console.log(err);
    setError(err);
  };

  return (
    <UserContext.Provider value={{ login, logout, user, loading, setLoading, logError, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
