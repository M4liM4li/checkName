import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import useStateUser from "../user/user-state";
import { getUserData } from "../api/student";
import { LogOut, LoaderCircle } from "lucide-react";

const Teacher = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const token = useStateUser((state) => state.token);

  const CLOUDINARY_URL = "https://res.cloudinary.com/dwyxrfpal/image/upload/";
  const DEFAULT_PROFILE_IMAGE = "/assets/default-profile.png";
  if (!token) {
    navigate("/");
  }
  const fetchUserData = async () => {
    try {
      const response = await getUserData(token);
      const data = response.data;

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch user data");
      }

      if (data.user) {
        setUserInfo(data.user);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setError("Session expired. Please log in again.");
        navigate("/");
      } else {
        setError(error.message);
      }
    } finally {
      setIsLoading(false);
      if (isFirstLoad.current) isFirstLoad.current = false;
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white w-24 h-24 rounded-3xl shadow-lg">
        <div className="animate-spin flex justify-center items-center h-full ">
          <LoaderCircle className="w-12 h-12" />
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="error">{error}</div>;
  }
  const handleLogout = () => {
    localStorage.removeItem("user-state");
    localStorage.removeItem("token");
    sessionStorage.clear();
    navigate("/"); // Redirects to Login
  };
  return (
    <div className="container">
      <div className="sun"></div>
      <div className="content w-92">
        <div className="flex justify-end items-end">
          <button
            className="w-7 h-7 bg-red-500 rounded-md text-white p-2 flex justify-center items-center hover:scale-105 shadow-md transition-all duration-300"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
        <div className="question">
          <img
            src={
              userInfo?.image
                ? `${CLOUDINARY_URL}profile/${userInfo.image}`
                : DEFAULT_PROFILE_IMAGE
            }
            alt={userInfo?.fullname || "โปรไฟล์"}
            className="profileImage"
            onError={(e) => (e.target.src = DEFAULT_PROFILE_IMAGE)}
          />
        </div>
        <h2 className="fullname" style={{ color: "#6A5ACD" }}>
          {userInfo?.fullname}
        </h2>
        <h3 className="department" style={{ color: "#FF0A0E" }}>
          {userInfo?.department}
        </h3>
        <div className="buttonContainer">
          <Link to="/teacher/scan-student">
            <button className="button" style={{ backgroundColor: "#66CCFF" }}>
              Scan
            </button>
          </Link>
          <Link to="/teacher/list-student">
            <button className="button" style={{ backgroundColor: "#FF66CC" }}>
              รายชื่อ
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Teacher;
