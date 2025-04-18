const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/users`;

const index = async () => {
  try {
    const res = await fetch(BASE_URL, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });

    const data = await res.json();

    if (data.err) {
      throw new Error(data.err);
    }

    return data
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

// Get a single user profile

const getUserProfile = async (userId) => {
  try {
    // console.log('Fetching profile for user ID:', userId);
    const res = await fetch(`${BASE_URL}/${userId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });

    const data = await res.json();
    console.log('API response:', data); 

    if (data.err) {
      throw new Error(data.err);
    }
     // If we got direct profile data (from image uploads)
     if (data.profile && data.profile._id) {
      return {
        username: data.user?.username || 'User',
        ...data.profile
      };
    }

    return data;

  } catch (err) {
    console.error('Error fetching profile:', err);
        throw err;
  }
}

const createUserProfile = async (userId, profileData) => {
  try {
    const res = await fetch(`${BASE_URL}/${userId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });

    const data = await res.json();

    if (data.err) {
      throw new Error(data.err);
    }

    return data.profile;
  } catch (err) {
    console.log(err);
    throw new Error(err.message || 'Failed to create profile');
  }
};


const updateUserProfile = async (userId, profileData) => {
  try {
    const res = await fetch(`${BASE_URL}/${userId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });

    const data = await res.json();

    if (data.err) {
      throw new Error(data.err);
    }

    return data.profile;
  } catch (err) {
    console.log(err);
    throw new Error(err.message || 'Failed to update profile');
  }
}

// Upload profile picture

const uploadProfilePicture = async (userId, formData) => {
  try {
    const res = await fetch(`${BASE_URL}/${userId}/profile-picture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.err || 'Failed to upload profile picture');
    }
    
    return res.json();
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// Upload cover photo

const uploadCoverPhoto = async (userId, formData) => {
  try {
    const res = await fetch(`${BASE_URL}/${userId}/cover-photo`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.err || 'Failed to upload cover photo');
    }
    
    return res.json();
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export {
  index, 
  getUserProfile,
  updateUserProfile,
  createUserProfile,
  uploadProfilePicture,
  uploadCoverPhoto
};
