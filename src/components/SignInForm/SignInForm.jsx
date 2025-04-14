import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';

import styles from './signInForm.module.css'
import backgroud from '../../assets/images/paul-povoroznuk-bJkynpjVRBQ-unsplash.jpg'

import { signIn } from '../../services/authService';

import { UserContext } from '../../contexts/UserContext';

const SignInForm = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (evt) => {
    setMessage('');
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const signedInUser = await signIn(formData);
      setUser(signedInUser);
      navigate('/');
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <main className={styles.overlay}>
      <img src={backgroud} alt="man shopping"/>

      <div className={styles.signIn}>
        <h1>Sign In</h1>
        <p className={styles.singInMesg}>{message}</p>
        <form autoComplete='off' onSubmit={handleSubmit} className={styles.signInForm}>


          <div className={styles.signInInput}>
            <label htmlFor='email'>Username:</label>
            <input
              type='text'
              autoComplete='off'
              id='username'
              value={formData.username}
              name='username'
              onChange={handleChange}
              required
            />
          </div>
            
          <div className={styles.signInInput}>
            <label htmlFor='password'>Password:</label>
            <input
              type='password'
              autoComplete='off'
              id='password'
              value={formData.password}
              name='password'
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.signInbtn}>
            <button>Sign In</button>
            <button onClick={() => navigate('/')}>Cancel</button>
          </div>
        </form>
      </div>
      
    </main>
  );
};

export default SignInForm;
