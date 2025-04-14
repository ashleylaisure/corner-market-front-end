import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router';
import * as listingService from '../../services/listingService.js'
import { useNavigate } from 'react-router'
import styles from './ListingDetails.module.css';

import { UserContext } from '../../contexts/UserContext.jsx'


const ListingDetails = (props) => {
    const { listingId } = useParams();

    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [listing, setListing] = useState(null);

    useEffect(() => {
        const fetchListing = async () => {
            const listingData = await listingService.show(listingId);
            setListing(listingData)
        }

        fetchListing();
    }, [listingId])

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

    if (!listing) return <main>Loading...</main>

    return (
        <main>
            <section>
                <header>
                    <h2>{listing.title}</h2>
                    <h4>Category: {listing.category}</h4>
                    <p>${listing.price}</p>
                    <p>{`Listed on ${new Date(listing.createdAt).toLocaleDateString()}`}</p>
                </header>
                {/* Listing Images */}
                <div className={styles.listingImages}>
                    {listing.images && listing.images.length > 0 ? (
                        <div className={styles.imageGrid}>
                            {listing.images.map((img, idx) => (
                                <div key={idx} className={styles.imageWrapper}>
                                    <img
                                        src={`${import.meta.env.VITE_BACK_END_SERVER_URL}${img.path}`}
                                        alt={`Listing image ${idx}`}
                                        className={styles.listingImage}
                                    />
                                    {user && listing.author._id === user._id && (
                                        <button
                                            className={styles.deleteImageButton}
                                            onClick={async () => {
                                                try {
                                                    await listingService.deleteListingImage(listing._id, idx);
                                                    const updated = await listingService.show(listing._id);
                                                    setListing(updated); // refresh state with updated listing
                                                } catch (err) {
                                                    console.error("Failed to delete image:", err);
                                                }
                                            }}
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className={styles.noImagePlaceholder}>No image available</div>
                    )}
                </div>

                <button>Message</button>
                <button>Save</button>

                <h4>Details</h4>
                <h5>Condition: {listing.condition}</h5>
                <p>{listing.description}</p>

                <p>{listing.location}</p>

                {/* Only show seller information if the viewer is NOT the seller */}
                {listing.author._id !== user?._id && (
                    <>
                        <h4>Seller Information</h4>
                        {user ? (
                            <Link to={`/users/${listing.author._id}`}>
                                {listing.author.username}'s Profile
                            </Link>
                        ) : (
                            <p>
                                Log in to see {listing.author.username}'s profile!
                            </p>
                        )}
                    </>
                )}

                {/* Show Edit & Delete buttons if the user owns the listing */}
                {user && listing.author._id === user._id && (
                    <>
                        <button onClick={handleDelete}>Delete</button>
                        <button onClick={() => navigate(`/listings/${listingId}/edit`)}>Edit</button>
                    </>
                )}
            </section>
        </main>
    );
}


export default ListingDetails;
