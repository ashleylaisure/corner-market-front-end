import { useState } from 'react';
import { uploadProfilePicture, uploadCoverPhoto } from '../../services/userService';
import styles from './ProfileImageUpload.module.css';

const ProfileImageUpload = ({ userId, onImageUpload }) => {
    const [profileLoading, setProfileLoading] = useState(false);
    const [coverLoading, setCoverLoading] = useState(false);
    const [error, setError] = useState(null);

const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('profilePicture', file);
    
    try {
      setProfileLoading(true);
      setError(null);
      
      const result = await uploadProfilePicture(userId, formData);
      if (onImageUpload) onImageUpload(result.profile);
      
      setProfileLoading(false);
    } catch (err) {
      setError("Failed to upload profile picture");
      setProfileLoading(false);
    }
  };

  const handleCoverPhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('coverPhoto', file);
    
    try {
      setCoverLoading(true);
      setError(null);
      
      const result = await uploadCoverPhoto(userId, formData);
      if (onImageUpload) onImageUpload(result.profile);
      
      setCoverLoading(false);
    } catch (err) {
      setError("Failed to upload cover photo");
      setCoverLoading(false);
    }
  };

  return (
    <div className={styles.imageUploadContainer}>
      {error && <p className={styles.error}>{error}</p>}
      
      <div className={styles.uploadSection}>
        <h3>Profile Picture</h3>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleProfilePictureUpload} 
          id="profile-picture-input"
          className={styles.fileInput}
        />
        <label 
          htmlFor="profile-picture-input" 
          className={styles.uploadButton}
        >
          {profileLoading ? 'Uploading...' : ''}
        </label>
      </div>
      
      <div className={styles.uploadSection}>
        <h3>Cover Photo</h3>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleCoverPhotoUpload} 
          id="cover-photo-input"
          className={styles.fileInput}
        />
        <label 
          htmlFor="cover-photo-input" 
          className={styles.uploadButton}
        >
          {coverLoading ? 'Uploading...' : ''}
        </label>
      </div>
    </div>
  );
};

export default ProfileImageUpload;