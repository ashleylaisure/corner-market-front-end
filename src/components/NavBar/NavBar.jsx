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
//     james/messaging-functionality
//     <nav>
//       <li>
//         <Link to="/">Corner Market</Link>
//       </li>
//       {/* <li><Link to='/listings'>Listings</Link></li> */}

//       {user ? (
//         <ul>
//           <li>Welcome, {user.username}</li>
//           <li>
//             <Link to={`/conversations/${user._id}`}>Messages</Link>
//           </li>
//           <li>
//             <Link to={`/users/${user._id}`}>Profile</Link>
//           </li>
//           <li>
//             <Link to="/listings/new">Create a Listing</Link>
//           </li>
//           <li>
//             <Link to="/" onClick={handleSignOut}>
//               Sign Out
//             </Link>
//           </li>
//         </ul>
//       ) : (
//         <ul>
//           <li>
//             <Link to="/sign-in">Sign In</Link>
//           </li>
//           <li>
//             <Link to="/sign-up">Sign Up</Link>
//           </li>
//         </ul>
//       )}

    
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
