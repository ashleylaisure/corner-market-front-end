import { useContext } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router";
import styles from './Aside.module.css';

import { UserContext } from "../../contexts/UserContext"
import { LocationFilterContext } from "../../contexts/LocationFilterContext.jsx";


const Aside = () => {

    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const { locationFilter } = useContext(LocationFilterContext);


    return (
        <div className={styles.asideWrapper}>
            <aside className={styles.aside}>
                <div className={styles.search}>
                    <i className="bx bx-search-alt"></i>
                    <input type="search" placeholder="Search Market" />
                </div>

                <div className={styles.create}>
                    {user ? (
                        <Link to="/listings/new" className="btn">
                            <i className="bx bx-add-to-queue"></i> Create New Listing
                        </Link>
                    ) : (
                        <h5>Sign in to create a listing</h5>
                    )}
                </div>

                {/* Location Display with click to update */}
                {locationFilter && (
                    <div
                        className={styles.locationDisplay}
                        onClick={() => navigate("/location-filter")}
                        title="Change location"
                        style={{ cursor: "pointer" }}
                    >
                        <h4 className={styles.locationHeader}>Location</h4>
                        <p className={styles.locationText}>
                            {locationFilter?.city && locationFilter?.state
                                ? `${locationFilter.city}, ${locationFilter.state}`
                                : "Your Area, US"}
                            <span className={styles.locationRadius}>
                                · Within {locationFilter?.radius || 10} mi
                            </span>
                        </p>
                    </div>
                )}
                <h3>CATEGORIES</h3>

                <div className={styles.catContainer}>
                    <div className={styles.cat}>
                        <Link to={`/listings/filter/${encodeURIComponent("Antiques & Collectables")}`} className={styles.catLink}>
                            <i className='bx bxs-coin bxAside'></i>
                            <p>Antiques & Collectables</p>
                        </Link>
                    </div>

                    <div className={styles.cat}>
                        <Link to={`/listings/filter/${encodeURIComponent("Arts & Crafts")}`} className={styles.catLink}>
                            <i className='bx bxs-brush bxAside'></i>
                            <p>Arts & Crafts</p>
                        </Link>
                    </div>
                    <div className={styles.cat}>
                        <Link to={`/listings/filter/${encodeURIComponent("Auto Parts & Accessories")}`} className={styles.catLink}>
                            <i className='bx bxs-car bxAside'></i>
                            <p>Auto, Parts & Accessories</p>
                        </Link>
                    </div>
                    <div className={styles.cat}>
                        <Link to={`/listings/filter/${encodeURIComponent("Baby Products")}`} className={styles.catLink}>
                            <i className='bx bxs-baby-carriage bxAside' ></i>
                            <p>Baby Products</p>
                        </Link>
                    </div>
                    <div className={styles.cat}>
                        <Link to={`/listings/filter/${encodeURIComponent("Books, Movies & Music")}`} className={styles.catLink}>
                            <i className='bx bxs-movie-play bxAside'></i>
                            <p>Books, Movies & Music</p>
                        </Link>
                    </div>
                    <div className={styles.cat}>
                        <Link to={`/listings/filter/${encodeURIComponent("Cell Phones & Accessories")}`} className={styles.catLink}>
                            <i className='bx bxs-phone-call bxAside'></i>
                            <p>Cell Phones & Accessories</p>
                        </Link>
                    </div>
                    <div className={styles.cat}>
                        <Link to={`/listings/filter/${encodeURIComponent("Clothing & Accessories")}`} className={styles.catLink}>
                            <i className='bx bx-body bxAside'></i>
                            <p>Clothing & Accessories</p>
                        </Link>
                    </div>
                    <div className={styles.cat}>
                        <Link to={`/listings/filter/${encodeURIComponent("Electronics")}`} className={styles.catLink}>
                            <i className='bx bxs-tv bxAside'></i>
                            <p>Electronics</p>
                        </Link>
                    </div>
                    <div className={styles.cat}>
                        <Link to={`/listings/filter/${encodeURIComponent("Furniture")}`} className={styles.catLink}>
                            <i className='bx bxs-bed bxAside'></i>
                            <p>Furniture</p>
                        </Link>
                    </div>
                    <div className={styles.cat}>
                        <Link to={`/listings/filter/${encodeURIComponent("Health & Beauty")}`} className={styles.catLink}>
                            <i className='bx bx-injection bxAside'></i>
                            <p>Health & Beauty</p>
                        </Link>
                    </div>
                    <div className={styles.cat}>
                        <Link to={`/listings/filter/${encodeURIComponent("Home & Kitchen")}`} className={styles.catLink}>
                            <i className='bx bxs-bowl-hot bxAside'></i>
                            <p>Home & Kitchen</p>
                        </Link>
                    </div>
                    <div className={styles.cat}>
                        <Link to={`/listings/filter/${encodeURIComponent("Jewelry & Watches")}`} className={styles.catLink}>
                            <i className='bx bxs-watch-alt bxAside'></i>
                            <p>Jewelry & Watches</p>
                        </Link>
                    </div>
                    <div className={styles.cat}>
                        <Link to={`/listings/filter/${encodeURIComponent("Musical Instruments")}`} className={styles.catLink}>
                            <i className='bx bxs-playlist bxAside'></i>
                            <p>Musical Instruments</p>
                        </Link>
                    </div>
                    <div className={styles.cat}>
                        <Link to={`/listings/filter/${encodeURIComponent("Office Supplies")}`} className={styles.catLink}>
                            <i className='bx bxs-pen bxAside' ></i>
                            <p>Office Supplies</p>
                        </Link>
                    </div>
                    <div className={styles.cat}>
                        <Link to={`/listings/filter/${encodeURIComponent("Patio & Garden")}`} className={styles.catLink}>
                            <i className='bx bxs-leaf bxAside' ></i>
                            <p>Patio & Garden</p>
                        </Link>
                    </div>
                    <div className={styles.cat}>
                        <Link to={`/listings/filter/${encodeURIComponent("Pet Supplies")}`} className={styles.catLink}>
                            <i className='bx bxs-dog bxAside'></i>
                            <p>Pet Supplies</p>
                        </Link>
                    </div>
                    <div className={styles.cat}>
                        <Link to={`/listings/filter/${encodeURIComponent("Sporting Goods")}`} className={styles.catLink}>
                            <i className='bx bxs-tennis-ball bxAside'></i>
                            <p>Sporting Goods</p>
                        </Link>
                    </div>
                    <div className={styles.cat}>
                        <Link to={`/listings/filter/${encodeURIComponent("Tools & Home Improvement")}`} className={styles.catLink}>
                            <i className='bx bxs-home bxAside'></i>
                            <p>Tools & Home Improvement</p>
                        </Link>
                    </div>
                    <div className={styles.cat}>
                        <Link to={`/listings/filter/${encodeURIComponent("Toys & Games")}`} className={styles.catLink}>
                            <i className='bx bxs-dice-5 bxAside'></i>
                            <p>Toys & Games</p>
                        </Link>
                    </div>
                    <div className={styles.cat}>
                        <Link to={`/listings/filter/${encodeURIComponent("Travel & Luggage")}`} className={styles.catLink}>
                            <i className='bx bxs-plane bxAside' ></i>
                            <p>Travel & Luggage</p>
                        </Link>
                    </div>
                    <div className={styles.cat}>
                        <Link to={`/listings/filter/${encodeURIComponent("Video Games")}`} className={styles.catLink}>
                            <i className='bx bxs-game bxAside' ></i>
                            <p>Video Games</p>
                        </Link>
                    </div>
                    <div className={styles.cat}>
                        <Link to={`/listings/filter/${encodeURIComponent("Miscellaneous")}`} className={styles.catLink}>
                            <i className='bx bxs-widget bxAside' ></i>
                            <p>Miscellaneous</p>
                        </Link>
                    </div>
                </div>

            </aside>
        </div>
    )
}

export default Aside;
