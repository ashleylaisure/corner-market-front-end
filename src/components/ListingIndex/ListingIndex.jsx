import { Link, useParams } from 'react-router'
import styles from './ListingIndex.module.css'
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import * as listingService from '../../services/listingService';

import Aside from "../Aside/Aside.jsx";

const ListingIndex = ({ listings: initialListings }) => {
    const [listings, setListings] = useState(initialListings);
    const location = useLocation();

    const {category} = useParams();
    
    const [filteredListing, setFilteredListing] = useState(null)

    const listingsToRender = category ? (filteredListing || []) : listings;
    

    useEffect(() => {
        const fetchLatest = async () => {
            const freshListings = await listingService.index();
            setListings(freshListings);
        };

        fetchLatest();
    }, [location.pathname]); // Refetch whenever route changes to "/"

    useEffect(() => {
        const fetchFilteredListings = async () => {
            const filteredData = await listingService.getByCategory(category)
            setFilteredListing(filteredData)
        }
        if (category) fetchFilteredListings()
    }, [category])

    // console.log('fitleredData', filteredListing)
    // console.log('listings', listings)

    return (
        <div className={styles.listingContainer}>

        <Aside />

        <div className={styles.indexBody}>

            {category ? (<h4>Category: {decodeURIComponent(category)}</h4>)
                : (<h4>Available Listings</h4>) }
            
            <main>
                {listingsToRender && listingsToRender.length > 0 ? (
                    <div className={styles.container}>
                        {listingsToRender.map((listing) => (
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
                    </div>
                    ) : (<h4>No Listings Found</h4>)
                }
                
            </main>
        </div>
    </div>
    );
};


export default ListingIndex;