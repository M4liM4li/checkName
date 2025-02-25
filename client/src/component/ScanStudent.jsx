import React, { useState, useRef } from "react";
import { Camera } from "react-camera-pro";
import axios from "axios";
import Swal from "sweetalert2";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SwitchCamera } from "lucide-react";

const ScanStudent = () => {
  const camera = useRef(null);
  const [numberOfCameras, setNumberOfCameras] = useState(0);
  const [image, setImage] = useState(null);
  const [isUsingCamera, setIsUsingCamera] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  const FACE_API_URL =
    import.meta.env.VITE_API_URL ||
    "https://stable-airedale-powerful.ngrok-free.app/compare-face";
  const ATTENDANCE_API_URL =
    import.meta.env.VITE_API_URL ||
    "https://check-name-server.vercel.app/api/attendance";

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

      const token = localStorage.getItem("token");
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
            {
              headers: { Authorization: token ? `Bearer ${token}` : undefined },
            }
          );
          const attendanceResult = attendanceRes.data;

          if (attendanceResult.status === "success") {
            Swal.fire({
              icon: "success",
              title: "สำเร็จ",
              text: "การเช็คชื่อสำเร็จ!",
            });
            setStudents((prev) => [
              ...prev,
              { name: result.name, confidence: result.confidence },
            ]);
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
  const handleBack = () => {
    navigate(-1);
  };
  return (
    <div className="container">
      <div className="sun"></div>
      <div className="content flex flex-col gap-5 w-92">
        <div className="flex justify-end items-end">
          {numberOfCameras > 1 && (
            <button
              className="w-8 h-8 bg-purple-600 rounded-md text-white p-1 flex  justify-center items-center hover:scale-105 shadow-md transition-all duration-300"
              onClick={() => camera.current?.switchCamera()}
              disabled={isProcessing}
            >
              <SwitchCamera />
            </button>
          )}
        </div>
        <button
          className="w-8 h-8 bg-blue-500 rounded-md text-white p-1 flex  justify-center items-center hover:scale-105 shadow-md transition-all duration-300"
          onClick={handleBack}
        >
          <ArrowLeft />
        </button>
        <div className=" flex justify-center items-center">
          <div className="overflow-hidden w-50 h-50 rounded-full bg-gray-300 ">
            {isUsingCamera ? (
              <div className="cameraContainer">
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
              <img src={image} className="questionImg" alt="Captured" />
            ) : (
              <img className="questionImg" />
            )}
          </div>
        </div>

        <div className="buttonContainer">
          {!isUsingCamera ? (
            <button
              className="button"
              style={{ backgroundColor: "#FF66CC" }}
              onClick={() => setIsUsingCamera(true)}
              disabled={isProcessing}
            >
              เปิดกล้อง
            </button>
          ) : (
            <>
              <button
                className="button"
                onClick={handleTakePhoto}
                style={{ backgroundColor: "#48ff00" }}
                disabled={isProcessing}
              >
                {isProcessing ? "กำลังประมวลผล..." : "ถ่ายรูป"}
              </button>

              <button
                className="button"
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
