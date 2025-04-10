import { useState, useEffect } from "react";
import { useParams } from "react-router";

import * as ListingService from "../../services/listingService.js";

const ListingForm = ({ handleAddListing, handleUpdateListing }) => {
  const { listingId } = useParams();
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

  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

//   const handleFileChange = (evt) => {
//     const files = Array.from(evt.target.files);
//     setFormData({ ...formData, images: files });
//   };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (listingId) {
      handleUpdateListing(listingId, formData);
    } else {
      handleAddListing(formData);
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
        {/* <label htmlFor="image-input">Upload Images:</label>
        <input
          required
          type="file"
          name="images"
          id="image-input"
          multiple
          accept="image/*"
          onChange={handleFileChange}
        /> */}
        {/* Display files */}
        <div>
          {formData.images.map((file, idx) => (
            <img
              key={idx}
              src={URL.createObjectURL(file)}
              alt={`Preview ${idx}`}
              style={{ maxWidth: "100px", marginRight: "8px" }}
            />
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
          <option value="Arts & Crafts">Arts & Crafts</option>
          <option value="Antiques & Collectables">
            Antiques & Collectables
          </option>
          <option value="Video Games">Video Games</option>
          <option value="Antiques & Collectables">
            Antiques & Collectables
          </option>
          <option value="Arts & Crafts">Arts & Crafts</option>
          <option value="Auto, Parts & Accessories">
            Auto, Parts & Accessories
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
