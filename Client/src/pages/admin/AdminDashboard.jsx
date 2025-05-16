// src/pages/AdminDashboard.jsx
import React, { useContext } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import { Link } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { navItems } from "../../components/admin/navLinks";
import { chartData } from "../../components/admin/data";
import { UserContext } from "../../components/context/UserContext";

const AdminDashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const { logout, userInfo } = useContext(UserContext);
  const navigationLinks = navItems({ id: userInfo.userId });
  useEffect(() => {
    // Fetch Users
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const resUser = await axios.get(
          "http://localhost:5029/api/Admin/customerinfo",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const resVendor = await axios.get(
          "http://localhost:5029/api/Admin/vendorinfo",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setUserCount(resUser.data.length + resVendor.data.length);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    // Fetch Products
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5029/api/Vendor/getallproduct",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setProductCount(res.data.length);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchUsers();
    fetchProducts();
  }, []);

  // Char Data
  const stats = [
    {
      label: "Users",
      value: userCount.toString(),
      icon: <PeopleIcon fontSize="large" />,
      chart: true,
    },
    {
      label: "Orders",
      value: productCount.toString(),
      icon: <ShoppingBagIcon fontSize="large" />,
      chart: true,
    },
    {
      label: "Revenue",
      value: "$6,400",
      icon: <AttachMoneyIcon fontSize="large" />,
      chart: true,
    },
    {
      label: "Products",
      value: productCount.toString(),
      icon: <InventoryIcon fontSize="large" />,
      chart: true,
    },
  ];

  //******************RENDER***************************//
  return (
    <Box display="flex" minHeight="100vh">
      {/* Sidebar */}
      <Box width="220px" bgcolor="#f2faf2" p={3}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          ADMIN DASHBOARD
        </Typography>
        <List>
          {navigationLinks.map((item) =>
            item.label === "Logout" ? (
              <ListItem
                onClick={logout}
                key={item.label}
                component={Link}
                to={item.path}
                sx={{
                  color: "#333",
                  "&:hover": { backgroundColor: "#e8f5e9" },
                  borderRadius: 1,
                }}
                button
              >
                <ListItemText primary={item.label} />
              </ListItem>
            ) : (
              <ListItem
                key={item.label}
                component={Link}
                to={item.path}
                sx={{
                  color: "#333",
                  "&:hover": { backgroundColor: "#e8f5e9" },
                  borderRadius: 1,
                }}
                button
              >
                <ListItemText primary={item.label} />
              </ListItem>
            )
          )}
        </List>
      </Box>

      {/* Main Content */}
      <Box flex={1} bgcolor="#fbfefb">
        {/* Top bar */}
        <AppBar
          position="static"
          elevation={0}
          sx={{ bgcolor: "#f2faf2", color: "#333" }}
        >
          <Toolbar>
            <EmojiEmotionsIcon sx={{ mr: 1, color: "#6cbf84" }} />
            <Typography variant="h6" fontWeight="bold">
              Hi Admin 👋
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Content Padding */}
        <Box p={5}>
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={6} key={index}>
                <Card
                  sx={{
                    bgcolor: "#f2faf2",
                    borderRadius: 4,
                    minHeight: 180,
                    boxShadow: 3,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2}>
                      {stat.icon}
                      <Box>
                        <Typography variant="h4" fontWeight="bold">
                          {stat.value}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                          {stat.label}
                        </Typography>
                      </Box>
                    </Box>
                    {stat.chart && (
                      <Box mt={3}>
                        <ShowChartIcon
                          sx={{ color: "#a6c5a6", fontSize: 34 }}
                        />
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Chart Section */}
          <Box
            mt={6}
            p={3}
            bgcolor="#f2faf2"
            borderRadius={4}
            boxShadow={3}
            height="300px"
          >
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Revenue Overview
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#82ca9d"
                  fill="#c8e6c9"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
