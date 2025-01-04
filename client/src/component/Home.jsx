import React from 'react';
import './Home.css';
import { useLocation } from 'react-router-dom';  // ใช้ useLocation เพื่อดึงข้อมูลที่ส่งจาก Login

const Home = () => {
  const location = useLocation();
  const { firstname, lastname } = location.state || {};  // ดึงข้อมูลจาก location.state ที่ส่งมาจาก Login

  return (
    <div className="container">
      <div className="content">
        {firstname && lastname ? (
          <>
            <h3>Welcome, {firstname} {lastname}</h3>
            {/* สามารถแสดงข้อมูลอื่น ๆ ได้ที่นี่ */}
          </>
        ) : (
          <p>กรุณาล็อกอินเพื่อดูข้อมูล</p>
        )}
      </div>
    </div>
  );
};

export default Home;
