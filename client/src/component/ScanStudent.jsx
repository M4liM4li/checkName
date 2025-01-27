import React, { useState, useRef } from "react";
import { Camera } from "react-camera-pro";
import axios from "axios"; // นำเข้า axios
import style from "../style/Teacher.module.css";
import Swal from "sweetalert2"; // เพิ่มการนำเข้า SweetAlert2

const ScanStudent = () => {
  const camera = useRef(null);
  const [numberOfCameras, setNumberOfCameras] = useState(0);
  const [image, setImage] = useState(null);
  const [isUsingCamera, setIsUsingCamera] = useState(false);
  const [students, setStudents] = useState([]); // ใช้ students state ตามที่ต้องการ

  const handleTakePhoto = () => {
    if (camera.current) {
      const photo = camera.current.takePhoto();
      setImage(photo);
      setIsUsingCamera(false);

      // ส่งรูปภาพไปยัง server สำหรับประมวลผล
      sendImageToServer(photo);
    }
  };

  const sendImageToServer = async (photo) => {
    try {
      const formData = new FormData();

      // เปลี่ยนรูปภาพจาก base64 หรือ URL เป็น Blob
      const response = await axios.get(photo, { responseType: "blob" });
      const blob = response.data;

      // ตรวจสอบขนาดของไฟล์ก่อนส่ง
      console.log("Photo Blob size:", blob.size);

      // เพิ่มไฟล์ลงใน formData
      formData.append("image", blob, "photo.jpg");

      // ส่งข้อมูลไปยัง server โดยใช้ axios
      const res = await axios.post(
        "https://stable-airedale-powerful.ngrok-free.app/compare-face",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const result = res.data;
      console.log(result);

      // แสดงผลลัพธ์หลังจากการส่งรูปภาพ
      if (result.status === "success") {
        Swal.fire({
          icon: "success",
          title: "สำเร็จ",
          text: `การเช็คชื่อสำเร็จ!`,
        });
        // เพิ่มข้อมูล student ลงใน state
        setStudents((prevStudents) => [...prevStudents, result.student]);
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
    }
  };

  return (
    <div className={style.container}>
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
            <img src={image} className={style.questionImg} />
          ) : (
            <img
              className={style.questionImg}
              onError={(e) => {
                e.target.src = "/assets/default-profile.png";
              }}
            />
          )}
        </div>
        <div className={style.buttonContainer}>
          {!isUsingCamera ? (
            <button
              className={style.buttonScan}
              onClick={() => setIsUsingCamera(true)}
            >
              เปิดกล้อง
            </button>
          ) : (
            <>
              <button
                className={style.button}
                onClick={handleTakePhoto}
                style={{ backgroundColor: "#48ff00" }}
              >
                ถ่ายรูป
              </button>
              {numberOfCameras > 1 && (
                <button
                  className={style.button}
                  onClick={() => {
                    if (camera.current) {
                      camera.current.switchCamera();
                    }
                  }}
                >
                  สลับกล้อง
                </button>
              )}
              <button
                className={style.button}
                onClick={() => setIsUsingCamera(false)}
                style={{ backgroundColor: "#ff1e1e" }}
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
