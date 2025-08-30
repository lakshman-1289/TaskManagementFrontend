import React from "react";
import Sidebar from "../Sidebar/Sidebar";
import TaskList from "../TaskList/TaskList";
import "./Home.css";

function Home() {
  return (
    <div className="flex w-full">
      {/* Sidebar */}
      <div className="hidden lg:block w-[20%]">
        <Sidebar />
      </div>

      {/* Right Content */}
      <div className="right-side-part w-full lg:w-[80%] p-4">
        <TaskList />
      </div>
    </div>
  );
}

export default Home;
