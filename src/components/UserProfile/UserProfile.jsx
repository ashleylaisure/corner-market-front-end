import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
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
                console.log('Profile data received:', data);

                // Handle different response structures
                if (data.user) {
                    // Structure: { user: { profile: {...}, username, listings } }
                    const { username, listings = [], profile: profileData = {} } = data.user;

                    setProfile({
                        username,
                        listings,
                        ...profileData
                    });

                } else {
                    // Direct profile data
                    setProfile(data);
                }

                setLoading(false);
            } catch (err) {
                console.error('Profile fetch error:', err);
                setError('Failed to load profile: ' + err.message);
                setLoading(false);
            }
        };

        fetchProfile();


        // Define a cleanup function to handle component unmounting
        return () => {
            // This prevents state updates after unmounting
            setLoading(false);
        };
    }, [userId, currentUser, navigate]); // Only dependencies that should trigger refetch

    // Create a separate refresh function that doesn't cause rendering loops
    // const refreshProfile = () => {
    //     setLoading(true);
    //     getUserProfile(userId)
    //         .then(data => {
    //             if (data.user) {
    //                 const { username, listings, profile: profileData } = data.user;
    //                 setProfile({
    //                     username,
    //                     listings,
    //                     ...profileData
    //                 });
    //             } else {
    //                 setProfile(data);
    //             }
    //             setLoading(false);
    //         })
    //         .catch(err => {
    //             setError('Failed to refresh profile. ' + err.message);
    //             setLoading(false);
    //         });
    // };


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
                            <img
                                src={`${import.meta.env.VITE_BACK_END_SERVER_URL}${profile.profilePicture}`}
                                alt={`${profile.username}'s profile picture`}
                            />
                        ) : (
                            <div className={styles.defaultAvatar}>
                                {profile.username?.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>

                    {/* Cover photo (if you have one) */}
                    {profile.coverPhoto && (
                        <div className={styles.coverPhoto}>
                            <img
                                src={`${import.meta.env.VITE_BACK_END_SERVER_URL}${profile.coverPhoto}`}
                                alt="Cover"
                                onError={(e) => {
                                    console.log('Cover image failed to load:', profile.coverPhoto);
                                    e.target.style.display = 'none';
                                }}
                            />
                        </div>
                    )}

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

                        {/* Social links if available */}
                        {(profile.facebookLink || profile.twitterLink || profile.instagramLink) && (
                            <div className={styles.socialLinks}>
                                <h3>Social Media</h3>
                                {profile.facebookLink && (
                                    <a href={profile.facebookLink} target="_blank" rel="noopener noreferrer">Facebook</a>
                                )}
                                {profile.twitterLink && (
                                    <a href={profile.twitterLink} target="_blank" rel="noopener noreferrer">Twitter</a>
                                )}
                                {profile.instagramLink && (
                                    <a href={profile.instagramLink} target="_blank" rel="noopener noreferrer">Instagram</a>
                                )}
                            </div>
                        )}

                        {/* Conditional rendering based on profile ownership */}
                        {isOwnProfile ? (
                            // Show Edit Profile button if it's the user's own profile
                            <div className={styles.profileActions}>
                                <button
                                    className={styles.actionButton}
                                    onClick={() => navigate('/profile/edit')}
                                >
                                    Edit profile
                                </button>
                            
                            </div>
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
                                <div
                                    key={listing._id}
                                    className={styles.listingCard}
                                    onClick={() => navigate(`/listings/${listing._id}`)}
                                >
                                    {/* Use actual listing images if available */}
                                    {listing.images && listing.images.length > 0 ? (
                                        <img
                                            src={`${import.meta.env.VITE_BACK_END_SERVER_URL}${listing.images[0].path}`}
                                            alt={listing.title}
                                            className={styles.listingImage}
                                        />
                                    ) : (
                                        <div className={styles.listingImagePlaceholder}></div>
                                    )}
                                    <h3>{listing.title}</h3>
                                    <p>${listing.price}</p>
                                </div>
                            )) :
                            // Display message if no listings available
                            <p className={styles.noListings}>No listings available</p>
                        }

                        
                    </div>

                </section>
            </main>
        </div>
    );
}

export default UserProfile;