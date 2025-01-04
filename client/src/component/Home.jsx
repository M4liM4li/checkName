import React, { useState } from 'react';
import Webcam from 'react-webcam';
import './Home.css';

const Home = () => {
 const [isScanning, setIsScanning] = useState(false);

 const handleScan = () => {
   setIsScanning(true);
 };

 return (
   <div className="container">
     <div className="sun"></div>
     <div className="cloud">
       <div className="cloud-part"></div>
       <div className="cloud-part"></div>
       <div className="cloud-part"></div>
     </div>
     <div className="cloud">
       <div className="cloud-part"></div>
       <div className="cloud-part"></div>
       <div className="cloud-part"></div>
     </div>
     <div className="cloud">
       <div className="cloud-part"></div>
       <div className="cloud-part"></div>
       <div className="cloud-part"></div>
     </div>
     <div className="cloud">
       <div className="cloud-part"></div>
       <div className="cloud-part"></div>
       <div className="cloud-part"></div>
     </div>
     <div className="content">
       <div className="question">
         {isScanning ? (
           <Webcam
             audio={false}
             screenshotFormat="image/jpeg"
             videoConstraints={{
               facingMode: "user"
             }}
           />
         ) : (
           "?"
         )}
       </div>
       <button className="button" onClick={handleScan}>
         {isScanning ? "ปิดกล้อง" : "แสกนหน้า"}
       </button>
     </div>
   </div>
 );
};

export default Home;