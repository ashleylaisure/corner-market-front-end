import { Link } from 'react-router'
import styles from './ListingIndex.module.css'


const ListingIndex = (props) => {

    return (
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
                            <div className={styles.noImagePlaceholder}></div>
                        )}

                        <header>
                            <h2>{listing.title}</h2>
                            <p className={styles.price}>${listing.price}</p>
                            <p className={styles.metadata}>
                                {`${listing.author?.username || 'Unknown'} posted on ${new Date(listing.createdAt).toLocaleDateString()}`}
                            </p>
                        </header>
                        <p className={styles.description}>{listing.description}</p>
                    </article>
                </Link>
            ))}
        </main>
    )
}


export default ListingIndex;