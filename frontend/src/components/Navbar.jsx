import {
  AppBar,
  Button,
  IconButton,
  Snackbar,
  Toolbar,
  Typography,
  Box,
} from "@mui/material";
import React, { useState } from "react";
import { Post_All } from "../basicfunction/allApiFunction";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";

const Navbar = () => {
  const navigate = useNavigate();

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

  const handleLogout = async () => {
    await Post_All("/api/user/logout")
      .then((res) => {
        if (res.status !== 200) {
          setSnackMsg({
            message: JSON.stringify(res.message),
            msgColor: "red",
          });
          setOpen(true);
        } else {
          navigate("/");
          setSnackMsg({
            message: JSON.stringify(res.message),
            msgColor: "green",
          });
          setOpen(true);
        }
      })
      .catch((error) => {
        console.log("error: " + error);
      });
  };
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <img
            src="https://www.clipartmax.com/png/middle/31-315703_512-x-512-do-list-icon-png.png"
            alt="Logo"
            style={{ marginRight: "10px", width: "80px" }}
          />
          <Typography variant="h6" sx={{ flexGrow: 1 }}></Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Box>
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
    </>
  );
};

export default Navbar;
