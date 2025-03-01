import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import useStateUser from "../user/user-state";
import { getUserData } from "../api/student";
import { LogOut, LoaderCircle } from "lucide-react";
const Home = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const previousLatestId = useRef(null);
  const isFirstLoad = useRef(true);
  const token = useStateUser((state) => state.token);

  const cloudinaryUrl = "https://res.cloudinary.com/dwyxrfpal/image/upload/";
  const defaultProfileImage = "/assets/default-profile.png";

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

      if (data.attendanceRecords) {
        const sortedRecords = data.attendanceRecords.sort(
          (a, b) => new Date(b.time) - new Date(a.time)
        );
        const latestRecordId = sortedRecords[0]?.attendanceId;

        if (
          !isFirstLoad.current &&
          latestRecordId &&
          latestRecordId !== previousLatestId.current
        ) {
          Swal.fire({
            icon: "success",
            title: "แจ้งเตือนการเช็คชื่อ",
            text: "เช็คชื่อแล้ว",
            timer: 1500,
          });
        }

        setAttendanceRecords(sortedRecords);
        previousLatestId.current = latestRecordId;
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setError("Session expired. Please log in again.");
        navigate("/login");
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
    const interval = setInterval(fetchUserData, 3000);
    return () => clearInterval(interval);
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

  const UserProfile = () => (
    <>
      <div className="question">
        <img
          src={
            userInfo?.image
              ? `${cloudinaryUrl}/profile/${userInfo.image}`
              : defaultProfileImage
          }
          alt={userInfo?.fullname || "Profile"}
          onError={(e) => (e.target.src = defaultProfileImage)}
        />
      </div>
      <h2>{userInfo?.fullname}</h2>
      <h3>แผนกเทคโนโลยีสารสนเทศ</h3>
    </>
  );

  const AttendanceList = () => (
    <div className="attendance">
      <ul>
        {attendanceRecords.map((record) => (
          <li key={record.attendanceId} className="record">
            <h2 className={record.status === "1" ? "absent" : "present"}>
              {record.status === "1" ? "ยังไม่เช็คชื่อ" : "เช็คชื่อแล้ว"}
            </h2>
            <h4>{new Date(record.time).toLocaleString("th-TH")}</h4>
          </li>
        ))}
      </ul>
    </div>
  );
  const handleLogout = () => {
    localStorage.removeItem("user-state");
    localStorage.removeItem("token");
    sessionStorage.clear();
    navigate("/"); // Redirects to Login
  };
  return (
    <div className="container">
      <div className="sun"></div>
      <div className="content w-92 ">
        <div className="flex justify-end items-end">
          <button
            className="w-7 h-7 bg-red-500 rounded-md text-white p-2 flex justify-center items-center hover:scale-105 shadow-md transition-all duration-300"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        {userInfo && <UserProfile />}
        {attendanceRecords.length > 0 && <AttendanceList />}
      </div>
    </div>
  );
};

export default Home;
