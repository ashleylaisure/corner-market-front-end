import { useContext } from "react";
import { Link } from "react-router";
import styles from './NavBar.module.css';
import Logo from '../../assets/images/logo-2.jpg'
import profile from '../../assets/images/channels4_profile.jpg'

import { UserContext } from "../../contexts/UserContext";

const NavBar = () => {
  const { user, setUser } = useContext(UserContext);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    
    <nav className={styles.container}>

      <div className={styles.navLeft}>
        <Link to="/"><img src={Logo} alt='Corner Market Log' className={styles.logo}/></Link>
        <h1>Corner Market</h1>
      </div>

      <div>
        {user ? (<h3>Welcome, {user.username}</h3>) : (<h3>Welcome, Guest</h3>) }
      </div>

      <div >
        {user ? (
          <div className={styles.navRight}>
            <i className='bx bx-message-dots' ></i>
            <Link to={`/users/${user._id}`}><img src={profile} alt="profile picture" /></Link>
            <Link to="/" onClick={handleSignOut}><i className='bx bx-chevrons-right'></i></Link>
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
