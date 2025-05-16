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
//************************************************************************/

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [searchUsername, setSearchUsername] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [userType, setUserType] = useState("vendors"); // 'vendors' or 'customers'
  const [filteredUsers, setFilteredUsers] = useState([]);
  const { logout, userInfo } = useContext(UserContext);
  const navigationLinks = navItems({ id: userInfo.userId });
  const [isDelete, setIsDelete] = useState(true);
  // Fetch Users
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const endpoint = userType === "vendors" ? "vendorinfo" : "customerinfo";
      const res = await axios.get(
        `http://localhost:5029/api/Admin/${endpoint}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setUsers(res.data);
      setFilteredUsers(res.data);

      console.log("Fetched users:", res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, [userType]);

  // const handleDelete = async (id) => {
  //   try {
  //     await userRequest.delete(`users/${id}`);
  //     setUsers(users.filter((user) => user._id !== id));
  //   } catch (err) {
  //     console.error("Error deleting user:", err);
  //   }
  // };

  const fetchVendors = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`http://localhost:5029/api/Admin/vendorinfo`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
     setIsDelete(res.data.canDelete); // Update the state with the fetched value
  };
  useEffect(() => {
    fetchVendors();
  }, []);
  // Live Search
  useEffect(() => {
    const filtered = users.filter((user) => {
      const usernameMatch = user.userName
        .toLowerCase()
        .includes(searchUsername.toLowerCase());
      const emailMatch = user.email
        .toLowerCase()
        .includes(searchEmail.toLowerCase());

      return usernameMatch && emailMatch;
    });
    setFilteredUsers(filtered);
    fetchVendors();
  }, [searchUsername, searchEmail, users]);

  // Auto Publish Switch
  const handleToggleAutoPublish = async (userId, isEnabled) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:5029/api/Admin/set-autopublish/${userId}`,
        JSON.stringify(isEnabled),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      fetchUsers();
    } catch (err) {
      console.error("Error updating AutoPublish:", err);
    }
  };
  const handleToggleEdit = async (userId, isEnabled) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:5029/api/Admin/set-canedit/${userId}`,
        JSON.stringify(isEnabled),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(typeof users.autoPublish, users.autoPublish);

      fetchUsers();
    } catch (err) {
      console.error("Error updating CanEdit:", err);
    }
  };
  const handleToggleDelete = async (isEnabled) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:5029/api/Admin/set-can-delete?canDelete=${isEnabled}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("CanDelete updated successfully");

    } catch (err) {
      console.error(
        "Error updating CanDelete:",
        err.response?.data?.message || err.message
      );
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
            Users List
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
            <FormControl fullWidth size="small">
              <InputLabel>User Type</InputLabel>
              <Select
                value={userType}
                label="User Type"
                onChange={(e) => setUserType(e.target.value)}
              >
                <MenuItem value="vendors">Vendors</MenuItem>
                <MenuItem value="customers">Customers</MenuItem>
              </Select>
            </FormControl>

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
              Total Users: {users.length}
            </Typography>
            <Typography variant="body2" display="inline">
              Can Delete:
            </Typography>
            <Switch
              checked={isDelete}
              onChange={(e) => {
                handleToggleDelete(e.target.checked);
                setIsDelete(e.target.checked);
              }}
              color="success"
            />
            {filteredUsers.map((user, index) => (
              <React.Fragment key={user.id}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  py={1}
                >
                  <Box>
                    <Typography fontWeight="bold">{user.userName}</Typography>
                    <Typography variant="body2">{user.email}</Typography>
                    {user.firstName && (
                      <Typography variant="body2">
                        Name: {user.firstName}
                      </Typography>
                    )}
                    {userType === "vendors" && (
                      <Box mt={1}>
                        <Typography variant="body2" display="inline">
                          AutoPublish:
                        </Typography>
                        <Switch
                          checked={user.autoPublish}
                          onChange={(e) =>
                            handleToggleAutoPublish(user.id, e.target.checked)
                          }
                          color="success"
                        />
                        <Typography variant="body2" display="inline">
                          Can Edit:
                        </Typography>
                        <Switch
                          checked={user.canEdit}
                          onChange={(e) =>
                            handleToggleEdit(user.id, e.target.checked)
                          }
                          color="success"
                        />
                      </Box>
                    )}
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
                {index !== users.length - 1 && <Divider sx={{ my: 1 }} />}
              </React.Fragment>
            ))}
          </Card>
        </Container>
      </Box>
    </Box>
  );
};

export default UsersList;
