import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import useStateUser from "../../user/user-state";

const Login = () => {
  const navigate = useNavigate();
  const actionLogin = useStateUser((state) => state.actionLogin);
  const cloudinaryUrl = "https://res.cloudinary.com/dwyxrfpal/image/upload/";

  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

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

    setIsLoading(true);

    try {
      const res = await actionLogin(form);

      if (!res.data?.success || !res.data.user?.role) {
        throw new Error(res.data?.message || "ข้อมูลผู้ใช้ไม่ถูกต้อง");
      }

      const { role } = res.data.user;
      console.log("User role:", role);

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      Swal.fire({
        icon: "success",
        title: "เข้าสู่ระบบสำเร็จ",
        text: "ยินดีต้อนรับ",
        timer: 1000,
      });

      setTimeout(() => {
        roleRedirect(role);
      }, 10000);
      roleRedirect(role);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "เข้าสู่ระบบไม่สำเร็จ",
        text: "รหัสนักศึกษาหรือรหัสผ่านไม่ถูกต้อง",
        timer: 1200,
      });
      console.error("Login Error:", err);
    } finally {
      setIsLoading(false);
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
    <div className="container">
      <div className="sun"></div>
      <div className="content">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="input">
            <input
              type="text"
              className="inputf"
              placeholder="Username"
              name="username"
              value={form.username}
              onChange={handleOnChange}
              disabled={isLoading}
            />
            <span className="label">Username</span>
          </div>
          <div className="input">
            <input
              type="password"
              className="inputf"
              placeholder="Password"
              name="password"
              value={form.password}
              onChange={handleOnChange}
              disabled={isLoading}
            />
            <span className="label">Password</span>
          </div>
          <button type="submit" disabled={isLoading} className="button loginButton">
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;