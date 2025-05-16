/*  eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { HiOutlineMenuAlt4 } from "react-icons/hi";
import {
  FaSearch,
  FaUser,
  FaCaretDown,
  FaShoppingCart,
  FaHeart,
} from "react-icons/fa";
import Flex from "../../components/designLayouts/Flex";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";

const HeaderBottom = ({userId}) => {
  const [show, setShow] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [cartLength, setCartLength] = useState(0);
  const [wishItems, setWishItems] = useState([]);
  const ref = useRef();
  const navigate = useNavigate();
  const { userInfo, logout } = useContext(UserContext);
  const username = localStorage.getItem("userName");
  const customerId = localStorage.getItem("userId")
  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setShow(false);
      }
    };
    document.body.addEventListener("click", handleClickOutside);
    return () => document.body.removeEventListener("click", handleClickOutside);
  }, []);

  // Fetch product data
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5029/api/Customer/Products",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (Array.isArray(res.data)) {
          setAllProducts(res.data);
        } else {
          setAllProducts([]);
        }
      } catch (err) {
        console.error("Failed to load products", err);
      }
    };
    fetchProducts();
  }, []);

  // Fetch cart, wishlist, and user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [cartRes, wishlistRes] = await Promise.all([
          axios.get("http://localhost:5029/api/Customer/cart", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }),
          axios.get("http://localhost:5029/api/Customer/Favorites", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }),
          //axios.get("http://localhost:5029/api/user"),
        ]);
        setCartItems(cartRes.data);
        setCartLength(cartRes.data.length);
        setWishItems(wishlistRes.data);
        // setUserInfo(userRes.data);
      } catch (err) {
        console.error("Error loading cart/wishlist/user info", err);
      }
    };
    fetchData();
  }, []);

  //Filter search results
  useEffect(() => {
    const filtered = allProducts.filter(
      (item) =>
        typeof item.title === "string" &&
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery, allProducts]);

  return (
    <div className="w-full bg-[#F5F5F3] relative">
      <div className="max-w-container px-10 mx-auto">
        <Flex className="flex flex-col lg:flex-row items-start lg:items-center justify-between w-full px-4 pb-4 lg:pb-0 h-full lg:h-24">
          {/* Category Menu */}
          <div
            onClick={() => setShow(!show)}
            ref={ref}
            className="flex h-14 cursor-pointer items-center gap-2 text-primeColor"
          >
            {show && (
              <motion.ul
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="absolute top-36 z-50 bg-primeColor w-auto text-[#767676] h-auto p-4 pb-6"
              >
                {[
                  "Accessories",
                  "Furniture",
                  "Electronics",
                  "Clothes",
                  "Bags",
                  "Home appliances",
                ].map((category) => (
                  <li
                    key={category}
                    className="text-gray-400 px-4 py-1 border-b border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer"
                  >
                    {category}
                  </li>
                ))}
              </motion.ul>
            )}
          </div>

          {/* Search Bar */}
          <div className="relative w-full lg:w-[600px] h-[50px] text-base text-primeColor bg-white flex items-center gap-2 justify-between px-6 rounded-xl">
            <input
              className="flex-1 h-full outline-none placeholder:text-[#C4C4C4] placeholder:text-[14px]"
              type="text"
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
              placeholder="Search your products here"
            />
            <FaSearch className="w-5 h-5" />
            {searchQuery && (
              <div className="w-full mx-auto h-96 bg-white top-16 absolute left-0 z-50 overflow-y-scroll shadow-2xl scrollbar-hide cursor-pointer">
                {filteredProducts.map((item) => (
                  <div
                    onClick={() => {
                      if (!userInfo) {
                           toast.error("You need to log in first to proceed.");
                           return;
                         }
                        
                      if (typeof item.title === "string") {
                        navigate(`/product/${item.id}`, { state: { item } });
                        setSearchQuery("");
                      } else {
                        console.error("Invalid item.title:", item);
                      }
                    }}
                    key={item.id}
                    className="max-w-[600px] h-28 bg-gray-100 mb-3 flex items-center gap-3"
                  >
                    <img className="w-24" src={item.imageUrl} alt="productImg" />
                    <div className="flex flex-col gap-1">
                      <p className="font-semibold text-lg">{item.title}</p>
                      <p className="text-xs">{item.description}</p>
                      <p className="text-sm">
                        Price:{" "}
                        <span className="text-primeColor font-semibold">
                          ${item.price}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User, Wishlist, Cart */}
          <div className="flex gap-4 mt-2 lg:mt-0 items-center pr-6 cursor-pointer relative">
            {/* User Dropdown */}
            <div
              onClick={() => setShowUser(!showUser)}
              className="flex items-center gap-1"
            >
              <FaUser />
              <FaCaretDown />
              {userInfo && <span className="text-sm ml-1">Hi</span>}
            </div>

            {showUser && (
              <motion.ul
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="absolute top-6 left-0 z-50 bg-neutral-800 w-44 text-[#767676] h-auto p-4 pb-6"
              >
                {userInfo ? (
                  <Link to="/login">
                    <li
                      onClick={logout}
                      className="text-gray-400 px-4 py-1 border-b border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer"
                    >
                      Logout
                    </li>
                  </Link>
                ) : (
                  <Link to="/login">
                    <li className="text-gray-400 px-4 py-1 border-b border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">
                      Login
                    </li>
                  </Link>
                )}
                {!userInfo && (
                  <Link onClick={() => setShowUser(false)} to="/register">
                    <li className="text-gray-400 px-4 py-1 border-b border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">
                      Sign Up
                    </li>
                  </Link>
                )}
                {userInfo && (
                  <Link
                    onClick={() => setShowUser(false)}
                    to={`/customer-profile/${userInfo.userId}`}
                  >
                    <li className="text-gray-400 px-4 py-1 border-b border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">
                      Profile
                    </li>
                  </Link>
                )}
              </motion.ul>
            )}
            {/* Wishlist */}
            <Link to={`/wishlist/${customerId}`}>
              <div className="relative">
                <FaHeart />
                {/* <span className="absolute font-titleFont top-3 -right-2 text-xs w-4 h-4 flex items-center justify-center rounded-full bg-red-500 text-white">
                    {wishItems.length}
                  </span> */}
              </div>
            </Link>

            {/* Cart */}
            <Link to= {`/cart/${customerId}`} >
              <div className="relative">
                <FaShoppingCart />
                <span className="absolute font-titleFont top-3 -right-2 text-xs w-4 h-4 flex items-center justify-center rounded-full bg-primeColor text-white">
                  {cartLength}
                </span>
              </div>
            </Link>
          </div>
        </Flex>
      </div>
    </div>
  );
};

export default HeaderBottom;
