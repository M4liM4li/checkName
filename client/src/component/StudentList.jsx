import React, { useState, useEffect } from "react";
import style from "../style/StudentList.module.css";
import * as XLSX from "xlsx";

const StudentList = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(
          "https://check-name-server.vercel.app/api/listname"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setStudents(data);
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
    try {
      const response = await fetch("https://check-name-server.vercel.app/api/delete-names", {
        method: "DELETE",
      });
      const result = await response.json();

      if (response.ok) {
        alert(result.message || "ลบข้อมูลในตารางสำเร็จ");
      } else {
        alert("เกิดข้อผิดพลาด: " + result.error);
      }
    } catch (error) {
      console.error("Error deleting data:", error);
      alert("ไม่สามารถลบข้อมูลในตารางได้");
    }
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
        <button onClick={exportToExcel} className={style.exportButton}>
          Export
        </button>
      </div>
    </div>
  );
};

export default StudentList;
