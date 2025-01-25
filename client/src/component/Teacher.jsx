import React from 'react';
import { useNavigate } from 'react-router-dom';
import style from '../style/Teacher.module.css';

const Teacher = () => {
  const navigate = useNavigate();

  const userInfo = {
    fullname: 'อาจารย์ สุภาพร ผุดผ่อง',
    department: 'แผนกเทคโนโลยีสารสนเทศ',
    image: '65209010022.jpg',
  };
  const handleScanClick = () => {
    navigate('/scan-student');
  };
  const handleStudentListClick = () => {
    navigate('/student-list');
  };
  return (
    <div className={style.container}>
      <div className={style.content}>
        <div className={style.question}>
          <img
            src={`/assets/${userInfo.image}`}
            alt={userInfo?.fullname || 'Profile'}
            onError={(e) => {
              e.target.src = '/assets/default-profile.png';
            }}
          />
        </div>
        <h2 className={style.fullname} style={{ color: '#6A5ACD' }}>
          {userInfo.fullname}
        </h2>
        <h3 className={style.department} style={{ color: '#FF0A0E' }}>
          {userInfo.department}
        </h3>

        <div className={style.buttonContainer}>
          <button
            className={style.button}
            style={{ background: '#66CCFF' }}
            onClick={handleScanClick}
          >
            scan
          </button>
          <button
            className={style.button}
            style={{ background: '#FF66CC' }}
            onClick={handleStudentListClick}
          >
            รายชื่อ
          </button>
        </div>
      </div>
    </div>
  );
};

export default Teacher;
