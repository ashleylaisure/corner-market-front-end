import { useState } from 'react'
import styles from './DetailsImageSlider.module.css'

const DetailsImageSlider = ({images}) => {
    const [imageIndex, setImageIndex] = useState(0)

    // console.log('images props', images)

    const previousImage = () => {
        setImageIndex(index => {
            if (index === 0 ) {
                return images.length - 1
            } return index - 1
        })
    }

    const nextImage = () => {
        setImageIndex(index => {
            if (index === images.length -1 ) {
                return 0
            } return index + 1
        })
    }

    return (
        <div className={styles.imageContainer}>
            <img src={`${import.meta.env.VITE_BACK_END_SERVER_URL}${images[imageIndex].path}`}
                alt={`Listing image ${imageIndex}`}
                className={styles.imageSlider}/>
            {images.length > 1 && 
                <div>
                    <button onClick={previousImage} className={styles.imageSliderBtnL}><i className='bx bxs-chevron-left' ></i></button>
                    <button onClick={nextImage} className={styles.imageSliderBtnR}><i className='bx bxs-chevron-right'></i></button>
                </div>
                
            }
            

            <div className={styles.imageIndexBtn}>
                {images.map((_, index) => (
                    <button 
                        key={index} 
                        onClick={() => setImageIndex(index)}
                        className={styles.indexBtnDot}
                        >{index === imageIndex ? <i className='bx bxs-circle' ></i> : <i className='bx bx-circle'></i> }
                    </button>
                ))}
            </div>
        </div>

    )
}

export default DetailsImageSlider; 