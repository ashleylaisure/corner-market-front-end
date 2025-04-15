import { useContext, useState, useEffect } from "react";
import { Link } from "react-router";
import styles from './NavBar.module.css';
import defaultProfilePic from '../../assets/images/default-profile-picture.png';
import * as userService from '../../services/userService.js'

import { UserContext } from "../../contexts/UserContext";

const NavBar = () => {
  const { user, setUser } = useContext(UserContext);
  const [showLabel, setShowLabel] = useState(null)

  const [profile, setProfile] = useState(null);


  const handleSignOut = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userService.getUserProfile(user._id);
        setProfile(data.user.profile);

      } catch (err) {

        console.error('Profile fetch error:', err);
      }
    }; fetchProfile();
  }, [user]);

  console.log("🔍 Profile state in NavBar:", profile);
  return (

    <nav className={styles.container}>

      <div className={styles.navLeft}>

        <div className={styles.iconLabel} onMouseEnter={() => setShowLabel('home')} onMouseLeave={() => setShowLabel(null)}>

          <Link to="/">
            <i className='bx bxs-home-smile bxNav'></i>
            {showLabel === 'home' && (
              <span className={styles.hoverLabel}>HOME</span>
            )}
          </Link>
        </div>

        <h1 className={styles.logo}>Corner Market</h1>
      </div>

      <div>
        {user ? (<h3>Welcome, {user.username}</h3>) : (<h3>Welcome, Guest</h3>)}
      </div>

      <div >
        {user ? (
          <div className={styles.navRight}>

            <div className={styles.iconLabel} onMouseEnter={() => setShowLabel('mesg')} onMouseLeave={() => setShowLabel(null)}>
              <Link to={`/conversations/${user._id}`}>
                <i className='bx bxl-messenger bxNav'></i>
                {showLabel === 'mesg' && (
                  <span className={styles.hoverLabel}>Messenger</span>
                )}
              </Link>
            </div>

            <div className={styles.iconLabel} onMouseEnter={() => setShowLabel('profile')} onMouseLeave={() => setShowLabel(null)}>
              <Link to={`/users/${user._id}`}>
                <img
                  src={
                    profile?.profilePicture
                      ? `${import.meta.env.VITE_BACK_END_SERVER_URL}${profile.profilePicture}`
                      : defaultProfilePic
                  }
                  alt="profile picture"
                  className={styles.profileImage}
                />
                {showLabel === 'profile' && (
                  <span className={styles.hoverLabel}>Profile</span>
                )}
              </Link>
            </div>

            <div className={styles.iconLabel} onMouseEnter={() => setShowLabel('logout')} onMouseLeave={() => setShowLabel(null)}>
              <Link to="/" onClick={handleSignOut}>
                <i className='bx bx-chevrons-right bxNav'></i>
                {showLabel === 'logout' && (
                  <span className={styles.hoverLabel}>Log Out</span>
                )}
              </Link>
            </div>

          </div>

        ) : (
          <div>
            <Link to="/sign-in" className={styles.auth}>Sign In</Link>
            <Link to="/sign-up" className={styles.auth}>Sign Up</Link>
          </div>
        )}

      </div>

    </nav>


  );
};

export default NavBar;
