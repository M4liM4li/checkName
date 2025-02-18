import React from "react";
import { Outlet } from "react-router-dom";
const Layouts = () => {
  return (
    <div>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layouts;
