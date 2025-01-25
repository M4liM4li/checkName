import React, { useState, useRef } from "react";
import { Camera } from "react-camera-pro";
import style from "../style/Teacher.module.css";

const ScanStudent = () => {
  const camera = useRef(null);
  const [numberOfCameras, setNumberOfCameras] = useState(0);
  const [image, setImage] = useState(null);
  const [isUsingCamera, setIsUsingCamera] = useState(false);

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
  return (
    <div className={style.container}>
      <div className={style.content}>
        <div className={style.question}>
          {isUsingCamera ? (
            <div className={style.cameraContainer}>
              <Camera
                ref={camera}
                numberOfCamerasCallback={setNumberOfCameras}
                facingMode="user"
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
            <img
              src={image}
              className={style.questionImg}
            />
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
              className={style.button}
              onClick={() => setIsUsingCamera(true)}
            >
              เปิดกล้อง
            </button>
          ) : (
            <>
              <button className={style.button} onClick={handleTakePhoto}>
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
