import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import Header from "../../components/header/Header";
import HeaderBottom from "../../components/header/HeaderBottom";
import Footer from "../../components/Footer/Footer";
import FooterBottom from "../../components/Footer/FooterBottom";
import { UserContext } from "../../components/context/UserContext";
import { toast } from "react-toastify";
import { LuEye } from "react-icons/lu";
function ProductDetails() {
  const { productId } = useParams();
  const [product, setProduct] = useState();
  const [cartItems, setCartItems] = useState([]);
  const [quantity, setQuantity] = useState(1); // State for quantity
  const [wishItems, setWishItems] = useState([]); // Renamed to camelCase
  // const [wishlistLoading, setWishlistLoading] = useState(true);
  const { userInfo } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const savedQuantity = localStorage.getItem(`productQuantity_${productId}`);
    if (savedQuantity) {
      setQuantity(parseInt(savedQuantity, 10));
    }
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5029/api/Customer/getProductById/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProduct(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProduct();
    if (userInfo) {
      const fetchWishList = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `http://localhost:5029/api/Customer/Favorites`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (Array.isArray(response.data)) {
            setWishItems(response.data);
          } else {
            setWishItems([]);
          }
        } catch (err) {
          console.error(err);
        }
      };

      const fetchCart = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `http://localhost:5029/api/Customer/allCartProduct`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (Array.isArray(response.data.items)) {
            const updatedItems = response.data.items.map((item) => {
              const savedQuantity = localStorage.getItem(
                `productQuantity_${item.productId}`
              );
              if (savedQuantity) {
                item.quantity = parseInt(savedQuantity, 10);
              }
              return item;
            });
            setCartItems(updatedItems);
          } else {
            setCartItems([]);
          }
        } catch (err) {
          console.error(err);
        }
      };

      fetchCart();
      fetchWishList();
    }
    fetchProduct();
  }, [userInfo, productId]);

  const isInWishList = (id) => {
    return wishItems.some((item) => item.id === id);
  };
  const isInCart = (id) => {
    return cartItems.some((item) => item.productId === id);
  };
  //********************* HANDELRS ***************************/
  const handleCartToggle = async (productId) => {
    if (!userInfo) {
      toast.error("You need to log in first to proceed.");
      return;
    }
    try {
      if (isInCart(productId)) {
        // Remove from wishlist
        await axios.delete(
          `http://localhost:5029/api/Customer/RemoveProductFromCart/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );
        setCartItems(cartItems.filter((item) => item.productId !== productId));
        console.log("cart items:", cartItems);
      } else {
        // Add to wishlist
        await axios.post(
          `http://localhost:5029/api/Customer/AddToCart/${productId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );
        setCartItems([...cartItems, { productId }]);
      }
    } catch (error) {
      console.error(error.response?.data || "Failed to update Cart");
    }
  };
  const handleWishToggle = async (productId) => {
    if (!userInfo) {
      toast.error("You need to log in first to proceed.");
      return;
    }
    try {
      if (isInWishList(productId)) {
        // Remove from wishlist
        await axios.delete(
          `http://localhost:5029/api/Customer/DeleteFromFavorite/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );
        setWishItems(wishItems.filter((item) => item.id !== productId));
        console.log("wishlist items:", wishItems);
      } else {
        // Add to wishlist
        await axios.post(
          `http://localhost:5029/api/Customer/AddToFavorite/${productId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );
        setWishItems([...wishItems, { id: productId }]);
      }
    } catch (error) {
      console.error(error.response?.data || "Failed to update WishList");
    }
  };

  const handleRestrictedAction = () => {
    if (!userInfo) {
      toast.error("You need to log in first.");
      navigate("/login");
      return;
    }
    // Proceed with the action
  };

  const handleQuantityChange = async (e) => {
    const newQuantity = parseInt(e.target.value, 10);
    if (newQuantity < 1) return;

    setQuantity(newQuantity);

    // حفظ الكمية في localStorage
    localStorage.setItem(`productQuantity_${productId}`, newQuantity);
  };

  if (!product) {
    return (
      <div className="text-center mt-10">
        <h1 className="text-2xl font-bold text-red-500">Product not found!</h1>
        <p className="text-gray-500">Please go back and select a product.</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <HeaderBottom />

      <div className="max-w-7xl mx-auto p-8 flex flex-col md:flex-row items-start gap-16">
        {/* Image Section */}
        <div className="w-full md:w-1/2 relative">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-[500px] object-cover rounded-2xl shadow-lg transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg shadow-md">
            <p className="text-sm font-medium">Views: {product.numOfViews}</p>
          </div>
        </div>

        {/* Details Section */}
        <div className="flex flex-col gap-6 w-full">
          {/* Title and Wishlist */}
          <div className="flex items-center justify-between">
            <h2 className="text-5xl font-bold text-gray-800">
              {product.title}
            </h2>
            <button
              onClick={() =>
                userInfo
                  ? handleWishToggle(product.id)
                  : handleRestrictedAction()
              }
              className="text-4xl transition-transform duration-300 hover:scale-110"
            >
              {isInWishList(product.id) ? (
                <AiFillHeart className="text-red-600" />
              ) : (
                <AiOutlineHeart className="text-gray-500" />
              )}
            </button>
          </div>

          {/* Price */}
          <p className="text-3xl font-semibold text-gray-700">
            ${product.price}
          </p>

          {/* Description */}
          <p className="text-lg text-gray-600 leading-relaxed">
            {product.description}
          </p>

          {/* Additional Info */}
          <div className="flex flex-col gap-2">
            <p className="text-lg text-gray-600">
              <span className="font-medium text-gray-800">
                Units Available:
              </span>{" "}
              {product.numOfUnits}
            </p>
            <p className="text-lg text-gray-600">
              <span className="font-medium text-gray-800">Vendor:</span>{" "}
              {product.vendorName}
            </p>
            <p className="text-lg text-gray-600">
              <span className="font-medium text-gray-800">Category:</span>{" "}
              {product.category}
            </p>
          </div>
          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <label htmlFor="quantity" className="text-lg font-medium">
              Quantity:
            </label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={handleQuantityChange}
              className="w-16 px-2 py-1 border rounded-lg text-center"
              min="1"
            />
          </div>
          {/* Add to Cart Button */}
          <button
            onClick={() =>
              userInfo ? handleCartToggle(product.id) : handleRestrictedAction()
            }
            className={`mt-6 px-10 py-4 text-lg font-semibold rounded-lg shadow-md transition-all duration-300 ${
              isInCart(product.id)
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-black hover:bg-gray-900 text-white"
            }`}
          >
            {isInCart(product.id) ? "Remove from Cart" : "Add to Cart"}
          </button>

          {/* Reviews Section */}
          <div className="mt-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Reviews
            </h3>
            <p className="text-gray-600 italic">
              Be the first to leave a review.
            </p>
          </div>
        </div>
      </div>

      <Footer />
      <FooterBottom />
    </>
  );
}

export default ProductDetails;

// {/*<div className="flex items-center gap-2">
//             <h2 className="text-4xl font-semibold">{product.title}</h2>

//           </div>

//              {wishlistLoading ? (
//               // لودر بسيط على شكل دايرة بتلف
//               <div className="w-7 h-7 border-4 border-gray-300 border-t-red-600 rounded-full animate-spin"></div>
//             ) : (
//               <button
//                 onClick={() => handleWishToggle(product.id)}
//                 className={`text-4xl ${
//                   isInWishList(product.id) ? "text-red-600" : "text-gray-500"
//                 }`}
//               >
//                 {isInWishList(product.id) ? (
//                   <AiFillHeart />
//                 ) : (
//                   <AiOutlineHeart />
//                 )}
//               </button>
//             )} */}

// <>
//   <Header />
//   <HeaderBottom />

//   <div className="max-w-6xl mx-auto p-8 flex flex-col md:flex-row items-center gap-12">
//     {/* Image Section */}
//     <div className="w-full md:w-1/2">
//       <img
//         src={product.imageUrl}
//         alt={product.title}
//         className="w-full h-[500px] object-cover rounded-2xl shadow-lg"
//       />
//     </div>
//     <div className="flex flex-col gap-5">
//       <div className="flex items-center gap-2">
//         <h2 className="text-4xl font-semibold">{product.title}</h2>
//         <button
//           onClick={() =>
//             userInfo
//               ? handleWishToggle(product.id)
//               : handleRestrictedAction()
//           }
//           className={"text-4xl"}
//         >
//           {isInWishList(product.id) ? (
//             <AiFillHeart className="text-red-600" />
//           ) : (
//             <AiOutlineHeart className="text-gray-500" />
//           )}
//         </button>
//       </div>
//       <p className="text-xl font-semibold">${product.price}</p>
//       <p className="text-base text-gray-600">{product.description}</p>
//       <p className="text-base text-gray-600">Views: {product.numOfViews}<LuEye />  </p>
//       <p className="text-base text-gray-600">
//         {product.numOfUnits} units available
//       </p>
//       <p className="text-base text-gray-600">
//         Vendor: {product.vendorName}
//       </p>
//       <p className="text-sm">Be the first to leave a review.</p>
//       {/* Button Add Cart */}
//       <button
//         onClick={() =>
//           userInfo ? handleCartToggle(product.id) : handleRestrictedAction()
//         }
//         className={`mt-6 px-8 py-3 ${
//           isInCart(product.id)
//             ? "bg-red-600 hover:bg-red-700 duration-300"
//             : "bg-black hover:bg-gray-900 duration-300"
//         } text-white rounded-xl text-lg transition`}
//       >
//         {isInCart(product.id) ? "Remove from Cart" : "Add to Cart"}
//       </button>
//       <p className="font-normal text-sm">
//         <span className="text-base font-medium">Categories:</span>{" "}
//         {product.category}
//       </p>
//     </div>
//   </div>
//   <Footer />
//   <FooterBottom />
// </>
