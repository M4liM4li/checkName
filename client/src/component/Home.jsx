import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import style from "../style/Home.module.css";
import Swal from "sweetalert2";
import axios from "axios";
import useStateUser from "../user/user-state";
import { getUserData } from "../api/student";

const Home = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const previousLatestId = useRef(null); // เปลี่ยนเป็นเก็บ ID ล่าสุด
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
          (a, b) => new Date(b.time) - new Date(a.time) // เรียงใหม่สุดก่อน
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
    const interval = setInterval(fetchUserData, 3000); // ปรับเป็น 10 วินาที
    return () => clearInterval(interval);
  }, [navigate, token]);

  if (isLoading) {
    return <div className={style.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={style.error}>{error}</div>;
  }

  const UserProfile = () => (
    <>
      <div className={style.question}>
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
    <div className={style.attendance}>
      <ul>
        {attendanceRecords.map((record) => (
          <li key={record.attendanceId} className={style.record}>
            <h2
              className={
                record.status === "1" ? style.absent : style.present // ปรับ logic ให้ชัดเจน
              }
            >
              {record.status === "1" ? "ยังไม่เช็คชื่อ" : "เช็คชื่อแล้ว"}
            </h2>
            <h4>{new Date(record.time).toLocaleString("th-TH")}</h4>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className={style.container}>
      <div className={style.sun}></div>
      {[...Array(4)].map((_, index) => (
        <div key={index} className={style.cloud}>
          <div className={style.cloud}></div>
          <div className={style.cloud}></div>
          <div className={style.cloud}></div>
        </div>
      ))}
      <div className={style.content}>
        {userInfo && <UserProfile />}
        {attendanceRecords.length > 0 && <AttendanceList />}
      </div>
    </div>
  );
};

export default Home;