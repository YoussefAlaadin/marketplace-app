import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  IconButton,
  Tooltip,
  Divider,
  Container,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  List,
  ListItemText,
  ListItem,
  Grid,
  CardMedia,
  CardContent,
  AppBar,
  Toolbar,
} from "@mui/material";
import axios from "axios";
import { Link } from "react-router-dom";
import { vendNavLinks } from "./navLinks";
import { useContext } from "react";
import { UserContext } from "../../components/context/UserContext";
const PurchaseHistory = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchProductName, setSearchProductName] = useState("");
  const [searchCustomer, setSearchCustomer] = useState("");
  const { logout, userInfo } = useContext(UserContext);
  const navigationLinks = vendNavLinks({ id: userInfo.userId });

  const fetchPurchaseData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:5029/api/Vendor/products-with-purchases",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = Array.isArray(res.data) ? res.data : [];
      setProducts(data);
      setFilteredProducts(data);
    } catch (err) {
      console.error("Error fetching purchase data:", err);
    }
  };

  useEffect(() => {
    fetchPurchaseData();
  }, []);

  useEffect(() => {
    const filtered = products.filter((product) => {
      const productMatch = product.productName
        .toLowerCase()
        .includes(searchProductName.toLowerCase());

      const customerMatch = product.purchases.some((cust) =>
        `${cust.firstName} ${cust.lastName} ${cust.email}`
          .toLowerCase()
          .includes(searchCustomer.toLowerCase())
      );

      return productMatch && (searchCustomer === "" || customerMatch);
    });

    setFilteredProducts(filtered);
  }, [searchProductName, searchCustomer, products]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e8f5e9 0%, #ffffff 100%)",
        display: "flex"
      }}
    >
      {/* Sidebar */}
      <Box width="220px" bgcolor="#f2faf2" p={3}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          VENDOR DASHBOARD
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
      <Box flex={1}>
        {/* Topbar */}
        <Box
          sx={{
            backgroundColor: "#a5d6a7",
            color: "black",
            padding: 3,
            textAlign: "center",
            boxShadow: 3,
            position: "sticky",
            top: 0,
            zIndex: 1000,
          }}
        >
          <Typography variant="h4" fontWeight="bold">
            Product Purchase History
          </Typography>
        </Box>

        {/* Search Inputs */}
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Box
            display="flex"
            flexDirection={{ xs: "column", sm: "row" }}
            gap={2}
            mb={3}
          >
            <TextField
              fullWidth
              size="small"
              label="Search by Product Name"
              value={searchProductName}
              onChange={(e) => setSearchProductName(e.target.value)}
            />
            <TextField
              fullWidth
              size="small"
              label="Search by Customer Name or Email"
              value={searchCustomer}
              onChange={(e) => setSearchCustomer(e.target.value)}
            />
          </Box>
          {/* Filtered Product List */}
          <Card
            sx={{
              bgcolor: "#ffffff",
              borderRadius: 4,
              p: 3,
              boxShadow: 4,
            }}
          >
            <Typography variant="h6" mb={2} fontWeight="bold">
              Products Found: {filteredProducts.length}
            </Typography>

            {filteredProducts.map((product, index) => (
              <React.Fragment key={product.productId}>
                <Box mb={2}>
                  <Typography fontWeight="bold" variant="subtitle1">
                    🛒 {product.productName}
                  </Typography>

                  {product.purchases.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No customers have purchased this product.
                    </Typography>
                  ) : (
                    product.purchases.map((customer) => (
                      <Box key={customer.id} pl={2} mt={1}>
                        <Typography variant="body2">
                          👤{" "}
                          <strong>
                            {customer.firstName} {customer.lastName}
                          </strong>{" "}
                          ({customer.email})
                        </Typography>
                      </Box>
                    ))
                  )}
                </Box>
                {index !== filteredProducts.length - 1 && (
                  <Divider sx={{ my: 2 }} />
                )}
              </React.Fragment>
            ))}
          </Card>
        </Container>
      </Box>
    </Box>
  );
};

