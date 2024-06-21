import { useEffect, useState } from "react";
import "./Home.css";

const CashbackImageSlider = () => {
    const [imageIndex, setImageIndex] = useState(0);

    const images = [
        "https://www.beyoung.in/api/catalog/homepage-3-10/logos-new/1.png",
        "https://www.beyoung.in/api/catalog/homepage-3-10/logos-new/2.png",
        "https://www.beyoung.in/api/catalog/homepage-3-10/logos-new/3.png",
        "https://www.beyoung.in/api/catalog/homepage-3-10/logos-new/4.png",

    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 4000); // 4-second interval
        return () => {
            clearInterval(interval);
        };
    }, [imageIndex, images.length]);

    useEffect(() => {
        const slider = document.querySelector(".image-sliderfeatured");
        slider.style.transform = `translateX(-${imageIndex * (100 / images.length)}%)`;
    }, [imageIndex, images.length]);

    return (
        <div className="cashback-swipper1">
            <p className="featuresec">
                <p>FEATURED ON</p>
            </p>
            <div className="image-sliderfeatured">
                {images.map((url, index) => (
                    <img
                        key={index}
                        src={url}
                        alt={`Image ${index}`}
                        className={index === imageIndex ? "active" : ""}
                    />
                ))}
            </div>
        </div>
    );
};

export default CashbackImageSlider;
