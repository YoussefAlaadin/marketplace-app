import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import Breadcrumbs from "../Cart/Breadcrumbs";
import ItemCard from "./ItemCard";
import { emptyCart } from "../../assets/images/index";
import Header from "../../components/header/Header";
import HeaderBottom from "../../components/header/HeaderBottom";
import Footer from "../../components/Footer/Footer";
import FooterBottom from "../../components/Footer/FooterBottom";
import { toast } from "react-toastify";

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [totalAmt, setTotalAmt] = useState(0);
  const [shippingCharge, setShippingCharge] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isCredit, setIsCredit] = useState(false);
  const customerId = localStorage.getItem("userId");
  // Fetch Cart Items on Component Mount
  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
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
        console.error("Failed to fetch cart items:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchCardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5029/api/Customer/creditcardinfo",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log(res.data)
        if (res.data.cardName==="") {
         setIsCredit(false)
        }
        else{
          setIsCredit(true)
        }
      } catch (err) {
        setIsCredit(false)
        console.log("No credit card data found or error:", err);
      }
    };
    fetchCardData();
    fetchCart();
  }, []);

  // Recalculate Total Price when Cart Items Change
  useEffect(() => {
    const calculateTotal = () => {
      const price = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      setTotalAmt(price);
    };

    calculateTotal();
  }, [cartItems]);

  // Update Shipping Charge Based on Total Amount
  useEffect(() => {
    if (totalAmt <= 200) {
      setShippingCharge(30);
    } else if (totalAmt <= 400) {
      setShippingCharge(25);
    } else {
      setShippingCharge(20);
    }
  }, [totalAmt]);

  // Handle Quantity Update
  const handleQuantityChange = async (productId, quantity) => {
    if (quantity < 1) return;

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5029/api/Customer/updateQuantity/${productId}/${quantity}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        )
      ); // تحديث الكمية في localStorage
      localStorage.setItem(`productQuantity_${productId}`, quantity);
    } catch (err) {
      console.error("Failed to update quantity:", err);
    }
  };

  // Handle Product Purchase
  const purchaseProduct = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5029/api/Customer/payment`,
        { cartItems },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCartItems([]); // Clear cart after purchase
    } catch (err) {
      console.error("Failed to process payment:", err);
    }
  };
  const handleNavigatePayment = () => {
    if (isCredit) {
        console.log("isCredit", isCredit )
        toast.success("Order Has Been Placed Successfully")
        return;
    }
      navigate(`/payment/${customerId}`);
    };
  return (
    <>
      <Header />
      <HeaderBottom />
      <div className="max-w-container mx-auto px-4">
        <Breadcrumbs title="Cart" />
        {loading ? (
          <div className="text-center py-10">
            <p className="text-lg font-semibold">Loading your cart...</p>
          </div>
        ) : cartItems.length > 0 ? (
          <div className="pb-20">
            {/* Cart Header */}
            <div className="w-full h-20 bg-[#F5F7F7] text-primeColor hidden lgl:grid grid-cols-5 place-content-center px-6 text-lg font-titleFont font-semibold">
              <h2 className="col-span-2">Product</h2>
              <h2>Price</h2>
              <h2>Quantity</h2>
              <h2>Sub Total</h2>
            </div>

            {/* Cart Items */}
            <div className="mt-5">
              {cartItems.map((item) => (
                <div key={item.productId}>
                  <ItemCard
                    item={item}
                    onQuantityChange={handleQuantityChange}
                    cartItems={cartItems}
                    setCartItems={setCartItems}
                  />
                </div>
              ))}
            </div>

            {/* Cart Totals */}
            <div className="max-w-7xl gap-4 flex justify-end mt-4">
              <div className="w-96 flex flex-col gap-4">
                <h1 className="text-2xl font-semibold text-right">
                  Cart totals
                </h1>
                <div>
                  <p className="flex items-center justify-between border-[1px] border-gray-400 border-b-0 py-1.5 text-lg px-4 font-medium">
                    Subtotal
                    <span className="font-semibold tracking-wide font-titleFont">
                      ${totalAmt.toFixed(2)}
                    </span>
                  </p>
                  <p className="flex items-center justify-between border-[1px] border-gray-400 border-b-0 py-1.5 text-lg px-4 font-medium">
                    Shipping Charge
                    <span className="font-semibold tracking-wide font-titleFont">
                      ${shippingCharge.toFixed(2)}
                    </span>
                  </p>
                  <p className="flex items-center justify-between border-[1px] border-gray-400 py-1.5 text-lg px-4 font-medium">
                    Total
                    <span className="font-bold tracking-wide text-lg font-titleFont">
                      ${(totalAmt + shippingCharge).toFixed(2)}
                    </span>
                  </p>
                </div>
                <div className="flex justify-end">
                    <button
                        onClick={() => { purchaseProduct(); handleNavigatePayment(); }}
                      className="w-52 h-10 text-white bg-gray-900 opacity-90 hover:bg-black duration-300"
                    >
                      Proceed to Checkout
                    </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Empty Cart Message
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col mdl:flex-row justify-center items-center gap-4 pb-20"
          >
            <div>
              <img
                className="w-80 rounded-lg p-4 mx-auto"
                src={emptyCart}
                alt="emptyCart"
              />
            </div>
            <div className="max-w-[500px] p-4 py-8 bg-white flex gap-4 flex-col items-center rounded-md shadow-lg">
              <h1 className="font-titleFont text-xl font-bold uppercase">
                Your Cart feels lonely.
              </h1>
              <p className="text-sm text-center px-10 -mt-2">
                Your Shopping cart lives to serve. Give it purpose - fill it
                with books, electronics, videos, etc. and make it happy.
              </p>
              <Link to="/shop">
                <button className="bg-gray-900 rounded-md cursor-pointer hover:bg-black active:bg-gray-900 px-8 py-2 font-titleFont font-semibold text-lg text-gray-200 hover:text-white duration-300">
                  Continue Shopping
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
      <Footer />
      <FooterBottom />
    </>
  );
};

export default Cart;

// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import Breadcrumbs from "../Cart/Breadcrumbs";
// import { emptyCart } from "../../assets/images/index";
// import ItemCard from "./ItemCard";
// import axios from "axios";
// import Header from "../../components/header/Header";
// import HeaderBottom from "../../components/header/HeaderBottom";
// import Footer from "../../components/Footer/Footer";
// import FooterBottom from "../../components/Footer/FooterBottom";

//   const Cart = () => {
//   const [totalAmt, setTotalAmt] = useState(0);
//   const [shippingCharge, setShippingCharge] = useState(0);
//   const [cartItems, setCartItems] = useState([]);

//   // Fetch Cart Items once on page load
//   useEffect(() => {
//     const fetchCart = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get(
//           `http://localhost:5029/api/Customer/allCartProduct`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         if (Array.isArray(response.data.items)) {
//           setCartItems(response.data.items);
//         } else {
//           setCartItems([]);
//         }
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchCart();
//   }, []);
//   console.log("Fetched Cart:", cartItems)
//   const purchaseProduct = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.post(
//         `http://localhost:5029/api/Customer/payment`,{cartItems},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       }
//      catch (err) {
//       console.error(err);
//     }
//   };

