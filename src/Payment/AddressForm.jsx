import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import axios from "axios";

export default function AddressForm({ onNextButtonClick }) {
  const [pincodeData, setPincodeData] = useState({});
  const [formCompleted, setFormCompleted] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    zip: "",
    district: "",
    state: "",
    country: "",
    city: "",
    saveAddress: false,
  });
  const handleZipCodeChange = async (e) => {
    const zipcode = e.target.value;

    if (zipcode.length === 6) {
      try {
        const response = await axios.get(
          `https://api.postalpincode.in/pincode/${zipcode}`
        );
        const data = response.data[0];

        if (data.Status === "Success") {
          const { District, State, Country, City } = data.PostOffice[0];
          setPincodeData({
            district: District,
            state: State,
            country: Country,
            city: City,
          });
          setFormCompleted(true); // Enable the "Next" button when form is completed
        } else {
          console.error("Invalid pin code");
          setPincodeData({});
          setFormCompleted(false);
        }
      } catch (error) {
        console.error("Error fetching pin code data", error);
        setPincodeData({});
        setFormCompleted(false);
      }
    } else {
      setPincodeData({});
      setFormCompleted(false);
    }
  };

  // Function to check if all required fields are filled
  const isFormValid = () => {
    const requiredFields = ["firstName", "lastName", "address1", "zip"];
    return requiredFields.every(
      (field) => !!document.getElementById(field).value
    );
  };
  useEffect(() => {
    const savedAddress = JSON.parse(localStorage.getItem("savedAddress")) || {};
    setFormData((prevData) => ({
      ...prevData,
      ...savedAddress,
    }));
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const saveAddressToLocalStorage = () => {
    const addressData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      address1: formData.address1,
      address2: formData.address2,
      zip: formData.zip,
      district: pincodeData.district || "",
      state: pincodeData.state || "",
      country: pincodeData.country || "",
    };

    // Save the address data to local storage
    localStorage.setItem("savedAddress", JSON.stringify(addressData));
  };

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Shipping address
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="firstName"
            name="firstName"
            label="First name"
            fullWidth
            autoComplete="given-name"
            variant="standard"
            value={formData.firstName || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="lastName"
            name="lastName"
            label="Last name"
            fullWidth
            autoComplete="family-name"
            variant="standard"
            value={formData.lastName || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="address1"
            name="address1"
            label="Address line 1"
            fullWidth
            autoComplete="shipping address-line1"
            variant="standard"
            value={formData.address1 || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="address2"
            name="address2"
            label="Address line 2"
            fullWidth
            autoComplete="shipping address-line2"
            variant="standard"
            value={formData.address2 || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="zip"
            name="zip"
            label="Zip / Postal code"
            fullWidth
            autoComplete="shipping postal-code"
            variant="standard"
            onChange={handleZipCodeChange}
          />
        </Grid>
        {/* Display the fetched data */}
        <Grid item xs={12} sm={6}>
          <TextField
            id="district"
            name="district"
            label="District"
            fullWidth
            variant="standard"
            value={pincodeData.district || ""}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="state"
            name="state"
            label="State/Province/Region"
            fullWidth
            variant="standard"
            value={pincodeData.state || ""}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="country"
            name="country"
            label="Country"
            fullWidth
            variant="standard"
            value={pincodeData.country || ""}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox color="secondary" name="saveAddress" value="yes" />
            }
            label="Use this address for payment details"
          />
        </Grid>

        <Grid
          container
          spacing={3}
          marginLeft={"50px"}
          justifyContent="flex-end"
        >
          <Grid item xs={9} sm={3}>
            <Button
              variant="contained"
              color="primary"
              disabled={!formCompleted || !isFormValid()}
              onClick={() => {
                onNextButtonClick();
                saveAddressToLocalStorage();
              }}
            >
              Next
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
