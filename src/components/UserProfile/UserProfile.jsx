import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getUserProfile } from '../../services/userService';
import styles from './UserProfile.module.css';


const UserProfile = ({ currentUser }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { userId } = useParams();
    const navigate = useNavigate();

    // Check if the profile being viewed belongs to the current user
    const isOwnProfile = currentUser?._id === userId;


    useEffect(() => {
        // Redirect to login if not authenticated
        if (!currentUser) {
            navigate('/sign-in');
            return;
        }

        const fetchProfile = async () => {
            try {
                setLoading(true);
                const data = await getUserProfile(userId);
                setProfile(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load profile.' + err.message);
                setLoading(false);
            }
        };
        fetchProfile();
    }, [userId, currentUser, navigate]);

    if (loading) return <div>Loading profile...</div>;
    if (error) return <div className={styles.error}>{error}</div>;
    if (!profile) return <div>Profile not found.</div>;

    return (
        <>
        <div className={styles.container}>

            <main className={styles.profileContent}>
                {/* Profile header with user image and info */}
                <div className={styles.profileHeader}>
                    {/* Profile image with fallback to default avatar */}
                    <div className={styles.profilePicture}>
                        {profile.profilePicture ? (
                            <img src={profile.profilePicture} alt={`${profile.username}'s profile`} />
                        ) : (
                            <div className={styles.defaultAvatar}>
                                {profile.username?.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>

                    {/* User information section */}
                    <div className={styles.profileInfo}>
                        <h2 className={styles.username}>{profile.username}</h2>

                        <div className={styles.locationInfo}>
                            <h3>Location</h3>
                            <p>{profile.location || 'Not specified'}</p>
                        </div>

                        {/* Bio section with fallback for empty bio */}
                        <p className={styles.bio}>{profile.bio || ''}</p>

                        {/* Conditional rendering based on profile ownership */}
                        {isOwnProfile ? (
                            // Show Edit Profile button if it's the user's own profile
                            <button className={styles.actionButton}>
                                Edit profile
                            </button>
                        ) : (
                            // Show Message button if viewing someone else's profile
                            <button className={styles.actionButton}>
                                Message
                            </button>
                        )}
                    </div>
                </div>

                {/* User's listings section */}
                <section className={styles.listingsSection}>
                    <h2 className={styles.listingsHeading}>
                        {isOwnProfile ? "Your Listings" : `${profile.username}'s Listings`}
                    </h2>

                    {/* Grid of listings with conditional rendering */}
                    <div className={styles.listingsGrid}>
                        {/* Check if user has listings */}
                        {profile.listings && profile.listings.length > 0 ?
                            // Map through the listings array to create listing cards
                            profile.listings.map(listing => (
                                <div key={listing._id} className={styles.listingCard}>
                                    {/* Placeholder for listing images - replace with actual images when available */}
                                    <div className={styles.listingImagePlaceholder}></div>
                                    {/* NOTE: You can add listing title, price, etc. here when available */}
                                </div>
                            )) :
                            // Display message if no listings available
                            <p className={styles.noListings}>No listings available</p>
                        }
                    </div>
                </section>
            </main>
        </div>
        </>
    );
}
export default UserProfile;
