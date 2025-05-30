import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { UserContext } from "../components/context/UserContext";
import RegisterRequest from "./admin/RegisterRequest";
export default function Login() {
  const [formData, setFormData] = useState({
    Email: "",
    Password: "",
  });
  const [status, setStatus] = useState("pending");
  const { login } = useContext(UserContext); // Access login function from UserContext
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target; // destructure the name and value from the event target
    setFormData({ ...formData, [name]: value }); // update the state with the input value
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5029/api/Auth/token",
        formData
      );

      const token = response.data.token;
      const roles = response.data.roles;
      const decoded = jwtDecode(token);
      const uid = decoded.uid?.toString();
      const userName = decoded.name;

      login({ token, roles });
      localStorage.setItem("userId", uid);
      localStorage.setItem("userName", userName);
      // ⬇️ Vendor logic
      if (roles.includes("Vendor")) {
        const res = await axios.get(
          `http://localhost:5029/api/Vendor/vendor-status/${uid}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const vendorStatus = res.data.status?.toLowerCase(); // Make sure it's lowercase

        if (vendorStatus === "pending") {
          navigate(`/register-status/${uid}`); // صفحة الحالة
        } else {
          navigate(`/vendor/${uid}`);
        }
      } else if (roles.includes("Customer")) {
        navigate(`/home/${uid}`);
      } else if (roles.includes("Admin")) {
        navigate(`/admin/${uid}`);
      }
    } catch (err) {
      console.error("ERROR:", err);
      alert(err.response?.data || "Login failed ❌");
    }
  };

  return (
    <div className="flex font-poppins items-center justify-center bg-gray-100 min-w-screen min-h-screen">
      <div className="grid gap-8">
        <div
          id="back-div"
          className="bg-gradient-to-r from-blue-400 to-purple-400 rounded-[26px] m-4"
        >
          <div className="border-[20px] border-transparent rounded-[20px] bg-white shadow-lg xl:p-10 2xl:p-10 lg:p-10 md:p-10 sm:p-2 m-2">
            <h1 className="pt-8 pb-6 font-bold text-5xl text-gray-800 text-center cursor-default">
              Sign In
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="Email" className="mb-2 text-gray-700 text-lg">
                  Email
                </label>
                <input
                  id="Email"
                  name="Email"
                  type="Email"
                  value={formData.Email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                  className="border bg-white text-gray-800 p-3 shadow-md placeholder:text-base border-gray-300 rounded-lg w-full focus:scale-105 ease-in-out duration-300"
                />
              </div>
              <div>
                <label
                  htmlFor="Password"
                  className="mb-2 text-gray-700 text-lg"
                >
                  Password
                </label>
                <input
                  id="Password"
                  name="Password"
                  type="Password"
                  value={formData.Password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                  className="border bg-white text-gray-800 p-3 shadow-md placeholder:text-base border-gray-300 rounded-lg w-full focus:scale-105 ease-in-out duration-300"
                />
              </div>
              <button
                className="bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg mt-6 p-2 text-white rounded-lg w-full hover:scale-105 hover:from-purple-500 hover:to-blue-500 transition duration-300 ease-in-out"
                type="submit"
              >
                SIGN IN
              </button>
            </form>
            <div className="flex flex-col mt-4 items-center justify-center text-sm">
              <h3>
                <span className="cursor-default text-gray-600">
                  First Time?
                </span>
                <a
                  className="group text-blue-500 transition-all duration-100 ease-in-out"
                  href="/register"
                >
                  <span className="bg-left-bottom ml-1 bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
                    Register
                  </span>
                </a>
              </h3>
            </div>

            {/* <!-- Third Party Authentication Options --> */}
            <div
              id="third-party-auth"
              className="flex items-center justify-center mt-5 flex-wrap"
            >
              <button className="hover:scale-105 ease-in-out duration-300 shadow-lg p-2 rounded-lg m-1">
                <img
                  className="max-w-[25px]"
                  src="https://ucarecdn.com/8f25a2ba-bdcf-4ff1-b596-088f330416ef/"
                  alt="Google"
                />
              </button>
              <button className="hover:scale-105 ease-in-out duration-300 shadow-lg p-2 rounded-lg m-1">
                <img
                  className="max-w-[25px]"
                  src="https://ucarecdn.com/95eebb9c-85cf-4d12-942f-3c40d7044dc6/"
                  alt="Linkedin"
                />
              </button>
              <button className="hover:scale-105 ease-in-out duration-300 shadow-lg p-2 rounded-lg m-1">
                <img
                  className="max-w-[25px]"
                  src="https://ucarecdn.com/be5b0ffd-85e8-4639-83a6-5162dfa15a16/"
                  alt="Github"
                />
              </button>
              <button className="hover:scale-105 ease-in-out duration-300 shadow-lg p-2 rounded-lg m-1">
                <img
                  className="max-w-[25px]"
                  src="https://ucarecdn.com/6f56c0f1-c9c0-4d72-b44d-51a79ff38ea9/"
                  alt="Facebook"
                />
              </button>
              <button className="hover:scale-105 ease-in-out duration-300 shadow-lg p-2 rounded-lg m-1">
                <img
                  className="max-w-[25px]"
                  src="https://ucarecdn.com/82d7ca0a-c380-44c4-ba24-658723e2ab07/"
                  alt="twitter"
                />
              </button>
              <button className="hover:scale-105 ease-in-out duration-300 shadow-lg p-2 rounded-lg m-1">
                <img
                  className="max-w-[25px]"
                  src="https://ucarecdn.com/3277d952-8e21-4aad-a2b7-d484dad531fb/"
                  alt="apple"
                />
              </button>
            </div>

            <div className="text-gray-500 flex text-center flex-col mt-4 items-center text-sm">
              <p className="cursor-default">
                By signing in, you agree to our{" "}
                <a
                  className="group text-blue-400 transition-all duration-100 ease-in-out"
                  href="#"
                >
                  <span className="cursor-pointer bg-left-bottom bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
                    Terms{" "}
                  </span>
                </a>
                and{" "}
                <a
                  className="group text-blue-400 transition-all duration-100 ease-in-out"
                  href="#"
                >
                  <span className="cursor-pointer bg-left-bottom bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
                    Privacy Policy
                  </span>
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
