import { useContext } from "react";
import { Link } from "react-router";

import { UserContext } from "../../contexts/UserContext";

const NavBar = () => {
  const { user, setUser } = useContext(UserContext);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <nav>
      <li>
        <Link to="/">Corner Market</Link>
      </li>
      {/* <li><Link to='/listings'>Listings</Link></li> */}

      {user ? (
        <ul>
          <li>Welcome, {user.username}</li>
          <li>
            <Link to={`/conversations/${user._id}`}>Messages</Link>
          </li>
          <li>
            <Link to={`/users/${user._id}`}>Profile</Link>
          </li>
          <li>
            <Link to="/listings/new">Create a Listing</Link>
          </li>
          <li>
            <Link to="/" onClick={handleSignOut}>
              Sign Out
            </Link>
          </li>
        </ul>
      ) : (
        <ul>
          <li>
            <Link to="/sign-in">Sign In</Link>
          </li>
          <li>
            <Link to="/sign-up">Sign Up</Link>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default NavBar;
