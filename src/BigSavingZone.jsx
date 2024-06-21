import { useState } from "react";
import "./Home.css";
import { Link } from "react-router-dom";
import previousbutton from './assets/previousbutton.svg';
import nextbutton from './assets/nextbutton.svg';

const BigSavingZone = () => {
  const [imageIndex, setImageIndex] = useState(0);
  const images = [
    "https://www.beyoung.in/api/catalog/homepage-3-10/hot-deals-banner/Joggers-banner.jpg",
    "https://www.beyoung.in/api/catalog/homepage-3-10/hot-deals-banner/new-Plain-T-shirts-banner.jpg",
    "https://www.beyoung.in/api/catalog/homepage-3-10/hot-deals-banner/new-Pyjama-banner.jpg",
    "https://www.beyoung.in/api/catalog/homepage-3-10/hot-deals-banner/winter-home-page-banner.jpg",
    "https://www.beyoung.in/api/catalog/homepage-3-10/hot-deals-banner/new-Boxers-banner.jpg",
    "https://www.beyoung.in/api/catalog/homepage-3-10/hot-deals-banner/new-Polo-banner.jpg",
  ];

  const imagesToShow = 3; // Number of images to show at a time
  const totalImages = images.length;

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

  const visibleImages = images.slice(imageIndex, imageIndex + imagesToShow);

  return (
    <div className="big-saving-zone">
      <p className="headaing-zone">Hot Deals</p>
      <div className="saving-zone-2">
        <div onClick={prevImage}>
          <img src={previousbutton} alt="prevbtn" className="previmage1" />
        </div>

        <div className="image-slide">
          <div className="column">
            <Link to={`/joggers`} className='sub-sub-link' onClick={() => console.log('Clicked on joggers image')}>
              <img
                className="big-save-image"
                width="553px"
                height="732px"
                style={{ padding: "5px" }}
                src={visibleImages[0]}
                alt={`Image 0`}
              />
            </Link>
          </div>

          <div className="column">
            <Link to={`/tshirt`}>
              <img
                className="small-save-image"
                width="553px"
                style={{ padding: "10px 10px" }}
                src={visibleImages[1]}
                alt={`Image 1`}
              />
            </Link>
            <Link to={`/pyjamas`}>
              <img
                className="small-save-image"
                width="553px"
                style={{ padding: "10px 10px" }}
                src={visibleImages[2]}
                alt={`Image 2`}
              />
            </Link>
          </div>
        </div>

        <div onClick={nextImage}>
          <img src={nextbutton} alt="nextbtn" className="nextimage1" />
        </div>
      </div>
    </div>
  );
};

export default BigSavingZone;