//   // Recalculate Total Price on cartItems change
//   useEffect(() => {
//     let price = 0;
//     cartItems.forEach((item) => {
//       price += item.price * item.quantity;
//     });
//     setTotalAmt(price);
//   }, [cartItems]);

//   // Set Shipping Charge based on total amount
//   useEffect(() => {
//     if (totalAmt <= 200) {
//       setShippingCharge(30);
//     } else if (totalAmt <= 400) {
//       setShippingCharge(25);
//     } else {
//       setShippingCharge(20);
//     }
//   }, [totalAmt]);

//   return (
//     <>
//       <Header />
//       <HeaderBottom />
//       <div className="max-w-container mx-auto px-4">
//         <Breadcrumbs title="Cart" />
//         {cartItems.length > 0 ? (
//           <div className="pb-20">
//             <div className="w-full h-20 bg-[#F5F7F7] text-primeColor hidden lgl:grid grid-cols-5 place-content-center px-6 text-lg font-titleFont font-semibold">
//               <h2 className="col-span-2">Product</h2>
//               <h2>Price</h2>
//               <h2>Quantity</h2>
//               <h2>Sub Total</h2>
//             </div>
//             <div className="mt-5">
//               {cartItems.map((item) => (
//                 <div key={item.id}>
//                   <ItemCard
//                     item={item}
//                     cartItems={cartItems}
//                     setCartItems={setCartItems}
//                   />
//                 </div>
//               ))}
//             </div>

