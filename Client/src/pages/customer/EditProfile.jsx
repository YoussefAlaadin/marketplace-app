// src/pages/EditProfile.jsx
import React, { useState } from "react";

const EditProfile = () => {
  const [userInfo, setUserInfo] = useState({
    name: "Youssef Alaadin",
    email: "youssef@example.com",
    phone: "0123456789",
    address: "Cairo, Egypt",
    cardHolder: "Youssef Alaadin",
    cardNumber: "1234123412341234",
    expiryDate: "12/26",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Saved User Info:", userInfo);
    alert("Profile updated successfully!");
    // ممكن تبعتها API هنا بعدين
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Edit Your Profile</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-white shadow-md p-6 rounded-lg">
        {/* Personal Info */}
        <div className="flex flex-col gap-4 border-2 p-4 rounded-md border-gray-300">
          <div>
            <label htmlFor="name" className="text-sm font-semibold">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={userInfo.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="border p-2 rounded-md mt-1 w-full"
            />
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-semibold">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={userInfo.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="border p-2 rounded-md mt-1 w-full"
            />
          </div>
          <div>
            <label htmlFor="phone" className="text-sm font-semibold">Phone Number</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={userInfo.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="border p-2 rounded-md mt-1 w-full"
            />
          </div>
          <div>
            <label htmlFor="address" className="text-sm font-semibold">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={userInfo.address}
              onChange={handleChange}
              placeholder="Address"
              className="border p-2 rounded-md mt-1 w-full"
            />
          </div>
        </div>

        {/* Credit Card Info */}
          <h3 className="text-lg font-semibold">Credit Card Info</h3>
          <div className="flex flex-col gap-4 border-2 p-4 rounded-md border-gray-300">
          <div>
            <label htmlFor="cardHolder" className="text-sm font-semibold">Card Holder Name</label>
            <input
              type="text"
              id="cardHolder"
              name="cardHolder"
              value={userInfo.cardHolder}
              onChange={handleChange}
              placeholder="Card Holder Name"
              className="border p-2 rounded-md mt-1 w-full"
            />
          </div>
          <div>
            <label htmlFor="cardNumber" className="text-sm font-semibold">Card Number</label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              value={userInfo.cardNumber}
              onChange={handleChange}
              placeholder="Card Number"
              className="border p-2 rounded-md mt-1 w-full"
            />
          </div>
          <div>
            <label htmlFor="expiryDate" className="text-sm font-semibold">Expiry Date (MM/YY)</label>
            <input
              type="text"
              id="expiryDate"
              name="expiryDate"
              value={userInfo.expiryDate}
              onChange={handleChange}
              placeholder="Expiry Date (MM/YY)"
              className="border p-2 rounded-md mt-1 w-full"
            />
          </div>
        </div>

        {/* Submit */}
        <button type="submit" className="bg-primeColor text-white py-2 rounded-md hover:bg-blue-700 transition">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
