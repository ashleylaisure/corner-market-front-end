import {useContext} from "react";
import { Link } from "react-router";
import styles from './Aside.module.css';

import {UserContext} from "../../contexts/UserContext"

const Aside = () => {

    const { user } = useContext(UserContext);

    return (
        <div className={styles.asideWrapper}> 

            <aside className={styles.aside}>
                <div className={styles.search}>
                    <i className='bx bx-search-alt'></i>
                    <input type="search" placeholder="Search Market" ></input>
                </div>

                <div className={styles.create}>
                {user ? (
                    <div>
                        <Link to="/listings/new" className="btn"><i className='bx bx-add-to-queue'></i> Create New Listing</Link>
                    </div>
                    
                    ) : (<h5>Sign In to create a Listing</h5>) }
                </div>
                

                <h3>CATEGORIES</h3>
                    <div className={styles.cat}>
                        <i className='bx bxs-coin bxAside'></i><p>Antiques & Collectables</p>
                    </div>
                    <div className={styles.cat}>
                        <i className='bx bxs-brush bxAside'></i><p>Arts & Crafts</p>
                    </div>
                    <div className={styles.cat}>
                        <i className='bx bxs-car bxAside'></i><p>Auto, Parts & Accessories</p>
                    </div>
                    <div className={styles.cat}>
                        <i className='bx bxs-baby-carriage bxAside' ></i><p>Baby Products</p>
                    </div>
                    <div className={styles.cat}>
                        <i className='bx bxs-movie-play bxAside'></i><p>Books, Movies & Music</p>
                    </div>
                    <div className={styles.cat}>
                        <i className='bx bxs-phone-call bxAside'></i><p>Cell Phones & Accessories</p>
                    </div>
                    <div className={styles.cat}>
                        <i className='bx bx-body bxAside'></i><p>Clothing & Accessories</p>
                    </div>
                    <div className={styles.cat}>
                        <i className='bx bxs-tv bxAside'></i><p>Electronics</p>
                    </div>
                    <div className={styles.cat}>
                        <i className='bx bxs-bed bxAside'></i><p>Furniture</p>
                    </div>
                    <div className={styles.cat}>
                        <i className='bx bx-health bxAside'></i><p>Health & Beauty</p>
                    </div>
                    <div className={styles.cat}>
                        <i className='bx bxs-bowl-hot bxAside'></i><p>Home & Kitchen</p>
                    </div>
                    <div className={styles.cat}>
                        <i className='bx bxs-watch-alt bxAside'></i><p>Jewelry & Watches</p>
                    </div>
                    <div className={styles.cat}>
                        <i className='bx bxs-pen bxAside' ></i><p>Office Supplies</p>
                    </div>
                    <div className={styles.cat}>
                    <i className='bx bxs-leaf bxAside' ></i><p>Patio & Garden</p>
                    </div>
                    <div className={styles.cat}>
                        <i className='bx bxs-dog bxAside'></i><p>Pet Supplies</p>
                    </div>
                    <div className={styles.cat}>
                        <i className='bx bxs-tennis-ball bxAside'></i><p>Sporting Goods</p>
                    </div>
                    <div className={styles.cat}>
                        <i className='bx bxs-home bxAside'></i><p>Tools & Home Improvement</p>
                    </div>
                    <div className={styles.cat}>
                        <i className='bx bxs-dice-5 bxAside'></i><p>Toys & Games</p>
                    </div>
                    <div className={styles.cat}>
                        <i className='bx bxs-plane bxAside' ></i><p>Travel & Luggage</p>
                    </div>
                    <div className={styles.cat}>
                        <i className='bx bxs-game bxAside' ></i><p>Video Games</p>
                    </div>
                    <div className={styles.cat}>
                        <i className='bx bxs-widget bxAside' ></i><p>Miscellaneous</p>
                    </div>
                
            </aside>
        </div>
    )
}

export default Aside;
