import React, { useState, useEffect } from 'react';
import './Home.css';
import axios from 'axios';

const Home = () => {
  const [user, setUser] = useState(null);  // เก็บข้อมูลผู้ใช้
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // เรียก API เมื่อ component ถูกโหลดขึ้น
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/getUserData');  // API ที่จะดึงข้อมูล
        if (response.data.success) {
          setUser(response.data.user);  // เก็บข้อมูลผู้ใช้ที่ได้รับ
        } else {
          setErrorMessage('ไม่สามารถดึงข้อมูลผู้ใช้ได้');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setErrorMessage('เกิดข้อผิดพลาดในการดึงข้อมูล');
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="container">
      <div className="content">
        <div className="question">
          {/* คุณสามารถใส่คำถามหรือข้อความที่ต้องการ */}
        </div>
        <div>
          {user ? (
            <>
              <h3>{user.firstname} {user.lastname}</h3>
              <h3>{user.queue ? 'true : เข้าแถว' : 'false : ไม่เข้าแถว'}</h3>
            </>
          ) : (
            <p>กำลังโหลดข้อมูล....</p>
          )}
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
      </div>
    </div>
  );
};

export default Home;
