import React, { useState, useRef, useEffect } from "react";
import { Camera } from "react-camera-pro";
import style from "../style/Teacher.module.css";
import Swal from 'sweetalert2';

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
      sendImageToServer(photo);
    }
  };

  const sendImageToServer = async (photo) => {
    try {
      const formData = new FormData();
      const response = await fetch(photo);
      const blob = await response.blob();

      formData.append("image", blob, "photo.jpg");

      const res = await fetch(
        "https://stable-airedale-powerful.ngrok-free.app/compare-face",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await res.json();
      fetchStudentName(result.name);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการส่งรูปภาพ:", error);
    }
  };

  const fetchStudentName = async (name) => {
    try {
      const response = await fetch('https://check-name-server.vercel.app/api/receiveFaceData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        Swal.fire({
          icon: 'success',
          title: 'บันทึกการเข้าเรียนสำเร็จ',
          text: `ชื่อ: ${data.name}`,
          confirmButtonText: 'ตกลง'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: data.message,
          confirmButtonText: 'ตกลง'
        });
      }
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้',
        confirmButtonText: 'ตกลง'
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
