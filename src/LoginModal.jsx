import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useNavigate } from "react-router-dom";
import { useAuth } from "./Context/UserProvider";

import './LoginModal.css';
import './SignupPage.css'; // Import the external CSS file
import PropTypes from 'prop-types';

const LoginModal = ({ isOpen, closeModal, onLogin }) => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({
        email: '',
        password: '',
        appType: "ecommerce",
    });

    const [error, setError] = useState("");
    const [messageSucess, setSuccessMessage] = useState(false);
    const [emailErr, setEmailErr] = useState(false);
    const [passwordErr, setPasswordErr] = useState(false);


    function handleChange(event) {
        const element = event.target;
        const { name, value } = element;

        setUserInfo((oldInfo) => {
            return {
                ...oldInfo,
                [name]: value,
            };
        });
    }

    const signIn = async (userInfo) => {
        try {
            const myHeaders = new Headers();
            myHeaders.append("projectID", "yxpa71cax49z");
            myHeaders.append("Content-Type", "application/json");

            const url = 'https://academics.newtonschool.co/api/v1/user/login';
            const payload = {
                email: userInfo.email,
                password: userInfo.password,
                appType: 'ecommerce',
            };

            const requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(payload),
            };

            const response = await fetch(url, requestOptions);


            if (response.ok) {
                const data = await response.json();

                const { token, data: loginData } = data;
                const { name: userName } = loginData;

                console.log('Login successful:', data);
                setSuccessMessage(true);

                // Clear sessionStorage
                sessionStorage.clear();

                setIsLoggedIn(true);
                navigate('/');

                setEmailErr(false);
                setPasswordErr(false);
                setError("");
                setSuccessMessage(true);

                // Assuming signInContext sets the user and token in the context
                // signInContext(token, userName);

                // Check if onLogin is defined and call it
                if (typeof onLogin === 'function') {
                    onLogin(token, userName);
                }

                closeModal();
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Password or email is incorrect');
                console.error('Login failed:', errorData);
            }

        } catch (error) {
            setError('Ok');
        }
    };
    // useEffect(() => {
    //     if (isLoggedIn) {
    //         closeModal();
    //     }
    // }, [isLoggedIn, closeModal]);

    useEffect(() => {
        console.log('isLoggedIn:', isLoggedIn);
    }, [isLoggedIn]);


    function handleSubmit(event) {
        event.preventDefault();

        if (!userInfo.email || !userInfo.password) {
            setError("Please enter both email and password.");
            return;
        }

        signIn(userInfo);
    }


    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={closeModal}
            className="react-modal-content"
            overlayClassName="react-modal-overlay"
            ariaHideApp={false}
        >

            <div className="login-intro">
                <img
                    src="https://www.beyoung.in/images/login-and-signup-image.jpg"
                    alt="loginintro"
                    className='loginimage'
                />
            </div>
            <div className="close-button" onClick={closeModal}>
                X
            </div>

            <div className="welcome-header">
                Login
                <span className="welcome-header-small">or</span>
                Signup
                <span className="offer-text">
                    Get Exciting Offers &amp; Track Order
                </span>
            </div>

            <form className="form-Submission" onSubmit={handleSubmit}>
                <div className="form-in">
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
                    <button className="btn-login" type="submit">
                        Log in
                    </button>
                    {error && <p className="error-message">{error}</p>}
                    {messageSucess && (
                        <p className="success-message">Login successful!</p>
                    )}                    <p className="heading-bottom" onClick={closeModal}>
                        Continue as Guest
                    </p>
                </div>
            </form>


        </Modal>

    );
};

LoginModal.propTypes = {
    isOpen: PropTypes.bool.isRequired, // isOpen should be a boolean and is required
    closeModal: PropTypes.func.isRequired, // closeModal should be a function and is required
    onLogin: PropTypes.func, // onLogin should be a function, not required
};

export default LoginModal;