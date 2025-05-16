// src/pages/OrderDetails.jsx
import React from "react";

const OrderDetails = () => {
  const order = {
    id: "123456",
    date: "2025-04-26",
    status: "Shipped",
    totalAmount: "$250.00",
    products: [
      {
        id: 1,
        name: "iPhone 14 Pro",
        quantity: 1,
        price: "$1200.00",
      },
      {
        id: 2,
        name: "AirPods Pro",
        quantity: 2,
        price: "$500.00",
      },
    ],
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Order Details</h2>

      <div className="bg-white shadow-md rounded-lg p-6 flex flex-col gap-6">
        {/* Order Info */}
        <div className="flex flex-col gap-2">
          <p><span className="font-semibold">Order ID:</span> {order.id}</p>
          <p><span className="font-semibold">Date:</span> {order.date}</p>
          <p><span className="font-semibold">Status:</span> {order.status}</p>
          <p><span className="font-semibold">Total Amount:</span> {order.totalAmount}</p>
        </div>

        {/* Products */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Products:</h3>
          <ul className="flex flex-col gap-4">
            {order.products.map((product) => (
              <li key={product.id} className="border p-4 rounded-lg hover:shadow-md transition">
                <div className="flex flex-col gap-1">
                  <p><span className="font-semibold">Name:</span> {product.name}</p>
                  <p><span className="font-semibold">Quantity:</span> {product.quantity}</p>
                  <p><span className="font-semibold">Price:</span> {product.price}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
