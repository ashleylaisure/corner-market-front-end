const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/listings`;

const index = async () => {
  try {
    const res = await fetch(BASE_URL);
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

async function update(listingId, listingFormData) {
  try {
    const res = await fetch(`${BASE_URL}/${listingId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(listingFormData),
    });
    return res.json();
  } catch (error) {
    console.log(error);
  }
}

const create = async (listingFormData) => {
  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(listingFormData),
    });
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

const show = async (listingId) => {
  try {
    const res = await fetch(`${BASE_URL}/${listingId}`);
    return res.json();
  } catch (error) {
    console.log(error);
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
        console.log(error)
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
    console.log(err);
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
    console.log(err);
    throw err;
  }
};


export { 
    index,
    show,
    create,
    update,
    deleteListing,
    uploadListingImages,
    deleteListingImage
};

