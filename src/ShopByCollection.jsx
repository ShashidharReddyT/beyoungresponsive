import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductDetail from './ProductDetail';
import Filter from './Filter';
import './ShopByCollection.css';


function ShopByCollection() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [selectedColorFilter, setSelectedColorFilter] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sortByPrice, setSortByPrice] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState('All'); // Add state for selected brand
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showWishlistMessage, setShowWishlistMessage] = useState(false);

  const [showNoColorMessage, setShowNoColorMessage] = useState(true);
  const [selectedSizeFilter, setSelectedSizeFilter] = useState('All');

  useEffect(() => {
    fetchProducts();
  }, [selectedColorFilter, selectedSizeFilter, sortByPrice, selectedBrand]); // Include selectedBrand in dependency array

  const fetchProducts = async () => {
    try {
      let filter = { "subCategory": "shirt" };

      if (selectedColorFilter !== 'All') {
        filter.color = selectedColorFilter;
      }
      if (selectedSizeFilter !== 'All') {
        filter.size = selectedSizeFilter;
      }
      if (selectedBrand !== 'All') {
        filter.brand = selectedBrand;
      }

      const response = await fetch(`https://academics.newtonschool.co/api/v1/ecommerce/clothes/products?limit=100&filter=${JSON.stringify(filter)}`, {
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

  const handleSizeFilterChange = (size) => {
    setSelectedSizeFilter(size);
  };

  const handleBrandFilterChange = (brand) => {
    setSelectedBrand(brand);
  };

  // Brands to be shown as buttons
  const brands = ['Bewakoof®', 'TISTABENE', 'Campus Sutra', 'Style Quotient', 'CHIMPAAANZEE',
    // 'Breakbounce', 'Chkokko', 'XYXX', 'Rigo', 'Alstyle', 'Brown Mocha',
    // 'Hubberholme', 'Smugglerz', 'Blue Tyga', 'TALES and STORIES',
    // 'Belliskey', '7 Shores', 'Kotty', 'Thomas Scott', 'Old Grey',
    // 'BLANCK', 'Urban Scottish', 'TrueBuyWorld'
  ];

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

  return (
    <>
      <div className="brand-buttons">
        <p className='brandheading'>BRANDS</p>
        {brands.map((brand) => (
          <button key={brand} onClick={() => handleBrandFilterChange(brand)}>{brand}</button>
        ))}
      </div>
      <div className="men-container">


        <Filter
          selectedColorFilter={selectedColorFilter}
          handleColorFilterChange={handleColorFilterChange}
          selectedSizeFilter={selectedSizeFilter}
          handleSizeFilterChange={handleSizeFilterChange}
          sortByPrice={sortByPrice}
          handleSortByPriceChange={handleSortByPriceChange}
        />

        <section className="men-clothes">
          <p className="heading-men">Shop By Brand</p>
          <p className="heading-men1">Mens Clothing is all about being stylish and comfortable all day long. Beyoung understands the same and provides you with a handsome range of Clothing For Men out there. Scroll below to get a look at it.</p>

          <div className="for-shirts-pants">
            {filteredProducts
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
          <div className="popup-modal">
            <p>Please log in to add items to your wishlist.</p>
          </div>
        )}

        {showWishlistMessage && (
          <div className="popup-modal">
            <p>Product is succesfully added to wishlist!</p>
          </div>
        )}
      </div>
    </>
  );
}

export default ShopByCollection;
