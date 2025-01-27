import React, { useState, useEffect } from "react";
import style from "../style/StudentList.module.css";
import * as XLSX from "xlsx";
import Swal from "sweetalert2"; // เพิ่มการนำเข้า SweetAlert2

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [stdcode, setStdcode] = useState("");
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
          const response = await fetch(
            "https://check-name-server.vercel.app/api/delete-names",
            {
              method: "DELETE",
            }
          );
          const result = await response.json();

          if (response.ok) {
            Swal.fire({
              title: "ลบสำเร็จ!",
              text: result.message || "ลบข้อมูลในตารางสำเร็จ",
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

  const handleAttendance = async () => {
    try {
      // ส่งคำขอไปยัง backend พร้อม stdcode
      const response = await fetch("https://check-name-server.vercel.app/api/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: stdcode }),
      });
  
      const data = await response.json();
  
      if (data.status === "success" && data.user) {
        // แสดงข้อมูลของนักเรียนทันทีที่ข้อมูลถูกส่งกลับ
        Swal.fire({
          title: "ข้อมูลนักเรียน",
          html: `<p>ชื่อ: <strong>${data.user.name}</strong></p>
                 <p>รหัสนักเรียน: <strong>${data.user.stdcode}</strong></p>
                 <p>สถานะ: ${
                   data.attendanceStatus === "registered"
                     ? "เช็คชื่อแล้ว"
                     : "ยังไม่ได้เช็คชื่อ"
                 }</p>`,
          icon: "info",
          showCancelButton: true,
          confirmButtonText: "ยืนยันเช็คชื่อ",
          cancelButtonText: "ยกเลิก",
        }).then(async (result) => {
          if (result.isConfirmed) {
            // หากผู้ใช้ยืนยัน จะบันทึกข้อมูลการเช็คชื่อ
            const confirmResponse = await fetch(
              "https://check-name-server.vercel.app/api/attendance",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: stdcode, confirm: true }),
              }
            );
            const confirmData = await confirmResponse.json();
  
            if (confirmData.status === "success") {
              Swal.fire("สำเร็จ", "เช็คชื่อสำเร็จ!", "success");
            } else {
              Swal.fire("ผิดพลาด", confirmData.message, "error");
            }
          }
        });
      } else {
        Swal.fire("ผิดพลาด", data.message, "error");
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire("ผิดพลาด", "เกิดข้อผิดพลาดในการเช็คชื่อ", "error");
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
        <input
          type="text"
          placeholder="ป้อนรหัสนักเรียน"
          value={stdcode}
          onChange={(e) => setStdcode(e.target.value)}
          onBlur={handleAttendance} // เรียกฟังก์ชันเมื่อ Input เสร็จสิ้น
        />
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
