import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // เพิ่มการนำเข้า SweetAlert2
import axios from "axios"; // นำเข้า axios
import style from "../../style/Login.module.css";
import useStateUser from "../../user/user-state";

const Login = () => {
  const navigate = useNavigate();
  const actionLogin = useStateUser((state) => state.actionLogin);
  const user = useStateUser((state) => state.user);
  const cloudinaryUrl = "https://res.cloudinary.com/dwyxrfpal/image/upload/";

  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const handleOnChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await actionLogin(form);
      const role = res.data.user.role;
      console.log(role);
      roleRedirect(role);
      Swal.fire({
        icon: "success",
        title: "เข้าสู่ระบบสำเร็จ",
        text: `ยินดีต้อนรับ`,
        timer: 1200,
      });
    } catch (err) {
      Swal.fire({
        icon: "danger",
        title: "เข้าสู่ระบบไม่สำเร็จ",
        text: `รหัสนักศึกษาหรือรหัสผ่านไม่ถูกต้อง`,
        timer: 1200,
      });
      console.log(err);
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
              name="username"
              onChange={handleOnChange}
            />
            <span className={style.label}>Username</span>
          </div>
          <div className={style.input}>
            <input
              type="password"
              className={style.inputf}
              placeholder="Password"
              name="password"
              onChange={handleOnChange}
            />
            <span className={style.label}>Password</span>
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
