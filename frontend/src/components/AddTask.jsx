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
  Snackbar,
  IconButton,
} from "@mui/material";
import { Get_All, Post_All } from "../basicfunction/allApiFunction";
import CloseIcon from "@mui/icons-material/Close";
const AddTask = (props) => {
  const [formData, setFormData] = useState({
    id: props.id ? props.id : "",
    title: "",
    description: "",
    duedate: "",
    priority: "",
    status: "",
  });

  const [formErrors, setFormErrors] = useState({
    title: "",
    duedate: "",
    priority: "",
    status: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // set snack msg
  const [snackMsg, setSnackMsg] = useState({
    message: "",
    msgColor: "",
  });
  // snackbar open close
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const action = (
    <div>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleCloseSnackbar}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </div>
  );

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
    setFormErrors({
      ...formErrors,
      [event.target.name]: "",
    });
  };

  const handleEvent = (event) => {
    setIsSubmitting(true);
  };
  const handleSubmit = async () => {
    await Post_All("/api/task", formData)
      .then((res) => {
        // console.log("response: " + JSON.stringify(res));
        if (res.status !== 200) {
          setSnackMsg({
            message: JSON.stringify(res.message),
            msgColor: "red",
          });
          setOpenSnackbar(true);
        } else {
          setSnackMsg({
            message: JSON.stringify(res.message),
            msgColor: "green",
          });
          setOpenSnackbar(true);
          props.modalClose();
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
          if (res.status !== 200) {
            setSnackMsg({
              message: JSON.stringify(res?.message),
              msgColor: "red",
            });
            setOpenSnackbar(true);
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
    const validateForm = () => {
      let errors = {};
      let isValid = true;

      // Title validation
      if (!formData.title.trim()) {
        errors.title = "Title is required";
        isValid = false;
      }

      // priority validation
      if (!formData.priority.trim()) {
        errors.priority = "Priority is required";
        isValid = false;
      }

      // Password validation
      if (!formData.duedate.trim()) {
        errors.duedate = "Due Date is required";
        isValid = false;
      }

      // Password validation
      if (!formData.status.trim()) {
        errors.status = "Status is required";
        isValid = false;
      }

      setFormErrors(errors);
      return isValid;
    };

    if (isSubmitting) {
      const isValid = validateForm();

      if (isValid) {
        handleSubmit();
      }

      setIsSubmitting(false);
    }
  }, [isSubmitting, formData]);
  useEffect(() => {
    getTaskId();
  }, []);

  return (
    <>
      <Dialog open={true} onClose={handleClose}>
        <DialogTitle>{props.title}</DialogTitle>
        <DialogContent>
          <Container maxWidth="md">
            {/* create */}
            <Box component="form" sx={{ mt: 2 }}>
              <TextField
                required
                autoFocus
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                error={!!formErrors.title}
                helperText={formErrors.title}
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
                error={!!formErrors.duedate}
                helperText={formErrors.duedate}
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
                  error={!!formErrors.priority}
                  helperText={formErrors.priority}
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
                  error={!!formErrors.status}
                  helperText={formErrors.status}
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
          <Button onClick={handleEvent}>{props?.id ? "Edit" : "Save"}</Button>
        </DialogActions>
        <Box>
          <div>
            <Snackbar
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
              open={openSnackbar}
              autoHideDuration={6000}
              onClose={handleCloseSnackbar}
              ContentProps={{
                sx: {
                  background: `${snackMsg.msgColor}`,
                },
              }}
              message={snackMsg.message}
              action={action}
            />
          </div>
        </Box>
      </Dialog>
    </>
  );
};

export default AddTask;
