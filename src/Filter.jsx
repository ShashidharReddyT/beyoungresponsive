import React, { useState, useRef, useEffect } from 'react';
import './Filter.css';

const FilterSection = ({
    handleColorFilterChange,
    handleSortByPriceChange,
    handleSizeFilterChange
}) => {
    const [isColorDropdownOpen, setIsColorDropdownOpen] = useState(false);
    const [isPriceDropdownOpen, setIsPriceDropdownOpen] = useState(false);
    const [isSizeDropdownOpen, setIsSizeDropdownOpen] = useState(false);
    const colorDropdownRef = useRef(null);
    const priceDropdownRef = useRef(null);
    const sizeDropdownRef = useRef(null);

    useEffect(() => {

        // Close the color dropdown if clicked outside of it
        const handleOutsideClick = (event) => {
            // Close the color dropdown if clicked outside of it
            if (colorDropdownRef.current && !colorDropdownRef.current.contains(event.target)) {
                setIsColorDropdownOpen(false);
            }

            // Close the price dropdown if clicked outside of it
            if (priceDropdownRef.current && !priceDropdownRef.current.contains(event.target)) {
                setIsPriceDropdownOpen(false);
            }

            // Close the size dropdown if clicked outside of it
            if (sizeDropdownRef.current && !sizeDropdownRef.current.contains(event.target)) {
                setIsSizeDropdownOpen(false);
            }
        };

        // Attach the event listener to the document body
        document.body.addEventListener('click', handleOutsideClick);

        // Cleanup the event listener on component unmount
        return () => {
            document.body.removeEventListener('click', handleOutsideClick);
        };
    }, []);

    const handleColorButtonClick = () => {
        setIsColorDropdownOpen(!isColorDropdownOpen);
    };

    const handlePriceButtonClick = () => {
        setIsPriceDropdownOpen(!isPriceDropdownOpen);
    };

    const handleSizeButtonClick = () => {
        setIsSizeDropdownOpen(!isSizeDropdownOpen);
    };

    return (
        <section className="filter-section">
            <div className="color-filter">
                <div
                    ref={colorDropdownRef}
                    className={`color-filter dropdowncolor ${isColorDropdownOpen ? 'active' : ''}`}
                >
                    <p className='heading-menfilter'>FILTER</p>
                    <button onClick={handleColorButtonClick} className='choosecolor'>
                        Choose Color
                    </button>
                    <div className="dropdown-contentcolor">
                        <button className="black" onClick={() => handleColorFilterChange('All')}>All</button>
                        <button className="red" onClick={() => handleColorFilterChange('RED')}></button>
                        <button className="orange" onClick={() => handleColorFilterChange('ORANGE')}></button>
                        <button className="blue" onClick={() => handleColorFilterChange('BLUE')}></button>
                        <button className="cream" onClick={() => handleColorFilterChange('CREAM')}></button>
                        <button className="yellow" onClick={() => handleColorFilterChange('YELLOW')}></button>
                        <button className="green" onClick={() => handleColorFilterChange('GREEN')}></button>
                        <button className="black" onClick={() => handleColorFilterChange('BLACK')}></button>
                        <button className="maroon" onClick={() => handleColorFilterChange('MAROON')}></button>
                        <button className="purple" onClick={() => handleColorFilterChange('PURPLE')}></button>
                        <button className="beige" onClick={() => handleColorFilterChange('BEIGE')}></button>
                        <button className="grey" onClick={() => handleColorFilterChange('GREY')}></button>
                        <button className="white" onClick={() => handleColorFilterChange('WHITE')}></button>
                        <button className="pink" onClick={() => handleColorFilterChange('PINK')}></button>
                    </div>
                </div>
            </div>
            <div
                ref={priceDropdownRef}
                className={`sort-by-price dropdowncolor ${isPriceDropdownOpen ? 'active' : ''}`}>
                <button onClick={handlePriceButtonClick} className='choosecolor'>
                    Choose Price
                </button>
                <div className="dropdown-contentcolor1">
                    <button onClick={() => handleSortByPriceChange('lowToHigh')}>Low to high</button>
                    <button onClick={() => handleSortByPriceChange('highToLow')}>High to Low</button>
                </div>
            </div>

            <div
                ref={sizeDropdownRef}
                className={`size-filter dropdowncolor ${isSizeDropdownOpen ? 'active' : ''}`}>
                <button onClick={handleSizeButtonClick} className='choosecolor'>
                    Choose Size
                </button>
                <div className="dropdown-contentcolor2">
                    <button onClick={() => handleSizeFilterChange('S')}>S</button>
                    <button onClick={() => handleSizeFilterChange('M')}>M</button>
                    <button onClick={() => handleSizeFilterChange('L')}>L</button>
                    <button onClick={() => handleSizeFilterChange('XL')}>XL</button>
                    <button onClick={() => handleSizeFilterChange('XXL')}>XXL</button>
                </div>
            </div>
        </section>
    );
};

export default FilterSection;
