import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import * as listingService from "../../services/listingService.js";

const ListingDetails = () => {
  const { listingId } = useParams();

  const [listing, setListing] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      const listingData = await listingService.show(listingId);
      setListing(listingData);
    };

    fetchListing();
  }, [listingId]);

  if (!listing) {
    return <p>loading</p>;
  }

  return (
    <main>
      <section>
        <header>
          <h2>{listing.title}</h2>
          <h4>Category: {listing.category}</h4>
          <p>${listing.price}</p>
          <p>{`Listed on ${new Date(
            listing.createdAt
          ).toLocaleDateString()}`}</p>
        </header>
        <button>Message</button> <button>Save</button>
        <h4>Details</h4>
        <h5>Condition: {listing.condition}</h5>
        <p>{listing.description}</p>
        {listing.location}
        <h4>Seller Information</h4>
        <p>{listing.author.username}</p>
      </section>
      <Link to={`/listings/${listingId}/edit`}>Edit</Link>
    </main>
  );
};

export default ListingDetails;
