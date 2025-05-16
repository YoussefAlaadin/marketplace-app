import React from "react";
import { Visa, Mastercard, Maestro } from "react-payment-icons";

import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Grid,
} from "@mui/material";
import { toast } from "react-toastify";

import Footer from "../../components/Footer/Footer";
import HeaderBottom from "../../components/header/HeaderBottom";
import FooterBottom from "../../components/Footer/FooterBottom";
import Header from "../../components/header/Header";
import { useNavigate } from "react-router-dom";
const CreditCardForm = () => {
  const customerId = localStorage.getItem("userId")
  const navigate = useNavigate();
  const onSubmitHandler = () => {
    toast.success("Order Has Been Placed Successfully");
    navigate(`/cart/${customerId}`);
  };
  return (
    <>
      <Header />
      <HeaderBottom />
      <Box sx={{ maxWidth: 600, mx: "auto", mt: 5 }}>
        <Card sx={{ p: 3, borderRadius: 4, boxShadow: 3 }}>
          <Typography variant="h5" mb={3}>
            Payment Details
          </Typography>
          <form >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name on Card"
                  name="nameOnCard"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Card Number"
                  name="cardNumber"
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Expiry Date (MM/YY)"
                  name="expiryDate"
                  required
                  placeholder="MM/YY"
                />
              </Grid>

              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                  Card Type
                </label>
                <div className="flex gap-4">
                  {[
                    { type: "Visa", icon: Visa },
                    { type: "MasterCard", icon: Mastercard },
                    { type: "Amex", icon: Maestro },
                  ].map(({ type, icon }) => (
                    <label key={type} className="flex items-center space-x-2">
                      <input type="date" />
                      <span>{type}</span>
                      <span>{icon}</span>
                    </label>
                  ))}
                </div>
              </div>
            </Grid>

            <Button
              className="bg-black"
              type="submit"
              variant="contained"
              sx={{ mt: 3 }}
              fullWidth
              onClick={onSubmitHandler}
            >
              Place Order
            </Button>
          </form>
        </Card>
      </Box>
      <Footer />
      <FooterBottom />
    </>
  );
};

export default CreditCardForm;
