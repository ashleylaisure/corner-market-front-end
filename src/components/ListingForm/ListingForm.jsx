import { useState, useEffect } from "react";
import { useParams } from "react-router";
import styles from './ListingForm.module.css';

import * as ListingService from "../../services/listingService.js";

const ListingForm = ({ handleAddListing, handleUpdateListing }) => {
  const { listingId } = useParams();
  const [imagePreview, setImagePreview] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    images: [],
    price: 9999,
    category: "",
    condition: "",
    description: "",
    location: "",
  });

  useEffect(() => {
    const fetchListing = async () => {
      const listingData = await ListingService.show(listingId);
      setFormData(listingData);
    };
    if (listingId) {
      fetchListing();
    } else {
      setFormData({
        title: "",
        images: [],
        price: 9999,
        category: "",
        condition: "",
        description: "",
        location: "",
      });
    }
  }, [listingId]);

  // Second useEffect to clean up image preview URLs when component unmounts
  // also runs when the imagePreview array changes, ensuring any old previews are cleaned up
  useEffect(() => {
    return () => {
      imagePreview.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imagePreview]);

  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  // Handle file selection
  const handleFileChange = (evt) => {
    const files = Array.from(evt.target.files);
    setFormData({ ...formData, images: files });

    const previewURLs = files.map((file) => URL.createObjectURL(file));
    setImagePreview(previewURLs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    for (const key in formData) {
      if (key === "images") {
        formData.images.forEach((file) => formDataToSend.append("images", file));
      } else {
        formDataToSend.append(key, formData[key]);
      }
    }

    if (listingId) {
      await handleUpdateListing(listingId, formDataToSend);
    } else {
      await handleAddListing(formDataToSend);
    }
  };

  return (
    <main>
      <h1>{listingId ? "Edit Listing" : "New Listing"}</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title-input">Title:</label>
        <input
          required
          type="text"
          name="title"
          id="title-input"
          value={formData.title}
          onChange={handleChange}
        />
        <label htmlFor="image-input">Upload Images:</label>
        <input
          type="file"
          name="images"
          id="image-input"
          multiple
          accept="image/*"
          onChange={handleFileChange}
        />

        {/* Display image previews */}
        <div className={styles.imagePreview}>
          {imagePreview.map((url, idx) => (
            <div key={idx} className={styles.previewItem}>
              <img
                src={url}
                alt={`Preview ${idx}`}
                className={styles.previewImage}
              />
              <button
                type="button"
                className={styles.removeButton}
                onClick={() => {
                  const newImages = [...formData.images];
                  newImages.splice(idx, 1);
                  setFormData({ ...formData, images: newImages });

                  const newPreviews = [...imagePreview];
                  URL.revokeObjectURL(newPreviews[idx]);
                  newPreviews.splice(idx, 1);
                  setImagePreview(newPreviews);
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <label htmlFor="price-input">Price</label>
        <input
          required
          type="number"
          name="price"
          id="price-input"
          value={formData.price}
          onChange={handleChange}
        />
        <label htmlFor="category-input">Select a Category:</label>
        <select
          required
          name="category"
          id="category-input"
          value={formData.category}
          onChange={handleChange}
        >
          <option value="" disabled>
            -- Select Category --
          </option>
          <option value="Video Games">Video Games</option>
          <option value="Antiques & Collectables">
            Antiques & Collectables
          </option>
          <option value="Arts & Crafts">Arts & Crafts</option>
          <option value="Auto Parts & Accessories">
            Auto Parts & Accessories
          </option>
          <option value="Baby Products">Baby Products</option>
          <option value="Books, Movies & Music">Books, Movies & Music</option>
          <option value="Cell Phones & Accessories">
            Cell Phones & Accessories
          </option>
          <option value="Clothing & Accessories">Clothing & Accessories</option>
          <option value="Electronics">Electronics</option>
          <option value="Furniture">Furniture</option>
          <option value="Health & Beauty">Health & Beauty</option>
          <option value="Home & Kitchen">Home & Kitchen</option>
          <option value="Jewelry & Watches">Jewelry & Watches</option>
          <option value="Musical Instruments">Musical Instruments</option>
          <option value="Office Supplies">Office Supplies</option>
          <option value="Patio & Garden">Patio & Garden</option>
          <option value="Pet Supplies">Pet Supplies</option>
          <option value="Sporting Goods">Sporting Goods</option>
          <option value="Tools & Home Improvement">
            Tools & Home Improvement
          </option>
          <option value="Toys & Games">Toys & Games</option>
          <option value="Travel & Luggage">Travel & Luggage</option>
          <option value="Miscellaneous">Miscellaneous</option>
        </select>
        <label htmlFor="condition-input">Condition:</label>
        <select
          required
          name="condition"
          id="condition-input"
          value={formData.condition}
          onChange={handleChange}
        >
          <option value="" disabled>
            -- Select Condition --
          </option>
          <option value="New">New</option>
          <option value="Used - Like New">Used - Like New</option>
          <option value="Used - Good">Used - Good</option>
          <option value="Used - Fair">Used - Fair</option>
        </select>
        <label htmlFor="description-input">Description:</label>
        <input
          required
          maxLength={500}
          type="text"
          name="description"
          id="description-input"
          value={formData.description}
          onChange={handleChange}
        />
        <button type="submit">SUBMIT</button>
      </form>
    </main>
  );
};

export default ListingForm;