export default PurchaseHistory;

// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Typography,
//   Card,
//   Divider,
//   Container,
//   TextField,
//   Button,
// } from "@mui/material";
// import { userRequest } from "../../components/admin/requestMethods";
// import axios from "axios";

// const PurchaseHistory = () => {
//   const [users, setUsers] = useState([]);
//   const [searchUsername, setSearchUsername] = useState("");
//   const [searchEmail, setSearchEmail] = useState("");
//   const [products, setProducts] = useState([]);

//   const fetchPurchaseData = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get("http://localhost:5029/api/Vendor/products-with-purchases", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         }
//       });

//       if (Array.isArray(res.data)) {
//         setProducts(res.data);
//       } else {
//         console.error("Expected array but got:", res.data);
//         setProducts([]); // fallback to empty array to prevent crash
//       }

//     } catch (err) {
//       console.error("Error fetching purchase data:", err);
//       setProducts([]); // fallback in case of error
//     }
//   };

//   const handleSearch = async () => {
//     try {
//       const query = [];
//       if (searchUsername.trim()) query.push(`username=${searchUsername}`);
//       if (searchEmail.trim()) query.push(`email=${searchEmail}`);
//       const queryString = query.length ? `/search?${query.join("&")}` : "";

//       const res = await userRequest.get(`users${queryString}`);
//       const nonAdminUsers = res.data.filter((user) => !user.isAdmin);
//       setUsers(nonAdminUsers);
//     } catch (err) {
//       console.error("Error searching users:", err);
//     }
//   };

//   useEffect(() => {
//     fetchPurchaseData();
//   }, []);

//   return (
//     <Box
//       sx={{
//         minHeight: '100vh',
//         background: 'linear-gradient(135deg, #e8f5e9 0%, #ffffff 100%)',
//       }}
//     >
//       {/* Topbar */}
//       <Box
//         sx={{
//           backgroundColor: '#a5d6a7',
//           color: 'black',
//           padding: 3,
//           textAlign: 'center',
//           boxShadow: 3,
//           position: 'sticky',
//           top: 0,
//           zIndex: 1000,
//         }}
//       >
//         <Typography variant="h4" fontWeight="bold">
//           Product Purchase History
//         </Typography>
//       </Box>

//       {/* Product List */}
//       <Container maxWidth="md" sx={{ mt: 4 }}>
//         <Card
//           sx={{
//             bgcolor: '#ffffff',
//             borderRadius: 4,
//             p: 3,
//             boxShadow: 4,
//           }}
//         >
//           <Typography variant="h6" mb={2} fontWeight="bold">
//             Total Products Sold: {Array.isArray(products) ? products.length : 0}
//           </Typography>

//           {Array.isArray(products) && products.length > 0 ? (
//             products.map((product, index) => (
//               <React.Fragment key={product.productId}>
//                 <Box mb={2}>
//                   <Typography fontWeight="bold" variant="subtitle1">
//                     🛒 {product.productName}
//                   </Typography>

//                   {Array.isArray(product.purchases) && product.purchases.length > 0 ? (
//                     product.purchases.map((customer) => (
//                       <Box key={customer.id} pl={2} mt={1}>
//                         <Typography variant="body2">
//                           👤 <strong>{customer.firstName} {customer.lastName}</strong> ({customer.email})
//                         </Typography>
//                       </Box>
//                     ))
//                   ) : (
//                     <Typography variant="body2" color="text.secondary">
//                       No customers have purchased this product.
//                     </Typography>
//                   )}
//                 </Box>
//                 {index !== products.length - 1 && <Divider sx={{ my: 2 }} />}
//               </React.Fragment>
//             ))
//           ) : (
//             <Typography variant="body2" color="text.secondary">
//               No purchase data available.
//             </Typography>
//           )}
//         </Card>
//       </Container>
//     </Box>
//   );
// };

// export default PurchaseHistory;
