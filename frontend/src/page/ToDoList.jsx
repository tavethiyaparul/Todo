import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
 
} from "@mui/material";
import AddTask from "../components/AddTask";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  console.log("task,", tasks);
 
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    dueDate: "",
    priority: "",
    status: "",
  });
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [filterStatus, setFilterStatus] = useState("All Status");

  const handleDelete = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));

    // delete API call
  };

  const handleEdit = (taskId) => {
    const taskToEdit = tasks.find((task) => task.id === taskId);
    if (taskToEdit) {
      setFormData(taskToEdit);
    }
  };

  // sort
  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // filter
  const handleFilter = (event) => {
    console.log("event", event.target.value);
    setFilterStatus(event.target.value);
  };

  const sortedTasks = sortColumn
    ? [...tasks].sort((a, b) => {
        if (sortColumn === "dueDate") {
          return sortDirection === "asc"
            ? new Date(a[sortColumn]) - new Date(b[sortColumn])
            : new Date(b[sortColumn]) - new Date(a[sortColumn]);
        } else {
          return sortDirection === "asc"
            ? a[sortColumn].localeCompare(b[sortColumn])
            : b[sortColumn].localeCompare(a[sortColumn]);
        }
      })
    : tasks;

  const filteredTasks =
    filterStatus && filterStatus !== "All Status"
      ? sortedTasks.filter((task) => task.status === filterStatus)
      : sortedTasks;

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div>
          <Button onClick={()=>setOpenDialog(true)}>Add Task</Button>
        </div>

        {/* display  */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" component="h2">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <p> Task List</p>
              <Box sx={{ mt: 2 }}>
                <FormControl fullWidth>
                  <InputLabel id="Status">Status</InputLabel>

                  <InputLabel id="staus-filter">Status Filter</InputLabel>
                  <Select
                    labelId="staus-filter"
                    placeholder="select value"
                    label="staus-filter"
                    value={filterStatus}
                    onChange={handleFilter}
                  >
                    <MenuItem value="All Status">All Status</MenuItem>
                    <MenuItem value="Not Started">Not Started</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </div>
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell onClick={() => handleSort("title")}>
                    Title
                  </TableCell>
                  <TableCell onClick={() => handleSort("description")}>
                    Description
                  </TableCell>
                  <TableCell onClick={() => handleSort("dueDate")}>
                    Due Date
                  </TableCell>
                  <TableCell onClick={() => handleSort("priority")}>
                    Priority
                  </TableCell>
                  <TableCell onClick={() => handleSort("status")}>
                    Status
                  </TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>{task.title}</TableCell>
                    <TableCell>{task.description}</TableCell>
                    <TableCell>{task.dueDate}</TableCell>
                    <TableCell>{task.priority}</TableCell>
                    <TableCell>{task.status}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        onClick={() => handleEdit(task.id)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => handleDelete(task.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
      <Box>
      {openDialog &&(
        <AddTask 
             modalClose={() => {
                  setOpenDialog(false);
                }}
                modalaction={() => {
                  setOpenDialog(false);
                }}
                title="Add Task"
                id=""
        />)
      }
      </Box>
    </Container>
  );
};

export default App;
