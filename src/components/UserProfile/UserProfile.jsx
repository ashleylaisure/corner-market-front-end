import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { getUserProfile } from "../../services/userService";
import styles from "./UserProfile.module.css";
import * as messageService from "../../services/messageService.js";
import defaultCoverPhoto from "../../assets/images/mats-hagwall-uzl47XdoLww-unsplash.jpg";
import defaultProfilePic from '../../assets/images/default-profile-picture.png';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';


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
                            e.target.onerror = null
                            e.target.src = defaultCoverPhoto
                        }}
                    />
                </div>
                <div className={styles.profileHeader}>
                    {/* ← LEFT COLUMN: grid of 4 areas */}
                    <div className={styles.profileSidebar}>
                        <div className={styles.profileGrid}>

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
                                        e.target.onerror = null
                                        e.target.src = defaultProfilePic
                                    }}
                                />
                            </div>

                            <div className={styles.profileTextInfo}>
                                <h3 className={styles.username}>{profile.username}</h3>
                                <div className={styles.locationInfo}>
                                    {profile.location?.city && profile.location?.state
                                        ? `${profile.location.city}, ${profile.location.state}`
                                        : "Not specified"}
                                </div>
                                <p className={styles.bio}>{profile.bio || ""}</p>
                            </div>

                            {/* 3) social links */}
                            <div className={styles.socialLinks}>
                                {profile.facebookLink && (
                                    <a href={profile.facebookLink} target="_blank" rel="noopener noreferrer">
                                        <i className="bx bxl-facebook-circle bxSocail"></i>
                                    </a>
                                )}
                                {profile.twitterLink && (
                                    <a href={profile.twitterLink} target="_blank" rel="noopener noreferrer">
                                        <i className="bx bxl-twitter bxSocail"></i>
                                    </a>
                                )}
                                {profile.instagramLink && (
                                    <a href={profile.instagramLink} target="_blank" rel="noopener noreferrer">
                                        <i className="bx bxl-instagram-alt bxSocail"></i>
                                    </a>
                                )}
                            </div>

                            {/* 4) action buttons */}
                            <div className={styles.profileActions}>
                                {isOwnProfile ? (
                                    <>
                                        <button className={styles.smallBtn} onClick={() => navigate("/profile/edit")}>
                                            <i className="bx bx-calendar-edit"></i>
                                            Edit profile
                                        </button>
                                        <button className={styles.smallBtn} onClick={() => navigate("/listings/new")}>
                                            <i className="bx bx-add-to-queue"></i>
                                            Create New Listing
                                        </button>
                                    </>
                                ) : (
                                    <button className={styles.smallBtn} onClick={handleStartConversation}>
                                        <i className="bx bxl-messenger bxDetails"></i>
                                        Message
                                    </button>
                                )}
                            </div>

                        </div>
                    </div>

                    {/* ← RIGHT COLUMN: map */}
                    {profile?.location?.coordinates?.lat && profile?.location?.coordinates?.lng && (
                        <div className={styles.profileMapWrapper}>
                            <MapContainer
                                center={[
                                    profile.location.coordinates.lat,
                                    profile.location.coordinates.lng,
                                ]}
                                zoom={12}
                                style={{ height: "250px", width: "100%", borderRadius : "1rem" }}
                                dragging={false}
                                scrollWheelZoom={false}
                                doubleClickZoom={false}
                                zoomControl={false}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution="&copy; OpenStreetMap contributors"
                                />
                                <Marker
                                    position={[
                                        profile.location.coordinates.lat,
                                        profile.location.coordinates.lng,
                                    ]}
                                />
                            </MapContainer>
                        </div>
                    )}

                </div>

                <div className={styles.sectionDivider} />

                {/* User’s listings */}
                <section className={styles.listingsSection}>
                    <h2 className={styles.listingsHeading}>
                        {isOwnProfile
                            ? "Your Listings"
                            : `${profile.username}'s Listings`}
                    </h2>

                    <div className={styles.listingsGrid}>
                        {profile.listings && profile.listings.length > 0 ? (
                            profile.listings.map((listing) => (
                                <div
                                    key={listing._id}
                                    className={styles.listingCard}
                                    onClick={() => navigate(`/listings/${listing._id}`)}
                                >
                                    {listing.images && listing.images.length > 0 ? (
                                        <div className={styles.listingImageCard}>
                                            <img
                                                src={`${import.meta.env.VITE_BACK_END_SERVER_URL}${listing.images[0].path}`}
                                                alt={listing.title}
                                                className={styles.listingImage}
                                            />
                                        </div>
                                    ) : (
                                        <div className={styles.noImagePlaceholder} />
                                    )}
                                    <div>
                                        <p>${listing.price}</p>
                                        <h2>{listing.title}</h2>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className={styles.noListings}>No listings available</p>
                        )}
                    </div>
                </section>
            </main>
        </div>
    )

};

export default UserProfile;
