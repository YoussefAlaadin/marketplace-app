import Image from "../ui/Image.jsx";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { MdOutlineLabelImportant } from "react-icons/md";
import { BsSuitHeartFill } from "react-icons/bs";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import { UserContext } from "../context/UserContext"; // استيراد الـ UserContext
import { LuEye } from "react-icons/lu";
import { productList } from "../../data/index.js";
const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { userInfo } = useContext(UserContext); // الحصول على معلومات المستخدم
  const [cartItems, setCartItems] = useState([]);
  const [wishItems, setWishItems] = useState([]);
  useEffect(() => {
    if (userInfo) {
      const fetchWishList = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5029/api/Customer/Favorites`,
            {
              headers: {
                Authorization: `Bearer ${userInfo.token}`, // استخدام الـ token من الـ Context
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
          const response = await axios.get(
            `http://localhost:5029/api/Customer/allCartProduct`,
            {
              headers: {
                Authorization: `Bearer ${userInfo.token}`, // استخدام الـ token من الـ Context
              },
            }
          );
          if (Array.isArray(response.data)) {
            setCartItems(response.data);
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
  }, [userInfo]); // إعادة التحقق عند تغيير معلومات المستخدم

  const isInWishList = (id) => {
    return wishItems.some((item) => item.id === id);
  };

  const isInCart = (id) => {
    return cartItems.some((item) => item.productId === id);
  };

  const handleCartToggle = async (productId) => {
    if (!userInfo) {
      toast.error("You need to log in first to proceed.");
      return;
    }
    try {
      if (isInCart(productId)) {
        await axios.delete(
          `http://localhost:5029/api/Customer/RemoveProductFromCart/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );
        setCartItems(cartItems.filter((item) => item.productId !== productId));
      } else {
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
        await axios.delete(
          `http://localhost:5029/api/Customer/DeleteFromFavorite/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );
        setWishItems(wishItems.filter((item) => item.id !== productId));
      } else {
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

  const handleNavigateToDetails = () => {
    if (!userInfo) {
      toast.error("You need to log in first to proceed.");
      return;
    }
    navigate(`/product/${product.id}`);
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
    <div
      className={`w-full relative group ${
        product.numOfUnits === 0
          ? "opacity-50 cursor-not-allowed pointer-events-none"
          : ""
      }`}
    >
      <div className="max-w-80 max-h-80 relative overflow-y-hidden">
        <div className="relative">
          <Image
            className="w-full h-full"
            imgSrc={product.imageUrl}
            alt={product.title}
          />
          {product.numOfUnits === 0 && (
            <div className="absolute top-4 left-4 bg-red-500 bg-opacity-50 text-white px-4 py-2 rounded-lg shadow-md">
              <p className="text-sm font-medium z-50">Out of Stock!</p>
            </div>
          )}
        </div>

        <div
          className={`w-full h-32 absolute bg-white  ${
            product.numOfUnits === 0
              ? ""
              : "-bottom-[130px] group-hover:bottom-0 duration-700"
          }`}
        >
          <ul className="w-full h-full flex flex-col items-end justify-center gap-2 font-titleFont px-2 border-l border-r border-gray-300">
            <li
              onClick={() => handleCartToggle(product.id)}
              className={`text-[#767676] hover:text-black text-sm font-normal border-b-[1px] border-b-gray-200 hover:border-b-black flex items-center justify-end gap-2 hover:cursor-pointer pb-1 duration-300 w-full ${
                product.numOfUnits === 0 ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              {isInCart(product.id)
                ? "Remove from Cart"
                : product.numOfUnits === 0
                ? "Out of Stock"
                : "Add to Cart"}
              <span>
                <FaShoppingCart />
              </span>
            </li>
            <li
              onClick={handleNavigateToDetails}
              className="text-[#767676] hover:text-black text-sm font-normal border-b-[1px] border-b-gray-200 hover:border-b-black flex items-center justify-end gap-2 hover:cursor-pointer pb-1 duration-300 w-full"
            >
              View Details
              <span className="text-lg">
                <MdOutlineLabelImportant />
              </span>
            </li>
            <li
              onClick={() => handleWishToggle(product.id)}
              className="text-[#767676] hover:text-black text-sm font-normal border-b-[1px] border-b-gray-200 hover:border-b-black flex items-center justify-end gap-2 hover:cursor-pointer pb-1 duration-300 w-full"
            >
              {isInWishList(product.id)
                ? "Remove from Wishlist"
                : "Add to Wishlist"}
              <span>
                <BsSuitHeartFill />
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-80 py-6 flex flex-col gap-2 border-[1px] border-t-0 px-4 bg-white shadow-md border-gray-300 ">
        <div className="flex flex-col items-start gap-2">
          <h2 className="text-lg text-primeColor font-bold">{product.title}</h2>
          <div className="flex items-center justify-between w-full">
            <p className="text-[#767676] text-sm font-medium">
              Price: <span className="text-black">${product.price}</span>
            </p>
            <p className="text-[#767676] text-sm font-medium">
              Category: <span className="text-black">{product.category}</span>
            </p>
            <p className="text-[#767676] text-sm font-medium">
              Units: <span className="text-black">{product.numOfUnits}</span>
            </p>
          </div>
          <div className="flex items-center gap-2 text-[#767676] text-sm font-medium">
            <LuEye className="text-lg text-primeColor" />
            <span>{product.numOfViews}</span> {/*edit this*/}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
