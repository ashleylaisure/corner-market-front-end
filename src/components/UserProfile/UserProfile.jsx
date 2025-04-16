import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { getUserProfile } from "../../services/userService";
import styles from "./UserProfile.module.css";
import * as messageService from "../../services/messageService.js";
import defaultCoverPhoto from "../../assets/images/paul-povoroznuk-bJkynpjVRBQ-unsplash.jpg";
import defaultProfilePic from '../../assets/images/default-profile-picture.png';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';


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
            navigate("/sign-in");
            return;
        }

        const fetchProfile = async () => {
            try {
                setLoading(true);
                const data = await getUserProfile(userId);
                console.log("Profile data received:", data);

                // Handle different response structures
                if (data.user) {
                    // Structure: { user: { profile: {...}, username, listings } }
                    const {
                        username,
                        listings = [],
                        profile: profileData = {},
                    } = data.user;

                    setProfile({
                        username,
                        listings,
                        ...profileData,
                    });
                } else {
                    // Direct profile data
                    setProfile(data);
                }

                setLoading(false);
            } catch (err) {
                console.error("Profile fetch error:", err);
                setError("Failed to load profile: " + err.message);
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

    const handleStartConversation = async () => {
        try {
            const conversation = await messageService.createOrGetConversation(
                currentUser._id,
                userId
            );

            navigate(`/messages/${conversation._id}`);
        } catch (err) {
            console.error("Failed to start conversation:", err);
        }
    };

    if (loading) return <div>Loading profile...</div>;
    if (error) return <div className={styles.error}>{error}</div>;
    if (!profile) return <div>Profile not found.</div>;

    return (
        <div className={styles.container}>
            <main className={styles.profileContent}>
                {/* Cover photo (fallback included) */}
                <div className={styles.coverPhoto}>
                    <img
                        src={
                            profile?.coverPhoto
                                ? `${import.meta.env.VITE_BACK_END_SERVER_URL}${profile.coverPhoto}`
                                : defaultCoverPhoto
                        }
                        alt="Cover"
                        className={styles.coverPhoto}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = defaultCoverPhoto;
                        }}
                    />
                </div>

                {/* Profile header with user image and info */}
                <div className={styles.profileHeader}>
                    <div className={styles.profilePicture}>
                        <img
                            src={
                                profile?.profilePicture
                                    ? `${import.meta.env.VITE_BACK_END_SERVER_URL}${profile.profilePicture}`
                                    : defaultProfilePic
                            }
                            alt={`${profile.username}'s profile picture`}
                            className={styles.profileImage}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = defaultProfilePic;
                            }}
                        />
                    </div>

                    {/* User information section */}
                    <div className={styles.profileInfo}>
                        <div className={styles.socialLinks}>
                            {/* Social links if available */}
                            {(profile.facebookLink ||
                                profile.twitterLink ||
                                profile.instagramLink) && (
                                    <div>
                                        {/* <h3>Social Media</h3> */}
                                        {profile.facebookLink && (
                                            <a
                                                href={profile.facebookLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <i className="bx bxl-facebook-circle bxSocail"></i>
                                            </a>
                                        )}
                                        {profile.twitterLink && (
                                            <a
                                                href={profile.twitterLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <i className="bx bxl-twitter bxSocail"></i>
                                            </a>
                                        )}
                                        {profile.instagramLink && (
                                            <a
                                                href={profile.instagramLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <i className="bx bxl-instagram-alt bxSocail"></i>
                                            </a>
                                        )}
                                    </div>
                                )}
                        </div>

                        <div>
                            <h2 className={styles.username}>{profile.username}</h2>

                            <div className={styles.locationInfo}>
                                {/* <h5>Location</h5> */}
                                <h5>
                                    {profile.location?.city && profile.location?.state
                                        ? `${profile.location.city}, ${profile.location.state}`
                                        : "Not specified"}
                                </h5>
                            </div>

                            {/* Bio section with fallback for empty bio */}
                            {/* <h3>Bio</h3> */}
                            <p className={styles.bio}>{profile.bio || ""}</p>
                        </div>

                        <div className={styles.profileActions}>
                            {/* Conditional rendering based on profile ownership */}
                            {isOwnProfile ? (
                                // Show Edit Profile button if it's the user's own profile
                                <div className={styles.profileActions}>
                                    <button
                                        className="btn"
                                        onClick={() => navigate("/profile/edit")}
                                    >
                                        <i className="bx bx-calendar-edit"></i>
                                        Edit profile
                                    </button>
                                </div>
                            ) : (
                                // Show Message button if viewing someone else's profile
                                <div className={styles.links} onClick={handleStartConversation}>
                                    <i className="bx bxl-messenger bxDetails"></i>
                                    <p>Message</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {profile?.location?.coordinates?.lat && profile?.location?.coordinates?.lng && (
                    <div className={styles.staticMap}>
                        <MapContainer
                            center={[profile.location.coordinates.lat, profile.location.coordinates.lng]}
                            zoom={12}
                            style={{ height: "300px", width: "100%" }}
                            dragging={false}
                            scrollWheelZoom={false}
                            doubleClickZoom={false}
                            zoomControl={false}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution="&copy; OpenStreetMap contributors"
                            />
                            <Marker position={[profile.location.coordinates.lat, profile.location.coordinates.lng]} />
                        </MapContainer>
                    </div>
                )}

                <div className={styles.sectionDivider}></div>

                {/* User's listings section */}
                <section className={styles.listingsSection}>
                    <h2 className={styles.listingsHeading}>
                        {isOwnProfile ? "Your Listings" : `${profile.username}'s Listings`}
                    </h2>

                    {/* Grid of listings with conditional rendering */}
                    <div className={styles.listingsGrid}>
                        {/* Check if user has listings */}

                        {profile.listings && profile.listings.length > 0 ? (
                            // Map through the listings array to create listing cards
                            profile.listings.map((listing) => (
                                <div
                                    key={listing._id}
                                    className={styles.listingCard}
                                    onClick={() => navigate(`/listings/${listing._id}`)}
                                >
                                    {/* Use actual listing images if available */}
                                    {listing.images && listing.images.length > 0 ? (
                                        <img
                                            src={`${import.meta.env.VITE_BACK_END_SERVER_URL}${listing.images[0].path
                                                }`}
                                            alt={listing.title}
                                            className={styles.listingImage}
                                        />
                                    ) : (
                                        <div className={styles.noImagePlaceholder}></div>
                                    )}
                                    <div>
                                        <p>${listing.price}</p>
                                        <h2>{listing.title}</h2>
                                    </div>
                                </div>
                            ))
                        ) : (
                            // Display message if no listings available
                            <p className={styles.noListings}>No listings available</p>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default UserProfile;
