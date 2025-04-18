import { createContext, useState, useEffect } from "react";

const LocationFilterContext = createContext();

const LocationFilterProvider = ({ children }) => {
  const [locationFilter, setLocationFilterState] = useState(null);

  // Save location filter to state and localStorage
  const setLocationFilter = (filter) => {
    setLocationFilterState(filter);
    localStorage.setItem("locationFilter", JSON.stringify(filter));
  };

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("locationFilter");
    if (saved) {
      setLocationFilterState(JSON.parse(saved));
    }
  }, []);

  return (
    <LocationFilterContext.Provider value={{ locationFilter, setLocationFilter }}>
      {children}
    </LocationFilterContext.Provider>
  );
};

export { LocationFilterContext, LocationFilterProvider };