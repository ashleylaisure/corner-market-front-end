import { useContext, useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router";
import { UserContext } from "./contexts/UserContext";
import { LocationFilterContext } from "./contexts/LocationFilterContext";

import NavBar from "./components/NavBar/NavBar";
import SignUpForm from "./components/SignUpForm/SignUpForm";
import SignInForm from "./components/SignInForm/SignInForm";
// import Landing from "./components/Landing/Landing";
// import Dashboard from "./components/Dashboard/Dashboard";

import UserProfile from "./components/UserProfile/UserProfile";
import ProfileForm from "./components/ProfileForm/ProfileForm";

import "boxicons/css/boxicons.min.css";

import ListingIndex from "./components/ListingIndex/ListingIndex.jsx";
import ListingDetails from "./components/ListingDetails/ListingDetails.jsx";
import ListingForm from "./components/ListingForm/ListingForm.jsx";

import UserConversations from "./components/UserConversations/UserConversations.jsx";
import ConversationDetails from "./components/ConversationDetails/ConversationDetails.jsx";

import * as listingService from "./services/listingService.js";
import { getUserProfile } from './services/userService';
import { IoGitMerge } from "react-icons/io5";
import LocationFilterPage from "./components/LocationFilterPage/LocationFilterPage.jsx";

const App = () => {
  const { user, setUser } = useContext(UserContext);
  const { locationFilter, setLocationFilter } = useContext(LocationFilterContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState(null);
  const [listings, setListings] = useState([]);


  const handleDeleteListing = async (listingId) => {
    const deletedListing = await listingService.deleteListing(listingId);

    // Remove from homepage listing index
    setListings((prev) =>
      prev.filter((listing) => listing._id !== deletedListing._id)
    );

    // Also remove from current user's profile (if loaded)
    setProfile((prev) => {
      if (!prev || !prev.listings) return prev;
      return {
        ...prev,
        listings: prev.listings.filter((l) => l._id !== deletedListing._id),
      };
    });

    return deletedListing;
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user && !user.profile) {
        const fullData = await getUserProfile(user._id);
        setUser((prevUser) => ({
          ...prevUser,
          profile: fullData.user.profile,
        }));
      }
    };

    fetchUserProfile();
  }, [user, setUser]);

  // Set location filter based on user's profile location
  useEffect(() => {
    const profileLoc = user?.profile?.location;
    const currentUserId = user?._id;
    const lastUserId = localStorage.getItem("lastUser");
    const savedFilter = localStorage.getItem("cm_locationFilter");

    if (
      profileLoc?.coordinates?.lat &&
      profileLoc?.coordinates?.lng &&
      profileLoc?.city &&
      profileLoc?.state &&
      currentUserId
    ) {
      const newFilter = {
        lat: profileLoc.coordinates.lat,
        lng: profileLoc.coordinates.lng,
        radius: 10,
        city: profileLoc.city,
        state: profileLoc.state,
      };

      const isSame =
        locationFilter &&
        locationFilter.lat === newFilter.lat &&
        locationFilter.lng === newFilter.lng &&
        locationFilter.radius === newFilter.radius &&
        locationFilter.city === newFilter.city &&
        locationFilter.state === newFilter.state;

      const shouldUpdate =
        // No existing filter
        !locationFilter ||
        // New user logged in
        currentUserId !== lastUserId ||
        // Saved filter is missing or corrupted
        !savedFilter;

      if (shouldUpdate && !isSame) {
        setLocationFilter(newFilter);
        localStorage.setItem("lastUser", currentUserId);
      }
    }
  }, [user, locationFilter, setLocationFilter]);


  useEffect(() => {
    const fetchAllListings = async () => {
      const listingData = await listingService.index();

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

      <main className="bodyGrid">

        <div>
          <Routes>
            <Route
              path="/"
              element={<ListingIndex listings={listings} key={location.pathname} />}
            />
            <Route
              path="/listings/new"
              element={<ListingForm handleAddListing={handleAddListing} />}
            ></Route>
            <Route
              path="/listings/:listingId/edit"
              element={
                <ListingForm handleUpdateListing={handleUpdateListing} />
              }
            />
            <Route path="/sign-up" element={<SignUpForm />} />
            <Route path="/sign-in" element={<SignInForm />} />
            <Route path="/location-filter" element={<LocationFilterPage />} />
            <Route
              path="/listings/:listingId"
              element={
                <ListingDetails handleDeleteListing={handleDeleteListing} />
              }
            />
            <Route path="/sign-up" element={<SignUpForm />} />
            <Route path="/sign-in" element={<SignInForm />} />
            <Route
              path="/users/:userId"
              element={
                <UserProfile
                  listings={listings}
                  key={location.pathname}
                  currentUser={user}
                  profile={profile}
                  setProfile={setProfile}
                />
              }
            />
            <Route
              path="/profile/edit"
              element={<ProfileForm currentUser={user} isNewUser={false} />}
            />
            <Route
              path="/profile/new"
              element={<ProfileForm currentUser={user} isNewUser={true} />}
            />

            <Route
              path="/conversations/user/:userId"
              element={<UserConversations />}
            />
            <Route
              path="/messages/:conversationId"
              element={<ConversationDetails />}
            ></Route>

            <Route
              path="/listings/filter/:category"
              element={<ListingIndex />}
            />
          </Routes>
        </div>
      </main>
    </>
  );
};

export default App;
