import React, { useState, useRef } from "react";
import { Camera } from "react-camera-pro";
import Swal from "sweetalert2"; // Assuming you've installed SweetAlert2
import style from "../style/Teacher.module.css";

const ScanStudent = () => {
  const camera = useRef(null);
  const [numberOfCameras, setNumberOfCameras] = useState(0);
  const [image, setImage] = useState(null);
  const [isUsingCamera, setIsUsingCamera] = useState(false);
  const [name, setName] = useState(""); // State to hold the student's name

  const handleTakePhoto = () => {
    if (camera.current) {
      const photo = camera.current.takePhoto();
      setImage(photo);
      setIsUsingCamera(false);

      // Send the photo to the server for processing
      sendImageToServer(photo);
    }
  };

  const handleNameVerification = async () => {
    if (!name) {
      return Swal.fire("Error", "Name is required", "error");
    }

    // Show confirmation alert with the name
    const result = await Swal.fire({
      title: `Confirm Name: ${name}`,
      text: "Is this your name?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    if (result.isConfirmed) {
      // Proceed with the attendance process
      await sendDataToBackend(name);
    } else {
      Swal.fire("Cancelled", "You cancelled the name verification", "info");
    }
  };

  const sendDataToBackend = async (name) => {
    try {
      const response = await fetch("/api/receiveFaceData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();
      if (data.status === "success") {
        Swal.fire("Success", data.message, "success");
      } else {
        Swal.fire("Failed", data.message, "error");
      }
    } catch (error) {
      Swal.fire("Error", "An error occurred while sending data", "error");
    }
  };

  const sendImageToServer = async (photo) => {
    try {
      const formData = new FormData();

      // Convert base64 or URL to Blob
      const response = await fetch(photo);
      const blob = await response.blob();

      // Check the file size before sending
      console.log("Photo Blob size:", blob.size);

      // Add the file to formData
      formData.append("image", blob, "photo.jpg");

      // Send the form data to the server
      const res = await fetch(
        "https://stable-airedale-powerful.ngrok-free.app/compare-face",
        {
          method: "POST",
          body: formData, // Do not set Content-Type manually
        }
      );

      const result = await res.json();
      console.log(result);
    } catch (error) {
      console.error("Error sending photo:", error);
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
                  noCameraAccessible: "Cannot access the camera",
                  permissionDenied: "Please allow camera access",
                  switchCamera: "Unable to switch cameras",
                  canvas: "Canvas is not supported",
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
          <input
            type="text"
            className={style.nameInput}
            placeholder="Enter student's name"
            value={name}
            onChange={(e) => setName(e.target.value)} // Update name state
          />

          {!isUsingCamera ? (
            <button
              className={style.button}
              onClick={() => setIsUsingCamera(true)}
            >
              Open Camera
            </button>
          ) : (
            <>
              <button className={style.button} onClick={handleTakePhoto}>
                Take Photo
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
                  Switch Camera
                </button>
              )}
              <button
                className={style.button}
                onClick={() => setIsUsingCamera(false)}
              >
                Cancel
              </button>
            </>
          )}

          <button
            className={style.button}
            onClick={handleNameVerification} // Trigger name verification flow
          >
            Verify Name
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScanStudent;
