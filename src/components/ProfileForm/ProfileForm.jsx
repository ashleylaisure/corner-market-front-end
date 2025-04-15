import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  updateUserProfile,
  getUserProfile,
  createUserProfile,
} from "../../services/userService";
import ProfileImageUpload from "../ProfileImageUpload/ProfileImageUpload";
import styles from "./ProfileForm.module.css";

const ProfileForm = ({ currentUser, isNewUser = false }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    bio: "",
    location: "",
    emailAddress: "",
    facebookLink: "",
    twitterLink: "",
    instagramLink: "",
  });
  const [loading, setLoading] = useState(!isNewUser);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If editing existing profile, fetch current data
    if (!isNewUser && currentUser) {
      const fetchProfile = async () => {
        try {
          const profileData = (await getUserProfile(currentUser._id)).user
            .profile;

          setFormData({
            bio: profileData.bio || "",
            location: profileData.location || "",
            emailAddress: profileData.emailAddress || "",
            facebookLink: profileData.facebookLink || "",
            twitterLink: profileData.twitterLink || "",
            instagramLink: profileData.instagramLink || "",
          });
          setLoading(false);
        } catch (err) {
          setError("Failed to load profile data");
          setLoading(false);
        }
      };
      fetchProfile();
    }
  }, [currentUser, isNewUser]);

  // Handler for form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handler for image upload completion
  const handleImageUpload = (updatedProfile) => {
    console.log("Profile image updated:", updatedProfile);
    // You can update UI or state here if needed
  };

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create or update profile details
      if (isNewUser) {
        await createUserProfile(currentUser._id, formData);
      } else {
        await updateUserProfile(currentUser._id, formData);
      }

      // Navigate to profile page, replace avoids users hitting back and returning to form
      navigate(`/users/${currentUser._id}`), { replace: true };
    } catch (err) {
      setError("Failed to save profile");
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className={isNewUser ? styles.newFormContainer : styles.formContainer}>
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.imageUploadSection}>
        <h1>{isNewUser ? "Complete Your Profile" : "Edit Your Profile"}</h1>
        {/* <h3>Profile Images</h3> */}
        <ProfileImageUpload
          userId={currentUser?._id}
          onImageUpload={handleImageUpload}
        />
      </div>

      <form onSubmit={handleSubmit} className={styles.profileForm}>
        <div className={styles.formGroup}>
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="City, State"
            required={isNewUser}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="emailAddress">Contact Email</label>
          <input
            type="email"
            id="emailAddress"
            name="emailAddress"
            value={formData.emailAddress}
            onChange={handleChange}
            placeholder="email@example.com"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell others about yourself"
            rows="4"
            maxLength="500"
          />
        </div>

        <h3>Social Media Links</h3>

        <div className={styles.formGroup}>
          <label htmlFor="facebookLink">
            <i className="bx bxl-facebook bxSocail"></i> Facebook
          </label>
          <input
            type="url"
            id="facebookLink"
            name="facebookLink"
            value={formData.facebookLink}
            onChange={handleChange}
            placeholder="https://facebook.com/yourusername"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="twitterLink">
            <i className="bx bxl-twitter bxSocail"></i> Twitter
          </label>
          <input
            type="url"
            id="twitterLink"
            name="twitterLink"
            value={formData.twitterLink}
            onChange={handleChange}
            placeholder="https://twitter.com/yourusername"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="instagramLink">
            <i className="bx bxl-instagram bxSocail"></i> Instagram
          </label>
          <input
            type="url"
            id="instagramLink"
            name="instagramLink"
            value={formData.instagramLink}
            onChange={handleChange}
            placeholder="https://instagram.com/yourusername"
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          {isNewUser ? "Create Profile" : "Save Changes"}
        </button>
        {isNewUser ? "" : <button onClick={handleGoBack}>Cancel</button>}
      </form>
    </div>
  );
};

export default ProfileForm;
