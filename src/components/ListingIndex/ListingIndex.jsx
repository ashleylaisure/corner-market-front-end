import { Link, useParams } from 'react-router'
import styles from './ListingIndex.module.css'
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import * as listingService from '../../services/listingService';
import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';


import Aside from "../Aside/Aside.jsx";

const ListingIndex = ({ listings: initialListings }) => {
    const [listings, setListings] = useState(initialListings);
    const location = useLocation();

    const { category } = useParams();
    const { user } = useContext(UserContext);

    const [locationFilter, setLocationFilter] = useState(null);
    const [nearbyListings, setNearbyListings] = useState(null);
    // const [loadingNearby, setLoadingNearby] = useState(true);
    const [categoryListings, setCategoryListings] = useState(null);

    const listingsToRender = category
        ? categoryListings
        : user && nearbyListings !== null
            ? nearbyListings
            : !user
                ? listings // show all listings for guests
                : []; // while waiting for nearbyListings to load


    // Effect to fetch all listings when component mounts
    useEffect(() => {
        const fetchLatest = async () => {
            const freshListings = await listingService.index();
            setListings(freshListings);
        };

        fetchLatest();
    }, [location.pathname]); // Refetch whenever route changes to "/"


    // useEffect to reset filtered listings when category changes
    useEffect(() => {
        if (!category && location.pathname === "/") {

            setCategoryListings(null);
        }
    }, [category, location.pathname]);


    //   Effect to fetch listings by category
    useEffect(() => {
        const fetchCategoryListings = async () => {
            if (category) {
                const filtered = await listingService.getByCategory(category);
                setCategoryListings(filtered);
            } else {
                setCategoryListings(null);
            }
        };

        fetchCategoryListings();
    }, [category]);



    // Effect to set location filter based on user profile
    useEffect(() => {
        const coords = user?.profile?.location?.coordinates;

        if (
            coords &&
            typeof coords.lat === "number" &&
            typeof coords.lng === "number"
        ) {
            setLocationFilter({
                lat: coords.lat,
                lng: coords.lng,
                radius: 10,
            });
        }
    }, [user]);


    // Effect to fetch nearby listings based on location filter
    useEffect(() => {
        const fetchNearby = async () => {
            const { lat, lng, radius } = locationFilter || {};
            const isValid = typeof lat === "number" && typeof lng === "number" && typeof radius === "number";

            if (!isValid) return;

            try {
                const nearby = await listingService.getNearbyListings(locationFilter);

                const validListings = Array.isArray(nearby)
                    ? nearby.filter(l => l.location?.coordinates && l.author?._id !== user?._id)
                    : [];

                setNearbyListings(validListings);
            } catch (err) {
                console.error("Error fetching nearby listings:", err);
            }
        };

        fetchNearby();
    }, [locationFilter, user]);


    return (
        <div className={styles.listingContainer}>

        <Aside />

        <div className={styles.indexBody}>

            {category ? (<h4>Category: {decodeURIComponent(category)}</h4>)
                : (<h4>Available Listings</h4>)}

            <main>
                {user && !category && nearbyListings === null ? (
                    <h4>Loading nearby listings...</h4>
                ) : Array.isArray(listingsToRender) && listingsToRender.length > 0 ? (
                    <div className={styles.container}>
                        {listingsToRender.map((listing) => (
                            <Link key={listing._id} to={`/listings/${listing._id}`}>
                                <article className={styles.listingCard}>
                                    {/* Images */}
                                    {listing.images?.length > 0 ? (
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
                                        <div className={styles.noImagePlaceholder}>
                                            <h4>Image Placeholder</h4>
                                        </div>
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
                ) : (
                    <h4>No Listings Found</h4>
                )}
            </main>

        </div>
    </div>
    );
};


export default ListingIndex;