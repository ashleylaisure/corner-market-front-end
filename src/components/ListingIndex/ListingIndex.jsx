import { Link } from 'react-router'
import styles from './ListingIndex.module.css'
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import * as listingService from '../../services/listingService';

const ListingIndex = ({ listings: initialListings }) => {
    const [listings, setListings] = useState(initialListings);
    const location = useLocation();

    useEffect(() => {
        const fetchLatest = async () => {
            const freshListings = await listingService.index();
            setListings(freshListings);
        };

        fetchLatest();
    }, [location.pathname]); // Refetch whenever route changes to "/"

    return (
        <div className={styles.indexBody}>
            <h4>Available Listings</h4>
            <main className={styles.container}>
                {listings.map((listing) => (
                    <Link key={listing._id} to={`/listings/${listing._id}`}>
                        <article className={styles.listingCard}>
                            {listing.images && listing.images.length > 0 ? (
                                <div className={styles.imageContainer}>
                                    {listing.images.map((img, idx) => (
                                        <img
                                            key={idx}
                                            src={`${import.meta.env.VITE_BACK_END_SERVER_URL}${img.path}`}
                                            alt={`Listing image ${idx}`}
                                            className={styles.listingImage}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className={styles.noImagePlaceholder}><h4>Image Placeholder</h4></div>
                            )}

                            <header>
                                <p className={styles.price}>${listing.price}</p>
                                <h2>{listing.title}</h2>
                                <h6 className={styles.metadata}>
                                    {`${listing.author?.username || 'Unknown'} posted on ${new Date(listing.createdAt).toLocaleDateString()}`}
                                </h6>
                            </header>
                        </article>
                    </Link>
                ))}
            </main>
        </div>
    );
};


export default ListingIndex;