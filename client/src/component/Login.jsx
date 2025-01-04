import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  
import "./Login.css";
import axios from "axios"; 

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  const navigate = useNavigate();  // ใช้ useNavigate สำหรับการนำทาง

  const handleLogin = async (e) => {
    e.preventDefault();
    const API_URL = 'https://react-galo.vercel.app/api/login';  // แก้ไข URL ให้ตรงกับ Backend ของคุณ

    try {
      const response = await axios.post(API_URL, {
        username,
        password
      });

      if (response.data.success) {
        console.log("Login successful:", response.data);
        // เมื่อเข้าสู่ระบบสำเร็จ ให้ทำการนำทางไปหน้า Home
        navigate('/home');  // เปลี่ยนเส้นทางไปหน้า Home
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      setErrorMessage("ไม่สามารถเข้าสู่ระบบได้, ลองใหม่อีกครั้ง");
      console.error("Login error:", error);
    }
  };

  return (
    <div className="container">
      <div className="sun"></div>
      <div className="cloud">
        <div className="cloud-part"></div>
        <div className="cloud-part"></div>
        <div className="cloud-part"></div>
      </div>
      <div className="cloud">
        <div className="cloud-part"></div>
        <div className="cloud-part"></div>
        <div className="cloud-part"></div>
      </div>
      <div className="cloud">
        <div className="cloud-part"></div>
        <div className="cloud-part"></div>
        <div className="cloud-part"></div>
      </div>
      <div className="cloud">
        <div className="cloud-part"></div>
        <div className="cloud-part"></div>
        <div className="cloud-part"></div>
      </div>
      <div className="content">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="input">
            <input
              type="text"
              className="inputf"
              placeholder="Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <span className="label">Name</span>
          </div>
          <div className="input">
            <input
              type="password"
              className="inputf"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="label">Password</span>
          </div>

          <button type="submit">Login</button>
        </form>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default Login;
