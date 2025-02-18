import React from "react";
import { Outlet } from "react-router-dom";

const LayoutTeacher = () => {
  return (
    <main>
      <Outlet />
    </main>
  );
};

export default LayoutTeacher;
