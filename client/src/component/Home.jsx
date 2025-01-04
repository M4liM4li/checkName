import React, { useState } from 'react';
import './Home.css';
import axios from 'axios';

const Home = () => {
  const [user, setUser] = useState(null); // เก็บข้อมูลผู้ใช้
  const [username, setUsername] = useState(''); // Input Username
  const [errorMessage, setErrorMessage] = useState('');

  const fetchUserData = async () => {
    try {
      const response = await axios.post('https://checkname-server.vercel.app/api/getUserData', { username });
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

  return (
    <div className="container">
      <div className="content">
        <div>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={fetchUserData}>ค้นหา</button>
        </div>

        {user ? (
          <>
            <h3>{user.firstname} {user.lastname}</h3>
            <h3>{user.queue ? 'true : เข้าแถว' : 'false : ไม่เข้าแถว'}</h3>
          </>
        ) : (
          <p>{errorMessage || 'โปรดค้นหาข้อมูลผู้ใช้'}</p>
        )}
      </div>
    </div>
  );
};

export default Home;
