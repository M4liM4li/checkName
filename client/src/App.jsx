import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";  // ใช้ BrowserRouter สำหรับการจัดการเส้นทาง
import Login from "./component/Login";
import Home from "./component/Home";

const App = () => {
  return (
    <Router>

      <Routes>  
        <Route path="/" element={<Login />} />  
        <Route path="/home" element={<Home />} />  
      </Routes>
    </Router>
  );
}

export default App;
