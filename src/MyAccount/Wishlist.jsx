import { useEffect, useState } from "react";
import { useAuth } from "../Context/UserProvider";
import "./Wishlist.css";
import { Link } from "react-router-dom";
import { useUpdateCartNumbers } from "../Context/CartNumberContext";
import StarIcon from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { Flex, Button, Text } from "@chakra-ui/react";

const Wishlist = () => {
  const { isUserLoggedIn, token } = useAuth();
  const [favProductList, setFavProductList] = useState([]);
  const updateCartNumber = useUpdateCartNumbers();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAddToCartMessage, setShowAddToCartMessage] = useState(false);
  useEffect(() => {
    const fetchFavProducts = async () => {
      if (!isUserLoggedIn) {
        // Handle the case when the user is not logged in
        return;
      }

      try {
        const myHeaders = new Headers();
        myHeaders.append("projectID", "yxpa71cax49z");
        myHeaders.append("Authorization", `Bearer ${token}`);

        const requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow",
        };

        const response = await fetch(
          "https://academics.newtonschool.co/api/v1/ecommerce/wishlist",
          requestOptions
        );
        const data = await response.json();

        console.log("Fetched favorite products:", data);

        const listOfFavProducts = data.data.items || [];
        setFavProductList(listOfFavProducts);
      } catch (error) {
        console.error("Error fetching favorite products:", error);
      }
    };

    fetchFavProducts();
  }, [isUserLoggedIn, token]);

  const removeFromWishlist = async (productId) => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("projectID", "yxpa71cax49z");
      myHeaders.append("Authorization", `Bearer ${token}`);

      const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        redirect: "follow",
      };

      const response = await fetch(
        `https://academics.newtonschool.co/api/v1/ecommerce/wishlist/${productId}`,
        requestOptions
      );

      const result = await response.text();
      console.log(result);

      // After successfully removing from wishlist, update the state directly
      setFavProductList((prevList) =>
        prevList.filter((product) => product.products._id !== productId)
      );
    } catch (error) {
      console.error("Error removing product from wishlist:", error);
    }
  };

  // Adding to cart
  const handleAddToCart = async (productId) => {
    if (!isUserLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    try {
      const myHeaders = new Headers();
      myHeaders.append("projectID", "yxpa71cax49z");
      myHeaders.append("Authorization", `Bearer ${token}`);
      myHeaders.append("Content-Type", "application/json");

      // Find the product in the wishlist data based on productId
      const selectedProduct = favProductList.find(
        (product) => product.products._id === productId
      );

      if (!selectedProduct) {
        console.error("Selected product not found in the wishlist");
        return;
      }

      const requestOptions = {
        method: "PATCH",
        headers: myHeaders,
        body: JSON.stringify({
          productID: selectedProduct.products._id,
          quantity: 1,
        }),
        redirect: "follow",
      };

      console.log("Product ID:", selectedProduct.products._id);

      const response = await fetch(
        `https://academics.newtonschool.co/api/v1/ecommerce/cart/${selectedProduct.products._id}`, // Use the correct URL for adding to cart
        requestOptions
      );

      if (response.ok) {
        console.log("Product added to cart successfully");
        setShowAddToCartMessage(true); // Set state to show success message

        const responseData = await response.json();

        // Update the cart number using the correct count value
        updateCartNumber(responseData.data.items.length);

        // Hide the success message after 1500 milliseconds (1.5 seconds)
        setTimeout(() => {
          setShowAddToCartMessage(false);
        }, 1500);
      } else {
        console.error("Failed to add product to cart");
        // Optionally, you can handle different HTTP status codes here
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };
  const StarRating = ({ rating }) => {
    if (typeof rating !== "number" || isNaN(rating)) {
      return null;
    }

    const maxRating = 5;
    const fullStars = Math.floor(rating);
    const remainder = rating % 1;
    const halfStar = remainder >= 0.25 && remainder <= 0.9;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarIcon key={i} />);
    }

    if (halfStar) {
      stars.push(<StarHalfIcon key="half" />);
    }

    const emptyStars = maxRating - stars.length;

    for (let i = 0; i < emptyStars; i++) {
      stars.push(<StarBorderIcon key={`empty${i}`} />);
    }

    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        {stars}
        <span className="rating-number"> ({rating.toFixed(2)})</span>
      </div>
    );
  };

  return (
    <section className="wishlist-section">
      <div className="whilistmobile">
        <h2 className="wishlist-heading">Wishlist</h2>
        {favProductList.length === 0 ? (
          <div>
            <p className="wishlist-heading">
              Your wishlist is empty. Start adding products!
            </p>
            <Flex
              style={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src="https://www.beyoung.in/desktop/images/checkout/EMPTY%20CARTORDER%20PAGE..png"
                alt="cartbag"
                style={{ width: "350px" }}
                className="cartproductimage"
              />
              <Text
                style={{ marginTop: "0", fontSize: "25px" }}
                className="nothingbag"
              >
                Nothing in the bag.
              </Text>
              <Link to="/">
                <Button
                  style={{
                    width: "300px",
                    height: "2.5rem",
                    fontWeight: "bold",
                    fontSize: "18px",

                    color: "white",
                    backgroundColor: "black",
                    borderRadius: "10px",
                    border: "1px solid rgb(66, 162, 162)",
                    cursor: "pointer",
                  }}
                  className="buttoncartnothings"
                >
                  Continue Shopping
                </Button>
              </Link>
            </Flex>
          </div>
        ) : (
          <ul className="wishlist-items">
            <div className="wishlist-grid">
              {favProductList.map((product) => (
                <div
                  key={product.products._id}
                  className="wishlist-item"
                  id="zoom-In1"
                >
                  <figure className="wishlist-product-figure">
                    <img
                      src={product.products.displayImage}
                      alt={product.products.name}
                      loading="lazy"
                      className="wishlist-image"
                    />
                  </figure>
                  <p className="wishlist-product-heading">
                    {product.products.name}
                  </p>
                  <section className="wishlist-product-info">
                    Ratings:
                    <StarRating rating={product.products.ratings} />
                  </section>
                  <button
                    className="remove-button"
                    onClick={() => removeFromWishlist(product.products._id)}
                  >
                    Remove ❤️
                  </button>
                  <button
                    className="remove-button"
                    onClick={() => handleAddToCart(product.products._id)}
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </ul>
        )}
        {showAddToCartMessage && (
          <div className="popup-modal">
            <p>Product added to cart successfully!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Wishlist;
