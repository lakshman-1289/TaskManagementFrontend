import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { getUserList } from '../../ReduxToolkit/oSlice';
import { assignTaskToUser } from '../../ReduxToolkit/taskSlice';
import {
  Button,
  Divider,
  Modal,
  Box,
  CircularProgress,
  Typography,
} from '@mui/material';

function UserList({ open, handleClose }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const taskID = queryParams.get('taskId');
  const [assigning, setAssigning] = useState({});

  useEffect(() => {
    if (open) {
      dispatch(getUserList(localStorage.getItem('jwt')));
    }
  }, [dispatch, open]);

  const { users } = useSelector((store) => store.auth);

  const handleAssignTask = (userId) => {
    if (taskID) {
      setAssigning((prev) => ({ ...prev, [userId]: true }));

      dispatch(assignTaskToUser({ taskId: taskID, userId })).then((result) => {
        setAssigning((prev) => {
          const newAssigning = { ...prev };
          delete newAssigning[userId];
          return newAssigning;
        });

        if (result.meta.requestStatus === 'fulfilled') {
          const updatedParams = new URLSearchParams(location.search);
          updatedParams.delete('taskId');
          navigate(
            location.pathname +
            (updatedParams.toString() ? '?' + updatedParams.toString() : ''),
            { replace: true }
          );
          handleClose();
        }
      });
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 420,
          bgcolor: '#0C071B',
          borderRadius: 3,
          boxShadow: `
                    0 0 60px 20px rgba(124, 115, 255, 0.6),
                    0 0 100px 40px rgba(194, 77, 208, 0.5)
                  `
          ,
          p: 4,
          outline: 'none',
        }}
      >
        {/* Header */}
        <Typography variant="h6" fontWeight="bold" color="white" mb={1}>
          Assign Task to User
        </Typography>
        <Typography variant="body2" color="gray" mb={2}>
          Task ID: {taskID}
        </Typography>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 2 }} />

        {/* Users List */}
        {users?.length > 0 ? (
          <Box
            sx={{
              maxHeight: '65vh',
              overflowY: 'auto',
              pr: 1,
            }}
          >
            {users.map((user, index) => (
              <Box key={user.id}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  p={2}
                  borderRadius={2}
                  sx={{
                    transition: '0.2s',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
                  }}
                >
                  {/* User Info */}
                  <Box display="flex" alignItems="center">
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        bgcolor: '#444',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                      }}
                    >
                      <Typography color="white" fontWeight="bold">
                        {user.fullName?.charAt(0)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography color="white" fontWeight="500">
                        {user.fullName}
                      </Typography>
                      <Typography color="gray" variant="body2">
                        {user.email}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Assign Button */}
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      px: 2,
                      py: 0.7,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAssignTask(user.id);
                    }}
                    disabled={assigning[user.id]}
                  >
                    {assigning[user.id] ? (
                      <CircularProgress size={18} color="inherit" />
                    ) : (
                      'Select'
                    )}
                  </Button>
                </Box>

                {/* Divider between users */}
                {index !== users.length - 1 && (
                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
                )}
              </Box>
            ))}
          </Box>
        ) : (
          <Typography
            textAlign="center"
            color="white"
            fontSize="0.9rem"
            mt={3}
          >
            No users found.
          </Typography>
        )}
      </Box>
    </Modal>
  );
}

export default UserList;
