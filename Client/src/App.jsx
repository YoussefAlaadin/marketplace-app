//App.jsx
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductManage from "./pages/vendor/ProductManage";
import ProductDetails from "./pages/product/ProductDetails";
import WishlistPage from "./pages/wishlist/Wishlist";
import Cart from "./pages/Cart/Cart";
import Payment from "./pages/billing/Payment";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Shop from "./pages/shop/Shop";
import CustomerProfile from "./pages/customer/CustomerProfile";
import AdminProductRequests from "./pages/admin/AdminProductRequests";
import AdminDashboard from "./pages/admin/AdminDashboard";
import PurchaseHistory from "./pages/vendor/PurchaseHistory";
import UsersList from "./pages/admin/UsersList";
import RegisterStatus from "./pages/vendor/RegisterStatus";
import RegisterRequest from "./pages/admin/RegisterRequest";

import ProtectedRoute from "./components/ProtectedRoute";
import { UserContext } from "./components/context/UserContext";
import Home from "./pages/Home/Home";
import VendorDashboard from "./pages/vendor/VendorDashboard";
import CreditCardForm from "./pages/payment/CreditCardForm";
import EditCard from "./pages/customer/EditCard";

function App() {
  const { userInfo } = useContext(UserContext);
  let pageRole = "home";
  // Check if userInfo exists and has roles
  if (userInfo && userInfo.roles) {
    if (userInfo.roles.includes("Admin")) {
      pageRole = "admin";
    } else if (userInfo.roles.includes("Vendor")) {
      pageRole = "vendor";
    } else if (userInfo.roles.includes("Customer")) {
      pageRole = "home";
    }
  }
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            !userInfo ? (
              <Login />
            ) : (
              <Navigate to={`/${pageRole}/${userInfo.userId}`} replace />
            )
          }
        />
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home/:customerId" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/shop/:customerId" element={<Shop />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:productId" element={<ProductDetails />} />

        {/* Admin Routes */}
        <Route
          path="/admin/:uid"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users/:uid"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <UsersList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/post-request/:uid"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminProductRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/register-requests/:uid"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <RegisterRequest />
            </ProtectedRoute>
          }
        />

        {/* Vendor Routes */}
        <Route
          path="/vendor/product-manage/:uid"
          element={
            <ProtectedRoute allowedRoles={["Vendor"]}>
              <ProductManage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendor/:uid"
          element={
            <ProtectedRoute allowedRoles={["Vendor"]}>
              <VendorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendor/purchase-history/:uid"
          element={
            <ProtectedRoute allowedRoles={["Vendor"]}>
              <PurchaseHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register-status/:uid"
          element={
            <ProtectedRoute allowedRoles={["Vendor"]}>
              <RegisterStatus />
            </ProtectedRoute>
          }
        />

        {/* Customer Protected Routes */}
        <Route
          path="/cart/:customerId"
          element={
            <ProtectedRoute allowedRoles={["Customer"]}>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wishlist/:customerId"
          element={
            <ProtectedRoute allowedRoles={["Customer"]}>
              <WishlistPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment/:customerId"
          element={
            <ProtectedRoute allowedRoles={["Customer"]}>
              <CreditCardForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer-profile/:customerId"
          element={
            <ProtectedRoute allowedRoles={["Customer"]}>
              <CustomerProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-card/:customerId"
          element={
            <ProtectedRoute allowedRoles={["Customer"]}>
              <EditCard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;

// import { useContext } from "react";
// import { Routes, Route, Router } from "react-router-dom";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import VendorDashboard from "./pages/vendor/VendorDashboard";
// import ProductDetails from "./pages/product/ProductDetails";
// import WishlistPage from "./pages/wishlist/Wishlist";
// import Cart from "./pages/Cart/Cart";
// import Payment from "./pages/billing/Payment";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Shop from "./pages/shop/Shop";
// import CustomerProfile from "./pages/customer/CustomerProfile";
// import AdminProductRequests from "./pages/admin/AdminProductRequests";
// import AdminDashboard from "./pages/admin/AdminDashboard";
// import PurchaseHistory from "./pages/vendor/PurchaseHistory";
// import UsersList from "./pages/admin/UsersList";
// import RegisterStatus from "./pages/vendor/RegisterStatus";
// import RegisterRequest from "./pages/admin/RegisterRequest";
// function App() {
//   return (
//     <>
//       <ToastContainer position="top-right" autoClose={3000} />{" "}
//       {/* خارج الـ Routes */}
//       <Routes>
//         {/*Authentication*/}
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         {/*admin*/}
//         <Route path="/admin/:uid" element={<AdminDashboard />} />
//         <Route path="/admin/users/:uid" element={<UsersList />} />
//         <Route path="/admin/post-request/:uid" element={<AdminProductRequests />} />
//         <Route path="/admin/register-requests/:uid" element={<RegisterRequest />} />
//         {/* vendor */}
//         <Route path="/vendor/product-manage/:uid" element={<VendorDashboard />} />
//         <Route path="/vendor" element={<VendorDashboard />} />
//         <Route path="/vendor/purchase-history/:uid" element={<PurchaseHistory />} />
//         <Route path="/register-status/:uid" element={<RegisterStatus />} />
//         {/* customer */}
//         <Route path="/shop/:customerId" element={<Shop />} />
//         <Route path="/shop" element={<Shop />} /> {/*Remove THIS*/}
//         <Route path="/cart" element={<Cart />} />
//         <Route path="/product/:productId" element={<ProductDetails />} />
//         <Route path="/wishlist" element={<WishlistPage />} />
//         <Route path="/payment" element={<Payment />} />
//         <Route
//           path="/customer-profile/:customerId"
//           element={<CustomerProfile />}
//         />
//       </Routes>
//     </>
//   );
// }

// export default App;
