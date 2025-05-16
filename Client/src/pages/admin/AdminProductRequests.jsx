import { useEffect, useState } from "react";
import axios from "axios";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { toast } from "react-toastify";
import { useContext } from "react";
import { UserContext } from "../../components/context/UserContext";
import {
  Box,
  Typography,
  Card,
  Container,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { Link } from "react-router-dom";
import { navItems } from "../../components/admin/navLinks";
const AdminProductRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connection, setConnection] = useState(null);
  const { logout, userInfo } = useContext(UserContext);
    const navigationLinks = navItems({ id: userInfo.userId });
  
  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5029/api/Admin/pending-product-requests",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setRequests(response.data);
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
      toast.info(
        data.message
      );
      fetchRequests();
    });

    setConnection(newConnection);

    return () => {
      newConnection.stop();
    };
  }, []);

  const handleStatusChange = async (requestId, approve) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5029/api/Admin/ReviewProduct/${requestId}?approve=${approve}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      approve
        ? toast.success("✅ Request approved")
        : toast.warn("❌ Request rejected");
      fetchRequests();
    } catch (err) {
      console.error("Status update failed", err);
    }
  };

  if (loading) {
    return (
      <Typography p={4} textAlign="center">
        Loading requests...
      </Typography>
    );
  }

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

      {/* Main content */}
      <Box flex={1}>
        {/* Top Bar */}
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
            Vendor Product Requests
          </Typography>
        </Box>

        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Card
            sx={{
              bgcolor: "#ffffff",
              borderRadius: 4,
              p: 3,
              boxShadow: 4,
              display: "flex", // خلي الكارد يكون flex
              flexDirection: "column", // ترتيب العناصر بشكل عمودي
            }}
          >
            <Typography variant="h6" mb={2} fontWeight="bold">
              Pending Requests: {requests.length}
            </Typography>

            {requests.length === 0 ? (
              <Typography>No pending requests found.</Typography>
            ) : (
              requests.map((req, index) => (
                <Box
                  key={req.requestId}
                  py={2}
                  display="flex"
                  justifyContent="space-between"
                >
                  {/* النصوص والأزرار هتكون على الشمال */}
                  <Box sx={{ flex: 1 }}>
                    <Typography fontWeight="bold" variant="subtitle1">
                      {req.productTitle}
                    </Typography>
                    <Typography variant="body2">{req.description}</Typography>
                    <Typography variant="body2" mt={1}>
                      Vendor: <strong>{req.vendorName}</strong> | Category:{" "}
                      <strong>{req.category}</strong>
                    </Typography>

                    <Box mt={2} display="flex" gap={2}>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleStatusChange(req.requestId, true)}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleStatusChange(req.requestId, false)}
                      >
                        Reject
                      </Button>
                    </Box>
                  </Box>

                  {/* الصورة هتكون على اليمين */}
                  {req.imageUrl && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        ml: 2, // المسافة بين النص والصورة
                      }}
                    >
                      <img
                        src={req.imageUrl}
                        alt={req.productTitle}
                        style={{
                          width: 150,
                          height: 150,
                          objectFit: "cover",
                          borderRadius: 8,
                        }}
                      />
                    </Box>
                  )}
                </Box>
              ))
            )}
          </Card>
        </Container>
      </Box>
    </Box>
  );
};

export default AdminProductRequests;
