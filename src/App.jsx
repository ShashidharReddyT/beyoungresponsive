import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './Navbar';
import Home from './Home';
import Men from './Men';
import Women from './Women';
import Footer from './Footer';
import Trackyourorder from './Trackyourorder';
import Joggers from './Mens/Joggers';
import Combos from './Combos';
import Trouser from './Mens/Trouser';
import Shorts from './Mens/Shorts';
import Shirts from './Mens/Shirts';
import Jeans from './Mens/Jeans';
import Kurta from './Mens/Kurta';
import Tshirt from './Mens/Tshirt';
import Pyjamas from './Mens/Pyjamas';
import ShirtsWomen from './Womens/ShirtsWomen';
import JeansWomen from './Womens/JeansWomen';
import KurtiWomen from './Womens/KurtiWomen';
import JoggersWomen from './Womens/JoggersWomen';
import PyjamasWomen from './Womens/JumpSuitWomen';
import ProductDetail from './ProductDetail';
import SearchPage from './SearchPage';
import ProtectedComponent from './ProtectedComponent';
import Wishlist from './MyAccount/Wishlist';
import LoadingSpinner from './LoadingSpinner';
import { CartNumberProvider } from "./Context/CartNumberContext";

import CartProduct from './CartProducts';

import MyOrder from './MyAccount/MyOrder';
import CheckOut from './Payment/CheckOut';
import MyAccount from './MyAccount/MyAccount';
import MyProfile from './MyAccount/MyProfile';
import MyAddress from './MyAccount/MyAddress';
import MaybeShowNavBar from './MaybeShowNavBar';
import WomensTShirts from './Womens/TshirtsWomen';
import Sweater from './Mens/Sweater';
import Hoodie from './Mens/Hoodie';
import Tracksuit from './Mens/Tracksuit';
import WinterWear from './WinterWear';
import ShopByCollection from './ShopByCollection';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
// const Men = React.lazy(() => import('./Men'));
// const Women = React.lazy(() => import('./Women'));

function App() {


  return (

    <div className="App">
      <CartNumberProvider>
        <MaybeShowNavBar>
          <Navbar />
        </MaybeShowNavBar>

        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/search" element={<SearchPage />} />

          <Route path="/men" element={<Men />} />



          <Route path="/product/:productId" element={<ProductDetail />} />



          <Route path="/shirts" element={<Shirts />} />
          <Route path="/kurtas" element={<Kurta />} />
          <Route path="/tshirt" element={<Tshirt />} />
          <Route path="/sweater" element={<Sweater />} />
          <Route path="/hoodie" element={<Hoodie />} />
          <Route path="/tracksuit" element={<Tracksuit />} />

          <Route path="/pyjamas" element={<Pyjamas />} />
          <Route path="/shorts" element={<Shorts />} />
          <Route path="/jeans" element={<Jeans />} />
          <Route path="/joggers" element={<Joggers />} />
          <Route path="/trousers" element={<Trouser />} />
          <Route path="/combos" element={<Combos />} />


          <Route path="/women" element={<Women />} />
          <Route path="/shirtsWomen" element={<ShirtsWomen />} />
          <Route path="/tshirtswomen" element={<WomensTShirts />} />
          <Route path="/kurtisWomen" element={<KurtiWomen />} />

          <Route path="/jeansWomen" element={<JeansWomen />} />
          <Route path="/joggersWomen" element={<JoggersWomen />} />
          <Route path="/jumpsuitWomen" element={<PyjamasWomen />} />

          <Route path="/winterwear" element={<WinterWear />} />
          <Route path="/trackyourorder" element={<Trackyourorder />} />

          <Route path="/" element={<ProtectedComponent><MyAccount /></ProtectedComponent>} >
            <Route path="/myprofile" element={<MyProfile />} />
            <Route path="/orders" element={<MyOrder />} />
            <Route path="/address" element={<MyAddress />} />
            <Route path="/wishlist" element={<Wishlist />} />
          </Route>

          <Route path="/cart" element={<ProtectedComponent><CartProduct /></ProtectedComponent>} />

          <Route path="/cart2" element={<CheckOut />} />

          <Route path="/shopbycollection" element={<ShopByCollection />} />

        </Routes>

        <MaybeShowNavBar>
          <Footer />
        </MaybeShowNavBar>

        <ScrollToTop />
      </CartNumberProvider>
    </div>

  );
}
export default App;
