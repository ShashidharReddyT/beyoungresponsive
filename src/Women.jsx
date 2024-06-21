import React, { useState, useEffect, useMemo } from 'react';
import './men.css';
import { useNavigate } from 'react-router-dom';
import ProductDetail from './ProductDetail';
import Filter from './Filter';
import { useAuth } from './Context/UserProvider';
function Women() {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedColorFilter, setSelectedColorFilter] = useState('All');
    const [sortByPrice, setSortByPrice] = useState(null); // Initialize with null
    const navigate = useNavigate();
    const { isUserLoggedIn } = useAuth();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showWishlistMessage, setShowWishlistMessage] = useState(false);
    const { token } = useAuth();
    const [selectedSizeFilter, setSelectedSizeFilter] = useState('All');

    useEffect(() => {
        fetchProducts();
    }, [selectedColorFilter, sortByPrice, selectedSizeFilter]);

    async function fetchProducts() {
        try {
            let filter = { "gender": "Women" };

            if (selectedColorFilter !== 'All') {
                filter.color = selectedColorFilter;
            }
            if (selectedSizeFilter !== 'All') {
                filter.size = selectedSizeFilter;
            }
            const response = await fetch(`https://academics.newtonschool.co/api/v1/ecommerce/clothes/products?filter=${JSON.stringify(filter)}`,
                {
                    method: 'GET',
                    headers: {
                        projectID: 'yxpa71cax49z',
                    },
                });

            if (response.ok) {
                const data = await response.json();
                let sortedProducts = data.data;

                if (sortByPrice !== null) {
                    sortedProducts = sortedProducts.sort((a, b) => (sortByPrice ? a.price - b.price : b.price - a.price));
                }

                setFeaturedProducts(sortedProducts);
            } else {
                console.error('Failed to fetch products');
            }
        } catch (error) {
            console.error('An error occurred while fetching products', error);
        }
    };

    const handleProductClick = (product) => {
        navigate(`/product/${product._id}`, {
            state: { itemData: product },
        });
    };

    const handleColorFilterChange = (color) => {
        setSelectedColorFilter(color);
    };

    const handleSortByPriceChange = (sortOrder) => {
        setSortByPrice(sortOrder === 'lowToHigh');
    };
    const handleSizeFilterChange = (size) => {
        setSelectedSizeFilter(size);
    };

    const filteredProducts = useMemo(() => {
        let filteredList = [...featuredProducts];

        if (selectedColorFilter !== 'All') {
            filteredList = filteredList.filter((product) => product.color === selectedColorFilter);
        }

        if (sortByPrice) {
            filteredList = filteredList.sort((a, b) => a.price - b.price);
        }

        return filteredList;
    }, [featuredProducts, selectedColorFilter, sortByPrice]);


    const addToWishlist = async (productId) => {
        console.log(productId)
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
                body: JSON.stringify({ productId }),
                redirect: 'follow',
            };

            const response = await fetch(
                `https://academics.newtonschool.co/api/v1/ecommerce/wishlist`,
                requestOptions
            );

            if (response.ok) {
                console.log('Product added to wishlist successfully');
                setShowWishlistMessage(true); // Set state to show wishlist message
            } else {
                console.error('Failed to add product to wishlist');
                // Handle different HTTP status codes here
            }
        } catch (error) {
            console.error('Error adding product to wishlist:', error);
        }
    };


    const loginModalStyle = {
        display: showLoginModal ? 'block' : 'none',
    };

    useEffect(() => {
        if (showLoginModal) {
            const timeoutId = setTimeout(() => {
                setShowLoginModal(false);
            }, 1500);

            // Cleanup the timeout to avoid memory leaks
            return () => clearTimeout(timeoutId);
        }
    }, [showLoginModal]);

    useEffect(() => {
        if (showWishlistMessage) {
            const timeoutId = setTimeout(() => {
                setShowWishlistMessage(false);
            }, 1500);

            return () => clearTimeout(timeoutId);
        }
    }, [showWishlistMessage]);

    return (
        <div className='bannerswomen'>
            <img src="https://www.beyoung.in/api//cache/catalog/products/banner_desktop/Women-clothing-banner-desktop-view_28_07_2023_1920x475.jpg" alt='womenbannerimg' className='womenbanner' />
            <div className="men-container">
                <Filter
                    selectedColorFilter={selectedColorFilter}
                    handleColorFilterChange={handleColorFilterChange}
                    sortByPrice={sortByPrice}
                    handleSortByPriceChange={handleSortByPriceChange}
                    selectedSizeFilter={selectedSizeFilter}
                    handleSizeFilterChange={handleSizeFilterChange}
                />
                <section className="men-clothes">
                    <p className="heading-men">Women's Clothing</p>
                    <p className='heading-men1'>Women's Clothing - Get your hands on stylish and comfortable clothing for women - Buy a range of ladies' clothing online at affordable prices. Beyoung offers the latest collection of Kurtis, shirts, tops, t-shirts, pants, boxers, and jeggings with existing offers and discounts. Find women's clothing for formal to weekend outings in all styles. Free Shipping | COD | S - 4XL Sizes | 15 Days Return</p>
                    <div className="for-shirts-pants">
                        {filteredProducts.map((product) => (
                            <div key={product._id} onClick={() => handleProductClick(product)} className="product-container">
                                {/* Product Image and Details */}
                                <div id='zoom-In' className="product-image">
                                    <button
                                        className="wishlist-button"
                                        onClick={(e) => { e.stopPropagation(); addToWishlist(product._id) }}
                                    >
                                        🖤
                                    </button>
                                    <figure className="product-figure">
                                        <img src={product.displayImage} alt={product.name} loading="lazy" />
                                    </figure>

                                </div>


                                <div className="product-details">
                                    <p className='productheadingg'>{product.name}</p>
                                    <p className='productheadinggg'>{product.subCategory}</p>
                                    <p className='productheadingg'>₹{product.price}</p>
                                </div>

                                {/* Wishlist button in the top right corner */}

                            </div>
                        ))}
                    </div>
                </section>



                {selectedProduct && <ProductDetail product={selectedProduct} />}
                {showLoginModal && (
                    <div className="popup-modal" style={loginModalStyle}>
                        <p>Please log in to add items to your wishlist.</p>
                    </div>

                )}

                {showWishlistMessage && (
                    <div className="popup-modal">
                        <p>Product is succesfully added to wishlist!</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Women;
