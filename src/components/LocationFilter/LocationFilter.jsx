import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Marker } from 'react-leaflet';
import { geocodeLocation } from '../../utils/geocode';
import styles from './LocationFilter.module.css';

const LocationFilter = ({ initialCoords, initialRadius = 10, onApplyFilter }) => {
    const [input, setInput] = useState("");
    const [radius, setRadius] = useState(initialRadius);
    const [coords, setCoords] = useState(initialCoords);
    const [error, setError] = useState(null);

    const handleGeocode = async () => {
        setError(null);
        const result = await geocodeLocation(input);
        if (result) {
            setCoords(result);
        } else {
            setError("Location not found. Try another city or zip code.");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!coords) {
            setError("Please enter a valid location.");
            return;
        }
        onApplyFilter({ coords, radius });
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <label>Location</label>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter city, state or zip"
                />
                <button type="button" onClick={handleGeocode}>
                    Search
                </button>

                <div className={styles.formGroup}>
                    <label htmlFor="radius">Radius</label>
                    <select
                        id="radius"
                        name="radius"
                        value={radius}
                        onChange={(e) => setRadius(Number(e.target.value))}
                        className={styles.radiusSelect}
                    >
                        {[1, 2, 5, 10, 20, 40, 60, 80, 100].map((mile) => (
                            <option key={mile} value={mile}>
                                {mile} mile{mile > 1 ? "s" : ""}
                            </option>
                        ))}
                    </select>
                </div>

                <button type="submit">Apply Filter</button>
                {error && <p className={styles.error}>{error}</p>}
            </form>

            {coords && (
                <MapContainer
                    center={[coords.lat, coords.lng]}
                    zoom={11}
                    scrollWheelZoom={false}
                    className={styles.map}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; OpenStreetMap contributors"
                    />
                    <Circle
                        center={[coords.lat, coords.lng]}
                        radius={radius * 1609.34} // miles to meters
                        pathOptions={{ color: "#bbb", fillOpacity: 0.2 }}
                    />
                    <Marker position={[coords.lat, coords.lng]} />
                </MapContainer>
            )}
        </div>
    );
};

export default LocationFilter;


