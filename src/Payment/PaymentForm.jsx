import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";

export default function PaymentForm({ onNextButtonClick }) {
  const [formValues, setFormValues] = useState({
    cardName: "",
    cardNumber: "",
    expDate: "",
    cvv: "",
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };

  const isFormValid = () => {
    const requiredFields = ["cardName", "cardNumber", "expDate", "cvv"];
    return requiredFields.every((field) => !!formValues[field]);
  };

  return (
    <React.Fragment>
      <img
        src="https://suncotanning.com/wp-content/uploads/2020/10/payment-600x219.jpg"
        alt="Payment Method"
        style={{ width: "100%" }}
      />
      <Typography variant="h6" gutterBottom>
        Payment method (Debit/Credit Card)
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="cardName"
            label="Name on card"
            fullWidth
            autoComplete="cc-name"
            variant="standard"
            value={formValues.cardName}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="cardNumber"
            label="Card number"
            fullWidth
            autoComplete="cc-number"
            variant="standard"
            value={formValues.cardNumber}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="expDate"
            label="Expiry date"
            fullWidth
            autoComplete="cc-exp"
            variant="standard"
            value={formValues.expDate}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="cvv"
            label="CVV"
            helperText="Last three digits on signature strip"
            fullWidth
            autoComplete="cc-csc"
            variant="standard"
            value={formValues.cvv}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox color="secondary" name="saveCard" value="yes" />}
            label="Remember credit card details for next time"
          />
        </Grid>
        <Grid container spacing={12} justifyContent="flex-end">
          <Grid item xs={0}>
            <Button
              variant="contained"
              color="primary"
              disabled={!isFormValid()}
              onClick={onNextButtonClick}
            >
              Next
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
