// CustomerProfile.jsx
import React, { useEffect, useState } from "react";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Divider,
  Grid,
} from "@mui/material";
import axios from "axios";
import Header from "../../components/header/Header";
import HeaderBottom from "../../components/header/HeaderBottom";
import Footer from "../../components/Footer/Footer";
import FooterBottom from "../../components/Footer/FooterBottom";
import { useNavigate } from "react-router-dom";

const CustomerProfile = () => {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [creditCard, setCreditCard] = useState(null);
  const [orders, setOrders] = useState([]);
  const customerId = localStorage.getItem("userId");
  const [isCredit, setIsCredit] = useState(false)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token"); // لو عندك توكن
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        const [customerRes, cardRes, ordersRes] = await Promise.all([
          axios.get(
            `http://localhost:5029/api/Customer/customerInfo/${customerId}`,
            { headers }
          ),
          axios.get(`http://localhost:5029/api/Customer/creditcardinfo`, {
            headers,
          }),
          axios.get(`http://localhost:5029/api/Customer/ordered-products`, {
            headers,
          }),
        ]);

        setCustomer(customerRes.data);
        setCreditCard(cardRes.data);
        setOrders(ordersRes.data);
        if (cardRes.data.cardName === "") {
          setIsCredit(false)
        }
        else {
          setIsCredit(true)
        }
      } catch (err) {
        setCreditCard(null);
        setOrders([]);
        console.error("Error fetching profile data:", err);
      }
    };

    fetchData();
  }, []);

  if (!customer) return <Typography>Loading...</Typography>;

  return (
    <>
      <Header />
      <HeaderBottom />
      <Box sx={{ p: 3 }}>
        {/* Profile Section */}
        <Card
          sx={{
            maxWidth: 700,
            mx: "auto",
            p: 3,
            borderRadius: 4,
            boxShadow: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Avatar sx={{ width: 64, height: 64, mr: 2 }} />
            <Typography variant="h5">{customer.userName}</Typography>
          </Box>
          <CardContent>
            <Typography>
              <strong>Email:</strong> {customer.email}
            </Typography>
            {/* <Typography>
              <strong>Address:</strong> {customer.address}
            </Typography> */}
            {/* <Typography>
              <strong>Phone:</strong> {customer.phone}
            </Typography> */}
            {/* <Typography>
              <strong>Joined:</strong>{" "}
              {new Date(customer.createdAt).toLocaleDateString()}
            </Typography> */}
            {/* <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
              <Button variant="contained" color="primary">
                Edit Profile
              </Button>
              <Button variant="outlined" color="secondary">
                Change Password
              </Button>
            </Box> */}
          </CardContent>
        </Card>

        {/* Credit Card Section */}
        <Card
          sx={{
            maxWidth: 700,
            mx: "auto",
            mt: 4,
            p: 3,
            borderRadius: 4,
            boxShadow: 3,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Credit Card
          </Typography>
          {isCredit ? (
            <CardContent>
              <Typography>
                <strong>Name on Card:</strong> {creditCard.cardName}
              </Typography>
              <Typography>
                <strong>Card Number:</strong> **** **** ****{" "}
                {creditCard.encryptedCardNumber.slice(-4)}
              </Typography>
              <Typography>
                <strong>Expiry Date:</strong> {creditCard.expirDate}
              </Typography>
              {/* <Button
                sx={{ mt: 2 }}
                variant="outlined"
                color="primary"
                onClick={() => navigate(`/edit-card/${customerId}`)}
              >
                Update Card
              </Button> */}
            </CardContent>
          ) : (
            <CardContent>
              <Typography color="text.secondary">
                You haven't added a credit card yet.
              </Typography>
                <Button
                  className="bg-black"
                sx={{ mt: 2 }}
                variant="outlined"
                onClick={() => navigate(`/edit-card/${customerId}`)}
              >
                Add Card
              </Button>
            </CardContent>
          )}
        </Card>

        {/* Past Orders Section */}
        <Card
          sx={{
            maxWidth: 700,
            mx: "auto",
            mt: 4,
            p: 3,
            borderRadius: 4,
            boxShadow: 3,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Past Orders
          </Typography>
          {orders && orders.length > 0 ? (
            <CardContent>
              <Grid container spacing={2}>
                {orders.map((order) => (
                  <Grid item xs={12} key={order.id}>
                    <Card variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                      <Typography>
                        <strong>Title:</strong> {order.productTitle}
                      </Typography>
                      <Typography>
                        <strong>Price:</strong> ${order.price}
                      </Typography>
                      <Typography>
                        <strong>Items:</strong> {order.quantity}
                      </Typography>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          ) : (
            <Typography color="text.secondary">
              You haven't placed any orders yet.
            </Typography>
          )}
        </Card>
      </Box>
      <Footer />
      <FooterBottom />
    </>
  );
};

export default CustomerProfile;
