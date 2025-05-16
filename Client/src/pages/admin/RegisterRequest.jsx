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
import DeleteIcon from "@mui/icons-material/Delete";
import Switch from "@mui/material/Switch";
import { useContext } from "react";
import { UserContext } from "../../components/context/UserContext";
//import { userRequest } from "../requestMethods";
import { Link } from "react-router-dom";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { navItems } from "../../components/admin/navLinks";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { toast } from "react-toastify";
//************************************************************************/

const RegisterRequest = () => {
  const [users, setUsers] = useState([]);
  const [searchUsername, setSearchUsername] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [userType, setUserType] = useState("vendors"); // 'vendors' or 'customers'
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connection, setConnection] = useState(null);
  const { logout, userInfo } = useContext(UserContext);
  const navigationLinks = navItems({ id: userInfo.userId });

  // Fetch Users
  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5029/api/Admin/pending-vendor-requests",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setRequests(response.data);
      console.log("requests:", response.data);

      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch requests", err);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchRequests();
    const newConnection = new HubConnectionBuilder()
      .withUrl("http://localhost:5029/notificationHub", {
        accessTokenFactory: () => localStorage.getItem("token"),
      })
      .build();

    newConnection
      .start()
      .then(() => {
        console.log("Connected to SignalR hub as Admin");
      })
      .catch((err) => console.error("SignalR Connection Error:", err));

    newConnection.on("ReceiveNotification", (data) => {
      console.log("New Register Request From Vendor: ", data);
      toast.info(
        data.message
      );
      fetchRequests(); // حدث القائمة تلقائيًا
    });

    setConnection(newConnection);

    return () => {
      newConnection.stop();
    };
  }, []);

  const handleReviewRequest = async (requestId, approve) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5029/api/Admin/ReviewVendorRequest/${requestId}?approve=${approve}`,
        {}, // مفيش body
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert(response.data.message);
      fetchRequests(); // عيد تحميل الطلبات بعد المراجعة
    } catch (error) {
      console.error("Error reviewing request", error);
      alert("An error occurred while reviewing the request.");
    }
  };

  //*************************************RENDERS*******************************/
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e8f5e9 0%, #ffffff 100%)",
        display: "flex",
      }}
    >
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
      <Box flex={1}>
        {/* Top bar */}
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
          <Typography variant="h6" fontWeight="bold">
            Register Requests
          </Typography>
        </Box>

        {/* Search + Filter */}
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Box
            display="flex"
            flexDirection={{ xs: "column", sm: "row" }}
            gap={2}
            mb={3}
          >
            <TextField
              label="Search by username"
              variant="outlined"
              size="small"
              fullWidth
              value={searchUsername}
              onChange={(e) => setSearchUsername(e.target.value)}
            />
            <TextField
              label="Search by email"
              variant="outlined"
              size="small"
              fullWidth
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
            />
          </Box>

          {/* User Cards */}
          <Card
            sx={{
              bgcolor: "#ffffff",
              borderRadius: 4,
              p: 3,
              boxShadow: 4,
            }}
          >
            <Typography variant="h6" mb={2} fontWeight="bold">
              Total Users: {requests.length}
            </Typography>

            {requests.map((request) => (
              <React.Fragment key={request.requestId}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  py={1}
                >
                  <Box>
                    <Typography fontWeight="bold">
                      {request.vendorUsername}
                    </Typography>
                    <Typography variant="body2">
                      {request.vendorEmail}
                    </Typography>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() =>
                        handleReviewRequest(request.requestId, true)
                      }
                    >
                      Approve
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() =>
                        handleReviewRequest(request.requestId, false)
                      }
                    >
                      Reject
                    </Button>
                  </Box>
                  <Tooltip title="Delete User">
                    <IconButton
                      sx={{ color: "red" }}
                      onClick={() => handleDelete(user._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </React.Fragment>
            ))}
          </Card>
        </Container>
      </Box>
    </Box>
  );
};

export default RegisterRequest;
