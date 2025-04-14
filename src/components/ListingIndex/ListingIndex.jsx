import { Link } from 'react-router'
import styles from './ListingIndex.module.css'


const ListingIndex = (props) => {

    return (

        <div className={styles.indexBody}>
            <h4>Available Listings</h4>
            <main className={styles.container}>
                {props.listings.map((listing) => (
                    <Link key={listing._id} to={`/listings/${listing._id}`}>
                        <article className={styles.listingCard}>
                            {/* Display the first image if available */}
                            {listing.images && listing.images.length > 0 ? (
                                <div className={styles.imageContainer}>
                                 {listing.images?.map((img, idx) => (
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
                            {/* <p className={styles.description}>{listing.description}</p> */}
                        </article>
                    </Link>
                ))}
            </main>
        </div>
    )
}


export default ListingIndex;