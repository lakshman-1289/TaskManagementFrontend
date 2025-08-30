import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchSubmissionsByTaskId } from '../../ReduxToolkit/submissionSlice';
import { Modal, Box, Typography, Divider } from '@mui/material';
import SubmissionCard from './SubmissionCard';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 520,
  bgcolor: '#0C071B',
  borderRadius: 3,
  p: 4,
  outline: 'none',

  // Glowing box shadow
  boxShadow: `
    0 0 60px 20px rgba(124, 115, 255, 0.6),
    0 0 100px 40px rgba(194, 77, 208, 0.5)
  `,
};

function SubmissionList({ open, handleClose }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const taskID = queryParams.get('taskId');

  const { taskSubmissions } = useSelector((store) => store.submission);
  const submissions = taskID ? taskSubmissions[taskID] || [] : [];

  const fetchSubmissions = () => {
    if (taskID) {
      dispatch(fetchSubmissionsByTaskId(taskID));
    }
  };

  useEffect(() => {
    if (open && taskID) {
      fetchSubmissions();
    }
  }, [dispatch, open, taskID]);

  const handleCloseWithUrlCleanup = () => {
    handleClose();
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
    >
      <Box sx={style}>
        {/* Header */}
        <Typography
          id="modal-modal-title"
          variant="h6"
          fontWeight="bold"
          sx={{ color: '#F5F5F5', mb: 1 }}
        >
          Submission List
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: '#B0B0B0', mb: 2 }}
        >
          Task ID: {taskID}
        </Typography>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 3 }} />

        {/* Content */}
        {submissions.length > 0 ? (
          <Box
            sx={{
              maxHeight: '65vh',
              overflowY: 'auto',
              pr: 1,
            }}
          >
            <Typography
              variant="body2"
              sx={{ color: '#E0E0E0', mb: 2 }}
            >
              Submissions count: {submissions.length}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {submissions.map((submission) => (
                <SubmissionCard
                  key={submission.id}
                  submission={submission}
                  onStatusChange={fetchSubmissions}
                />
              ))}
            </Box>
          </Box>
        ) : (
          <Typography
            textAlign="center"
            sx={{ color: '#B0B0B0', mt: 3 }}
          >
            No submission found
          </Typography>
        )}
      </Box>
    </Modal>
  );
}

export default SubmissionList;
