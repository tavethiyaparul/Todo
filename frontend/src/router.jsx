import { BrowserRouter, Route,Routes } from "react-router-dom";
import { React, useEffect, useState } from "react";
import Login from "./page/Login";
import RegistrationForm from "./page/RegistrationFrom";
import TaskList from "./page/TaskList";
import Navbar from "./components/Navbar";


// import { useNavigate ,Link} from "react-router-dom";

const Router = () => {
  // const navigate = useNavigate();
  // const[isChecked,setChecked] =useState()
  // if(document.cookie){
  //   setChecked(true)
  // }else{
  //   navigate("/")
  // }
  return (
    <>
   
      <BrowserRouter>
      <Navbar/>
      <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<RegistrationForm />} />
          <Route path="/task" element={<TaskList />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default Router;
