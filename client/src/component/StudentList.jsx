import React, { useState, useEffect } from "react";
import style from "../style/StudentList.module.css";
import * as XLSX from "xlsx";
import Swal from "sweetalert2"; // เพิ่มการนำเข้า SweetAlert2
import axios from "axios"; // นำเข้า axios

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [stdcode, setStdcode] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          "https://check-name-server.vercel.app/api/listname"
        );
        setStudents(response.data);
      } catch (error) {
        console.error("Failed to fetch students:", error);
      }
    };

    fetchStudents();
  }, []);

  const exportToExcel = async () => {
    // สร้างข้อมูลสำหรับ Export
    const data = students.map((student) => ({
      รหัสนักเรียน: student.user.stdcode,
      ชื่อเต็ม: student.user.fullname,
      สถานะ: student.status === "1" ? "" : "เช็คชื่อแล้ว",
      เวลาเช็คชื่อ: new Date(student.createdAt).toLocaleTimeString("th-TH"),
    }));

    // สร้างไฟล์ Excel
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, "รายชื่อนักเรียน.xlsx");

    // เรียก API เพื่อลบข้อมูลในตาราง
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
        try {
          const response = await axios.delete(
            "https://check-name-server.vercel.app/api/delete-names"
          );

          if (response.status === 200) {
            Swal.fire({
              title: "ลบสำเร็จ!",
              text: response.data.message || "ลบข้อมูลในตารางสำเร็จ",
              icon: "success",
            }).then(() => {
              window.location.reload(); // Reload the page
            });
          } else {
            Swal.fire({
              title: "เกิดข้อผิดพลาด",
              text: "ไม่สามารถลบข้อมูลได้",
              icon: "error",
            });
          }
        } catch (error) {
          console.error("Error deleting data:", error);
          Swal.fire({
            title: "เกิดข้อผิดพลาด",
            text: "ไม่สามารถลบข้อมูลในตารางได้",
            icon: "error",
          });
        }
      }
    });
  };

  return (
    <div className={style.container}>
      <div className={style.content}>
        <h4>รายชื่อ</h4>
        <ul>
          {students.map((student) => (
            <li key={student.id} className={style.li}>
              <span className={style.name}>{student.user.stdcode}</span>
              <span className={style.name}>{student.user.fullname}</span>
              <span className={style.status}>
                {student.status === "1" ? "" : "เช็คชื่อแล้ว"}{" "}
                {new Date(student.createdAt).toLocaleTimeString("th-TH")}
              </span>
            </li>
          ))}
        </ul>

        <div className={style.buttonContainer}>
          <button onClick={deleteName} className={style.deleteButton}>
            ลบ
          </button>
          <button onClick={exportToExcel} className={style.exportButton}>
            Export
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentList;