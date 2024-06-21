import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProductDetail from './ProductDetail';
import { useNavigate } from 'react-router-dom';
import './SearchPage.css';
const SearchPage = () => {
    const location = useLocation();
    const searchQuery = new URLSearchParams(location.search).get('name');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (searchQuery) {
                const encodedSearchQuery = encodeURIComponent(`{"name": "${searchQuery.toLowerCase()}"}`);
                const apiUrl = `https://academics.newtonschool.co/api/v1/ecommerce/clothes/products?search=${encodedSearchQuery}`;
                const myHeaders = new Headers();
                myHeaders.append("projectID", "yxpa71cax49z");
                const requestOptions = {
                    method: 'GET',
                    headers: myHeaders,
                    redirect: 'follow',
                };

                try {
                    const response = await fetch(apiUrl, requestOptions);
                    const result = await response.json();
                    if (response.ok) {
                        if (result.status === 'success' && result.results > 0) {
                            setSearchResults(result.data);
                        } else {
                            setSearchResults([]);
                        }
                    } else {
                        console.log('Error:', result.message);
                        setSearchResults([]);
                    }
                } catch (error) {
                    console.log('Fetch Error:', error);
                    setSearchResults([]);
                }
            }
        };

        fetchSearchResults();
    }, [searchQuery]);

    const handleProductClick = (product) => {
        navigate(`/product/${product._id}`, {
            state: { itemData: product },
        });
    };

    return (
        <div className="men-container">
            <section className="men-clothessearch">
                <p className="heading-mensearch">Search Results:</p>
                <div className="for-shirts-pants">
                    {searchResults.length > 0 ? (
                        searchResults.map((product) => (
                            <div key={product._id} onClick={() => handleProductClick(product)} id='zoom-In'>
                                <figure>
                                    <img src={product.displayImage} alt={product.name} loading="lazy" />
                                </figure>
                                <p className='headingsearch'>{product.name}</p>
                                <p className='headingsearch1'>{product.subCategory}</p>
                                <p className='headingsearch'>₹{product.price}</p>
                            </div>
                        ))
                    ) : (
                        <p>No results found</p>
                    )}
                </div>
            </section>
            {selectedProduct && <ProductDetail product={selectedProduct} />}
        </div>
    );
};

export default SearchPage;
