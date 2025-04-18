const BASE_URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places';
const token = import.meta.env.VITE_MAPBOX_TOKEN;

/**
 * Geocodes a location string like "New Orleans, LA" or "70117"
 * and returns an object with { lat, lng }, or null if not found.
 */

const geocodeLocation = async (locationString) => {
  try {
    const response = await fetch(
      `${BASE_URL}/${encodeURIComponent(locationString)}.json?access_token=${token}`
    );

    const data = await response.json();

    if (data.features && data.features.length > 0) {
      const [lng, lat] = data.features[0].center;
      return { lat, lng };
    } else {
      console.warn('No geocoding results found for:', locationString);
      return null;
    }
  } catch (err) {
    console.error('Error during geocoding:', err.message);
    return null;
  }
};


export { geocodeLocation };