import "./Home.css";
import { Link } from "react-router-dom";

const ShirtImages = () => {
    return (
        <div className="shirt-image">
            <Link to={'/shopbycollection'}>

                <img src="https://www.beyoung.in/api/catalog/homepage-3-10/banner-new/11bhuvan-section-desktop-view-min.jpeg" alt="catalog" />

            </Link>
            <Link to={'/shopbycollection'}>

                <img src="https://www.beyoung.in/api/catalog/homepage-3-10/bbimages/new/shop-the-look-desktop-view.jpg" alt="shop-look" />

            </Link>
        </div>
    );
};

export default ShirtImages;
