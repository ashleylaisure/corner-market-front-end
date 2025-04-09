import { useContext, useState, useEffect } from 'react';
import { Routes, Route } from 'react-router';
import { UserContext } from './contexts/UserContext';

import NavBar from './components/NavBar/NavBar';
import SignUpForm from './components/SignUpForm/SignUpForm';
import SignInForm from './components/SignInForm/SignInForm';
import Landing from './components/Landing/Landing';
import Dashboard from './components/Dashboard/Dashboard';

import ListingIndex from './components/ListingIndex/ListingIndex.jsx';
import ListingDetails from './components/ListingDetails/ListingDetails.jsx';

import * as listingService from './services/listingService.js'

const App = () => {
  const { user } = useContext(UserContext);

  const [listings, setListings] = useState([])

  useEffect(() => {
    const fetchAllListings = async () => {
      const listingData = await listingService.index();

      // console.log('listingData', listingData)
      setListings(listingData)
    }
    fetchAllListings();
  }, [user])
  
  return (
    <>
      <NavBar/>
      <Routes>
        {/* <Route path='/' element={user ? <Dashboard /> : <Landing />} /> */}

        <Route path='/' element={<ListingIndex listings={listings}/>} />
        {/* <Route path='/listings' element={<ListingIndex listings={listings}/>}></Route> */}

        <Route path='/sign-up' element={<SignUpForm />} />
        <Route path='/sign-in' element={<SignInForm />} />
        
        <Route path='/listings/:listingId' element={<ListingDetails />}></Route>
      </Routes>
    </>
  );
};

export default App;
