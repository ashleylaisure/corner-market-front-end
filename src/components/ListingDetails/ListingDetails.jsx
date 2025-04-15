import { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router";
import * as listingService from "../../services/listingService.js";
import styles from "./ListingDetails.module.css";

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
                        await listingService.deleteListingImage(
                          listing._id,
                          idx
                        );
                        const updated = await listingService.show(listing._id);
                        setListing(updated); // refresh state with updated listing
                      } catch (err) {
                        console.error("Failed to delete image:", err);
                      }
                    }}
                  >
                    <i className="bx bx-x"></i>
                  </button>
                )}
              </div>
            ))}
          </div>
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

        <div className={styles.detailLinks}>
          {user && listing.author._id !== user._id && (
            <div className={styles.links} onClick={handleStartConversation}>
              <i className="bx bxl-messenger bxDetails"></i>
              <p>Message</p>
            </div>
          )}

          <div className={styles.links}>
            <i className="bx bxs-save bxDetails"></i>
            <p>Save</p>
          </div>
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
                <i className="bx bxs-face"></i>
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
