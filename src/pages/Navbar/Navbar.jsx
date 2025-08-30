import React from "react";
import { Avatar } from "@mui/material";
import { useSelector } from "react-redux";
import "./Navbar.css";

function Navbar() {
  const { user } = useSelector((store) => store.auth);

  // Determine which avatar to use based on user role
  const getAvatarSrc = () => {
    if (user?.profilePic) {
      return user.profilePic;
    }
    return user?.role === "ROLE_ADMIN" 
      ? "/Images/admin.webp" 
      : "/Images/user.webp";
  };

  return (
    <div className="navbar-container flex justify-between items-center px-8 py-4">
      <p className="text-2xl font-bold">Task Manager</p>
      <div className="flex items-center gap-3">
        <p className="hidden sm:block font-medium">{user?.fullName}</p>
        <Avatar src={getAvatarSrc()} alt={user?.fullName || "U"} />
      </div>
    </div>
  );
}

export default Navbar;