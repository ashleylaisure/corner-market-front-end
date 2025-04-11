import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { getUserProfile } from '../../services/userService';
import styles from './UserProfile.module.css';


const UserProfile = ({ currentUser, listings}) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { userId } = useParams();
    const navigate = useNavigate();

    // Check if the profile being viewed belongs to the current user
    const isOwnProfile = currentUser?._id === userId;

    // find all listings by this user
    const userListings = listings.filter(listing => listing.author._id === userId)
    console.log("user listings", userListings)

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
                console.log("user profile data", data.user)

                const { username, profile: profileData } = data.user;
                
                // Flatten and merge for easy access
                setProfile({
                    username,
                    ...profileData // merges bio, location, etc. at top level
                });
    
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
        <div className={styles.container}>

            <main className={styles.profileContent}>
                {/* Profile header with user image and info */}
                <div className={styles.profileHeader}>
                    {/* Profile image with fallback to default avatar */}
                    <div className={styles.profilePicture}>
                        {profile.profilePicture ? (
                            <img src={profile.profilePicture} alt={`${profile.username}'s profile`} />
                        ) : null}
                    </div>

                    {/* User information section */}
                    <div className={styles.profileInfo}>
                        <h2 className={styles.username}>{profile.username}</h2>

                        <div className={styles.locationInfo}>
                            <h3>Location</h3>
                            <p>{profile.location || 'Not specified'}</p>
                        </div>

                        {/* Bio section with fallback for empty bio */}
                        <h3>Bio</h3>
                        <p className={styles.bio}>{profile.bio || ''}</p>

                        {/* Conditional rendering based on profile ownership */}
                        {isOwnProfile ? (
                            // Show Edit Profile button if it's the user's own profile
                            <button className={styles.actionButton}
                                onClick={() => navigate('/profile/edit')}
                            >
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
                        {userListings.length > 0 ? (

                        <ul>
                            {/* Map through the listings array to create listing cards */}
                            {userListings.map((listing) => (
                                <li key={listing._id} className={styles.listingCard}>

                                    {/* link back to the listingss detail page */}
                                    <Link key={listing._id} to={`/listings/${listing._id}`}>
                                        
                                        <h2>{listing.title}</h2>
                                        <p>{listing.price}</p>

                                        {/* Placeholder for listing images - replace with actual images when available */}
                                        <div className={styles.listingImagePlaceholder}></div>
                                        
                                        <p>{listing.description}</p>

                                    </Link>
                                </li>
                            ))}
                        </ul>
                        ) : (
                        // Display message if no listings available
                        <p className={styles.noListings}>No listings available</p>
                        )}

                    </div>

                </section>
            </main>
        </div>
    );
}
export default UserProfile;
