import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginModal.css'; // Import the external CSS file
import PropTypes from 'prop-types'; // Import PropTypes

const SignupModal = ({ isOpen, closeModal, openLoginModal, onContinueAsGuest }) => {
    const [userInfo, setUserInfo] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [emailErr, setEmailErr] = useState('');
    const [passwordErr, setPasswordErr] = useState('');
    const [err, setErr] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loader, setLoader] = useState(false);
    const navigate = useNavigate();
    let [errorMessage, setErrorMessage] = useState('')

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserInfo({ ...userInfo, [name]: value });
    };

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    let errorData;

    const signUp = async (userInfo) => {
        userInfo.appType = 'ecommerce';

        try {
            // Make a POST request to your signup API
            const headers = {
                headers: {
                    projectID: 'yxpa71cax49z', // Replace with your project ID
                },
            };

            const res = await axios.post('https://academics.newtonschool.co/api/v1/user/signup', userInfo, headers);
            console.log('Response:', res); // Log the entire response object
            console.log('Response Data:', res.data); // Log the data property of the response

            if (res.data.token) {
                console.log('Token:', res.data.token);
                setSuccessMessage('Signed up successfully');
                navigate('/');
                closeModal();
                if (typeof openLoginModal === 'function') {
                    openLoginModal();
                }
            } else {
                console.log('Response Data:', res.data); // Log the data property of the response
                setSuccessMessage('Already used email');
                setErr(true); // Set error state to true
                setErrorMessage('User already exists with this email.'); // Set the error message
            }
        } catch (err) {
            setErr(true);

            if (err.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                errorData = err.response.data;
                console.log(errorData);
                if (errorData && errorData.message) {
                    console.error('Signup failed:', errorData.message);
                    setErrorMessage(errorData.message);
                } else {
                    console.error('Signup failed:', 'Unknown error');
                    setErrorMessage('Unknown error occurred during signup');
                }
            } else {
                // The request was made but no response was received
                console.error('Signup failed:', 'No response from the server');
                setErrorMessage('No response from the server during signup');
            }
        } finally {
            setLoader(false);
        }
    };




    const handleSubmit = (e) => {
        e.preventDefault();

        if (!isValidEmail(userInfo.email)) {
            setEmailErr('Please enter a valid email address.');
            return;
        } else {
            setEmailErr('');
        }

        if (userInfo.password.length < 6) {
            setPasswordErr('Password must be at least 6 characters long.');
            return;
        } else {
            setPasswordErr('');
        }

        signUp(userInfo);
    };

    const handleContinueAsGuest = () => {
        // Implement the logic for "Continue as Guest"
        // You can call the onContinueAsGuest prop or add your logic here
        // For now, let's just close the modal
        closeModal();
        if (typeof onContinueAsGuest === 'function') {
            onContinueAsGuest();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={closeModal}
            className="react-modal-content" // Add the CSS class for the modal content
            overlayClassName="react-modal-overlay" // Add the CSS class for the modal overlay
        >
            <div className="login-intro">
                <img
                    src="https://www.beyoung.in/images/login-and-signup-image.jpg"
                    alt="signupintro"
                    className='loginimage'
                />
            </div>
            <div className="close-button" onClick={closeModal}>
                X
            </div>
            <div className="welcome-header">
                Signup
                <span className="offer-text">
                    Get Exciting Offers &amp; Track Order
                </span>
            </div>

            <form className="form-Submission" onSubmit={handleSubmit}>
                <div className="form-in">
                    <input
                        type="text"
                        placeholder="Name"
                        name="name"
                        value={userInfo.name}
                        onChange={handleChange}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={userInfo.email}
                        onChange={handleChange}
                    />
                    {emailErr && (
                        <p className="error-message">{emailErr}</p>
                    )}
                    <input
                        type="password"
                        name="password"
                        value={userInfo.password}
                        onChange={handleChange}
                        placeholder="Password"
                    />
                    {passwordErr && (
                        <p className="error-message">{passwordErr}</p>
                    )}
                    <button className="btn-signup" type="submit">
                        Sign up
                    </button>
                    {err && <p className="error-message">{err}</p>}
                    {successMessage && <p className="success-message">{successMessage}</p>
                    }
                    {err && <p className="error-message">{errorMessage}</p>}

                    <p className="heading-bottom" onClick={handleContinueAsGuest}>
                        Continue as Guest
                    </p>


                </div>
            </form>
        </Modal>
    );
};
SignupModal.propTypes = {
    isOpen: PropTypes.bool.isRequired, // isOpen should be a boolean and is required
    closeModal: PropTypes.func.isRequired, // closeModal should be a function and is required
    openLoginModal: PropTypes.func.isRequired, // openLoginModal should be a function and is required
    onContinueAsGuest: PropTypes.func, // onContinueAsGuest is a function and is optional
};
export default SignupModal;
