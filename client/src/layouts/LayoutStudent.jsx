import React from "react";
import { Outlet } from "react-router-dom";

const LayoutStudent = () => {
  return (
    <main>
      <Outlet />
    </main>
  );
};

export default LayoutStudent;
