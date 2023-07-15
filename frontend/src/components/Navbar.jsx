import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import React from "react";
import { Post_All } from "../basicfunction/allApiFunction";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    await Post_All("/api/user/logout")
      .then((res) => {
        if (res.status != 200) {
          console.log("Error", res.message);
        } else {
          navigate("/");
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
    </>
  );
};

export default Navbar;
