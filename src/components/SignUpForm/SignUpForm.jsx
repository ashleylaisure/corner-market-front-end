import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';

import styles from './SignUpForm.module.css'
import backgroud from '../../assets/images/paul-povoroznuk-bJkynpjVRBQ-unsplash.jpg'

import { signUp } from '../../services/authService';

import { UserContext } from '../../contexts/UserContext';

const SignUpForm = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    passwordConf: '',
  });

  const { username, password, passwordConf } = formData;

  const handleChange = (evt) => {
    setMessage('');
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const newUser = await signUp(formData);
      setUser(newUser);
      navigate("/");
    } catch (err) {
      setMessage(err.message);
    }
  };

  const isFormInvalid = () => {
    return !(username && password && password === passwordConf);
  };

  return (
    <main className={styles.overlay}>
      <img src={backgroud} alt="man shopping"/>

      <div className={styles.signIn}> 
        <h1>Sign Up</h1>
        <p className={styles.singInMesg}>{message}</p>
        <form onSubmit={handleSubmit} className={styles.signInForm}>
          
          <div className={styles.signInInput}>
            <label htmlFor='username'>Username:</label>
            <input
              type='text'
              id='name'
              value={username}
              name='username'
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.signInInput}>
            <label htmlFor='password'>Password:</label>
            <input
              type='password'
              id='password'
              value={password}
              name='password'
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.signInInput}>
            <label htmlFor='confirm'>Confirm Password:</label>
            <input
              type='password'
              id='confirm'
              value={passwordConf}
              name='passwordConf'
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.signInbtn}>
            <button disabled={isFormInvalid()}>Sign Up</button>
            <button onClick={() => navigate('/')}>Cancel</button>
          </div>
        </form>
      </div>

    </main>
  );
};

export default SignUpForm;
