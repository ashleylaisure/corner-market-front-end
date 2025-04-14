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
        <main className={styles.container}>
            <section className={styles.listingImages}>
                {/* Listing Images */}
                {listing.images && listing.images.length > 0 ? (
                    <div className={styles.mainImage}>
                        <img
                            src={`${import.meta.env.VITE_BACK_END_SERVER_URL}${listing.images[0].path}`} 
                            alt={listing.title}
                        />
                    </div>
                ) : (
                    <div className={styles.noImagePlaceholder}>No image available</div>
                )}
            </section>

            <section className={styles.detailsInfo}>
                <header>
                    <div>
                        <h2>{listing.title}</h2>
                        <h4>Category: {listing.category}</h4>
                    </div>
                    
                    <div>
                        <p>${listing.price}</p>
                        <h6>{`Listed on ${new Date(listing.createdAt).toLocaleDateString()}`}</h6>
                    </div>
                    
                </header>

                <div className={styles.detailLinks}>
                    <div className={styles.links}>
                        <i className='bx bxl-messenger bxDetails'></i>
                        <p>Message</p>
                    </div>

                    <div className={styles.links}>
                        <i className='bx bxs-save bxDetails'></i>
                        <p>Save</p>
                    </div>
                </div>
                <div>
                    <h4>Details:</h4>
                    <h5>Condition: {listing.condition}</h5>
                </div>
                
                <p>{listing.description}</p>

                <p>{listing.location}</p>

                <div className={styles.sectionDivider}></div>

                {/* Only show seller information if the viewer is NOT the seller */}
                {listing.author._id !== user?._id && (
                    <div className={styles.seller}>
                        <h4>Seller Information</h4>
                        {user ? (
                            <div className={styles.sellerLink}>
                                <i className='bx bxs-face'></i>
                                <Link to={`/users/${listing.author._id}`}>
                                    {listing.author.username}'s Profile
                                </Link>
                            </div>
                            
                        ) : (
                            <p>
                                Log in to see {listing.author.username}'s profile!
                            </p>
                        )}
                    </div>
                )}

                

                {/* Show Edit & Delete buttons if the user owns the listing */}
                {user && listing.author._id === user._id && (
                    <div className={styles.detailLinks}>
                    
                        <div className={styles.links} onClick={handleDelete}>
                            <i className='bx bx-task-x bxDetails'></i>
                            <p>Delete</p>
                        </div>

                        <div className={styles.links} onClick={() => navigate(`/listings/${listingId}/edit`)}>
                        <i className='bx bx-calendar-edit bxDetails'></i>
                            <p>Edit</p>
                        </div>
                    </div>
                )}

            </section>

        </main>
    );
}


export default ListingDetails;
