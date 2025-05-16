import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/header/Header";
import HeaderBottom from "../../components/header/HeaderBottom";
import FooterBottom from "../../components/Footer/FooterBottom";
import Footer from "../../components/Footer/Footer";
import { Navigate, useNavigate } from "react-router-dom";
//import { productList } from "../../data";
import { toast } from "react-toastify";
import Image from "../../components/designLayouts/Image";
import { FaShoppingCart } from "react-icons/fa";
import { MdOutlineLabelImportant } from "react-icons/md";
import { BsSuitHeartFill } from "react-icons/bs";
const WishlistPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [wishItems, setWishItems] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchWishList = async () => {
      try {
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
        const response = await axios.get(
          `http://localhost:5029/api/Customer/allCartProduct`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data?.items) {
          setCartItems(response.data.items);
        } else {
          setCartItems([]);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchCart();
    fetchWishList();
  }, []);

  const isInWishList = (id) => {
    return wishItems.some((item) => item.id === id);
  };

  const isInCart = (id) => {
    return cartItems.some((item) => item.productId === id);
  };

  const handleCartToggle = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You Need to Login First to Proceed");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (isInCart(productId)) {
        await axios.delete(
          `http://localhost:5029/api/Customer/RemoveProductFromCart/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
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
              Authorization: `Bearer ${token}`,
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
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You Need to Login First to Proceed");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (isInWishList(productId)) {
        await axios.delete(
          `http://localhost:5029/api/Customer/DeleteFromFavorite/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
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
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // Fetch updated wishlist to get full product info
        const response = await axios.get(
          `http://localhost:5029/api/Customer/Favorites`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setWishItems(response.data || []);
      }
    } catch (error) {
      console.error(error.response?.data || "Failed to update WishList");
    }
  };

  return (
    <>
      <Header />
      <HeaderBottom />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">My Wishlist 💖</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
          {wishItems.length === 0 ? (
            <p>Your wishlist is empty 😔</p>
          ) : (
            wishItems.map((item) => (
              <div className=" w-full relative group">
                <div className="max-w-80 max-h-80 relative overflow-y-hidden ">
                  <div>
                    <Image
                      className="w-full h-full"
                      imgSrc={item.imageUrl}
                      alt={item.title}
                    />
                  </div>

                  <div className="w-full h-32 absolute bg-white -bottom-[130px] group-hover:bottom-0 duration-700">
                    <ul className="w-full h-full flex flex-col items-end justify-center gap-2 font-titleFont px-2 border-l border-r">
                      <li
                        onClick={() => handleCartToggle(item.id)}
                        className="text-[#767676] hover:text-primeColor text-sm font-normal border-b-[1px] border-b-gray-200 hover:border-b-primeColor flex items-center justify-end gap-2 hover:cursor-pointer pb-1 duration-300 w-full"
                      >
                        {isInCart(item.id) ? "Remove from Cart" : "Add to Cart"}
                        <span>
                          <FaShoppingCart />
                        </span>
                      </li>
                      <li
                        onClick={() => navigate(`/product/${item.id}`)}
                        className="text-[#767676] hover:text-primeColor text-sm font-normal border-b-[1px] border-b-gray-200 hover:border-b-primeColor flex items-center justify-end gap-2 hover:cursor-pointer pb-1 duration-300 w-full"
                      >
                        View Details
                        <span className="text-lg">
                          <MdOutlineLabelImportant />
                        </span>
                      </li>
                      <li
                        onClick={() => handleWishToggle(item.id)}
                        className="text-[#767676] hover:text-primeColor text-sm font-normal border-b-[1px] border-b-gray-200 hover:border-b-primeColor flex items-center justify-end gap-2 hover:cursor-pointer pb-1 duration-300 w-full"
                      >
                        {isInWishList(item.id)
                          ? "Remove from Wishlist"
                          : "Add to Wishlist"}
                        <span>
                          <BsSuitHeartFill />
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="max-w-80 py-6 flex flex-col gap-1 border-[1px] border-t-0 px-4">
                  <div className="flex items-center justify-between font-titleFont">
                    <h2 className="text-lg text-primeColor font-bold">
                      {item.title}
                    </h2>
                    <p className="text-[#767676] text-[14px]">${item.price}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
      <FooterBottom />
    </>
  );
};

export default WishlistPage;
