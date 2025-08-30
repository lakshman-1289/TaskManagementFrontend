import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Modal,
  Box,
  Typography,
  Grid,
  TextField,
  Autocomplete,
  Button,
  Divider,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { createTask } from '../../ReduxToolkit/taskSlice';
import dayjs from 'dayjs';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  borderRadius: 3,
  boxShadow: 24,
  p: 4,

  boxShadow: `
  0 0 60px 20px rgba(124, 115, 255, 0.6),
  0 0 100px 40px rgba(194, 77, 208, 0.5)`

};

function CreateTaskForm({ open, handleClose }) {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    title: '',
    image: '',
    description: '',
    deadline: dayjs(),
  });
  const [selectedTags, setSelectedTags] = useState([]);

  const tags = ['Angular', 'React', 'Vue.js', 'Spring Boot', 'Node.js', 'Python','Block chain'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTagChange = (event, value) => {
    setSelectedTags(value);
  };

  const handleDeadlineChange = (date) => {
    setFormData({ ...formData, deadline: date });
  };

  const formatDate = (date) => {
    if (!date) return '';
    const year = date.year();
    const month = String(date.month() + 1).padStart(2, '0');
    const day = String(date.date()).padStart(2, '0');
    const hours = String(date.hour()).padStart(2, '0');
    const minutes = String(date.minute()).padStart(2, '0');
    const seconds = String(date.second()).padStart(2, '0');
    const milliseconds = String(date.millisecond()).padStart(3, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedDeadline = formatDate(formData.deadline);
    const dataToSend = {
      ...formData,
      deadline: formattedDeadline,
      tags: selectedTags,
    };

    dispatch(createTask(dataToSend));
    handleClose();

    setFormData({
      title: '',
      image: '',
      description: '',
      deadline: dayjs(),
    });
    setSelectedTags([]);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography
          id="modal-modal-title"
          variant="h5"
          fontWeight="bold"
          mb={2}
          textAlign="center"
        >
          Create New Task
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Title"
                fullWidth
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Image URL"
                fullWidth
                name="image"
                value={formData.image}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={tags}
                onChange={handleTagChange}
                value={selectedTags}
                renderInput={(params) => (
                  <TextField {...params} label="Tags" placeholder="Select tags" />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Deadline"
                  value={formData.deadline}
                  onChange={handleDeadlineChange}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} mt={2}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  py: 1.2,
                  fontSize: '1rem',
                  textTransform: 'none',
                  borderRadius: 2,
                }}
              >
                Create Task
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Modal>
  );
}

export default CreateTaskForm;
