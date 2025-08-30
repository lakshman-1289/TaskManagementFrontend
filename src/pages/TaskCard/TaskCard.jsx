import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';
import { Menu, MenuItem, IconButton } from '@mui/material';
import UserList from '../UserLists/UserList.jsx';
import SubmissionList from '../SubmissionList/SubmissionList.jsx';
import EditTaskForm from '../EditTaskForm/EditTaskForm.jsx';
import SubmitFormModel from '../SubmissionList/SubmitFormModel.jsx';
import { deleteTask } from '../../ReduxToolkit/taskSlice.js';
import './TaskCard.css'; // Import the CSS file

function TaskCard({ item }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);

  // State for menu and modals
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const [openUserList, setOpenUserList] = useState(false);
  const [openSubmissionList, setOpenSubmissionList] = useState(false);
  const [openUpdateTaskForm, setOpenUpdateTaskForm] = useState(false);
  const [openSubmitFormModel, setOpenSubmitFormModel] = useState(false);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenUserList = () => {
    setOpenUserList(true);
    handleMenuClose();
    const updatedParams = new URLSearchParams(location.search);
    updatedParams.set('taskId', item.id);
    navigate(location.pathname + '?' + updatedParams.toString());
  };

  const handleCloseUserList = () => {
    setOpenUserList(false);
    // Remove taskId from URL when closing
    const updatedParams = new URLSearchParams(location.search);
    updatedParams.delete('taskId');
    navigate(location.pathname + (updatedParams.toString() ? '?' + updatedParams.toString() : ''), { replace: true });
  };

  const handleOpenSubmissionList = () => {
    setOpenSubmissionList(true);
    handleMenuClose();
    const updatedParams = new URLSearchParams(location.search);
    updatedParams.set('taskId', item.id);
    navigate(location.pathname + '?' + updatedParams.toString());
  };

  const handleCloseSubmissionList = () => {
    setOpenSubmissionList(false);
    // Remove taskId from URL when closing
    const updatedParams = new URLSearchParams(location.search);
    updatedParams.delete('taskId');
    navigate(location.pathname + (updatedParams.toString() ? '?' + updatedParams.toString() : ''), { replace: true });
  };

  const handleOpenUpdateTaskModel = () => {
    setOpenUpdateTaskForm(true);
    handleMenuClose();
    const updatedParams = new URLSearchParams(location.search);
    updatedParams.set('taskId', item.id);
    navigate(location.pathname + '?' + updatedParams.toString());
  };

  const handleCloseUpdateTaskModel = () => {
    setOpenUpdateTaskForm(false);
    // Remove taskId from URL when closing
    const updatedParams = new URLSearchParams(location.search);
    updatedParams.delete('taskId');
    navigate(location.pathname + (updatedParams.toString() ? '?' + updatedParams.toString() : ''), { replace: true });
  };

  const handleDeleteTask = () => {
    dispatch(deleteTask(item.id));
    handleMenuClose();
  };

  const handleOpenSubmitFormModel = () => {
    setOpenSubmitFormModel(true);
    handleMenuClose();
    const updatedParams = new URLSearchParams(location.search);
    updatedParams.set('taskId', item.id);
    navigate(location.pathname + '?' + updatedParams.toString());
  };

  const handleCloseSubmitFormModel = () => {
    setOpenSubmitFormModel(false);
    // Remove taskId from URL when closing
    const updatedParams = new URLSearchParams(location.search);
    updatedParams.delete('taskId');
    navigate(location.pathname + (updatedParams.toString() ? '?' + updatedParams.toString() : ''), { replace: true });
  };

  return (
    <div className="card lg:flex justify-between p-5 rounded-md">
      <div className="lg:flex gap-5 items-center w-[90%] lg:w-[70%]">
        <div className="image">
          <img
            className="object-cover w-full h-full rounded-md"
            src={item.image || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGFza3xlbnwwfHwwfHx8MA%3D%3D"}
            alt={item.title}
            style={{ width: '7rem', height: '7rem' }}
          />
        </div>
        <div className="space-y-2">
          <h1 className="task-title font-bold text-lg">{item.title}</h1>
          <p className="text-gray-500 text-sm">{item.description}</p>
          <div className="flex flex-wrap gap-2 items-center">
            {item.tags?.map((tag, index) => (
              <span key={index} className="py-1 px-5 rounded-full text-tech-stack">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div>
        <IconButton
          aria-label="more"
          id="long-button"
          aria-controls={openMenu ? 'long-menu' : undefined}
          aria-expanded={openMenu ? 'true' : undefined}
          aria-haspopup="true"
          onClick={handleMenuClick}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="long-menu"
          MenuListProps={{
            'aria-labelledby': 'long-button',
          }}
          anchorEl={anchorEl}
          open={openMenu}
          onClose={handleMenuClose}
        >
          {user?.role === 'ROLE_ADMIN' ? (
            [
              <MenuItem key="assigned-user" onClick={handleOpenUserList}>Assigned User</MenuItem>,
              <MenuItem key="see-submissions" onClick={handleOpenSubmissionList}>See Submissions</MenuItem>,
              <MenuItem key="edit" onClick={handleOpenUpdateTaskModel}>Edit</MenuItem>,
              <MenuItem key="delete" onClick={handleDeleteTask}>Delete</MenuItem>
            ]
          ) : (
            <MenuItem onClick={handleOpenSubmitFormModel}>Submit</MenuItem>
          )}
        </Menu>
      </div>

      {/* Modals/Forms */}
      <UserList open={openUserList} handleClose={handleCloseUserList} />
      <SubmissionList open={openSubmissionList} handleClose={handleCloseSubmissionList} />
      <EditTaskForm open={openUpdateTaskForm} handleClose={handleCloseUpdateTaskModel} />
      <SubmitFormModel open={openSubmitFormModel} handleClose={handleCloseSubmitFormModel} />
    </div>
  );
}

export default TaskCard;