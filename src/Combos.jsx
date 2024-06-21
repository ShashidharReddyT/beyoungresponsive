import { useState, useEffect } from 'react';
import "./men.css";
function Men() {
    const [featuredProducts, setFeaturedProducts] = useState([]);

    useEffect(() => {
        // Fetch featured products from the API here
        fetchProducts();
    }, []);

    async function fetchProducts() {
        try {
            const response = await fetch('https://academics.newtonschool.co/api/v1/ecommerce/clothes/products?filter={"subCategory":"trouser"}', {
                method: 'GET',
                headers: {
                    projectID: 'yxpa71cax49z',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setFeaturedProducts(data.data);
            } else {
                console.error('Failed to fetch products');
            }
        } catch (error) {
            console.error('An error occurred while fetching products', error);
        }
    }

    return (
        <div className="men-container">

            <section className="men-clothes">
                <p className="heading-men">Combos</p>
                <div className="for-shirts-pants">
                    {/* Implement product carousels for different categories */
                        featuredProducts
                            // Filter products by gender
                            .map((product) => (
                                <div key={product._id}>

                                    <img src={product.displayImage} alt={product.name} />
                                    <h3>{product.name}</h3>
                                    <p>{product.category}</p>
                                    <p>Price: ${product.price}</p>
                                </div>
                            ))}
                </div>
            </section>


        </div>
    );
}

export default Men;
