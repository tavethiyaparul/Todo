import React, { useEffect, useState } from 'react';
import { Box, Button, Container, Snackbar, TextField, Typography,IconButton, } from '@mui/material';
import { Post_All } from '../basicfunction/allApiFunction';
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
    // Clear the error when a value is entered
    setFormErrors({
      ...formErrors,
      [event.target.name]: '',
    });
  };

  // set snack msg
  const [snackMsg, setSnackMsg] = useState({
    message: "",
    msgColor: "",
  });
  // snackbar open close
  const [open, setOpen] = useState(false);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const action = (
    <div>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </div>
  );

  const handleEvent = (event) => {
    setIsSubmitting(true)
}

  const handleSubmit = async () => {
    await Post_All("/api/user/register", formData)
    .then((res) => {
      console.log("response: " + JSON.stringify(res));
      if(res.status !== 200){
        setSnackMsg({message:JSON.stringify(res.message),msgColor:"red"});
        setOpen(true);
      }else{
        setSnackMsg({message:JSON.stringify(res.message),msgColor:"green"});
        setOpen(true);
        navigate ("/task");
      }
    
    })
    .catch((error) => {
      console.log("error: " + error);
    });
  }
  
  useEffect(() => {
    const validateForm = () => {
      let errors = {};
      let isValid = true;

      // Name validation
      if (!formData.name.trim()) {
        errors.name = 'Name is required';
        isValid = false;
      }

      // Email validation
      if (!formData.email.trim()) {
        errors.email = 'Email is required';
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = 'Email is invalid';
        isValid = false;
      }

      // Password validation
      if (!formData.password.trim()) {
        errors.password = 'Password is required';
        isValid = false;
      } else if (formData.password.trim().length < 6) {
        errors.password = 'Password must be at least 6 characters long';
        isValid = false;
      }

      setFormErrors(errors);
      return isValid;
    };

    if (isSubmitting) {
      const isValid = validateForm();

      if (isValid) {
        handleSubmit()     
      }

      setIsSubmitting(false);
    }
  }, [isSubmitting, formData]);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" component="h1">
          Registration
        </Typography>
        <Box component="form" sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Name"
            name="name"
            onChange={handleChange}
            autoFocus
            error={!!formErrors.name}
            helperText={formErrors.name}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            type="email"
            onChange={handleChange}
            error={!!formErrors.email}
            helperText={formErrors.email}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="password"
            label="Password"
            name="password"
            type="password"
            onChange={handleChange}
            error={!!formErrors.password}
            helperText={formErrors.password}
          />
          <Button fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} onClick={()=>handleEvent()}>
            Sign Up
          </Button>
        </Box>
        <div>
          <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
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
    </Container>
  );
};

export default RegistrationForm;
