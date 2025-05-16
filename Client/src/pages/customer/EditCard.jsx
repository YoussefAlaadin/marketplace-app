import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  Typography,
  TextField,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import Header from "../../components/header/Header";
import HeaderBottom from "../../components/header/HeaderBottom";
import Footer from "../../components/Footer/Footer";
import FooterBottom from "../../components/Footer/FooterBottom";

const EditCard = () => {
  const [form, setForm] = useState({
    cardName: "",
    numOfCard: "",
    expirDate: "",
    cardType: "",
  });

  // fetch existing card
  useEffect(() => {
    const fetchCardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5029/api/Customer/creditcardinfo",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data) {
          setForm({
            cardName: res.data.cardName || "",
            numOfCard: res.data.numOfCard || "",
            expirDate: res.data.expirDate?.slice(0, 7) || "", // YYYY-MM
            cardType: res.data.cardType || "",
          });
        }
      } catch (err) {
        console.log("No credit card data found or error:", err);
      }
    };

    fetchCardData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5029/api/Customer/Savecreditcard",
        {
          ...form,
          expirDate: `${form.expirDate}-01T00:00:00Z`, // تحويل YYYY-MM إلى ISO
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Payment details submitted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit payment details");
    }
  };

  return (
    <>
      <Header />
      <HeaderBottom />
      <Box sx={{ maxWidth: 600, mx: "auto", mt: 5 }}>
        <Card sx={{ p: 3, borderRadius: 4, boxShadow: 3 }}>
          <Typography variant="h5" mb={3}>
            Payment Details
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name on Card"
                  name="cardName"
                  value={form.cardName}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Card Number"
                  name="numOfCard"
                  value={form.numOfCard}
                  onChange={handleChange}
                  required
                  inputProps={{ maxLength: 16 }}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Expiry Date"
                  name="expirDate"
                  type="month"
                  value={form.expirDate}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <FormLabel>Card Type</FormLabel>
                <RadioGroup
                  row
                  name="cardType"
                  value={form.cardType}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    value="Visa"
                    control={<Radio />}
                    label="Visa"
                  />
                  <FormControlLabel
                    value="MasterCard"
                    control={<Radio />}
                    label="MasterCard"
                  />
                  <FormControlLabel
                    value="Amex"
                    control={<Radio />}
                    label="Amex"
                  />
                </RadioGroup>
              </Grid>
            </Grid>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
              fullWidth
            >
              Save Card Info
            </Button>
          </form>
        </Card>
      </Box>
      <Footer />
      <FooterBottom />
    </>
  );
};

export default EditCard;


