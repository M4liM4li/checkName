import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "https://check-name-server.vercel.app";

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/api/listname`, {
        headers: { Authorization: token ? `Bearer ${token}` : undefined },
      });
      setStudents(response.data);
    } catch (error) {
      console.error("Failed to fetch students:", error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถดึงรายชื่อนักเรียนได้",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    const interval = setInterval(fetchStudents, 10000);
    return () => clearInterval(interval);
  }, []);

  const exportToExcel = async () => {
    setIsLoading(true);
    try {
      const data = students.map((student) => ({
        รหัสนักเรียน: student.user.stdcode,
        ชื่อเต็ม: student.user.fullname,
        สถานะ: student.status === "1" ? "ยังไม่เช็คชื่อ" : "เช็คชื่อแล้ว",
        เวลาเช็คชื่อ: new Date(student.createdAt).toLocaleTimeString("th-TH"),
      }));

      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Students");
      XLSX.writeFile(wb, "รายชื่อนักเรียน.xlsx");

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถ export ไฟล์ได้",
      });
    } finally {
      setIsLoading(false);
    }
  };
 

  const deleteName = async () => {
    Swal.fire({
      title: "ยืนยันการลบ?",
      text: "คุณต้องการลบรายชื่อทั้งหมดใช่หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่, ลบเลย!",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        try {
          await deleteAllStudents();
          Swal.fire({
            title: "ลบสำเร็จ!",
            text: "ลบข้อมูลในตารางสำเร็จ",
            icon: "success",
          });
        } catch (error) {
          Swal.fire({
            title: "เกิดข้อผิดพลาด",
            text: error.message,
            icon: "error",
          });
        } finally {
          setIsLoading(false);
        }
      }
    });
  };
  const handleBack = () => {
    navigate(-1); 
  };
  return (
    <div className="container">
      <div className="sun"></div>
      <div className="content w-92">
      <button className="w-7 h-7 bg-blue-500 rounded-md text-white p-1 flex  justify-center items-center hover:scale-105 shadow-md transition-all duration-300" onClick={handleBack}>
          <ArrowLeft />
        </button>
        <h4>รายชื่อ</h4>
        {isLoading ? (
          <div className="loading">กำลังโหลด...</div>
        ) : students.length === 0 ? (
          <p>ไม่มีข้อมูลนักเรียน</p>
        ) : (
          <ul className="studentList">
            {students.map((student) => (
              <li key={student.id} className="li">
                <span className="name">{student.user.fullname}</span>
                <span className="status">
                  {student.status === "1"
                    ? "ยังไม่เช็คชื่อ"
                    : `เช็คชื่อแล้ว ${new Date(student.createdAt).toLocaleTimeString("th-TH")}`}
                </span>
              </li>
            ))}
          </ul>
        )}
        <div className="buttonContainer">
          <button
            onClick={deleteName}
            className="button deleteButton"
            disabled={isLoading}
          >
            ลบ
          </button>
          <button
            onClick={exportToExcel}
            className="button exportButton"
            disabled={isLoading}
          >
            Export
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentList;