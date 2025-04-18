import LocationFilter from "../LocationFilter/LocationFilter";
import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import { useNavigate } from "react-router";
import { LocationFilterContext } from "../../contexts/LocationFilterContext";
import { reverseGeocode } from "../../utils/geocode";
import styles from "./LocationFilterPage.module.css";

const LocationFilterPage = () => {
    const { user } = useContext(UserContext);
    const { setLocationFilter } = useContext(LocationFilterContext);
    const navigate = useNavigate();

    const handleApplyFilter = async ({ coords, radius }) => {
        console.log("Updating global locationFilter:", coords, radius);
      
        const place = await reverseGeocode(coords.lat, coords.lng);
        console.log("reverseGeocode result:", place); 
      
        setLocationFilter({
          lat: coords.lat,
          lng: coords.lng,
          radius,
          city: place?.city || "Unknown",
          state: place?.state || "Unknown"
        });
      
        navigate("/");
      };

    return (
        <div className={styles.pageContainer}>
            <h2 className={styles.heading}>Change Location</h2>
            <p className={styles.subtext}>
                Search by city, state, or ZIP code.
            </p>
            <LocationFilter initialCoords={user?.profile?.location?.coordinates}
                onApplyFilter={handleApplyFilter}
            />
        </div>
    );
};


export default LocationFilterPage;