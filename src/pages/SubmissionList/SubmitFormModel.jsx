import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { submitTask } from '../../ReduxToolkit/submissionSlice';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 420,
  bgcolor: 'rgba(20, 20, 40, 0.9)', // ✅ dark semi-transparent background
  borderRadius: '1.2rem',
  p: 0,
  boxShadow: `
    0 0 60px 20px rgba(124, 115, 255, 0.6),
    0 0 100px 40px rgba(194, 77, 208, 0.5)
  `,
  color: '#fff',
};



function SubmitFormModel({ open, handleClose }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const taskID = queryParams.get('taskId');

  const [githubLink, setGithubLink] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskID && githubLink) {
      dispatch(submitTask({ taskId: taskID, githubLink }));
      setGithubLink('');
      handleCloseWithUrlCleanup();
    }
  };

  const handleCloseWithUrlCleanup = () => {
    handleClose();
    // Remove taskId from URL when closing
    const updatedParams = new URLSearchParams(location.search);
    updatedParams.delete('taskId');
    navigate(
      location.pathname +
        (updatedParams.toString() ? '?' + updatedParams.toString() : ''),
      { replace: true }
    );
  };

  return (
    <Modal
      open={open}
      onClose={handleCloseWithUrlCleanup}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{ zIndex: 2000 }}
    >
      <Box sx={style}>
        <Box sx={{ p: 4 }}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center' }}
          >
            🚀 Submit Task
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="GitHub Link"
              fullWidth
              value={githubLink}
              onChange={(e) => setGithubLink(e.target.value)}
              margin="normal"
              variant="outlined"
              InputLabelProps={{ style: { color: '#f1f1f1' } }}
              InputProps={{
                style: {
                  color: '#fff',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              sx={{
                mt: 2,
                padding: '0.9rem',
                fontWeight: 'bold',
                borderRadius: '10px',
                background: 'linear-gradient(90deg, #ff8cba, #9b6dff)',
                color: '#fff',
                '&:hover': {
                  background: 'linear-gradient(90deg, #ff6ea0, #805dff)',
                },
              }}
            >
              Submit
            </Button>
          </form>
        </Box>
      </Box>
    </Modal>
  );
}

export default SubmitFormModel;
