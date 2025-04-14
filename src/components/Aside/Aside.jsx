import {useContext} from "react";
import { Link } from "react-router";
import styles from './Aside.module.css';

import {UserContext} from "../../contexts/UserContext"

const Aside = () => {

    const { user } = useContext(UserContext);

    return (
        <aside>
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
                    <i className='bx bx-plus-circle'></i><p>Antiques & Collectables</p>
                </div>
                <div className={styles.cat}>
                    <i className='bx bx-plus-circle'></i><p>Arts & Crafts</p>
                </div>
                <div className={styles.cat}>
                    <i className='bx bx-plus-circle'></i><p>Auto, Parts & Accessories</p>
                </div>
                <div className={styles.cat}>
                    <i className='bx bx-plus-circle'></i><p>Baby Products</p>
                </div>
                <div className={styles.cat}>
                    <i className='bx bx-plus-circle'></i><p>Books, Movies & Music</p>
                </div>
                <div className={styles.cat}>
                    <i className='bx bx-plus-circle'></i><p>Cell Phones & Accessories</p>
                </div>
                <div className={styles.cat}>
                    <i className='bx bx-plus-circle'></i><p>Clothing & Accessories</p>
                </div>
                <div className={styles.cat}>
                    <i className='bx bx-plus-circle'></i><p>Electronics</p>
                </div>
                <div className={styles.cat}>
                    <i className='bx bx-plus-circle'></i><p>Furniture</p>
                </div>
                <div className={styles.cat}>
                    <i className='bx bx-plus-circle'></i><p>Health & Beauty</p>
                </div>
                <div className={styles.cat}>
                    <i className='bx bx-plus-circle'></i><p>Home & Kitchen</p>
                </div>
                <div className={styles.cat}>
                    <i className='bx bx-plus-circle'></i><p>Jewelry & Watches</p>
                </div>
                <div className={styles.cat}>
                    <i className='bx bx-plus-circle'></i><p>Office Supplies</p>
                </div>
                <div className={styles.cat}>
                    <i className='bx bx-plus-circle'></i><p>Patio & Garden</p>
                </div>
                <div className={styles.cat}>
                    <i className='bx bx-plus-circle'></i><p>Pet Supplies</p>
                </div>
                <div className={styles.cat}>
                    <i className='bx bx-plus-circle'></i><p>Sporting Goods</p>
                </div>
                <div className={styles.cat}>
                    <i className='bx bx-plus-circle'></i><p>Tools & Home Improvement</p>
                </div>
                <div className={styles.cat}>
                    <i className='bx bx-plus-circle'></i><p>Toys & Games</p>
                </div>
                <div className={styles.cat}>
                    <i className='bx bx-plus-circle'></i><p>Travel & Luggage</p>
                </div>
                <div className={styles.cat}>
                    <i className='bx bx-plus-circle'></i><p>Video Games</p>
                </div>
                <div className={styles.cat}>
                    <i className='bx bx-plus-circle'></i><p>Miscellaneous</p>
                </div>
            
        </aside>
    )
}

export default Aside;
