import React from "react";
import { useNavigate } from "react-router-dom";
import style from "../style/Teacher.module.css";
import { Link } from "react-router-dom";

const Teacher = () => {
  const navigate = useNavigate();

  const userInfo = {
    fullname: "อาจารย์ สุภาพร ผุดผ่อง",
    department: "แผนกเทคโนโลยีสารสนเทศ",
    image: "../public/teacher.jpg",
  };
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
    
      <div className={style.content}>
        <div className={style.question}>
          <img
            src={`/assets/${userInfo.image}`}
            alt={userInfo?.fullname || "Profile"}
          />
        </div>
        <h2 className={style.fullname} style={{ color: "#6A5ACD" }}>
          {userInfo.fullname}
        </h2>
        <h3 className={style.department} style={{ color: "#FF0A0E" }}>
          {userInfo.department}
        </h3>

        <div className={style.buttonContainer}>
          <button className={style.button} style={{ background: "#66CCFF" }}>
            <Link to={"/teacher/scan-student/"}>Scan</Link>
          </button>
          <button className={style.button} style={{ background: "#FF66CC" }}>
            <Link to={"/teacher/list-student/"}>รายชื่อ</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Teacher;
