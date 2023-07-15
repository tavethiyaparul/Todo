
import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Post_All } from '../basicfunction/allApiFunction';


const AddTask = (props) => {
    console.log("props", props);
    const [open, setOpen] = useState(true);
    const [tasks, setTasks] = useState([]);
  console.log("task,", tasks)
    const [formData, setFormData] = useState({
        id: '',
        title: '',
        description: '',
        dueDate: '',
        priority: '',
        status: '',
      });
      const handleChange = (event) => {
        setFormData({
          ...formData,
          [event.target.name]: event.target.value,
        });
      }; 
      const handleSubmit = async() => {
        props.modalaction()
        if (formData.id) {
          // Update existing task
          const updatedTasks = tasks.map((task) =>
            task.id === formData.id ? formData : task
          );
          setTasks(updatedTasks);
          // update API call
        } else {
            console.log("from data",formData)
            await Post_All("http://localhost:8000/api/task", formData)
            .then((res) => {
              console.log("response: " + JSON.stringify(res));
              if(res.status !=200){
                // setSnackMsg({message:JSON.stringify(res.message),msgColor:"red"});
                // setOpen(true);
              }else{
                props.modalClose()
                // setSnackMsg({message:JSON.stringify(res.message),msgColor:"green"});
                // setOpen(true);
              }
            })
            .catch((error) => {
              console.log("error: " + error);
            });

        //   setTasks([...tasks, newTask]);
          // add API call
        }
    
        setFormData({
          id: '',
          title: '',
          description: '',
          dueDate: '',
          priority: '',
          status: '',
        });
      };

        // Function to handle dialog open
  const handleOpen = () => {
    setOpen(true);
  };

  // Function to handle dialog close
  const handleClose = () => {
    props.modalClose();
  };
  return (
    <>
    <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{props.title}</DialogTitle>
            <DialogContent>
         <Container maxWidth="md">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* create */}
        <Typography variant="h4" component="h1">
          Task Manager
        </Typography>
        <Box component="form" sx={{ mt: 2 }} onSubmit={handleSubmit}>
          <TextField
            required
            fullWidth
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
          /><br /><br />
          <TextField
            required
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          /><br /><br />
          <TextField
            required
            fullWidth
            label="Due Date"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          /><br /><br />
          <FormControl required fullWidth>
            <InputLabel id="Priority">Priority</InputLabel>

            <Select
              labelId="Priority"

              label="Priority"

              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </Select>
          </FormControl>
          <br /><br />
          <FormControl required fullWidth>
            <InputLabel id="Status">Status</InputLabel>
            <Select
              labelId="Status"

              label="Status"

              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="in progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>
          <br /><br />
        </Box>
        </Box>
        </Container>
        </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button  onClick={handleSubmit}>{formData.id ? 'Edit' : 'Save'}</Button>
            </DialogActions>
          </Dialog>
    </>
  )
}

export default AddTask