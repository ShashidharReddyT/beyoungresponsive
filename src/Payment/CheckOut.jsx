import React, { useState, useEffect } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import AddressForm from "../Payment/AddressForm";
import PaymentForm from "../Payment/PaymentForm";
import Review from "./Review";
import "../Payment/Payment.css";
import Beyounglogo from "../assets/Beyounglogo.svg";
import securepayment from "../assets/securepayment.svg";
import { useAuth } from "../Context/UserProvider";
import { useUpdateCartNumbers } from "../Context/CartNumberContext";

const Navbar = () => {
  return (
    <div className="navbarcart">
      <Link to="/">
        <img src={Beyounglogo} alt="beyoung" className="beyoungglogo" />
      </Link>
      <div className="header-right">
        <img
          src={securepayment}
          alt="securepayment"
          className="securepayment"
        />
        <span>100% secure payment</span>
      </div>
    </div>
  );
};

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="/">
        BEYOUNG
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const steps = ["Shipping address", "Payment details", "Review your order"];

function getStepContent(step, onNextButtonClick) {
  switch (step) {
    case 0:
      return <AddressForm onNextButtonClick={onNextButtonClick} />;
    case 1:
      return <PaymentForm onNextButtonClick={onNextButtonClick} />;
    case 2:
      return <Review />;
    default:
      throw new Error("Unknown step");
  }
}
export default function Checkout() {
  const [activeStep, setActiveStep] = useState(0);
  const { token, resultData } = useAuth();
  const [cartProductList, setCartProductList] = useState([]);

  const updateCartNumbers = useUpdateCartNumbers();
  const [finalTotal, setFinalTotal] = useState(null);
  const [totalPrice, setTotalPrice] = useState(null);

  const createHeaders = (token) => {
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${token}`);
    headers.append("projectID", "yxpa71cax49z");
    headers.append("Content-Type", "application/json");
    return headers;
  };

  const clearCart = async () => {
    try {
      const myHeaders = createHeaders(token);

      const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        redirect: "follow",
      };

      const response = await fetch(
        "https://academics.newtonschool.co/api/v1/ecommerce/cart/",
        requestOptions
      );

      if (response.ok) {
        console.log("Cart cleared successfully");
        setCartProductList([]);
        updateCartNumbers(0);
      } else {
        console.error("Failed to clear cart");
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const fetchCartData = async () => {
    console.log("Fetching cart data...");
    if (resultData && resultData.data && resultData.data.totalPrice) {
      setTotalPrice(resultData.data.totalPrice);

      // Extract productId from resultData
      const productId = resultData.data.items[0].product._id;

      console.log("Product ID:", productId);

      const myHeaders = new Headers();
      myHeaders.append("projectId", "yxpa71cax49z");
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${token}`);

      // Retrieve address from local storage
      const storedShippingAddress = localStorage.getItem("savedAddress");
      const parsedShippingAddress = storedShippingAddress
        ? JSON.parse(storedShippingAddress)
        : null;

      const raw = JSON.stringify({
        productId: productId,
        quantity: 2,
        addressType: "HOME",
        address: {
          street: parsedShippingAddress?.street || "123 Main St",
          city: parsedShippingAddress?.city || "Anytown",
          state: parsedShippingAddress?.state || "CA",
          country: parsedShippingAddress?.country || "USA",
          zipCode: parsedShippingAddress?.zipCode || "12345",
        },
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      try {
        const response = await fetch(
          "https://academics.newtonschool.co/api/v1/ecommerce/order",
          requestOptions
        );
        const data = await response.json(); // assuming response is in JSON format
        console.log(data);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      // Move to the next step
      setActiveStep(activeStep + 1);
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  const handleNext1 = async () => {
    if (activeStep === steps.length - 1) {
      // Clear the cart
      clearCart();

      // Fetch cart data
      await fetchCartData();

      // Move to the next step
      setActiveStep(activeStep + 1);
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleAddressFormNext = () => {
    handleNext();
  };

  const handlePaymentFormNext = () => {
    handleNext();
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Navbar />
      <Container component="main" maxWidth="sm" sx={{ marginTop: "10px" }}>
        <Paper
          variant="outlined"
          sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
        >
          <Typography component="h1" variant="h4" align="center">
            Checkout
          </Typography>

          <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length ? (
            <React.Fragment>
              <Typography variant="h5" gutterBottom>
                Thank you for your order.
              </Typography>
              <Typography variant="subtitle1">
                Your order number is #2001539. We have emailed your order
                confirmation, and will send you an update when your order has
                shipped.
                <br></br>
                Go back to home click here, <Link to="/">Beyoung
                </Link>
              </Typography>
              {cartProductList && cartProductList.length > 0 && (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ mt: 3, ml: 1 }}
                >
                  Place order
                </Button>
              )}
            </React.Fragment>
          ) : (
            <React.Fragment>
              {getStepContent(
                activeStep,
                activeStep === 0 ? handleAddressFormNext : handlePaymentFormNext
              )}
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                {activeStep !== 0 && (
                  <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                    Back
                  </Button>
                )}

                {activeStep === steps.length - 1 && (
                  <Button
                    variant="contained"
                    onClick={handleNext1}
                    sx={{ mt: 3, ml: 1 }}
                  >
                    Place order
                  </Button>
                )}
              </Box>
            </React.Fragment>
          )}
        </Paper>
        <Copyright />
      </Container>
    </React.Fragment>
  );
}
