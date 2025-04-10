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

export { 
    index,
    show,
    create,
    update,
    deleteListing,
};