//             <div className="max-w-7xl gap-4 flex justify-end mt-4">
//               <div className="w-96 flex flex-col gap-4">
//                 <h1 className="text-2xl font-semibold text-right">
//                   Cart totals
//                 </h1>
//                 <div>
//                   <p className="flex items-center justify-between border-[1px] border-gray-400 border-b-0 py-1.5 text-lg px-4 font-medium">
//                     Subtotal
//                     <span className="font-semibold tracking-wide font-titleFont">
//                       ${totalAmt}
//                     </span>
//                   </p>
//                   <p className="flex items-center justify-between border-[1px] border-gray-400 border-b-0 py-1.5 text-lg px-4 font-medium">
//                     Shipping Charge
//                     <span className="font-semibold tracking-wide font-titleFont">
//                       ${shippingCharge}
//                     </span>
//                   </p>
//                   <p className="flex items-center justify-between border-[1px] border-gray-400 py-1.5 text-lg px-4 font-medium">
//                     Total
//                     <span className="font-bold tracking-wide text-lg font-titleFont">
//                       ${totalAmt + shippingCharge}
//                     </span>
//                   </p>
//                 </div>
//                 <div className="flex justify-end">
//                   <Link to="/payment">
//                     <button onClick={()=>purchaseProduct()} className="w-52 h-10 text-white bg-gray-900 opacity-90 hover:bg-black duration-300">
//                       Proceed to Checkout
//                     </button>
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <motion.div
//             initial={{ y: 30, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             transition={{ duration: 0.4 }}
//             className="flex flex-col mdl:flex-row justify-center items-center gap-4 pb-20"
//           >
//             <div>
//               <img
//                 className="w-80 rounded-lg p-4 mx-auto"
//                 src={emptyCart}
//                 alt="emptyCart"
//               />
//             </div>
//             <div className="max-w-[500px] p-4 py-8 bg-white flex gap-4 flex-col items-center rounded-md shadow-lg">
//               <h1 className="font-titleFont text-xl font-bold uppercase">
//                 Your Cart feels lonely.
//               </h1>
//               <p className="text-sm text-center px-10 -mt-2">
//                 Your Shopping cart lives to serve. Give it purpose - fill it
//                 with books, electronics, videos, etc. and make it happy.
//               </p>
//               <Link to="/shop">
//                 <button className="bg-gray-900 rounded-md cursor-pointer hover:bg-black active:bg-gray-900 px-8 py-2 font-titleFont font-semibold text-lg text-gray-200 hover:text-white duration-300">
//                   Continue Shopping
//                 </button>
//               </Link>
//             </div>
//           </motion.div>
//         )}
//       </div>
//       <Footer />
//        <FooterBottom />
//     </>
//   );
// };

// export default Cart;

// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import Breadcrumbs from "../Cart/Breadcrumbs";
// import { emptyCart } from "../../assets/images/index";
// import ItemCard from "./ItemCard";
// import axios from "axios";
// import { productList } from "../../data";
// import Header from "../../components/header/Header";
// import HeaderBottom from "../../components/header/HeaderBottom";
// import Footer from "../../components/Footer/Footer";
// import FooterBottom from "../../components/Footer/FooterBottom";

// const Cart = () => {
//   //const [products, setProducts] = useState([])
//   const [totalAmt, setTotalAmt] = useState("");
//   const [shippingCharge, setShippingCharge] = useState("");
//   const [cartItems, setCartItems] = useState(productList);

