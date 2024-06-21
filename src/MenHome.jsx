// NewArrival.js
import { useState } from "react";
import { Link } from "react-router-dom";
import previousbutton from './assets/previousbutton.svg';
import nextbutton from './assets/nextbutton.svg';
import './newArrival.css';
import './MenHome.css';

const NewArrival = () => {
    const [imageIndex, setImageIndex] = useState(0);
    const totalImages = 6;

    const images = [
        {
            url: 'https://images.bewakoof.com/t1080/men-s-grey-all-over-printed-super-loose-fit-plus-size-shirt-586212-1695998689-1.jpg',
            heading: 'Shirts',
        },
        {
            url: 'https://images.bewakoof.com/t1080/men-s-olive-relaxed-fit-short-kurta-302581-1663931236-1.jpg',
            heading: 'Kurtas',
        },
        {
            url: 'https://images.bewakoof.com/t1080/worst-enemies-half-sleeve-t-shirt-for-men-s-381186-1656185046-1.jpg',
            heading: 'Tshirt',
        },
        {
            url: 'https://images.bewakoof.com/t1080/men-s-black-high-side-graphic-printed-flatknit-sweater-40-597238-1695639276-1.jpg',
            heading: 'Sweater',
        },
        {
            url: 'https://images.bewakoof.com/t1080/men-s-black-batman-graphic-printed-oversized-plus-size-hoodies-597163-1695984124-1.jpg',
            heading: 'Hoodie',
        },
        {
            url: 'https://images.bewakoof.com/t1080/men-s-blue-tracksuit-560421-1670588569-1.jpg',
            heading: 'Tracksuit',
        },
        // Add more objects for each image
    ];

    const imagesToShow = 4;

    const visibleImages = Array.from({ length: imagesToShow }).map((_, i) => {
        const index = (imageIndex + i) % totalImages;
        const { url, heading } = images[index];
        return (
            <div className="newarrival" key={index}>
                <Link to={`/${heading.toUpperCase()}`}>
                    <img
                        src={url}
                        alt={`img${index + 1}`}
                        className="newarrivalimg"
                    />
                    <p className="newarrrivalheading">{heading}</p>
                </Link>
            </div>
        );
    });

    const nextImage = () => {
        setImageIndex((prevIndex) => (prevIndex + imagesToShow) % totalImages);
    };

    const prevImage = () => {
        const newIndex =
            imageIndex - imagesToShow < 0
                ? totalImages - (totalImages % imagesToShow) - imagesToShow
                : imageIndex - imagesToShow;
        setImageIndex(newIndex);
    };

    return (
        <div className="big-saving-zone">
            <h1 className='for-men'>FOR MEN</h1>
            <div className="saving-zone-2">
                <div onClick={prevImage}>
                    <img src={previousbutton} alt="prevbtn" className="previmage" />
                </div>
                {visibleImages}
                <div onClick={nextImage}>
                    <img src={nextbutton} alt="nextbtn" className="nextimage" />
                </div>
            </div>
        </div>
    );
};

export default NewArrival;
