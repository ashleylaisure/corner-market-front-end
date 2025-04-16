import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import { geocodeLocation } from '../../utils/geocode';
import {
    updateUserProfile,
    getUserProfile,
    createUserProfile,
    uploadProfilePicture,
    uploadCoverPhoto,
} from "../../services/userService";
import ProfileImageUpload from "../ProfileImageUpload/ProfileImageUpload";
import { UserContext } from "../../contexts/UserContext";
import styles from "./ProfileForm.module.css";


const ProfileForm = ({ currentUser, isNewUser = false }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        bio: "",
        location: { city: "", state: "", zip: "", coordinates: { lat: null, lng: null } },
        emailAddress: "",
        facebookLink: "",
        twitterLink: "",
        instagramLink: "",
    });
    const [loading, setLoading] = useState(!isNewUser);
    const [error, setError] = useState(null);
    const { setUser } = useContext(UserContext);
    const [profileImageFile, setProfileImageFile] = useState(null);
    const [coverPhotoFile, setCoverPhotoFile] = useState(null);
    const [initialProfileImage, setInitialProfileImage] = useState(null);
    const [initialCoverImage, setInitialCoverImage] = useState(null);

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

                    setInitialProfileImage(
                        profileData.profilePicture
                            ? `${import.meta.env.VITE_BACK_END_SERVER_URL}${profileData.profilePicture
                            }`
                            : null
                    );
                    setInitialCoverImage(
                        profileData.coverPhoto
                            ? `${import.meta.env.VITE_BACK_END_SERVER_URL}${profileData.coverPhoto
                            }`
                            : null
                    );
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
    //   const handleImageUpload = (updatedProfile) => {
    //     console.log('Profile image updated:', updatedProfile);
    //     setUser((prevUser) => ({
    //       ...prevUser,
    //       profile: updatedProfile,
    //     }));
    //   };

    // Handler for form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Geocode the location before saving
            const locationString = `${formData.location.city}, ${formData.location.state}`;
            const coords = await geocodeLocation(locationString);
            
            if (!coords) {
                setError("Failed to geocode location. Please check your input.");
                return;
            }

            const fullFormData = {
                ...formData,
                location: {
                    ...formData.location,
                    coordinates: coords,
                },
            };

            const latestUserData = await getUserProfile(currentUser._id);
            const alreadyHasProfile = !!latestUserData.user.profile;

            if (!alreadyHasProfile) {
                await createUserProfile(currentUser._id, fullFormData);
            } else {
                await updateUserProfile(currentUser._id, fullFormData);
            }

            // Upload profile picture if selected
            if (profileImageFile) {
                const form = new FormData();
                form.append("profilePicture", profileImageFile);
                await uploadProfilePicture(currentUser._id, form);
            }

            //  Upload cover photo if selected
            if (coverPhotoFile) {
                const form = new FormData();
                form.append("coverPhoto", coverPhotoFile);
                await uploadCoverPhoto(currentUser._id, form);
            }

            // Re-fetch the user's profile and update UserContext
            const updatedUserData = await getUserProfile(currentUser._id);
            setUser((prevUser) => ({
                ...prevUser,
                profile: updatedUserData.user.profile,
            }));

            navigate(`/users/${currentUser._id}`, { replace: true });
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
          <div className={styles.formBackdrop}>
            <div className={styles.profileDataContainer}>
                {error && <p className={styles.error}>{error}</p>}

                <div className={styles.imageUploadSection}>
                    <h1>{isNewUser ? "Complete Your Profile" : "Edit Your Profile"}</h1>
                    {/* <h3>Profile Images</h3> */}
                    <ProfileImageUpload
                        onSelectProfilePicture={(file) => setProfileImageFile(file)}
                        onSelectCoverPhoto={(file) => setCoverPhotoFile(file)}
                        initialProfileImage={initialProfileImage}
                        initialCoverImage={initialCoverImage}
                    />
                </div>

                <form onSubmit={handleSubmit} className={styles.profileForm}>
                    <div className={styles.formGroup}>
                        <label htmlFor="city">City</label>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.location.city}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    location: { ...prev.location, city: e.target.value },
                                }))
                            }
                            placeholder="New Orleans"
                            required={isNewUser}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="state">State</label>
                        <input
                            type="text"
                            id="state"
                            name="state"
                            value={formData.location.state}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    location: { ...prev.location, state: e.target.value },
                                }))
                            }
                            placeholder="LA"
                            required={isNewUser}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="zip">Zip Code</label>
                        <input
                            type="text"
                            id="zip"
                            name="zip"
                            value={formData.location.zip}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    location: { ...prev.location, zip: e.target.value },
                                }))
                            }
                            placeholder="70117"
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
                        <label htmlFor="facebookLink"><i className='bx bxl-facebook bxSocail'></i>  Facebook</label>
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
                        <label htmlFor="twitterLink"><i className='bx bxl-twitter bxSocail' ></i>  Twitter</label>
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
                        <label htmlFor="instagramLink"><i className='bx bxl-instagram bxSocail'></i>  Instagram</label>
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
                    {isNewUser ? (
                        <button
                            type="button"
                            onClick={() => navigate(`/users/${currentUser._id}`)}
                          > Cancel
                        </button>
                      ) : (
                        <button type="button" onClick={handleGoBack}>
                          Cancel
                        </button>
                      )}
                </form>

            </div>

          </div>
    </div>
  );
};

export default ProfileForm;
