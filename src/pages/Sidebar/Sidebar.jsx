import { useLocation, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Button } from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import { logout } from "../../ReduxToolkit/oSlice";
import CreateTaskForm from "../CreateTaskForm/CreateTaskForm";
import "./Sidebar.css";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);

  const [activeMenu, setActiveMenu] = useState("Home");
  const [openCreateTaskForm, setOpenCreateTaskForm] = useState(false);

  // Set active menu based on current route
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filter = params.get("filter");
    
    if (!filter) {
      setActiveMenu("Home");
    } else {
      const menuItem = menu.find(item => item.value === filter);
      if (menuItem) {
        setActiveMenu(menuItem.name);
      }
    }
  }, [location]);

  const handleMenuChange = (item) => {
    setActiveMenu(item.name);

    if (item.name === "Create New Task") {
      setOpenCreateTaskForm(true);
    } else if (item.name === "Home") {
      const updatedParams = new URLSearchParams(location.search);
      updatedParams.delete("filter");
      const queryString = updatedParams.toString();
      navigate(location.pathname + (queryString ? `?${queryString}` : ""));
    } else {
      const updatedParams = new URLSearchParams(location.search);
      updatedParams.set("filter", item.value);
      navigate(location.pathname + "?" + updatedParams.toString());
    }
  };

  const handleLogout = () => {
    // Clear filter from URL before logging out
    const updatedParams = new URLSearchParams(location.search);
    updatedParams.delete("filter");
    const queryString = updatedParams.toString();
    navigate(location.pathname + (queryString ? `?${queryString}` : ""));
    
    // Dispatch logout action
    dispatch(logout());
  };

  // Determine which avatar to use based on user role
  const getAvatarSrc = () => {
    if (user?.profilePic) {
      return user.profilePic;
    }
    return user?.role === "ROLE_ADMIN" 
      ? "/Images/admin.webp" 
      : "/Images/user.webp";
  };

  const menu = [
    { name: "Home", value: "home", role: ["ROLE_ADMIN", "ROLE_CUSTOMER"] },
    { name: "Done", value: "DONE", role: ["ROLE_ADMIN", "ROLE_CUSTOMER"] },
    { name: "Assigned", value: "ASSIGNED", role: ["ROLE_ADMIN","ROLE_CUSTOMER"] },
    { name: "Not Assigned", value: "PENDING", role: ["ROLE_ADMIN"] },
    { name: "Create New Task", value: "create_new_task", role: ["ROLE_ADMIN"] },
    { name: "Notification", value: "notification", role: ["ROLE_CUSTOMER"] },
  ];

  const currentRole = user?.role || "ROLE_ADMIN";

  return (
    <div className="sidebar fixed top-0 left-0 h-screen w-64 flex flex-col justify-between items-center text-white py-10 bg-black/30 backdrop-blur-lg shadow-lg">
      {/* Top: Avatar + Name */}
      <div className="flex flex-col items-center gap-3">
        <Avatar
          src={getAvatarSrc()}
          alt={user?.fullName || "User"}
          sx={{ bgcolor: deepPurple[500], width: "8rem", height: "8rem" }}
          className="sidebar-avatar"
        />
        <p className="text-lg font-semibold">{user?.fullName}</p>
      </div>

      {/* Middle: Menu */}
      <div className="flex flex-col gap-4 w-full px-6">
        {menu
          .filter((item) => item.role.includes(currentRole))
          .map((item) => (
            <p
              key={item.name}
              className={`py-3 px-5 rounded-full text-center cursor-pointer
                ${activeMenu === item.name ? "active-menu-item" : "menu-item"}`}
              onClick={() => handleMenuChange(item)}
            >
              {item.name}
            </p>
          ))}
      </div>

      {/* Bottom: Logout */}
      <Button
        onClick={handleLogout}
        className="logout-button w-3/4"
        variant="outlined"
      >
        Logout
      </Button>

      {/* Create Task Modal */}
      <CreateTaskForm
        open={openCreateTaskForm}
        handleClose={() => setOpenCreateTaskForm(false)}
      />
    </div>
  );
}

export default Sidebar;