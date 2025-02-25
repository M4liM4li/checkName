import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import useStateUser from "../user/user-state";
import { getUserData } from "../api/student";

const Teacher = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const token = useStateUser((state) => state.token);

  const CLOUDINARY_URL = "https://res.cloudinary.com/dwyxrfpal/image/upload/";
  const DEFAULT_PROFILE_IMAGE = "/assets/default-profile.png";

  const fetchUserData = async () => {
    try {
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await getUserData(token);
      const { success, message, user } = response.data;

      if (!success) {
        throw new Error(message || "ไม่สามารถดึงข้อมูลผู้ใช้ได้");
      }

      setUserInfo(
        user || {
          fullname: "อาจารย์ สุภาพร ผุดผ่อง",
          department: "แผนกเทคโนโลยีสารสนเทศ",
          image: "teacher.jpg",
        }
      );
    } catch (error) {
      if (error.response?.status === 401) {
        setError("เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setError(error.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchUserData();
  }, [token, navigate]);

  if (isLoading) {
    return <div className="loading">กำลังโหลด...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="container">
      <div className="sun"></div>
      <div className="content">
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