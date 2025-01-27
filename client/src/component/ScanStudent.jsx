import React, { useState, useRef } from "react";
import { Camera } from "react-camera-pro";
import style from "../style/Teacher.module.css";
import Swal from "sweetalert2"; // เพิ่มการนำเข้า SweetAlert2

const ScanStudent = () => {
  const camera = useRef(null);
  const [numberOfCameras, setNumberOfCameras] = useState(0);
  const [image, setImage] = useState(null);
  const [isUsingCamera, setIsUsingCamera] = useState(false);
  const [students, setStudents] = useState([]);
  const [stdcode, setStdcode] = useState("");

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
      const response = await fetch(photo);
      const blob = await response.blob();

      // ตรวจสอบขนาดของไฟล์ก่อนส่ง
      console.log("Photo Blob size:", blob.size); // ตรวจสอบขนาดของไฟล์ก่อนส่ง

      // เพิ่มไฟล์ลงใน formData
      formData.append("image", blob, "photo.jpg");

      // ตรวจสอบ content ของ formData
      console.log("FormData content:", formData.get("image"));

      // ส่งข้อมูลไปยัง server
      const res = await fetch(
        "https://stable-airedale-powerful.ngrok-free.app/compare-face",
        {
          method: "POST",
          body: formData, // ไม่ต้องตั้ง Content-Type ด้วยตัวเอง
        }
      );

      const result = await res.json();
      console.log(result);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการส่งรูปภาพ:", error);
    }
  };

  const handleGetAttendance = async (stdcode) => {
    try {
      const response = await fetch(
        "https://check-name-server.vercel.app/api/attendance",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: stdcode }),
        }
      );

      const data = await response.json();
      console.log(data); // เพิ่มการ log เพื่อตรวจสอบข้อมูลที่ได้รับ

      if (data.status === "success" && data.user) {
        // แสดง SweetAlert ทันทีเมื่อได้รับข้อมูล
        const result = await Swal.fire({
          title: "ข้อมูลนักเรียน",
          html: `
            <div class="text-left">
              <p class="mb-2">ชื่อ: <strong>${data.user.name}</strong></p>
              <p class="mb-2">รหัสนักเรียน: <strong>${
                data.user.stdcode
              }</strong></p>
              <p>สถานะ: <strong class="${
                data.attendanceStatus === "registered"
                  ? "text-green-500"
                  : "text-yellow-500"
              }">${
            data.attendanceStatus === "registered"
              ? "เช็คชื่อแล้ว"
              : "ยังไม่ได้เช็คชื่อ"
          }</strong></p>
            </div>
          `,
          icon: "info",
          showCancelButton: true,
          confirmButtonText: "ยืนยันเช็คชื่อ",
          cancelButtonText: "ยกเลิก",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          reverseButtons: true,
        });

        if (result.isConfirmed) {
          // ถ้ากดยืนยัน ให้ส่ง request ไปบันทึกการเช็คชื่อ
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
          console.log(confirmData); // เพิ่มการ log เพื่อตรวจสอบข้อมูลที่ได้รับ

          if (confirmData.status === "success") {
            await Swal.fire({
              title: "สำเร็จ",
              text: "บันทึกการเช็คชื่อเรียบร้อยแล้ว",
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
            });
          } else {
            throw new Error(confirmData.message);
          }
        }
      } else {
        throw new Error(data.message || "ไม่พบข้อมูลนักเรียน");
      }
    } catch (error) {
      console.error("Error:", error);
      await Swal.fire({
        title: "ผิดพลาด",
        text: error.message || "เกิดข้อผิดพลาดในการเช็คชื่อ",
        icon: "error",
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
