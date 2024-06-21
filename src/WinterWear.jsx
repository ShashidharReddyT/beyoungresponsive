import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate from React Router

import ProductDetail from './ProductDetail';
import './WinterWear.css';
import { useAuth } from './Context/UserProvider';
import Filter from './Filter';
// import "./men.css";
function MenSweater() {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [selectedColorFilter, setSelectedColorFilter] = useState('All');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [fetchError, setFetchError] = useState(null);
    const [sortByPrice, setSortByPrice] = useState(false);
    const navigate = useNavigate();
    const { isUserLoggedIn } = useAuth();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showWishlistMessage, setShowWishlistMessage] = useState(false);
    const { token } = useAuth();
    const [showNoColorMessage, setShowNoColorMessage] = useState(true);
    useEffect(() => {
        fetchProducts();
    }, [selectedColorFilter, sortByPrice]);

    const fetchProducts = async () => {
        try {
            let filter = { "subCategory": "sweater" };

            if (selectedColorFilter !== 'All') {
                filter.color = selectedColorFilter;
            }

            const response = await fetch(`https://academics.newtonschool.co/api/v1/ecommerce/clothes/products?filter=${JSON.stringify(filter)}`, {
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

    const handleSortByPriceChange = () => {
        setSortByPrice(!sortByPrice);
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

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate some asynchronous task
        const timeoutId = setTimeout(() => {
            setLoading(false);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, []);

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
        <div className='bannersss'>
            <img src="https://www.beyoung.in/api/catalog/products/banner_desktop/black-friday-category-banner-desktop-view_21_11_2023.jpg" alt='sweaterimg' className='bannersweater' />
            <div className='winterwearsub' >
                <Link to='/winterwear' className='link'>
                    <img src="https://www.beyoung.in/api/catalog/products/banner_desktop/winter-filter_21_11_2023.jpg" alt='sweaterimg' className='bannersweatersub' />
                </Link>
                <Link to='/hoodie' className='link'>
                    <img src="https://www.beyoung.in/api/catalog/products/banner_desktop/winter-filter3.jpg" alt='sweaterimg' className='bannersweatersub' />
                </Link>
            </div>

            <div className="men-container">
                <Filter
                    selectedColorFilter={selectedColorFilter}
                    handleColorFilterChange={handleColorFilterChange}
                    sortByPrice={sortByPrice}
                    handleSortByPriceChange={handleSortByPriceChange}
                />
                <section className="men-clothes">
                    <p className="heading-men">Mens Winter Wears</p>
                    <p className="heading-men1">Men Winter Wear - Buy Winter Wear for Men Online in India at BeYOUng. Shop Mens Winterwear Online @Best Prices. Select a wide range of latest collection on Winterwear for Men. *Free Shipping and *COD Available.</p>
                    <div className="for-shirts-pants">
                        {filteredProducts
                            .filter((product) => product.gender === 'Men')
                            .map((product) => (
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
                                </div>
                            ))}

                        {filteredProducts.length === 0 && showNoColorMessage && (
                            <p className='nocolor'>No products found with the selected color: {selectedColorFilter}</p>
                        )}
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

export default MenSweater;
