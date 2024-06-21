import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Carticon from './assets/Carticon.svg';
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import { Divider, LinearProgress, Rating } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import StarIcon from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { useAuth } from './Context/UserProvider';
import { Link } from 'react-router-dom';
import "./ProductDetail.css";
import {
    useUpdateCartNumbers,
} from "./Context/CartNumberContext";

const StarRating = ({ rating }) => {
    if (typeof rating !== 'number') {
        return null; // or handle the case when rating is undefined or not a number
    }

    const maxRating = 5;
    const fullStars = Math.floor(rating);
    const remainder = rating % 1;
    const halfStar = remainder >= 0.25 && remainder <= 0.90;

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
        <span>
            {stars}
            {typeof rating === 'number' && <span className="rating-number"> ({rating.toFixed(2)})</span>}
        </span>
    );
};


function ProductDetail() {
    const { state } = useLocation();
    const itemData = state && state.itemData;
    // console.log(itemData);

    const [selectedImage, setSelectedImage] = useState("");
    const [product, setProduct] = useState("");
    const updateCartNumber = useUpdateCartNumbers();
    const { isUserLoggedIn, token } = useAuth();

    useEffect(() => {
        // Example usage
        console.log('Is user logged in:', isUserLoggedIn);
        console.log('User token:', token);

        // Your component logic here

    }, [isUserLoggedIn, token]);

    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showAddToCartMessage, setShowAddToCartMessage] = useState(false);

    const handleImageClick = (image) => {
        setSelectedImage(image);
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                if (!itemData || !itemData._id) {
                    console.error('Invalid itemData or _id');
                    return;
                }

                const response = await fetch(`https://academics.newtonschool.co/api/v1/ecommerce/product/${itemData._id}`, {
                    headers: {
                        projectID: 'yxpa71cax49z',
                    },
                });

                if (!response.ok) {
                    console.error('Failed to fetch product');
                    return;
                }

                const data = await response.json();
                setProduct(data);
                setSelectedImage(data?.displayImage);
                console.log(data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchProduct();
    }, [itemData]);

    //Adding to cart
    // Adding to cart
    const handleAddToCart = async ({ productId }) => {
        if (!isUserLoggedIn) {
            setShowLoginModal(true);
            return;
        }

        try {
            const myHeaders = new Headers();
            myHeaders.append('projectID', 'yxpa71cax49z');
            myHeaders.append('Authorization', `Bearer ${token}`);
            myHeaders.append('Content-Type', 'application/json');

            const requestOptions = {
                method: 'PATCH',
                headers: myHeaders,
                body: JSON.stringify({
                    productId: itemData._id,
                    quantity: 1,
                }),
                redirect: 'follow',
            };

            const response = await fetch(
                `https://academics.newtonschool.co/api/v1/ecommerce/cart/${itemData._id}`,
                requestOptions
            );

            if (response.ok) {
                console.log('Product added to cart successfully');

                // Assuming the API response provides the updated cart count
                const responseData = await response.json();

                updateCartNumber(responseData.data.items.length);

                // Optionally, you can update the UI or show a success message
                setShowAddToCartMessage(true);

                // Hide the message after a certain duration (e.g., 3 seconds)
                setTimeout(() => {
                    setShowAddToCartMessage(false);
                }, 3000);
            } else {
                console.error('Failed to add product to cart');
                // Optionally, you can handle different HTTP status codes here
            }
        } catch (error) {
            console.error('Error adding product to cart:', error);
        }
    };


    return (
        <div className="product-component-container">
            <div className="product-component-box">
                <div className="product-left">
                    <div className="forImageShowing">
                        {product.data?.images &&
                            product.data.images
                                .slice(0, 5)
                                .map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`Image ${index}`}
                                        onClick={() => handleImageClick(image)}
                                    />
                                ))}
                    </div>

                    {selectedImage ? (
                        <img
                            src={selectedImage}
                            alt="Selected Image"
                            onClick={() => handleImageClick(selectedImage)}
                        />
                    ) : (
                        product.data?.displayImage && (

                            <img
                                src={product.data.displayImage}
                                alt="Default Display Image"
                            // onClick={() => handleImageClick(product.data.displayImage)}
                            />

                        )
                    )}
                </div>

                <div className="product-right">
                    <h5>{product.data?.name}</h5>
                    <p>{product.data?.subCategory}</p>
                    <b>&#8377; {product.data?.price}</b>
                    {/* <span className='offer'>&nbsp; &nbsp;(50% off)</span> */}
                    <span className="discounted-text">
                        Inclusive of All Taxes + Free Shipping
                    </span>
                    <section className="rating-container">
                        <StarRating rating={product.data?.ratings} />
                    </section>



                    {/* color of the product */}
                    <p className='colorr'>COLOR: {product.data?.color}</p>


                    {/* size chart */}

                    <label htmlFor="sizeChart">SIZE</label>
                    <div className="size-chart-container">
                        {product.data?.size &&
                            product.data.size.map((size, index) => (
                                <button
                                    key={index}
                                    className={`size-button ${product.selectedSize === size ? 'selected' : ''}`}
                                    onClick={() => setProduct({ ...product, selectedSize: size })}
                                >
                                    {size}
                                </button>
                            ))}
                    </div>

                    <label htmlFor="qty">
                        QTY<sup>*</sup>

                        <select name="" id="">
                            <option value="">Select</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="1">4</option>
                            <option value="2">5</option>
                            <option value="3">6</option>
                            <option value="1">7</option>
                            <option value="2">8</option>
                            <option value="3">9</option>
                            <option value="1">10</option>

                        </select>
                    </label>

                    <div className="btn-cart-buy">
                        <button className="btn-cart" onClick={handleAddToCart}>
                            <img src={Carticon} alt='cart' className='cartloggo' /> add to cart
                        </button>
                        <button className="btn-buy">
                            <Link to='/cart' className='cartbtn'>
                                <ArrowCircleRightIcon /> buy now
                            </Link>
                        </button>
                        {showAddToCartMessage && (
                            <div className="popup-modal">
                                <p>Product is succesfully added to Cart!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="product-description-container">
                <h3>Product Description</h3>
                <div
                    dangerouslySetInnerHTML={{ __html: itemData?.description || '' }}
                    className="product-description"
                />
            </div>

            {/* <div className="product-info-container">
                <h3>Product Details</h3>
                <div className="product-details-section">
                    {[...Array(4).keys()].map((index) => (
                        <div key={index} className="product-details-box">
                            <h5>Product Highlights</h5>
                            
                            <content>
                                Product Highlights
                                Fabric	Bio-washed Cotton
                                Neck	Round Neck
                                Pattern	Printed
                                Sleeve	Half-sleeves
                                Fit	Regular-fit
                                Style	Casual Wear
                            </content>
                        </div>
                    ))}
                </div>
            </div> */}
            <div className="ratings-review-container">
                <h3>Rating & Reviews</h3>
                <div className="ratings-review-section">
                    <div className="review-section-left">
                        <h3>{product.data?.ratings.toFixed(2)}</h3>
                        <StarRating rating={product.data?.ratings} />
                        <p>Based on 31K+ ratings and 9K+ reviews</p>
                    </div>
                    <div className="review-section-right">
                        <h4>Product reviews</h4>
                        <p>
                            <ThumbUpIcon />
                            91% of customers recommend this brand
                        </p>
                        <Divider sx={{ marginBottom: "2rem" }} />
                        {[5, 4, 3, 2, 1].map((rating) => (
                            <div key={rating} className="rating-bar">
                                <span>{rating}</span>
                                <StarBorderIcon />
                                <LinearProgress
                                    style={{ width: "70%" }}
                                    color="inherit"
                                    variant="determinate"
                                    value={80}
                                />
                                <span>80+</span>{" "}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="about-us-container">
                <ul>

                    <li>
                        <img
                            src={"https://www.beyoung.in/desktop/images/product-details-2/product-discription-icon1.jpg"}
                            alt={'icon'}
                        />
                        <p>1.5M+ Happy Beyoungsters</p>
                    </li>
                    <li>
                        <img
                            src={"https://www.beyoung.in/desktop/images/product-details-2/product-discription-icon2.jpg"}
                            alt={'icon'}
                        />
                        <p>15 Days Easy Returns</p>
                    </li>
                    <li>
                        <img
                            src={"https://www.beyoung.in/desktop/images/product-details-2/product-discription-icon3.jpg"}
                            alt={'icon'}
                        />
                        <p>Homegrown Brand</p>
                    </li>
                    <li>
                        <img
                            src={"https://www.beyoung.in/desktop/images/product-details-2/product-discription-icon4.jpg"}
                            alt={'icon'}
                        />
                        <p>Packed with Safety</p>
                    </li>

                </ul>
            </div>
        </div>
    );
}

export default ProductDetail;