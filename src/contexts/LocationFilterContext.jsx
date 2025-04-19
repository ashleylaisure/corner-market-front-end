import { createContext, useState, useEffect } from "react";

const STORAGE_KEY = "cm_locationFilter";
const LocationFilterContext = createContext();

const LocationFilterProvider = ({ children }) => {
    const [locationFilter, setLocationFilterState] = useState(null);


    // Save location filter to state and localStorage
    const setLocationFilter = (filter) => {
        setLocationFilterState(filter);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filter));


        // Safely decode JWT to extract userId
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const userId = payload?._id;
                if (userId) {
                    localStorage.setItem("lastUser", userId);
                }
            } catch (err) {
                console.error("Failed to decode token:", err);
            }
        }
    };


    // Load location filter from localStorage on initial render
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed && typeof parsed === "object") {
                    setLocationFilterState(parsed);
                }
            }
        } catch (err) {
            console.error("Failed to load locationFilter from localStorage:", err);
            localStorage.removeItem(STORAGE_KEY);
        }
    }, []);


    return (
        <LocationFilterContext.Provider value={{ locationFilter, setLocationFilter }}>
            {children}
        </LocationFilterContext.Provider>
    );
};


export { LocationFilterContext, LocationFilterProvider };