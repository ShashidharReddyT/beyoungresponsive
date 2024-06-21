import React, { useEffect, useState } from 'react';
import { useAuth } from './Context/UserProvider';
import { Link, useNavigate } from 'react-router-dom';
import { Divider } from '@mui/material';
import './CartProduct.css';
import {
    useUpdateCartNumbers,
} from "./Context/CartNumberContext";


const CartProduct = () => {
    const { isUserLoggedIn, token, updateResultData } = useAuth();
    const [cartProductList, setCartProductList] = useState([]);
    const navigate = useNavigate();
    const [couponCode, setCouponCode] = useState('');
    const [isCouponApplied, setIsCouponApplied] = useState(false);
    const updateCartNumbers = useUpdateCartNumbers();
    const [showWishlistMessage, setShowWishlistMessage] = useState(false);

    const applyCoupon = () => {
        if (couponCode === 'BEYOUNG100') {
            setIsCouponApplied(true);
        } else {
            console.log('Invalid coupon code');
        }
    };
    const removeCoupon = () => {
        setIsCouponApplied(false);
        setCouponCode('');
    };

    useEffect(() => {
        const fetchCartProducts = async () => {
            if (!isUserLoggedIn) {
                return;
            }

            try {
                const myHeaders = new Headers();
                myHeaders.append('projectID', 'yxpa71cax49z');
                myHeaders.append('Authorization', `Bearer ${token}`);

                const requestOptions = {
                    method: 'GET',
                    headers: myHeaders,
                    redirect: 'follow',
                };

                const response = await fetch(
                    'https://academics.newtonschool.co/api/v1/ecommerce/cart',
                    requestOptions
                );
                const result = await response.json();

                console.log('Fetched cart products:', result);

                setCartProductList(result.data.items || []);

                updateCartNumbers(result.data.items.length || 0);

                updateResultData(result);
            } catch (error) {
                console.error('Error fetching cart products:', error);
            }
        };

        fetchCartProducts();
    }, [isUserLoggedIn, token]);

    const removeFromCart = async (productId) => {
        try {
            const myHeaders = new Headers();
            myHeaders.append('projectID', 'yxpa71cax49z');
            myHeaders.append('Authorization', `Bearer ${token}`);

            const requestOptions = {
                method: 'DELETE',
                headers: myHeaders,
                redirect: 'follow',
            };

            const response = await fetch(
                `https://academics.newtonschool.co/api/v1/ecommerce/cart/${productId}`,
                requestOptions
            );

            const result = await response.json();
            console.log(result);

            updateCartNumbers(result.data.items.length);

            setCartProductList(prevList =>
                prevList.filter(product => product.product._id !== productId)
            );
        } catch (error) {
            console.error('Error removing product from cart:', error);
        }
    };
    const moveToWishlist = async (productId) => {
        try {
            await removeFromCart(productId);

            const movedProduct = cartProductList.find(item => item.product._id === productId);

            if (movedProduct) {
                await addToWishlist(movedProduct.product);

            }
        } catch (error) {
            console.error('Error moving product to wishlist:', error);
        }
    };
    const addToWishlist = async (productId) => {
        console.log(productId)
        if (!isUserLoggedIn) {

            return;
        }

        try {
            const myHeaders = new Headers();
            myHeaders.append('projectId', 'yxpa71cax49z');
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
                setShowWishlistMessage(true); 
            } else {
                console.error('Failed to add product to wishlist');
                
            }
        } catch (error) {
            console.error('Error adding product to wishlist:', error);
        }
    };


    const handleQtyChange = (event, productId) => {
      
        const newQuantity = parseInt(event.target.value, 10);

        setCartProductList(prevList =>
            prevList.map(product => {
              
                if (product.product._id === productId) {
          
                    return {
                        ...product,
                        quantity: newQuantity,
                    };
                }
              
                return product;
            })
        );
    };

    const handleProductClick = (cartItem) => {
        navigate(`/product/${cartItem.product._id}`, {
            state: { itemData: cartItem.product },
        });
    };

    const calculatePriceDetails = () => {
        let totalMRP = 0;
        let beyoungDiscount = isCouponApplied ? 300 : 200;

        cartProductList.forEach(cartItem => {
            totalMRP += cartItem.product.price * cartItem.quantity;
            beyoungDiscount += (cartItem.product.discount || 0) * cartItem.quantity;
        });

        const shipping = 49; 
        const cartTotal = totalMRP - beyoungDiscount;
        const totalAmount = cartTotal + shipping;

        return {
            totalMRP,
            beyoungDiscount,
            shipping,
            cartTotal,
            totalAmount,
        };
    };

    const priceDetails = calculatePriceDetails();
    
     const clearCart = async () => {
        try {
            const myHeaders = new Headers();
            myHeaders.append('Authorization', `Bearer ${token}`);
            myHeaders.append('projectID', 'yxpa71cax49z');

            const requestOptions = {
                method: 'DELETE',
                headers: myHeaders,
                redirect: 'follow',
            };

            const response = await fetch(
                'https://academics.newtonschool.co/api/v1/ecommerce/cart/',
                requestOptions
            );

            if (response.ok) {
                console.log('Cart cleared successfully');
                setCartProductList([]);
                updateCartNumbers(0);
            } else {
                console.error('Failed to clear cart');
            }
        } catch (error) {
            console.error('Error clearing cart:', error);
        }
    };
    return (
        <div className="cart-items-container">
            {cartProductList && cartProductList.length === 0 ? (
                <div style={{ textAlign: 'center' }}>
                    <img
                        src="https://www.beyoung.in/desktop/images/checkout/EMPTY%20CARTORDER%20PAGE..png"
                        alt="cartbag"
                        style={{ width: '350px' }}
                        className="cartproductimage"
                    />
                    <p style={{ marginTop: '0', fontSize: '25px' }} className="nothingbag">
                        Nothing in the bag.
                    </p>
                    <Link to="/">
                        <button
                            style={{
                                width: '300px',
                                height: '2.5rem',
                                fontWeight: 'bold',
                                fontSize: '18px',
                                color: 'white',
                                backgroundColor: 'black',
                                borderRadius: '10px',
                                border: '1px solid rgb(66, 162, 162)',
                                cursor: 'pointer',
                            }}
                            className="buttoncartnothings"
                        >
                            Continue Shopping
                        </button>
                    </Link>
                </div>
            ) : (
                <ul className="cart-itemss">
                    <p className="cartitemsheading">Your Cart Items</p>
                    {cartProductList && cartProductList.length > 0 && (
                                
                        <div className="enter-code">
                            <Link to="/">
                                <button
                                    
                                    onClick={clearCart}
                                >
                                    Empty Cart
                                </button>
                            </Link>
                        </div>
                    )}
                    {cartProductList?.map((cartItem) => (
                        <div key={cartItem.product._id} className="cart-item-card">
                            <section className="cart-item-content">
                                <div className="cart-item-img" onClick={() => handleProductClick(cartItem)}>
                                    <Link to={`/product/${cartItem.product._id}`}>
                                        <img
                                            src={cartItem.product.displayImage}
                                            alt={cartItem.product.name}
                                            className="cartproductimge"
                                        />
                                    </Link>
                                </div>
                                <div className="cart-item-details">
                                    <p>{cartItem.product.name}</p>
                                    <p>&#8377;{cartItem.product.price}</p>
                                    <div className="cart-item-qty">
                                        <label htmlFor="quantity">QTY:</label>
                                        <select
                                            name="quantity"
                                            id="quantity"
                                            value={cartItem.quantity}
                                            onChange={(event) => handleQtyChange(event, cartItem.product._id)}
                                        >
                                            {Array.from({ length: 10 }, (_, index) => (
                                                <option key={index + 1} value={index + 1}>
                                                    {index + 1}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </section>
                            <Divider />
                            <section className="cart-action-btns">
                                <button
                                    onClick={() => removeFromCart(cartItem.product._id)}
                                    style={{ borderRight: '1px solid #E6E6E6' }}
                                >
                                    Remove
                                </button>
                                {cartItem.product._id ? (
                                    <button onClick={() => moveToWishlist(cartItem.product._id)}>
                                        Move To Wishlist
                                    </button>
                                ) : (
                                    <span>ID not available</span>
                                )}
                            </section>
                        </div>
                    ))}
                </ul>
            )}

            {/* New section for Offers & Benefits and PRICE DETAILS */}
            {cartProductList && cartProductList.length > 0 && (
                <div className="cart-price-details">
                    <div className="offers-benefits">
                        <p>Offers & Benefits</p>
                        <div className="enter-code">
                            <label htmlFor="promo-code">Enter code</label>
                            <input
                                type="text"
                                id="promo-code"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                            />
                            <button onClick={applyCoupon}>APPLY</button>
                            {isCouponApplied && <button onClick={removeCoupon}>Remove Coupon</button>}
                        </div>
                        {isCouponApplied && <p>Coupon applied successfully!</p>}
                        <p>Flat ₹100 off on orders above ₹999 - BEYOUNG100</p>
                    </div>

                    <div className="price-details">
                        <p>PRICE DETAILS ({cartProductList.length} items)</p>
                        <div className="price-breakdown">
                            <p>Total MRP (Inc. of Taxes)</p>
                            <p>₹{priceDetails.totalMRP}</p>
                        </div>
                        {isCouponApplied && (
                            <div className="price-breakdown">
                                <p>Coupon Applied</p>
                                <p>- ₹100</p>
                            </div>
                        )}
                        <div className="price-breakdown">
                            <p>Beyoung Discount</p>
                            <p>- ₹200</p>
                        </div>
                        <div className="price-breakdown total-amount">
                            <p>Shipping</p>
                            <p>₹{priceDetails.shipping}</p>
                        </div>
                        <div className="price-breakdown total-amount">
                            <p>Cart Total</p>
                            <p>₹{priceDetails.cartTotal}</p>
                        </div>
                        <div className="price-breakdown total-amount">
                            <p>Total Amount</p>
                            <p>₹{priceDetails.totalAmount}</p>
                        </div>
                        <div className="enter-code">
                            <Link to="/cart2" >
                                <button>Checkout Securely</button>
                            </Link>

                        </div>
                    </div>
                </div>
            )}
            {/* New section for Offers & Benefits and PRICE DETAILS */}
            
        </div>
    );
};

export default CartProduct;
