import React, { useState, useEffect } from 'react';
import './Home.css';
import axios from 'axios';

const Home = ({ username }) => {
  const [user, setUser] = useState(null); // เก็บข้อมูลผู้ใช้
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // ดึงข้อมูลผู้ใช้เมื่อ component โหลดครั้งแรก
    const fetchUserData = async () => {
      try {
        const response = await axios.post('https://checkname-server.vercel.app/api/login', { username });
        if (response.data.success) {
          setUser(response.data.user);
          setErrorMessage('');
        } else {
          setErrorMessage(response.data.message || 'ไม่พบข้อมูลผู้ใช้');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setErrorMessage('เกิดข้อผิดพลาดในการดึงข้อมูล');
      }
    };

    if (username) {
      fetchUserData();
    } else {
      setErrorMessage('กรุณาเข้าสู่ระบบ');
    }
  }, [username]);

  return (
    <div className="container">
      <div className="content">
        {user ? (
          <>
            <h3>{user.firstname} {user.lastname}</h3>
            <h3>{user.queue ? 'true : เข้าแถว' : 'false : ไม่เข้าแถว'}</h3>
          </>
        ) : (
          <p>{errorMessage || 'กำลังโหลดข้อมูล...'}</p>
        )}
      </div>
    </div>
  );
};

export default Home;