// import React, { useEffect, useState } from "react";
  // import { Visa, Mastercard, Maestro } from "react-payment-icons";

  // import {
  //   Box,
  //   Button,
  //   Card,
  //   CardContent,
  //   TextField,
  //   Typography,
  //   Grid,
  // } from "@mui/material";
  // import { toast } from "react-toastify";
  // import axios from "axios";
  // import Footer from "../../components/Footer/Footer";
  // import HeaderBottom from "../../components/header/HeaderBottom";
  // import FooterBottom from "../../components/Footer/FooterBottom";
  // import Header from "../../components/header/Header";

  // const EditCard = () => {
  //   const [form, setForm] = useState({
  //     nameOnCard: "",
  //     cardNumber: "",
  //     expiryDate: "",
  //     cardType: "",
  //   });
  //   const addCreditCard = async () => {
  //     try {
  //       const token = localStorage.getItem("token");
  //       const res = await axios.post(
  //         "http://localhost:5029/api/Customer/Savecreditcard",
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       );

  //       if (res.data) {
  //         setForm({
  //           nameOnCard: res.data.cardName || "",
  //           cardNumber: res.data.numOfCard || "",
  //           expiryDate: res.data.expirDate || "",
  //           cardType: res.data.cardType || "",
  //         });
  //         toast.info("Credit Card Has Been Updated")
  //       }
  //     } catch (err) {
  //       console.log("No credit card data found or error:", err);
  //     }
  //   };
  //   useEffect(() => {
  //     const fetchCardData = async () => {
  //       try {
  //         const token = localStorage.getItem("token");
  //         const res = await axios.get(
  //           "http://localhost:5029/api/Customer/creditcardinfo",
  //           {
  //             headers: {
  //               Authorization: `Bearer ${token}`,
  //               "Content-Type": "application/json",
  //             },
  //           }
  //         );

  //         if (res.data) {
  //           setForm({
  //             nameOnCard: res.data.cardName || "",
  //             cardNumber: res.data.numOfCard || "",
  //             expiryDate: res.data.expirDate || "",
  //             cardType: res.data.cardType || "",
  //           });
  //         }
  //       } catch (err) {
  //         console.log("No credit card data found or error:", err);
  //       }
  //     };

  //     fetchCardData();
  //   }, []);

  //   const handleChange = (e) => {
  //     setForm({
  //       ...form,
  //       [e.target.name]: e.target.value,
  //     });
  //   };

  //   const handleSubmit = async (e) => {
  //     e.preventDefault();

  //     try {
  //       // Replace this with your actual API call
  //       const token = localStorage.getItem("token");
  //       await axios.post("/api/customers/me/credit-card", form, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });

  //       toast.success("Payment details submitted successfully!");
  //     } catch (error) {
  //       console.error(error);
  //       toast.error("Failed to submit payment details");
  //     }
  //   };

  //   return (
  //     <>
  //       <Header />
  //       <HeaderBottom />
  //       <Box sx={{ maxWidth: 600, mx: "auto", mt: 5 }}>
  //         <Card sx={{ p: 3, borderRadius: 4, boxShadow: 3 }}>
  //           <Typography variant="h5" mb={3}>
  //             Payment Details
  //           </Typography>
  //           <form onSubmit={handleSubmit}>
  //             <Grid container spacing={2}>
  //               <Grid item xs={12}>
  //                 <TextField
  //                   fullWidth
  //                   label="Name on Card"
  //                   name="nameOnCard"
  //                   value={form.nameOnCard}
  //                   onChange={handleChange}
  //                   required
  //                 />
  //               </Grid>
  //               <Grid item xs={12}>
  //                 <TextField
  //                   fullWidth
  //                   label="Card Number"
  //                   name="cardNumber"
  //                   value={form.cardNumber}
  //                   onChange={handleChange}
  //                   required
  //                   inputProps={{ maxLength: 16 }}
  //                 />
  //               </Grid>
  //               <Grid item xs={6}>
  //                 <TextField
  //                   fullWidth
  //                   label="Expiry Date (MM/YY)"
  //                   name="expiryDate"
  //                   value={form.expiryDate}
  //                   onChange={handleChange}
  //                   required
  //                   placeholder="MM/YY"
  //                 />
  //               </Grid>

  //               <div className="mb-4">
  //                 <label className="block text-gray-700 font-bold mb-2">
  //                   Card Type
  //                 </label>
  //                 <div className="flex gap-4">
  //                   {[
  //                     { type: "Visa", icon: Visa },
  //                     { type: "MasterCard", icon: Mastercard },
  //                     { type: "Amex", icon: Maestro },
  //                   ].map(({ type, icon }) => (
  //                     <label key={type} className="flex items-center space-x-2">
  //                       <input
  //                         type="date"
  //                         value={
  //                           form.expirDate ? form.expirDate.slice(0, 10) : ""
  //                         } // Add
  //                         fallback
  //                         for
  //                         undefined
  //                         onChange={(e) =>
  //                           setForm({
  //                             ...form,
  //                             expirDate: new Date(e.target.value).toISOString(),
  //                           })
  //                         }
  //                       />
  //                       <span>{type}</span>
  //                       <span>{icon}</span>
  //                     </label>
  //                   ))}
  //                 </div>
  //               </div>
  //             </Grid>

  //             <Button
  //               type="submit"
  //               onSubmit={addCreditCard}
  //               variant="contained"
  //               color="primary"
  //               sx={{ mt: 3 }}
  //               fullWidth
  //             >
  //               Place Order
  //             </Button>
  //           </form>
  //         </Card>
  //       </Box>
  //       <Footer />
  //       <FooterBottom />
  //     </>
  //   );
  // };

  // export default EditCard;
