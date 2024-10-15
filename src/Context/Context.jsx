import axios from "../axios";
import { useState, useEffect, createContext } from "react";

const AppContext = createContext({
  data: [],
  isError: "",
  refreshData: () => {}
});

export const AppProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [isError, setIsError] = useState("");

  // Fetch wallpaper data
  const refreshData = async () => {
    try {
      const response = await axios.get("/wallpapers"); // Updated API endpoint if needed
      setData(response.data);
    } catch (error) {
      setIsError(error.message);
    }
  };

  useEffect(() => {
    refreshData(); // Fetch data on component mount
  }, []);

  return (
    <AppContext.Provider value={{ data, isError, refreshData }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
