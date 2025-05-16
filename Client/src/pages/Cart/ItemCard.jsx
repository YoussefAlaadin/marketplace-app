import React from "react";
import axios from "axios";
import { ImCross } from "react-icons/im";

const ItemCard = ({ item, cartItems, setCartItems }) => {
  const handleRemove = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:5029/api/Customer/RemoveProductFromCart/${item.productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCartItems(cartItems.filter((i) => i.productId !== item.productId));
      localStorage.removeItem(
              `productQuantity_${item.productId}`)
    } catch (error) {
      console.error(error.response?.data || "Error removing item");
    }
  };

  const handleQuantityChange = async (delta) => {
    const newQuantity = item.quantity + delta;
    if (newQuantity < 1) return;
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5029/api/Customer/updateQuantity/${item.productId}/${newQuantity}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const updatedItems = cartItems.map((i) =>
        i.productId === item.productId ? { ...i, quantity: newQuantity } : i
      );
      setCartItems(updatedItems);
    } catch (error) {
      console.error(error.response?.data || "Error updating quantity");
    }
  };

  return (
    <div className="w-full bg-white border rounded-xl shadow-sm p-4 mb-4 flex flex-col md:flex-row items-center justify-between gap-4 transition hover:shadow-md">
      <div className="flex items-center gap-3 w-full md:w-1/3">
        <button
          onClick={handleRemove}
          className="text-gray-400 hover:text-red-500 transition"
          title="Remove item"
        >
          <ImCross />
        </button>
        <h2 className="font-medium text-gray-800">{item.title}</h2>
      </div>

      <div className="flex items-center justify-between w-full md:w-2/3 gap-4 flex-wrap md:flex-nowrap">
        <div className="text-gray-600 font-semibold text-sm md:text-base">
          ${item.price.toFixed(2)}
        </div>

        <div className="flex items-center border rounded-md overflow-hidden">
          <button
            onClick={() => handleQuantityChange(-1)}
            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 text-xl font-bold text-gray-700"
          >
            -
          </button>
          <span className="px-4 text-gray-800 font-medium">
            {item.quantity}
          </span>
          <button
            onClick={() => handleQuantityChange(1)}
            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 text-xl font-bold text-gray-700"
          >
            +
          </button>
        </div>

        <div className="font-bold text-gray-800 text-sm md:text-base">
          ${(item.quantity * item.price).toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default ItemCard;

// import React, { useEffect, useState } from "react";
// import { ImCross } from "react-icons/im";

// import axios from "axios";

// const ItemCard = ({item}) => {

//   const [cartItems, setCartItems] = useState([]);
//   const [quantityItems, setQuantityItems] = useState(1);

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
//     fetchCart();
//   }, [cartItems]);

//   const removeItem = async (productId) => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get(
//         `http://localhost:5029/api/Customer/RemoveProductFromCart/${productId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setCartItems(cartItems.filter((item) => item.productId !== productId));
//       console.log("cart Items:", cartItems)
//     } catch (error) {
//       console.error(error.response?.data || "Failed to update Cart");
//     }

//   };

//   const updateQuantity = async(productId, quantity) => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get(
//         `http://localhost:5029/api/Customer/updateQuantity/${productId}/${quantity}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setQuantityItems(quantity);
//       console.log("quantity Items:", cartItems)
//     } catch (error) {
//       console.error(error.response?.data || "Failed to update quantity");
//     }
//   }
//   const increaseQuantity = () => {
//     setQuantityItems(prev => prev + 1);
//   };

//   const decreaseQuantity = () => {
//     setQuantityItems(prev => (prev > 1 ? prev - 1 : 1));
//   };

//   return (
//     <div className="w-full grid grid-cols-5 mb-4 border py-2">
//       <div className="flex col-span-5 mdl:col-span-2 items-center gap-4 ml-4">
//         <ImCross
//           onClick={()=>removeItem(item.id)}
//           className="text-primeColor hover:text-red-500 duration-300 cursor-pointer"
//         />
//         <img className="w-32 h-32" src={item.image} alt="productImage" />
//         <h1 className="font-titleFont font-semibold">{item.name}</h1>
//       </div>
//       <div className="col-span-5 mdl:col-span-3 flex items-center justify-between py-4 mdl:py-0 px-4 mdl:px-0 gap-6 mdl:gap-0">
//         <div className="flex w-1/3 items-center text-lg font-semibold">
//           ${item.price}
//         </div>
//         <div className="w-1/3 flex items-center gap-6 text-lg">
//           <span
//             onClick={decreaseQuantity}
//             className="w-6 h-6 bg-gray-100 text-2xl flex items-center justify-center hover:bg-gray-300 cursor-pointer duration-300 border-[1px] border-gray-300 hover:border-gray-300"
//           >
//             -
//           </span>
//           <p>{item.quantity}</p>
//           <span
//             onClick={increaseQuantity}
//             className="w-6 h-6 bg-gray-100 text-2xl flex items-center justify-center hover:bg-gray-300 cursor-pointer duration-300 border-[1px] border-gray-300 hover:border-gray-300"
//           >
//             +
//           </span>
//         </div>
//         <div className="w-1/3 flex items-center font-titleFont font-bold text-lg">
//           <p>${item.quantity * item.price}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ItemCard;
