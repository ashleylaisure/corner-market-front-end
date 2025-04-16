import { useState } from 'react'

const DetailsImageSlider = ({images}) => {
    const [imageIndex, setImageIndex] = useState(0)

    console.log('images props', images)
    return (
        <div>
            <img src={`${import.meta.env.VITE_BACK_END_SERVER_URL}${images[0].path}`}
                // alt={`Listing image ${idx}`}
                />
                
            <button><i className='bx bxs-chevron-left'></i></button>
            <button><i className='bx bxs-chevron-right'></i></button>
        </div>

    )
}

export default DetailsImageSlider; 