//   useEffect(() => {
//     // Fetch Cart Items
//     const fetchCart = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get(
//           `http://localhost:5029/api/Customer/allCartProduct`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         if (Array.isArray(response.data)) {
//           setCartItems(response.data);
//         } else {
//           setCartItems([]);
//         }
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     let price = 0;
//     cartItems.map((item) => {
//       price += item.price * item.quantity;
//       return price;
//     });
//     setTotalAmt(price);

//     fetchCart();
//   }, [cartItems]);
//   // Update Price
//   useEffect(() => {
//     if (totalAmt <= 200) {
//       setShippingCharge(30);
//     } else if (totalAmt <= 400) {
//       setShippingCharge(25);
//     } else if (totalAmt > 401) {
//       setShippingCharge(20);
//     }
//   }, [totalAmt]);
//   return (
//     <>
//       <Header />
//       <HeaderBottom />
//       <div className="max-w-container mx-auto px-4">
//         <Breadcrumbs title="Cart" />
//         {cartItems.length > 0 ? (
//           <div className="pb-20">
//             <div className="w-full h-20 bg-[#F5F7F7] text-primeColor hidden lgl:grid grid-cols-5 place-content-center px-6 text-lg font-titleFont font-semibold">
//               <h2 className="col-span-2">Product</h2>
//               <h2>Price</h2>
//               <h2>Quantity</h2>
//               <h2>Sub Total</h2>
//             </div>
//             <div className="mt-5">
//               {cartItems.map((item) => (
//                 <div key={item._id}>
//                   <ItemCard item={item} />
//                 </div>
//               ))}
//             </div>

//             <div className="max-w-7xl gap-4 flex justify-end mt-4">
//               <div className="w-96 flex flex-col gap-4">
//                 <h1 className="text-2xl font-semibold text-right">
//                   Cart totals
//                 </h1>
//                 <div>
//                   <p className="flex items-center justify-between border-[1px] border-gray-400 border-b-0 py-1.5 text-lg px-4 font-medium">
//                     Subtotal
//                     <span className="font-semibold tracking-wide font-titleFont">
//                       ${totalAmt}
//                     </span>
//                   </p>
//                   <p className="flex items-center justify-between border-[1px] border-gray-400 border-b-0 py-1.5 text-lg px-4 font-medium">
//                     Shipping Charge
//                     <span className="font-semibold tracking-wide font-titleFont">
//                       ${shippingCharge}
//                     </span>
//                   </p>
//                   <p className="flex items-center justify-between border-[1px] border-gray-400 py-1.5 text-lg px-4 font-medium">
//                     Total
//                     <span className="font-bold tracking-wide text-lg font-titleFont">
//                       ${totalAmt + shippingCharge}
//                     </span>
//                   </p>
//                 </div>
//                 <div className="flex justify-end">
//                   <Link to="/paymentgateway">
//                     <button className="w-52 h-10 bg-primeColor text-white hover:bg-black duration-300">
//                       Proceed to Checkout
//                     </button>
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <motion.div
//             initial={{ y: 30, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             transition={{ duration: 0.4 }}
//             className="flex flex-col mdl:flex-row justify-center items-center gap-4 pb-20"
//           >
//             <div>
//               <img
//                 className="w-80 rounded-lg p-4 mx-auto"
//                 src={emptyCart}
//                 alt="emptyCart"
//               />
//             </div>
//             <div className="max-w-[500px] p-4 py-8 bg-white flex gap-4 flex-col items-center rounded-md shadow-lg">
//               <h1 className="font-titleFont text-xl font-bold uppercase">
//                 Your Cart feels lonely.
//               </h1>
//               <p className="text-sm text-center px-10 -mt-2">
//                 Your Shopping cart lives to serve. Give it purpose - fill it
//                 with books, electronics, videos, etc. and make it happy.
//               </p>
//               <Link to="/shop">
//                 <button className="bg-primeColor rounded-md cursor-pointer hover:bg-black active:bg-gray-900 px-8 py-2 font-titleFont font-semibold text-lg text-gray-200 hover:text-white duration-300">
//                   Continue Shopping
//                 </button>
//               </Link>
//             </div>
//           </motion.div>
//         )}
//       </div>
//       <Footer />
//       <FooterBottom />
//     </>
//   );
// };

// export default Cart;
