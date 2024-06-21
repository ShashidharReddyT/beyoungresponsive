import { useEffect, useState } from "react";
import "./Home.css";

const CashbackImageSlider = () => {
  const [imageIndex, setImageIndex] = useState(0);

  const images = [
    "https://www.beyoung.in/api/catalog/homepage-3-10/desktop/Offers-strip/3.png",
    "https://www.beyoung.in/api/catalog/homepage-3-10/desktop/Offers-strip/1_.png",
    "https://www.beyoung.in/api/catalog/homepage-3-10/desktop/Offers-strip/2.png",
    "https://www.beyoung.in/api/catalog/homepage-3-10/desktop/Offers-strip/5.png",
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
    const slider = document.querySelector(".image-slider");
    slider.style.transform = `translateX(-${
      imageIndex * (100 / images.length)
    }%)`;
  }, [imageIndex, images.length]);

  return (
    <div className="cashback-swipper">
      <div className="image-slider">
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
