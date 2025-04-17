import { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router";
import * as listingService from "../../services/listingService.js";
import defaultProfilePic from "../../assets/images/default-profile-picture.png";
import styles from "./ListingDetails.module.css";
import DetailsImageSlider from "../DetailsImageSlider/DetailsImageSlider.jsx";
import { MapContainer, TileLayer, Circle } from 'react-leaflet';


import { UserContext } from "../../contexts/UserContext.jsx";
import * as messageService from "../../services/messageService.js";

const ListingDetails = (props) => {
    const { listingId } = useParams();

    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [listing, setListing] = useState(null);

    useEffect(() => {
        const fetchListing = async () => {
            const listingData = await listingService.show(listingId);

            setListing(listingData);
        };

        fetchListing();
    }, [listingId]);

    const handleDelete = async () => {
        try {
            await props.handleDeleteListing(listingId); // calls the API + removes from global listings
            if (props.onListingDeleted) {
                props.onListingDeleted(listingId); // removes from profile listings state
            }
            navigate(`/users/${user._id}`); // go back to your profile
        } catch (err) {
            console.error("Failed to delete listing:", err);
        }
    };

    const handleStartConversation = async () => {
        try {
            const conversation = await messageService.createOrGetConversation(
                user._id,
                listing.author._id
            );
            navigate(`/messages/${conversation._id}`);
        } catch (err) {
            console.error("Failed to start conversation:", err);
        }
    };

    if (!listing) return <main>Loading...</main>;

    return (
        <main className={styles.container}>
            {/* Listing Images */}
            <div className={styles.listingImages}>
                {listing.images && listing.images.length > 0 ? (
                    <DetailsImageSlider images={listing.images} />
        
                ) : (
                    <div className={styles.noImagePlaceholder}>No image available</div>
                )}
            </div>

            <section className={styles.detailsInfo}>
                <header>
                    <div>
                        <h2>{listing.title}</h2>
                        <h4>Category: {listing.category}</h4>
                    </div>

                    <div>
                        <p>${listing.price}</p>
                        <h6>{`Listed on ${new Date(
                            listing.createdAt
                        ).toLocaleDateString()}`}</h6>
                    </div>
                </header>

                <div >
                    {user && listing.author._id !== user._id && (
                        <div className={styles.detailLinks}>
                            <div className={styles.links} onClick={handleStartConversation}>
                                <i className="bx bxl-messenger bxDetails"></i>
                                <p>Message</p>
                            </div>
                            <div className={styles.links}>
                                <i className="bx bxs-save bxDetails"></i>
                                <p>Save</p>
                            </div>
                        </div>

                    )}


                </div>
                <div>
                    <h6>Condition: {listing.condition}</h6>
                    <p>{listing.description}</p>
                </div>

                <p>{listing.location}</p>

                <div className={styles.sectionDivider}></div>

                {listing.author.profile?.location?.coordinates && (
                    <div className={styles.mapWrapper}>
                        <MapContainer
                            center={[
                                listing.author.profile.location.coordinates.lat,
                                listing.author.profile.location.coordinates.lng,
                            ]}
                            zoom={12}
                            scrollWheelZoom={true}
                            style={{ height: "250px", width: "100%", borderRadius: "8px", marginBottom: "1rem" }}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution="&copy; OpenStreetMap contributors"
                            />
                            <Circle
                                center={[
                                    listing.author.profile.location.coordinates.lat,
                                    listing.author.profile.location.coordinates.lng,
                                ]}
                                radius={2000} // ~2km for approximate location
                                pathOptions={{
                                    color: "gray",
                                    fillColor: "lightgray",
                                    fillOpacity: 0.3,
                                }}
                            />
                        </MapContainer>
                    </div>
                )}
                <div className={styles.locationText}>
                    <h5>
                        {listing.author.profile?.location?.city}, {listing.author.profile?.location?.state}
                    </h5>
                    <p className={styles.approxNote}>Location is approximate</p>
                </div>

                {/* Only show seller information if the viewer is NOT the seller */}
                {listing.author._id !== user?._id && (
                    <div className={styles.seller}>
                        <h4>Seller Information</h4>
                        {user ? (
                            <div className={styles.sellerLink}>
                                <img
                                    src={
                                        listing.author.profile?.profilePicture
                                            ? `${import.meta.env.VITE_BACK_END_SERVER_URL}${listing.author.profile.profilePicture}`
                                            : defaultProfilePic
                                    }
                                    alt={`${listing.author.username}'s profile`}
                                    className={styles.sellerImage}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = defaultProfilePic;
                                    }}
                                />
                                <Link to={`/users/${listing.author._id}`}>
                                    {listing.author.username}'s Profile
                                </Link>
                            </div>
                        ) : (
                            <p>Log in to see {listing.author.username}'s profile!</p>
                        )}
                    </div>
                )}

                {/* Show Edit & Delete buttons if the user owns the listing */}
                {user && listing.author._id === user._id && (
                    <div className={styles.detailLinks}>
                        <div className={styles.links} onClick={handleDelete}>
                            <i className="bx bx-task-x bxDetails"></i>
                            <p>Delete</p>
                        </div>

                        <div
                            className={styles.links}
                            onClick={() => navigate(`/listings/${listingId}/edit`)}
                        >
                            <i className="bx bx-calendar-edit bxDetails"></i>
                            <p>Edit</p>
                        </div>
                    </div>
                )}
            </section>
        </main>
    );
};

export default ListingDetails;
