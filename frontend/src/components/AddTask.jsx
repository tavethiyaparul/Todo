import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Get_All, Post_All } from "../basicfunction/allApiFunction";

const AddTask = (props) => {
  console.log("props", props);
  const [open, setOpen] = useState(true);
  const [tasks, setTasks] = useState([]);

  const [formData, setFormData] = useState({
    id: props.id ? props.id : "",
    title: "",
    description: "",
    duedate: "",
    priority: "",
    status: "",
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };
  const handleSubmit = async () => {
    props.modalaction();
    console.log("from data", formData);
    await Post_All("/api/task", formData)
      .then((res) => {
        console.log("response: " + JSON.stringify(res));
        if (res.status != 200) {
          // setSnackMsg({message:JSON.stringify(res.message),msgColor:"red"});
          // setOpen(true);
        } else {
          props.modalClose();
          // setSnackMsg({message:JSON.stringify(res.message),msgColor:"green"});
          // setOpen(true);
        }
      })
      .catch((error) => {
        console.log("error: " + error);
      });

    setFormData({
      id: "",
      title: "",
      description: "",
      duedate: "",
      priority: "",
      status: "",
    });
  };

  // Function to handle dialog close
  const handleClose = () => {
    props.modalClose();
  };

  const getTaskId = async () => {
    if (props.id) {
      await Get_All(`/api/task/${props.id}`)
        .then((res) => {
          // console.log("response: " + JSON.stringify(res));
          if (res.status != 200) {
            // setSnackMsg({
            //   message: JSON.stringify(res?.message),
            //   msgColor: "red",
            // });
            // setOpen(true);
          } else {
            setFormData({
              id: props?.id ?? "",
              title: res?.task?.title ?? "",
              description: res?.task?.description ?? "",
              duedate:
                new Date(res?.task?.duedate).toISOString().split("T")[0] ?? "",
              priority: res?.task?.priority ?? "",
              status: res?.task?.status ?? "",
            });
          }
        })
        .catch((error) => {
          console.log("error: " + error);
        });
    }
  };

  useEffect(() => {
    getTaskId();
  }, []);

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{props.title}</DialogTitle>
        <DialogContent>
          <Container maxWidth="md">
            {/* create */}
            <Box component="form" sx={{ mt: 2 }} onSubmit={handleSubmit}>
              <TextField
                required
                autoFocus
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
              <br />
              <br />
              <TextField
                required
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
              <br />
              <br />
              <TextField
                required
                fullWidth
                label="Due Date"
                name="duedate"
                type="date"
                value={formData.duedate}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  min: new Date().toISOString().split("T")[0],
                }}
              />
              <br />
              <br />
              <FormControl required fullWidth>
                <InputLabel id="Priority">Priority</InputLabel>

                <Select
                  labelId="Priority"
                  label="Priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <MenuItem value="3">Low</MenuItem>
                  <MenuItem value="2">Medium</MenuItem>
                  <MenuItem value="1">High</MenuItem>
                </Select>
              </FormControl>
              <br />
              <br />
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
              <br />
              <br />
            </Box>
          </Container>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>
            {formData.id ? "Edit" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddTask;
