import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { toast } from "react-toastify";
import { UserContext } from "../../components/context/UserContext";

const RegisterStatus = () => {
  const { uid: vendorId } = useParams(); // ✅ Get vendor ID from URL
  const [status, setStatus] = useState("");
  const [connection, setConnection] = useState(null);
  const { logout } = useContext(UserContext);
  const fetchStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5029/api/Vendor/vendor-status/${vendorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setStatus(response.data.status);
      console.log("status", response.data.status);
    } catch (error) {
      console.error("Error fetching status", error);
    }
  };

  useEffect(() => {
    fetchStatus(); // أول ما الصفحة تفتح نجيب حالة الـ vendor

    const newConnection = new HubConnectionBuilder()
      .withUrl("http://localhost:5029/notificationHub", {
        accessTokenFactory: () => localStorage.getItem("token"),
      })
      .withAutomaticReconnect()
      .build();

    newConnection
      .start()
      .then(() => {
        console.log("Connected to SignalR hub as Vendor");
      })
      .catch((err) => console.error("SignalR Connection Error:", err));

    newConnection.on("ReceiveNotification", (notification) => {
      console.log("Response From Admin", notification);

      if (notification.type === "ReviewResult") {
        // Show Toast Message
        if (notification.approved) {
          toast.success(notification.message);
        } else {
          toast.warning(notification.message);
          logout(); // لو اترفض يتم تسجيل الخروج
        }

        fetchStatus(); // نعمل refresh للحالة
      }
    });

    setConnection(newConnection);

    return () => {
      newConnection.stop();
    };
  }, []);

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-lg rounded-xl text-center">
      <h2 className="text-2xl font-bold mb-4">Vendor Account Status</h2>

      {status === "Pending" && (
        <p className="text-yellow-600 font-medium">
          ⏳ Your account is under review.
        </p>
      )}

      {status === "Approved" && (
        <p className="text-green-600 font-medium">
          ✅ Your account has been approved!
        </p>
      )}

      {status === "Rejected" && (
        <div className="text-red-600">
          ❌ Your account has been rejected.
          <br />
        </div>
      )}
    </div>
  );
};

export default RegisterStatus;
