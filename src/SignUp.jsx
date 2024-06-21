import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import { apiURL } from "../utils/getProductApi";
import {
  getHeaderWithProjectIdAndBody,
} from "../utils/getHeader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: "0px 0px",
    border: "none",
  },
};

const SignUp = ({ isOpen, closeModal }) => {
  const [loader, setLoader] = useState();
  const [err, setErr] = useState(false);
  const [messageSucess, setSuceessMessage] = useState(false);
  const [nameErr, setNameErr] = useState(false);
  const [emailErr, setEmailErr] = useState(false);
  const [passwordErr, setPasswordErr] = useState();

  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
    appType: "ecommerce",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name" && value.length < 4) {
      setNameErr("Name must be at least 4 characters long.");
    } else {
      setNameErr(false);
    }

    if ((name === "email" && !isValidEmail(value))) {
      setEmailErr("Please enter a valid email address.");
    } else {
      setEmailErr(false);
    }

    if (name === "password" && value.length > 6) {
      setPasswordErr("Password must be at least 6 characters long.");
    } else {
      setPasswordErr(false);
    }
    setUserInfo({ ...userInfo, [name]: value });
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };


  const signUp = async (userInfo) => {
    try {
      // Proceed with the sign-up
      const signUpRes = await axios.post(
        'https://academics.newtonschool.co/api/v1/user/signup',
        userInfo,
        getHeaderWithProjectIdAndBody()
      );

      if (signUpRes.data.token) {
        // ... (other success logic)
      } else {
        setErr(signUpRes.data.message || 'Failed to sign up. Please try again.');
      }
    } catch (err) {
      // Handle errors
      if (axios.isAxiosError(err)) {
        console.error('Axios error:', err);
        if (err.response) {
          console.error('Response status:', err.response.status);
          console.error('Response data:', err.response.data);
        }
      } else {
        console.error('Error:', err);
      }

      setErr('Something went wrong! Please try again later.');
    } finally {
      setLoader(false);
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    signUp(userInfo);
  };

  return (
    <div>
      <Modal
        isOpen={isOpen}
        // onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
        ariaHideApp={false}
        shouldCloseOnOverlayClick={true}
      >
        <div className="login-container">
          <div className="image-close-bar">
            <img
              className="login-image"
              src="./images/login-image-final.jpg"
              alt=""
            />
            <button className="btn-close" onClick={closeModal}>
              X
            </button>
          </div>

          <div className="welcome-header">
            Login <span className="welcome-header-small">or</span> Signup
            <span className="span-offer-text">
              Get Exciting Offers &amp; Track Order
            </span>
          </div>
          <form className="form-Submisson" onSubmit={handleSubmit}>
            <div className="form-in">

              <input
                type="name"
                placeholder="Name"
                name="name"
                value={userInfo.name}
                onChange={handleChange}
              />
              {nameErr && (
                <p
                  style={{
                    color: "red",
                    fontSize: "15px",
                    textAlign: "center",
                    margin: "0px",
                  }}
                >
                  {nameErr}
                </p>
              )}
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={userInfo.email}
                onChange={handleChange}
              />
              {emailErr && (
                <p
                  style={{
                    color: "red",
                    fontSize: "15px",
                    textAlign: "center",
                    margin: "0px",
                  }}
                >
                  {emailErr}
                </p>
              )}
              <input
                type="password"
                name="password"
                value={userInfo.password}
                onChange={handleChange}
                placeholder="Password"
              />
              {passwordErr && (
                <p
                  style={{
                    color: "red",
                    fontSize: "15px",
                    textAlign: "center",
                    margin: "0px",
                  }}
                >
                  {passwordErr}
                </p>
              )}
              <button>Sign Up</button>
              <p className="heading-bottom" onClick={closeModal}>
                Continue as Guest
              </p>
            </div>
          </form>
        </div>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default SignUp;
