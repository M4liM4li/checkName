import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import style from "../../style/Login.module.css";
import useStateUser from "../../user/user-state";

const Login = () => {
  const navigate = useNavigate();
  const actionLogin = useStateUser((state) => state.actionLogin);
  const cloudinaryUrl = "https://res.cloudinary.com/dwyxrfpal/image/upload/";

  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false); // เพิ่ม loading state

  const handleOnChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (form.username.trim().length < 3) {
      Swal.fire({
        icon: "error",
        title: "กรุณากรอกข้อมูล",
        text: "ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร",
        timer: 1200,
        
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true); // เริ่ม loading

    try {
      const res = await actionLogin(form);

      if (!res.data?.success || !res.data.user?.role) {
        throw new Error(res.data?.message || "ข้อมูลผู้ใช้ไม่ถูกต้อง");
      }

      const { role } = res.data.user;
      console.log("User role:", role);

      // เก็บ token (ถ้า backend ส่งมา)
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      roleRedirect(role);

      Swal.fire({
        icon: "success",
        title: "เข้าสู่ระบบสำเร็จ",
        text: "ยินดีต้อนรับ",
        timer: 1000,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "เข้าสู่ระบบไม่สำเร็จ",
        text: "รหัสนักศึกษาหรือรหัสผ่านไม่ถูกต้อง",
        timer: 1200,
      });
      console.error("Login Error:", err);
    } finally {
      setIsLoading(false); // หยุด loading
    }
  };

  const roleRedirect = (role) => {
    if (role === "teacher") {
      navigate("/teacher");
    } else {
      navigate("/student");
    }
  };

  return (
    <div className={style.container}>
      <div className={style.sun}></div>
      {/* ลดการซ้ำซ้อนของ cloud ด้วยการใช้ array */}
      {[...Array(4)].map((_, index) => (
        <div key={index} className={style.cloud}>
          <div className={style.cloud}></div>
          <div className={style.cloud}></div>
          <div className={style.cloud}></div>
        </div>
      ))}
      <div className={style.content}>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className={style.input}>
            <input
              type="text"
              className={style.inputf}
              placeholder="Username"
              name="username"
              value={form.username}
              onChange={handleOnChange}
              disabled={isLoading}
            />
            <span className={style.label}>Username</span>
          </div>
          <div className={style.input}>
            <input
              type="password"
              className={style.inputf}
              placeholder="Password"
              name="password"
              value={form.password}
              onChange={handleOnChange}
              disabled={isLoading}
            />
            <span className={style.label}>Password</span>
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
