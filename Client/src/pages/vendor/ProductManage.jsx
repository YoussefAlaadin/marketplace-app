/* eslint-disable no-unused-vars */

import { useContext, useEffect, useState } from "react";
import ProductCard from "../../components/vendor/ProductCard";
import Modal from "../../components/ui/Modal";
import { categories, formInputsList, productList } from "../../data";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import productValidation from "../../validation";
import ErrorMsg from "../../components/ui/ErrorMsg";
import SelectMenu from "../../components/ui/SelectMenu";
import axios from "axios";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr"; // Import SignalR
import { toast } from "react-toastify";
import { UserContext } from "../../components/context/UserContext";
import {
  Box,
  Typography,
  Card,
  IconButton,
  Tooltip,
  Divider,
  Container,
  TextField,
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
import { Link } from "react-router-dom";
import { vendNavLinks } from "./navLinks";

function ProductManage() {
  const defaultProductObj = {
    title: "",
    description: "",
    category: "",
    price: "",
    imageUrl: "",
    numOfUnits: "",
    numOfViews: 0,
    status: "pending", // Default status is "pending"
  };

  const defaultErrorObj = {
    title: "",
    description: "",
    imageUrl: "",
    price: "",
    category: "",
  };

  const { userInfo, logout } = useContext(UserContext);
  const [products, setProducts] = useState([]);
  const [productAdd, setProductAdd] = useState(defaultProductObj);
  const [productToEdit, setProductToEdit] = useState(defaultProductObj);
  const [productToEditIdx, setProductToEditIdx] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState(defaultErrorObj);
  const [isError, setIsError] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [connection, setConnection] = useState(null); // To store SignalR connection
  const [filteredProducts, setFilteredProducts] = useState([]); // To store filtered products
  const [searchProduct, setSearchProduct] = useState(""); // To store search input
  //const [notification, setNotification] = useState([]);
  const navigationLinks = vendNavLinks({ id: userInfo.userId });

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5029/api/Vendor/getallproduct",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (Array.isArray(response.data)) {
        setProducts(response.data);
        console.log("products:", response.data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  useEffect(() => {
   
    const token = localStorage.getItem("token");
    fetchProducts();

    const newConnection = new HubConnectionBuilder()
      .withUrl("http://localhost:5029/notificationHub", {
        accessTokenFactory: () => localStorage.getItem("token"),
      })
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    newConnection
      .start()
      .then(() => {
        console.log("✅ Connected to SignalR hub as Vendor");

        // استقبل الإشعار من الـ Admin
        newConnection.on("ReceiveNotification", (notification) => {
          console.log("📩 Notification received:", notification);
          console.log("📩 Notification message:", notification.message);

          if (notification.approved===true) {
            toast.success(
              notification.message
            );
          } else {
            toast.warning(
              notification.message
            );
          }
          console.log(notification)
          fetchProducts(); // تحديث قائمة المنتجات
        });
      })
      .catch((error) => console.log("❌ SignalR Connection Error:", error));

    setConnection(newConnection);

    return () => {
      if (newConnection) {
        newConnection.stop();
      }
    };
  }, []);
  const openEditModal = () => setIsEdit(true);
  const closeEditModal = () => setIsEdit(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  //***************** ON CHANGE HANDLERS ************************/
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);

    if (isEdit) {
      setProductToEdit((prev) => ({
        ...prev,
        category: category.name, // أو ممكن category.id لو عايز تبعته id مش الاسم
      }));
    } else {
      setProductAdd((prev) => ({
        ...prev,
        category: category.name,
      }));
    }
  };

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setProductAdd({
      ...productAdd,
      [name]: value,
      category: selectedCategory,
    });
    // console.log(productAdd.category);

    if (isError) {
      setErrors({
        ...errors,
        [name]: productValidation({ ...productAdd, [name]: value })[name],
      });
    }
  };

  const onChangeEditHandler = (event) => {
    const { name, value } = event.target;
    setProductToEdit((prev) => ({
      ...prev,
      [name]: value,
      category: selectedCategory,
    }));
    console.log("category", selectedCategory)
    console.log(productToEdit)
    if (isError) {
      setErrors({
        ...errors,
        [name]: productValidation({ ...productToEdit, [name]: value })[name],
      });
    }
  };

  //***************** SUBMIT HANDLERS ************************/

  const addItemHandler = async (event) => {
    event.preventDefault();
    const validationErrors = productValidation(productAdd);
    const hasNoError = Object.values(validationErrors).every((e) => e === "");

    if (hasNoError) {
      try {
        const token = localStorage.getItem("token");
        const newProduct = { ...productAdd, status: "pending" }; // تأكد من أنه في حالة "pending"
        const response = await axios.post(
          "http://localhost:5029/api/Vendor/addproduct",
          newProduct,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      
        setProducts([response.data, ...products]); // إضافة المنتج الجديد في حالة pending
        fetchProducts();
        if (newProduct.status === "pending") {
          toast.info("Your Post Waiting For Admin's Approval");
        }
        setProductAdd(defaultProductObj);
        closeModal();
        // toast.info("Request Has Been Sent to Admin, Wait For Approval.");
      } catch (err) {
        console.error(err);
        alert("Failed to add product.");
      }
    } else {
      setErrors(validationErrors);
      setIsError(true);
    }
  };

  const editItemHandler = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const cleanedProduct = {
        ...productToEdit,
        numOfUnits: parseInt(productToEdit.numOfUnits) || 0,
      };
      console.log(cleanedProduct);
      const response = await axios.put(
        `http://localhost:5029/api/Vendor/updateproduct/${productToEdit.id}`,
        cleanedProduct,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const updatedProducts = [...products];
      updatedProducts[productToEditIdx] = response.data;
      setProducts(updatedProducts);
      console.log([updatedProducts]);

      closeEditModal();
      toast.success("Product updated successfully!");
    } catch (err) {
      console.error(err);
      toast.warn("Please Update Category")
      toast.error("Failed to update product.");
    }
  };

  const onCancelHandler = () => {
    setProductAdd(defaultProductObj);
    setErrors(defaultErrorObj);
    setIsError(false);
    closeModal();
  };
  /*****************************FILTER *********************/
  // Live Search
  useEffect(() => {
    const filtered = products.filter((product) => {
      const titleMatch = product.title
        ?.toLowerCase()
        .includes(searchProduct.toLowerCase());

      return titleMatch;
    });
    setFilteredProducts(filtered);
  }, [searchProduct, products]);
  //***************** RENDERS ************************/

  const renderProductList = (() => {
    if (!Array.isArray(products)) {
      return (
        <div className="text-center col-span-full">
          <h2 className="text-2xl font-bold text-red-600">
            Error loading products
          </h2>
          <p className="text-gray-500">
            Unexpected data format received from server.
          </p>
        </div>
      );
    }

    if (products.length === 0) {
      return (
        <div className="text-center col-span-full">
          <h2 className="text-2xl font-bold text-gray-700">
            No products available
          </h2>
          <p className="text-gray-500">
            Click "ADD ITEM" to create your first product.
          </p>
        </div>
      );
    }

    const approvedProducts = filteredProducts.filter(
      (product) => product?.isapproved === true
    );

    if (approvedProducts.length === 0) {
      return (
        <div className="text-center col-span-full">
          <h2 className="text-2xl font-bold text-gray-700">
            No approved products yet
          </h2>
          <p className="text-gray-500">
            Your products may still be pending approval.
          </p>
        </div>
      );
    }

    return approvedProducts.map((product, idx) => (
      <ProductCard
        key={product.id}
        product={product}
        setProductToEdit={setProductToEdit}
        setProductToEditIdx={setProductToEditIdx}
        setIsEdit={setIsEdit}
        openEditModal={openEditModal}
        idx={idx}
        setProducts={setProducts}
        products={products}
      />
    ));
  })();

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
          PRODUCTS MANAGEMENT
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
            Manage Your Products
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
              value={searchProduct}
              onChange={(e) => setSearchProduct(e.target.value)}
            />
          </Box>

          <button
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            onClick={openModal}
          >
            Add Item
          </button>

          <div className="m-5 p-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {renderProductList}
          </div>
        </Container>
      </Box>

      {/* Modal for Adding */}
      <Modal isOpen={isOpen} close={closeModal} title="Add New Product">
        <form onSubmit={addItemHandler}>
          {formInputsList.map((input) => (
            <div key={input.id} className="flex flex-col mb-4">
              <label htmlFor={input.id}>{input.label}</label>
              <Input
                name={input.name}
                id={input.id}
                value={productAdd[input.name]}
                onChange={onChangeHandler}
              />
              <ErrorMsg msg={errors[input.name]} />
            </div>
          ))}
          <ErrorMsg msg={errors.category} />
          <SelectMenu
            selected={selectedCategory}
            setSelected={handleCategoryChange}
          />
          <div className="flex space-x-2 mt-5">
            <Button type="submit" className="bg-violet-700">
              Submit
            </Button>
            <Button
              type="button"
              onClick={onCancelHandler}
              className="bg-gray-700"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal for Editing */}
      <Modal isOpen={isEdit} close={closeEditModal} title="Edit Product">
        <form onSubmit={editItemHandler}>
          {formInputsList.map((input) => (
            <div key={input.id} className="flex flex-col mb-4">
              <label htmlFor={input.id}>{input.label}</label>
              <Input
                name={input.name}
                id={input.id}
                value={productToEdit[input.name]}
                onChange={onChangeEditHandler}
              />
            </div>
          ))}
          <SelectMenu
            selected={selectedCategory}
            setSelected={handleCategoryChange}
          />
          <div className="flex space-x-2 mt-5">
            <Button type="submit" className="bg-violet-700">
              Save
            </Button>
            <Button
              type="button"
              onClick={closeEditModal}
              className="bg-gray-700"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </Box>
  );
}

export default ProductManage;
