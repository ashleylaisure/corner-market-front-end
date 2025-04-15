
import { useState, useEffect } from 'react';
import styles from './ProfileImageUpload.module.css';
import defaultProfilePic from '../../assets/images/default-profile-picture.png';
import defaultCoverPhoto from '../../assets/images/paul-povoroznuk-bJkynpjVRBQ-unsplash.jpg';

const ProfileImageUpload = ({
    onSelectProfilePicture,
    onSelectCoverPhoto,
    initialProfileImage,
    initialCoverImage
  }) => {
    const [error, setError] = useState(null);
    const [profilePreview, setProfilePreview] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);


  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError(null);
    setProfilePreview(URL.createObjectURL(file));
    onSelectProfilePicture(file); // send to parent
  };


  const handleCoverPhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError(null);
    setCoverPreview(URL.createObjectURL(file));
    onSelectCoverPhoto(file); // send to parent
  };

  // Clean up previews on unmount
  useEffect(() => {

    return () => {
        if (profilePreview) URL.revokeObjectURL(profilePreview);
        if (coverPreview) URL.revokeObjectURL(coverPreview);
      };
    }, [profilePreview, coverPreview]);
  
    return (
        <div className={styles.imageUploadContainer}>
          {error && <p className={styles.error}>{error}</p>}
    
          <div className={styles.uploadSection}>
            <h3>Profile Picture</h3>
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePictureChange}
              id="profile-picture-input"
              className={styles.fileInput}
            />
            <label htmlFor="profile-picture-input" className={styles.uploadButton}>
              Choose Profile Image
            </label>
            {profilePreview || initialProfileImage ? (
              <img
              src={profilePreview || initialProfileImage || defaultProfilePic}
                alt="Profile preview"
                className={styles.previewImage}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultProfilePic;
                }}
              />
            ): null}
          </div>
    
          <div className={styles.uploadSection}>
            <h3>Cover Photo</h3>
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverPhotoChange}
              id="cover-photo-input"
              className={styles.fileInput}
            />
            <label htmlFor="cover-photo-input" className={styles.uploadButton}>
              Choose Cover Photo
            </label>
            {coverPreview || initialCoverImage ? (
              <img
              src={coverPreview || initialCoverImage || defaultCoverPhoto}
                alt="Cover preview"
                className={styles.previewImage}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultCoverPhoto;
                }}
              />
            ) : null}
          </div>
        </div>
      );
    };


export default ProfileImageUpload;
