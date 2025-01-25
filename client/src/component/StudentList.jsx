import React, { useState, useEffect } from "react";
import style from "../style/StudentList.module.css";
import ReactExport from "react-export-excel";

const { ExcelFile, ExcelSheet } = ReactExport;

const StudentList = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(
          "https://check-namev2-serverx.vercel.app/api/listname"
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
                {student.status === "present" ? "" : "เช็คชื่อแล้ว"}{" "}
                {new Date(student.createdAt).toLocaleTimeString("th-TH")}
              </span>
            </li>
          ))}
        </ul>

        <ExcelFile
          filename="รายชื่อนักเรียน"
          element={<button className={style.exportButton}>Export</button>}
        >
          <ExcelSheet data={students} name="Students">
            <ExcelSheet.Column label="รหัสนักเรียน" value={(col) => col.user.stdcode} />
            <ExcelSheet.Column label="ชื่อเต็ม" value={(col) => col.user.fullname} />
            <ExcelSheet.Column label="สถานะ" value={(col) => (col.status === "present" ? "เช็คชื่อแล้ว" : "")} />
            <ExcelSheet.Column
              label="เวลาเช็คชื่อ"
              value={(col) => new Date(col.createdAt).toLocaleTimeString("th-TH")}
            />
          </ExcelSheet>
        </ExcelFile>
      </div>
    </div>
  );
};

export default StudentList;
