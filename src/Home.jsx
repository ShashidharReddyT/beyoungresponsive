import React, { useState, useEffect } from 'react';
import Boxer from "./assets/Boxer.jpg";
import Combo from "./assets/Combo.jpg";
import CashbackImageSlider from "./CashbackImageSlider";
import ShirtImages from './ShirtsImages';
import BigSavingZone from './BigSavingZone';
import FreeShiping from './FreeShiping';
import NewArrival from './NewArrival';
import FeaturedOn from './FeaturedOn';
import MenHome from './MenHome';
import WomenHome from './WomenHome';

function Home() {
    const images = [
        { src: Combo, alt: 'Combo Image', id: 'combo' },
        // { src: Boxer, alt: 'Boxer Image', id: 'boxer' },
    ];
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000); // Change image every 3000 milliseconds

        return () => clearInterval(intervalId);
    }, [images]);

    return (
        <>
            <div className="slide">
                <img
                    src={images[currentImageIndex].src}
                    alt={images[currentImageIndex].alt}
                    key={images[currentImageIndex].id}
                    className="sliderimg"
                    loading="lazy"
                />
            </div>

            <CashbackImageSlider />
            <ShirtImages />
            <BigSavingZone />
            <NewArrival />
            <FreeShiping />
            <MenHome />
            <WomenHome />

            <FeaturedOn />
        </>
    );
}

export default Home;