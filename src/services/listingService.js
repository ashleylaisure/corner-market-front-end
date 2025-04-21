const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/listings`;

const index = async () => {
  try {
    const res = await fetch(BASE_URL);
    return res.json();
  } catch (error) {
    console.error(error);
  }
};

  const getByCategory = async (category) => {
    try {
      const res = await fetch(`${BASE_URL}/filter/${category}`);
      return res.json();
    } catch (error) {
      console.error(error)
    }
  };

  // Function to get nearby listings based on latitude, longitude, and radius

  const getNearbyListings = async ({ lat, lng, radius }) => {
    if (lat == null || lng == null || radius == null) return [];

    try {
      const res = await fetch(`${BASE_URL}/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);
      return await res.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const update = async (listingId, listingFormData) => {
    try {
      const res = await fetch(`${BASE_URL}/${listingId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          // Do NOT manually set "Content-Type" — FormData needs to set it
        },
        body: listingFormData, // FormData, not JSON.stringify
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      return data;
    } catch (error) {
      console.error("Error updating listing:", error);
      throw error;
    }
  };

  const create = async (listingFormData) => {
    try {
      const res = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          // DO NOT manually set Content-Type here!
          // Let the browser set it when sending FormData
        },
        body: listingFormData, // FormData, not JSON.stringify!
      });

      const data = await res.json();
      if (data.err) throw new Error(data.err);
      return data;
    } catch (error) {
      console.error("Error creating listing:", error);
      throw error;
    }
  };
  const show = async (listingId) => {
    try {
      const res = await fetch(`${BASE_URL}/${listingId}`);
      return res.json();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteListing = async (listingId) => {

    try {
      const res = await fetch(`${BASE_URL}/${listingId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return res.json()

    } catch (error) {
      console.error(error)
    }
  }

  // Function to upload images for a listing

  const uploadListingImages = async (listingId, formData) => {
    try {
      const res = await fetch(`${BASE_URL}/${listingId}/images`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.err || 'Failed to upload images');
      }

      return res.json();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  // Function to delete a specific image from a listing

  const deleteListingImage = async (listingId, imageIndex) => {
    try {
      const res = await fetch(`${BASE_URL}/${listingId}/images/${imageIndex}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.err || 'Failed to delete image');
      }

      return res.json();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };


export {
  index,
  getByCategory,
  show,
  create,
  update,
  deleteListing,
  uploadListingImages,
  deleteListingImage,
  getNearbyListings
}
