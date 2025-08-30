import React from 'react';
import { useDispatch } from 'react-redux';
import { IconButton, Button } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { acceptDeclineSubmission } from '../../ReduxToolkit/submissionSlice';

function SubmissionCard({ submission, onStatusChange }) {
  const dispatch = useDispatch();

  const handleAccepted = () => {
    dispatch(acceptDeclineSubmission({ id: submission.id, status: 'ACCEPTED' })).then((result) => {
      if (result.meta.requestStatus === 'fulfilled' && onStatusChange) {
        onStatusChange();
      }
    });
  };

  const handleDeclined = () => {
    dispatch(acceptDeclineSubmission({ id: submission.id, status: 'DECLINED' })).then((result) => {
      if (result.meta.requestStatus === 'fulfilled' && onStatusChange) {
        onStatusChange();
      }
    });
  };

  return (
    <div className="rounded-md bg-black p-5 flex items-center justify-between space-y-2">
      {/* GitHub Link section */}
      <div className="flex items-center gap-2">
        <a href={submission.githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
          <span className="text-[#c24dd0]">Go to Link</span>
          <OpenInNewIcon />
        </a>
      </div>
      {/* Submission Time section */}
      <div className="flex items-center gap-2 text-xs">
        <p className="text-gray-400">Submission Time</p>
        <p className="text-gray-400">{new Date(submission.submissionTime).toLocaleString()}</p>
      </div>
      {/* Status / Action buttons */}
      {submission.status === 'ACCEPTED' ? (
        <div className="flex gap-5">
          <div className="text-green-500">
            <IconButton onClick={handleAccepted}>
              <CheckCircleIcon />
            </IconButton>
            Accepted
          </div>
          <div className="text-red-500">
            <IconButton onClick={handleDeclined}>
              <CancelIcon />
            </IconButton>
            Declined
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <Button variant="outlined" color="success" onClick={handleAccepted}>
            Accept
          </Button>
          <Button variant="outlined" color="error" onClick={handleDeclined}>
            Decline
          </Button>
        </div>
      )}
    </div>
  );
}

export default SubmissionCard;