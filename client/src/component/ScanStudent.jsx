import React, { useState, useRef } from "react";
import { Camera } from "react-camera-pro";
import axios from "axios";
import style from "../style/Teacher.module.css";
import Swal from "sweetalert2";

const ScanStudent = () => {
  const camera = useRef(null);
  const [numberOfCameras, setNumberOfCameras] = useState(0);
  const [image, setImage] = useState(null);
  const [isUsingCamera, setIsUsingCamera] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // เพิ่ม loading state
  const [students, setStudents] = useState([]); // เก็บข้อมูลนักเรียนที่เช็คชื่อ

  const FACE_API_URL = import.meta.env.VITE_API_URL || "https://stable-airedale-powerful.ngrok-free.app/compare-face";
  const ATTENDANCE_API_URL = import.meta.env.VITE_API_URL || "https://check-name-server.vercel.app/api/attendance";

  // แปลง base64 เป็น Blob
  const base64ToBlob = (base64) => {
    const byteString = atob(base64.split(",")[1]);
    const mimeString = base64.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  const handleTakePhoto = () => {
    if (camera.current && !isProcessing) {
      const photo = camera.current.takePhoto();
      setImage(photo);
      setIsUsingCamera(false);
      sendImageToServer(photo);
    }
  };

  const sendImageToServer = async (photo) => {
    setIsProcessing(true);
    try {
      const formData = new FormData();
      const blob = base64ToBlob(photo);
      console.log("Photo Blob size:", blob.size);
      formData.append("image", blob, "photo.jpg");

      const token = localStorage.getItem("token"); // ดึง token จาก localStorage
      const res = await axios.post(FACE_API_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });

      const result = res.data;
      console.log(result);

      if (result.status === "success") {
        const { value: action } = await Swal.fire({
          title: `พบการจับคู่: ${result.name}`,
          text: `ความมั่นใจ: ${result.confidence}`,
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "เช็คชื่อ",
          cancelButtonText: "ยกเลิกการเช็คชื่อ",
        });

        if (action) {
          const attendanceRes = await axios.post(
            ATTENDANCE_API_URL,
            { name: result.name, confirm: true },
            { headers: { Authorization: token ? `Bearer ${token}` : undefined } }
          );
          const attendanceResult = attendanceRes.data;

          if (attendanceResult.status === "success") {
            Swal.fire({
              icon: "success",
              title: "สำเร็จ",
              text: "การเช็คชื่อสำเร็จ!",
            });
            // ปรับให้ใช้ result.name แทน result.student
            setStudents((prev) => [...prev, { name: result.name, confidence: result.confidence }]);
          } else {
            Swal.fire({
              icon: "error",
              title: "ไม่สำเร็จ",
              text: attendanceResult.message || "เกิดข้อผิดพลาดในการเช็คชื่อ",
            });
          }
        } else {
          Swal.fire({
            icon: "info",
            title: "การเช็คชื่อถูกยกเลิก",
            text: "ไม่มีการเพิ่มข้อมูลการเช็คชื่อ",
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "ไม่สำเร็จ",
          text: result.message || "เกิดข้อผิดพลาด",
        });
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการส่งรูปภาพ:", error);
      Swal.fire({
        icon: "error",
        title: "ไม่สามารถส่งรูปภาพได้",
        text: error.response?.data?.message || "เกิดข้อผิดพลาดในการเชื่อมต่อ",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={style.container}>
      <div className={style.sun}></div>
      {[...Array(3)].map((_, index) => (
        <div key={index} className={style.cloud}>
          <div className={style.cloud}></div>
          <div className={style.cloud}></div>
          <div className={style.cloud}></div>
        </div>
      ))}
      <div className={style.content}>
        <div className={style.question}>
          {isUsingCamera ? (
            <div className={style.cameraContainer}>
              <Camera
                ref={camera}
                numberOfCamerasCallback={setNumberOfCameras}
                facingMode="environment"
                aspectRatio={1}
                errorMessages={{
                  noCameraAccessible: "ไม่สามารถเข้าถึงกล้องได้",
                  permissionDenied: "กรุณาอนุญาตการใช้งานกล้อง",
                  switchCamera: "ไม่สามารถสลับกล้องได้",
                  canvas: "Canvas ไม่สามารถใช้งานได้",
                }}
              />
            </div>
          ) : image ? (
            <img src={image} className={style.questionImg} alt="Captured" />
          ) : (
            <img
              src="/assets/default-profile.png"
              className={style.questionImg}
              alt="Default"
            />
          )}
        </div>
        <div className={style.buttonContainer}>
          {!isUsingCamera ? (
            <button
              className={style.buttonScan}
              onClick={() => setIsUsingCamera(true)}
              disabled={isProcessing}
            >
              เปิดกล้อง
            </button>
          ) : (
            <>
              <button
                className={style.button}
                onClick={handleTakePhoto}
                style={{ backgroundColor: "#48ff00" }}
                disabled={isProcessing}
              >
                {isProcessing ? "กำลังประมวลผล..." : "ถ่ายรูป"}
              </button>
              {numberOfCameras > 1 && (
                <button
                  className={style.button}
                  onClick={() => camera.current?.switchCamera()}
                  disabled={isProcessing}
                >
                  สลับกล้อง
                </button>
              )}
              <button
                className={style.button}
                onClick={() => setIsUsingCamera(false)}
                style={{ backgroundColor: "#ff1e1e" }}
                disabled={isProcessing}
              >
                ยกเลิก
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScanStudent;