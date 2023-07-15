import { BrowserRouter, Route,Routes } from "react-router-dom";
import { React, useEffect, useState } from "react";
import Login from "./page/Login";
import RegistrationForm from "./page/RegistrationFrom";
import ToDoList from "./page/ToDoList";
import AddTask from "./components/AddTask";


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
      <Routes>
        {/* <Route element={<PersistentDrawer />}> */}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<RegistrationForm />} />
          <Route path="/task" element={<ToDoList />} />
          <Route path="/add" element={<AddTask />} />
        {/* </Route> */}
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default Router;
