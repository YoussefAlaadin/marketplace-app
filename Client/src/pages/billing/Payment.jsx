// src/pages/payment.jsx
import React, { useEffect, useMemo, useState } from "react";
import countryList from "react-select-country-list";
import MaskInput from "react-maskinput";
import axios from "axios";
import { Link } from "react-router-dom";
import Header from "../../components/header/Header";
import HeaderBottom from "../../components/header/HeaderBottom";
import Footer from "../../components/Footer/Footer";
import FooterBottom from "../../components/Footer/FooterBottom";

const Payment = () => {
  const [mask, setMask] = useState("0000-0000-0000-0000");

  const [cardName, setCardName] = useState("");
  const [numOfCard, setNumOfCard] = useState("");
  const [cardType, setCardType] = useState("Visa");
  const [expMonth, setExpMonth] = useState("01");
  const [expYear, setExpYear] = useState("2025");
  const [cvv, setCvv] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCreditCard = async () => {
      try {
        const response = await axios.get("http://localhost:5029/api/Customer/creditcardinfo", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data;
        if (data) {
          setCardName(data.cardName || "");
          setNumOfCard(data.numOfCard || "");
          setCardType(data.cardType || "");
          const expiryDate = new Date(data.expirDate);
          setExpMonth(String(expiryDate.getMonth() + 1).padStart(2, "0"));
          setExpYear(String(expiryDate.getFullYear()));
        }
      } catch (error) {
        console.error("No previous credit card found or error:", error);
      }
    };

    fetchCreditCard();
  }, []);

  const handleCardNumberChange = (e) => {
    setNumOfCard(e.target.value);
  };

  const processPayment = async () => {
    try {
      const expiryDateFormatted = `${expYear}-${expMonth}-01T00:00:00Z`;

      const payload = {
        cardName,
        numOfCard,
        cardType,
        expirDate: expiryDateFormatted,
      };

      await axios.post("http://localhost:5029/api/Customer/Savecreditcard", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Payment info saved successfully!");
    } catch (error) {
      console.error("Payment processing error:", error);
    }
  };

  return (
    <>
      <Header />
      <HeaderBottom />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6">
        <div>
          <h3 className="text-xl font-bold mb-4">Credit Card Info</h3>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="font-bold">Name On Card</label>
              <input
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                className="w-full border px-4 py-2 rounded"
              />
            </div>
            <div>
              <label className="font-bold">Card Number</label>
              <MaskInput
                value={numOfCard}
                onChange={handleCardNumberChange}
                maskChar="_"
                mask={mask}
                alwaysShowMask
                className="w-full border px-4 py-2 rounded"
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="font-bold">Exp. Month</label>
                <select
                  className="w-full border px-4 py-2 rounded"
                  value={expMonth}
                  onChange={(e) => setExpMonth(e.target.value)}
                >
                  {[...Array(12)].map((_, i) => (
                    <option key={i}>{String(i + 1).padStart(2, "0")}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="font-bold">Exp. Year</label>
                <select
                  className="w-full border px-4 py-2 rounded"
                  value={expYear}
                  onChange={(e) => setExpYear(e.target.value)}
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i}>{2025 + i}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-4 items-end">
              <div>
                <label className="font-bold">CVV</label>
                <input
                  type="text"
                  maxLength={3}
                  placeholder="123"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  className="w-full border px-4 py-2 rounded"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={processPayment}
              className="bg-blue-600 text-white py-2 px-6 rounded font-bold uppercase mt-4 w-full"
            >
              Place Order
            </button>
          </form>
        </div>
      </div>

      <Footer />
      <FooterBottom />
    </>
  );
};

export default Payment;


// import React, { useState, useEffect } from "react";
// import MaskInput from "react-maskinput";
// import axios from "axios";
// import Footer from "../../components/Footer/Footer";
// import FooterBottom from "../../components/Footer/FooterBottom";
// import Header from "../../components/header/Header";
// import HeaderBottom from "../../components/header/HeaderBottom";

// const Payment = () => {
//   const [cardName, setCardName] = useState("");
//   const [cardNumber, setCardNumber] = useState("");
//   const [cardType, setCardType] = useState("Visa");
//   const [expMonth, setExpMonth] = useState("01");
//   const [expYear, setExpYear] = useState("2025");
//   const [mask] = useState("0000-0000-0000-0000");

//   // جلب البيانات لو محفوظة قبل كده
//   useEffect(() => {
//     const fetchCard = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await axios.get("http://localhost:5029/api/Customer/creditcardinfo", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const card = res.data;
//         setCardName(card.cardName);
//         setCardNumber(card.numOfCard);
//         setCardType(card.cardType);
//         const [year, month] = card.expirDate.split("-");
//         setExpMonth(month);
//         setExpYear(year);
//       } catch (err) {
//         console.log("No saved card info.");
//       }
//     };
//     fetchCard();
//   }, []);

//   // حفظ البيانات عند الضغط على زر Place Order
//   const processPayment = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const expirDate = `${expYear}-${expMonth}-01T00:00:00.000Z`;

//       await axios.post(
//         "http://localhost:5029/api/Customer/Savecreditcard",
//         {
//           cardName,
//           numOfCard: cardNumber,
//           cardType,
//           expirDate,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       alert("Card saved successfully!");
//     } catch (err) {
//       console.error("Error saving card:", err);
//       alert("Failed to save card");
//     }
//   };

//   return (
//     <>
//       <Header />
//       <HeaderBottom/>
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
//         <div>
//           <h3 className="text-xl font-bold mb-4">Credit Card Info</h3>
//           <form className="space-y-4">
//             <div>
//               <label className="font-bold">Name On Card</label>
//               <input
//                 type="text"
//                 className="w-full border px-4 py-2 rounded"
//                 value={cardName}
//                 onChange={(e) => setCardName(e.target.value)}
//               />
//             </div>
//             <div>
//               <label className="font-bold">Card Number</label>
//               <MaskInput
//                 maskChar="_"
//                 mask={mask}
//                 alwaysShowMask
//                 className="w-full border px-4 py-2 rounded"
//                 value={cardNumber}
//                 onChange={(e) => setCardNumber(e.target.value)}
//               />
//             </div>
//             <div>
//               <label className="font-bold">Card Type</label>
//               <select
//                 className="w-full border px-4 py-2 rounded"
//                 value={cardType}
//                 onChange={(e) => setCardType(e.target.value)}
//               >
//                 <option value="Visa">Visa</option>
//                 <option value="MasterCard">MasterCard</option>
//                 <option value="Amex">Amex</option>
//               </select>
//             </div>
//             <div className="flex gap-4">
//               <div className="flex-1">
//                 <label className="font-bold">Exp. Month</label>
//                 <select
//                   className="w-full border px-4 py-2 rounded"
//                   value={expMonth}
//                   onChange={(e) => setExpMonth(e.target.value)}
//                 >
//                   {[...Array(12)].map((_, i) => (
//                     <option key={i} value={String(i + 1).padStart(2, "0")}>
//                       {String(i + 1).padStart(2, "0")}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div className="flex-1">
//                 <label className="font-bold">Exp. Year</label>
//                 <select
//                   className="w-full border px-4 py-2 rounded"
//                   value={expYear}
//                   onChange={(e) => setExpYear(e.target.value)}
//                 >
//                   {[...Array(10)].map((_, i) => (
//                     <option key={i} value={2025 + i}>
//                       {2025 + i}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//             <button
//               type="button"
//               onClick={processPayment}
//               className="bg-blue-600 text-white py-2 px-6 rounded font-bold uppercase mt-4 w-full"
//             >
//               Place Order
//             </button>
//           </form>
//         </div>
//       </div>
//       <Footer />
//       <FooterBottom />
//     </>
//   );
// };

// export default Payment;
