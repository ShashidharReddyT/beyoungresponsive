import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import axios from "axios";
import { useAuth } from "../Context/UserProvider";

export default function AddressForm() {
  const [pincodeData, setPincodeData] = useState({});
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

    // Update the form data immediately when the user types
    setFormData((prevData) => ({
      ...prevData,
      zip: zipcode,
    }));

    if (zipcode.length === 6) {
      try {
        const response = await axios.get(
          `https://api.postalpincode.in/pincode/${zipcode}`
        );
        const data = response.data[0];

        if (data.Status === "Success") {
          const { District, State, Country, City } = data.PostOffice[0];

          // Update state with the fetched data
          setPincodeData({
            district: District,
            state: State,
            country: Country,
            city: City,
          });

          // Update the corresponding form fields
          setFormData((prevData) => ({
            ...prevData,
            district: District || "",
            state: State || "",
            country: Country || "",
          }));
        } else {
          // Handle error case
          console.error("Invalid pin code");
          setPincodeData({});
        }
      } catch (error) {
        console.error("Error fetching pin code data", error);
        setPincodeData({});
      }
    } else {
      // Clear data if the entered pin code is not of the correct length
      setPincodeData({});
    }
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

  const handleSaveAddress = () => {
    localStorage.setItem("savedAddress", JSON.stringify(formData));
  };

  return (
    <React.Fragment>
      <div className="myadresss">
        <Typography variant="h6" gutterBottom>
          My Address
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
              value={formData.zip || ""}
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
              value={formData.district || ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="state"
              name="state"
              label="State/Province/Region"
              fullWidth
              variant="standard"
              value={formData.state || ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="country"
              name="country"
              label="Country"
              fullWidth
              variant="standard"
              value={formData.country || ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  color="secondary"
                  name="saveAddress"
                  checked={formData.saveAddress}
                  onChange={handleInputChange}
                />
              }
              label="Use this address for payment details"
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveAddress}
            >
              Save Address
            </Button>
          </Grid>
        </Grid>
      </div>
    </React.Fragment>
  );
}
