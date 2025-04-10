import { useContext, useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router";
import { UserContext } from "./contexts/UserContext";

import NavBar from "./components/NavBar/NavBar";
import SignUpForm from "./components/SignUpForm/SignUpForm";
import SignInForm from "./components/SignInForm/SignInForm";
import Landing from "./components/Landing/Landing";
import Dashboard from "./components/Dashboard/Dashboard";

import ListingIndex from "./components/ListingIndex/ListingIndex.jsx";
import ListingDetails from "./components/ListingDetails/ListingDetails.jsx";
import ListingForm from "./components/ListingForm/ListingForm.jsx";

import * as listingService from "./services/listingService.js";

const App = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchAllListings = async () => {
      const listingData = await listingService.index();

      // console.log('listingData', listingData)
      setListings(listingData);
    };
    fetchAllListings();
  }, [user]);

  const handleAddListing = async (listingFormData) => {
    const newListing = await listingService.create(listingFormData);
    setListings([newListing, ...listings]);
    navigate("/");
  };

  const handleUpdateListing = async (listingId, listingFormData) => {
    const updatedListing = await listingService.update(
      listingId,
      listingFormData
    );
    setListings(
      listings.map((listing) =>
        listingId === listing._id ? updatedListing : listing
      )
    );
    navigate(`/listings/${listingId}`);
  };

  return (
    <>
      <NavBar />
      <Routes>
        {/* <Route path='/' element={user ? <Dashboard /> : <Landing />} /> */}

        <Route path="/" element={<ListingIndex listings={listings} />} />
        {/* <Route path='/listings' element={<ListingIndex listings={listings}/>}></Route> */}
        <Route
          path="/listings/new"
          element={<ListingForm handleAddListing={handleAddListing} />}
        ></Route>
        <Route
          path="/listings/:listingId/edit"
          element={<ListingForm handleUpdateListing={handleUpdateListing} />}
        />
        <Route path="/sign-up" element={<SignUpForm />} />
        <Route path="/sign-in" element={<SignInForm />} />

        <Route path="/listings/:listingId" element={<ListingDetails />}></Route>
      </Routes>
    </>
  );
};

export default App;
