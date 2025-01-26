import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // เพิ่มการนำเข้า SweetAlert2
import style from "../style/Login.module.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const cloudinaryUrl = "https://res.cloudinary.com/dwyxrfpal/image/upload/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://check-name-server.vercel.app/api/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "เกิดข้อผิดพลาดในการเชื่อมต่อ");
        return;
      }

      if (data.success) {
        sessionStorage.setItem("user", JSON.stringify(data.user));
        sessionStorage.setItem("token", data.token);

        // แสดงข้อความแจ้งเตือนเมื่อเข้าสู่ระบบสำเร็จ
        Swal.fire({
          icon: "success",
          title: "เข้าสู่ระบบสำเร็จ",
          text: `ยินดีต้อนรับ`,
          timer: 1200,
        });
        // หลังจากผู้ใช้กด "ตกลง" จะนำไปยังหน้าอื่น
        if (data.user.role === "teacher") {
          navigate("/Teacher");
        } else {
          navigate("/Home");
        }
      } else {
        setError(data.message || "ข้อมูลไม่ถูกต้อง");
      }
    } catch (err) {
      console.log(err);
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    }
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
      <div className={style.cloud}>
        <div className={style.cloud}></div>
        <div className={style.cloud}></div>
        <div className={style.cloud}></div>
      </div>
      <div className={style.content}>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className={style.input}>
            <input
              type="text"
              className={style.inputf}
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <span className={style.label}>Username</span>
          </div>
          <div className={style.input}>
            <input
              type="password"
              className={style.inputf}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className={style.label}>Password</span>
          </div>
          <button type="submit">Login</button>
        </form>
        {error && <p className={style.error}>{error}</p>}
      </div>
    </div>
  );
};

export default Login;
