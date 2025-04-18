import LocationFilter from "../LocationFilter/LocationFilter";
import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import styles from "./LocationFilterPage.module.css";

const LocationFilterPage = () => {
    const { user } = useContext(UserContext);

    return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Change Location</h2>
      <p className={styles.subtext}>
        Search by city, neighborhood or ZIP code.
      </p>
      <LocationFilter initialCoords={user?.profile?.location?.coordinates} />
    </div>
  );
};


export default LocationFilterPage;