import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import style from "../style/Home.module.css";
import Swal from "sweetalert2";
import axios from "axios";

const Home = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const previousLength = useRef(0);
  const isFirstLoad = useRef(true);

  const cloudinaryUrl = "https://res.cloudinary.com/dwyxrfpal/image/upload/";

  const fetchUserData = async () => {
    try {
      setError(null);
      const token = sessionStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get(
        "https://check-name-server.vercel.app/api/listUsers",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      if (data.success) {
        if (data.user) {
          setUserInfo(data.user);
        }
        if (data.attendanceRecords) {
          // ตรวจสอบว่ามีข้อมูลใหม่หรือไม่
          if (
            !isFirstLoad.current &&
            data.attendanceRecords.length > previousLength.current
          ) {
            // มีข้อมูลใหม่เข้ามา
            Swal.fire({
              icon: "success",
              title: "แจ้งเตือนการเช็คชื่อ",
              text: `เช็คชื่อแล้ว`,
              timer: 1500,
            });
          }
          setAttendanceRecords(data.attendanceRecords);
          previousLength.current = data.attendanceRecords.length;
        }
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
      if (isFirstLoad.current) {
        isFirstLoad.current = false;
      }
    }
  };

  useEffect(() => {
    fetchUserData();
    const interval = setInterval(fetchUserData, 3000);
    return () => clearInterval(interval);
  }, [navigate]);

  if (error) {
    return <div className={style.error}>{error}</div>;
  }

  const UserProfile = () => (
    <>
      <div className={style.question}>
        <img
          src={`${cloudinaryUrl}/profile/${userInfo?.image}`}
          alt={userInfo?.fullname || "Profile"}
          onError={(e) => {
            e.target.src = "/assets/default-profile.png";
          }}
        />
      </div>
      <h2>{userInfo?.fullname}</h2>
      <h3>แผนกเทคโนโลยีสารสนเทศ</h3>
    </>
  );

  return (
    <div className={style.container}>
      <div className={style.sun}></div>
      <div className={style.cloud}>
        <div className={style.cloud}></div>
        <div className={style.cloud}></div>
        <div className={style.cloud}></div>
      </div>
      <div className={style.cloud}>
        <div className={style.cloud}></div>
        <div className={style.cloud}></div>
        <div className={style.cloud}></div>
      </div>
      <div className={style.cloud}>
        <div className={style.cloud}></div>
        <div className={style.cloud}></div>
        <div className={style.cloud}></div>
      </div>
      <div className={style.cloud}>
        <div className={style.cloud}></div>
        <div className={style.cloud}></div>
        <div className={style.cloud}></div>
      </div>
      <div className={style.content}>
        {/* แสดงข้อมูลผู้ใช้เสมอถ้ามีข้อมูล */}
        {userInfo && <UserProfile />}

        {/* แสดงข้อมูลการเช็คชื่อเฉพาะเมื่อมีข้อมูล */}
        {attendanceRecords.length > 0 && (
          <div className={style.attendance}>
            <ul>
              {attendanceRecords.map((record) => (
                <li key={record.attendanceId} className={style.record}>
                  <h2
                    className={
                      record.status === "1" ? style.present : style.absent
                    }
                  >
                    {record.status === "1" ? "ยังไม่เช็คชื่อ" : "เช็คชื่อแล้ว"}
                  </h2>
                  <h4>{new Date(record.time).toLocaleString("th-TH")}</h4>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;