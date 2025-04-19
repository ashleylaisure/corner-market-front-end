import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Marker } from 'react-leaflet';
import { geocodeLocation } from '../../utils/geocode';
import styles from './LocationFilter.module.css';

const LocationFilter = ({ initialCoords, initialRadius = 10, onApplyFilter }) => {
    const [input, setInput] = useState("");
    const [radius, setRadius] = useState(initialRadius);
    const [coords, setCoords] = useState(initialCoords);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // If user typed a location, geocode it first
        if (input.trim() !== "") {
            const result = await geocodeLocation(input.trim());
            if (result) {
                setCoords(result);
                onApplyFilter({ coords: result, radius });
                return;
            } else {
                setError("Location not found. Try another city or ZIP code.");
                return;
            }
        }

        // If user didn’t enter a new location, just apply with existing coords
        if (!coords) {
            setError("Please enter a valid location.");
            return;
        }

        onApplyFilter({ coords, radius });
    };

    useEffect(() => {
        if (initialCoords) {
            setCoords(initialCoords);
        }
    }, [initialCoords]);

    return (
        <div className={styles.filterCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="location">Location</label>
                    <input
                        id="location"
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Search by city, state, or ZIP code"
                        className={styles.input}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="radius">Radius</label>
                    <select
                        id="radius"
                        value={radius}
                        onChange={(e) => setRadius(Number(e.target.value))}
                        className={styles.radiusSelect}
                    >
                        {[1, 2, 5, 10, 20, 40, 60, 80, 100].map((mile) => (
                            <option key={mile} value={mile}>
                                {mile} mile{mile > 1 ? 's' : ''}
                            </option>
                        ))}
                    </select>
                </div>

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
                            radius={radius * 1609.34}
                            pathOptions={{ color: '#bbb', fillOpacity: 0.2 }}
                        />
                        <Marker position={[coords.lat, coords.lng]} />
                    </MapContainer>
                )}

                <button type="submit" className={styles.applyBtn}>
                    Apply
                </button>

                {error && <p className={styles.error}>{error}</p>}
            </form>
        </div>
    );
};

export default LocationFilter;