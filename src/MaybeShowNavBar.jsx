import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from 'prop-types';

const MaybeShowNavBar = ({ children }) => {
    const location = useLocation();

    const [showNavBar, setShowNavBar] = useState(false);
    useEffect(() => {
        // console.log("this is location: ", location);
        if (location.pathname === '/cart2') {
            setShowNavBar(false);
        } else {
            setShowNavBar(true);
        }
    }, [location])

    return (
        <div>{showNavBar && children}</div>
    )
}

// // Add PropTypes validation
// MaybeShowNavBar.propTypes = {
//     children: PropTypes.node.isRequired,
// };

export default MaybeShowNavBar;
