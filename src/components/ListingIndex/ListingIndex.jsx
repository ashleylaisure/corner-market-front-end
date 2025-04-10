import { Link } from 'react-router'
import styles from './ListingIndex.module.css'

const ListingIndex = (props) => {

    return (
        <main className={styles.container}>
            {props.listings.map((listing) => (
                <Link key={listing._id} to={`/listings/${listing._id}`}>
                    <article>
                        <header>
                            <h2>{listing.title}</h2>
                            <p>
                                {`${listing.author?.username || 'Unknown'} posted on ${new Date(listing.createdAt).toLocaleDateString()}`}
                            </p>
                        </header>
                        <p>{listing.description}</p>
                    </article>
                </Link>
            ))}
        </main>

    )
}

export default ListingIndex;