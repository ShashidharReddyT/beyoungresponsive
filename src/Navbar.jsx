import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Beyounglogo from "./assets/Beyounglogo.svg";
import Searchicon from "./assets/Searchicon.svg";
import Hearticon from "./assets/Hearticon.svg";
import Trackicon from "./assets/Trackicon.svg";
import { Link } from "react-router-dom";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";
import "./Navbar.css";
import { AuthProvider, useAuth } from "./Context/UserProvider";
import { ClickAwayListener, Popper } from "@mui/material";

import {
  useCartNumbers,
  useUpdateCartNumbers,
  useUpdateWishlistNumbers,
} from "./Context/CartNumberContext";

const Navbar = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { isUserLoggedIn, signInContext, signOutContext, user } = useAuth();
  const numberOfCartItems = useCartNumbers();
  const updateCartNumber = useUpdateCartNumbers();
  const updateWishlistNumbers = useUpdateWishlistNumbers();

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const openSignupModal = () => {
    setIsSignupModalOpen(true);
  };

  const closeSignupModal = () => {
    setIsSignupModalOpen(false);
  };

  const handleLogin = (token, userName) => {
    sessionStorage.setItem("authToken", token);
    sessionStorage.setItem("userInfo", userName);
    setIsLoggedIn(true);
    signInContext(token, userName);
    closeLoginModal();
  };

  const handleLogout = (token, userName) => {
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("userInfo");
    signOutContext(token, userName);
    setIsLoggedIn(false);
    updateCartNumber(0);
    updateWishlistNumbers(0);
    navigate("/");
  };

  // Searching a product
  const [isSearchbarOpen, setIsSearchbarOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const searchInputRef = useRef();
  const navigate = useNavigate(); // Move useNavigate hook here
  const [searchResults, setSearchResults] = useState("");

  const handleSearchBtnClick = (event) => {
    if (anchorEl) {
      setIsSearchbarOpen(false);
      setAnchorEl(null);
    } else {
      setIsSearchbarOpen(true);
      setAnchorEl(event.currentTarget);
    }
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    const { value } = searchInputRef.current;

    const encodedSearchQuery = encodeURIComponent(`{"name":"${value}"}`);
    const apiUrl = `https://academics.newtonschool.co/api/v1/ecommerce/clothes/products?search=${encodedSearchQuery}`;
    console.log(apiUrl);
    setIsSearchbarOpen(false);

    var myHeaders = new Headers();
    myHeaders.append("projectID", "yxpa71cax49z");

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    try {
      const response = await fetch(apiUrl, requestOptions);
      const result = await response.json(); // Parse the response as JSON

      if (response.ok) {
        // Check if the response status is OK
        if (result.status === "success" && result.results > 0) {
          // Products found, update the state with the data
          setSearchResults(result.data);
        } else {
          // No products found
          setSearchResults([]);
        }
      } else {
        // Handle non-OK response status
        console.log("Error:", result.message);
        setSearchResults([]); // Set empty array in case of an error
      }
    } catch (error) {
      // Handle fetch error
      console.log("Fetch Error:", error);
      setSearchResults([]); // Set empty array in case of an error
    }

    navigate(`/search?name=${value}`);
  };

  const handleWishlistClick = () => {
    if (!isUserLoggedIn) {
      openLoginModal();
    } else {
      return;
    }
  };
  const handleCartClick = () => {
    if (!isUserLoggedIn) {
      openLoginModal();
    } else {
      return;
    }
  };

  // mobilesidebar

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("MEN");

  const handleSidebarToggle = () => {
    console.log("Toggle sidebar");
    setIsSidebarOpen((prevState) => !prevState);
  };

  const handleOverlayClick = () => {
    setIsSidebarOpen(false);
    setSelectedCategory("MEN");
  };

  const handleCategoryClick = (category) => {
    if (selectedCategory === category) {
      setIsSidebarOpen(false);
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  const handleSidebarClick = (event) => {
    event.stopPropagation();
  };

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.classList.add("sidebar-open");
    } else {
      document.body.classList.remove("sidebar-open");
    }

    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth <= 380);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isSidebarOpen]);

  return (
    <header>
      <div className="couponcode">
        <p>
          Free Shipping on All Orders | Get Extra <b> ₹100</b> OFF on Spent of
          ₹999 Use Code: <b>BEYOUNG100</b>
        </p>
      </div>

      <div className="navbar">
        <div className="nav-links">
          <Link to="/trackyourorder" className="linked">
            <img src={Trackicon} alt="search" className="navlogo" />
            TRACK YOUR ORDER
          </Link>
        </div>

        <ul className="nav-linkss">
  {isUserLoggedIn ? (
    <>
      <div className="dropdownmyaccount">
        <button className="dropbtn1">MY ACCOUNT</button>
        <div className="dropdown-contentmyaccount">
          <Link to="/" className="linked">
            Hi! {user}
          </Link>
          <Link to="/myprofile" className="linked">
            My Profile
          </Link>
          <Link to="/orders" className="linked">
            Orders
          </Link>
          <Link to="/address" className="linked">
            Address
          </Link>
          <Link to="/wishlist" className="linked">
            Wishlist
          </Link>
        </div>
      </div>
      <p className="dash">|</p>
      <button onClick={handleLogout}>LOGOUT</button>
    </>
  ) : (
    <>
      <button onClick={openLoginModal}>LOGIN</button>
      <p className="dash">|</p>
      <button onClick={openSignupModal}>SIGNUP</button>
    </>
  )}
</ul>

      </div>

      <div className="navmain">
        <div className="navchild">
          <Link to="/">
            <img src={Beyounglogo} alt="beyoung" className="logo" />
          </Link>
          <div className="dropdown">
            <Link to="/men" className="link1">
              MEN
            </Link>
            <div className="dropdown-content">
              <div className="sub-heading">
                <p className="headingdropdown">Topwear</p>
                <Link to="/shirts" className="sub-sub-link">
                  Shirts
                </Link>
                <Link to="/kurtas" className="sub-sub-link">
                  Kurtas
                </Link>
                <Link to="/tshirt" className="sub-sub-link">
                  T-shirts
                </Link>
                <Link to="/sweater" className="sub-sub-link">
                  Sweater
                </Link>
                <Link to="/hoodie" className="sub-sub-link">
                  Hoodie
                </Link>
                <Link to="/tracksuit" className="sub-sub-link">
                  TrackSuit
                </Link>
              </div>

              <div className="sub-heading">
                <p className="headingdropdown">Bottomwear</p>
                <Link to="/shorts" className="sub-sub-link">
                  Shorts
                </Link>
                <Link to="/trousers" className="sub-sub-link">
                  Trousers
                </Link>
                <Link to="/joggers" className="sub-sub-link">
                  Joggers
                </Link>
                <Link to="/pyjamas" className="sub-sub-link">
                  Pyjamas
                </Link>
                <Link to="/jeans" className="sub-sub-link">
                  Jeans
                </Link>
              </div>
              <img
                src="https://www.beyoung.in/api/catalog/Navigation/desktop-navigation_19_10_jpg.jpg"
                alt="img"
                className="dropdownimg"
              />
            </div>
          </div>
          <div className="dropdown">
            <Link to="/women" className="link1">
              WOMEN
            </Link>
            <div className="dropdown-content">
              <div className="sub-heading">
                <p className="headingdropdown">Topwear</p>
                <Link to="/shirtsWomen" className="sub-sub-link">
                  Shirts
                </Link>
                <Link to="/tshirtswomen" className="sub-sub-link">
                  T-Shirts
                </Link>
                <Link to="/kurtisWomen" className="sub-sub-link">
                  Kurtis
                </Link>
              </div>
              <div className="sub-heading">
                <p className="headingdropdown">Bottomwear</p>
                <Link to="/joggersWomen" className="sub-sub-link">
                  Joggers
                </Link>
                <Link to="/jeansWomen" className="sub-sub-link">
                  Jeans
                </Link>
                <Link to="/jumpsuitWomen" className="sub-sub-link">
                  JumpSuit
                </Link>
              </div>
              <img
                src="https://www.beyoung.in/api/catalog/Navigation/desktop-navigation_19_10_jpg.jpg"
                alt="img"
                className="dropdownimg"
              />
            </div>
          </div>
          <Link to="/trousers" className="link1">
            COMBOS
          </Link>
          <Link to="/joggers" className="link1">
            JOGGERS
          </Link>
          <Link to="/winterwear" className="link1">
            WINTER WEAR
          </Link>
          <Link to="/shopbycollection" className="link1">
            SHOP BY COLLECTION
          </Link>
        </div>

        <div className="navlogos">
          <div className="sidebarbutton">
            <button className="sidebar-btn" onClick={handleSidebarToggle}>
              &#9776;
            </button>
            <div className="logosidebar">
              <Link to="/">
                <img src={Beyounglogo} alt="beyoung" className="logo3" />
              </Link>
            </div>
          </div>
          <Link className="searchBar" onClick={handleSearchBtnClick}>
            <img src={Searchicon} alt="searchbar" className="navlogo" />
          </Link>

          <Link
            className="searchBar"
            onClick={handleWishlistClick}
            to="/wishlist"
          >
            <img src={Hearticon} alt="heart" className="navlogo" />
          </Link>

          <Link className="searchBar" onClick={handleCartClick} to="/cart">
            <i className="fa badge fa-lg" value={numberOfCartItems}>
              &#xf07a;
            </i>
          </Link>
        </div>
      </div>

      {isSidebarOpen && (
        <>
          <div className="sidebar-overlay" onClick={handleOverlayClick}>
            <div className="sidebar" onClick={handleSidebarClick}>
              <button
                className="sidebar-close-btn"
                onClick={handleOverlayClick}
              >
                X
              </button>
              <div className="logomain">
                <Link to="/">
                  <img src={Beyounglogo} alt="beyoung" className="logo" />
                </Link>
              </div>
              <div className="menu-links">
                <button
                  className="link1"
                  onClick={() => handleCategoryClick("MEN")}
                >
                  MEN
                </button>
                <button
                  className="link1"
                  onClick={() => handleCategoryClick("WOMEN")}
                >
                  WOMEN
                </button>
              </div>

              <div className="category-content">
                {selectedCategory === "MEN" && (
                  <>
                    <Link to="/men" className="link1">
                      MEN
                    </Link>

                    <div className="sub-heading">
                      <p className="headingdropdown">Topwear</p>
                      <Link to="/shirts" className="sub-sub-link">
                        Shirts
                      </Link>
                      <Link to="/kurtas" className="sub-sub-link">
                        Kurtas
                      </Link>
                      <Link to="/tshirt" className="sub-sub-link">
                        T-shirts
                      </Link>
                      <Link to="/sweater" className="sub-sub-link">
                        Sweater
                      </Link>
                      <Link to="/hoodie" className="sub-sub-link">
                        Hoodie
                      </Link>
                      <Link to="/tracksuit" className="sub-sub-link">
                        TrackSuit
                      </Link>
                    </div>
                    <div className="sub-heading">
                      <p className="headingdropdown">Bottomwear</p>
                      <Link to="/shorts" className="sub-sub-link">
                        Shorts
                      </Link>
                      <Link to="/trousers" className="sub-sub-link">
                        Trousers
                      </Link>
                      <Link to="/joggers" className="sub-sub-link">
                        Joggers
                      </Link>
                      <Link to="/pyjamas" className="sub-sub-link">
                        Pyjamas
                      </Link>
                      <Link to="/jeans" className="sub-sub-link">
                        Jeans
                      </Link>
                    </div>
                    <div className="sub-heading">
                      <p className="headingdropdown">Offers</p>
                      <Link to="/trousers" className="sub-sub-link">
                        COMBOS
                      </Link>
                      <Link to="/joggers" className="sub-sub-link">
                        JOGGERS
                      </Link>
                      <Link to="/winterwear" className="sub-sub-link">
                        WINTER WEAR
                      </Link>
                      <Link to="/shopbycollection" className="sub-sub-link">
                        SHOP BY COLLECTION
                      </Link>
                    </div>
                  </>
                )}

                {selectedCategory === "WOMEN" && (
                  <>
                    <Link to="/wommen" className="link1">
                      WOMEN
                    </Link>
                    <div className="sub-heading">
                      <p className="headingdropdown">Topwear</p>
                      <Link to="/shirtsWomen" className="sub-sub-link">
                        Shirts
                      </Link>
                      <Link to="/tshirtswomen" className="sub-sub-link">
                        T-Shirts
                      </Link>
                      <Link to="/kurtisWomen" className="sub-sub-link">
                        Kurtis
                      </Link>
                    </div>
                    <div className="sub-heading">
                      <p className="headingdropdown">Bottomwear</p>
                      <Link to="/joggersWomen" className="sub-sub-link">
                        Joggers
                      </Link>
                      <Link to="/jeansWomen" className="sub-sub-link">
                        Jeans
                      </Link>
                      <Link to="/jumpsuitWomen" className="sub-sub-link">
                        JumpSuit
                      </Link>
                    </div>
                    <div className="sub-heading">
                      <p className="headingdropdown">Offers</p>
                      <Link to="/trousers" className="sub-sub-link">
                        COMBOS
                      </Link>
                      <Link to="/joggers" className="sub-sub-link">
                        JOGGERS
                      </Link>
                      <Link to="/winterwear" className="sub-sub-link">
                        WINTER WEAR
                      </Link>
                      <Link to="/shopbycollection" className="sub-sub-link">
                        SHOP BY COLLECTION
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {isSearchbarOpen && (
        <ClickAwayListener onClickAway={handleSearchBtnClick}>
          <Popper
            open={isSearchbarOpen}
            anchorEl={anchorEl}
            placement="bottom-start"
            style={{ width: "350px" }}
          >
            <div className="search-bar">
              <input
                id="searchBarInput"
                type="text"
                placeholder="Search entire store here..."
                ref={searchInputRef}
              />
              <button onClick={handleSearch}>Search</button>
            </div>
          </Popper>
        </ClickAwayListener>
      )}

      {/* { <LoginModal isOpen={isLoginModalOpen} closeModal={closeLoginModal} /> } */}
      <AuthProvider>
        <LoginModal
          isOpen={isLoginModalOpen}
          closeModal={closeLoginModal}
          onLogin={handleLogin}
        />
        <SignupModal
          isOpen={isSignupModalOpen}
          closeModal={closeSignupModal}
          openLoginModal={openLoginModal}
        />
      </AuthProvider>
    </header>
  );
};

export default Navbar;
