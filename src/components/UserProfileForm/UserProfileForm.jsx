import {useEffect, useState} from 'react'
import {useParams} from "react-router"

import * as userService from '../../services/userService.js'

const initalState = {
    bio: '',
    profilePicture: '',
    coverPhoto: '',
    location: '',
    emailAddress: '',
    facebookLink: '',
    twitterLink: '',
    instagramLink: '',
}

const UserProfileForm = (props) => {
    const {userId} = useParams();
    // console.log('userId', userId)
    const [formData, setFormData] = useState(initalState)

    const handleChange = (evt) => {
        setFormData({ ...formData, [evt.target.name]: evt.target.value });
    };
    
    const handleSubmit = (evt) => {
        evt.preventDefault();
        // console.log('formData', formData);
        if (userId) {
            props.handleProfileUpdate(userId, formData)
            
        } else {
            props.handleAddProfile(userId, formData)
        }
    };

    useEffect(() => {
        const fetchUserProfile = async () => {
            const profileData = await userService.getUserProfile(userId)
            setFormData(profileData)
        }

        if (userId) fetchUserProfile();
    }, [userId])

    return (
        <main>
            {/* <h1>{userId.profile ? 'Edit Your Profile' : 'Create Your User Profile'}</h1> */}

            <form onSubmit={handleSubmit}>

                <label htmlFor='bio'>BIO:</label>
                <input 
                    type='text'
                    name='bio'
                    id='bio-input'
                    value={formData.bio}
                    onChange={handleChange}
                />
                <br />
                <label htmlFor='profilePicture'>Insert A Link To A Profile Picture:</label>
                <input 
                    type='text'
                    name='profilePicture'
                    id='profilePicture-input'
                    value={formData.profilePicture}
                    onChange={handleChange}
                />
                <br />
                <label htmlFor='coverPhoto'>Insert A Link To A Profile Picture:</label>
                <input 
                    type='text'
                    name='coverPhoto'
                    id='coverPhoto-input'
                    value={formData.coverPhoto}
                    onChange={handleChange}
                />
                <br />
                <label htmlFor='location'>Your Location City, State:</label>
                <input 
                    type='text'
                    name='location'
                    id='location-input'
                    value={formData.location}
                    onChange={handleChange}
                />
                <br />
                <label htmlFor='emailAddress'>emailAddress:</label>
                <input 
                    type='text'
                    name='emailAddress'
                    id='emailAddress-input'
                    value={formData.emailAddress}
                    onChange={handleChange}
                />
                <br />
                <label htmlFor='facebookLink'>facebookLink:</label>
                <input 
                    type='text'
                    name='facebookLink'
                    id='facebookLink-input'
                    value={formData.facebookLink}
                    onChange={handleChange}
                />
                <br />
                <label htmlFor='twitterLink'>twitterLink:</label>
                <input 
                    type='text'
                    name='twitterLink'
                    id='twitterLink-input'
                    value={formData.twitterLink}
                    onChange={handleChange}
                />
                <br />
                <label htmlFor='instagramLink'>instagramLink:</label>
                <input 
                    type='text'
                    name='instagramLink'
                    id='instagramLink-input'
                    value={formData.instagramLink}
                    onChange={handleChange}
                />
                <br />
                <button type='submit'>SUBMIT</button>
            </form>
        </main>
    )
}

export default UserProfileForm;