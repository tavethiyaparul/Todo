import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Container,
  MenuItem,
  CircularProgress,
  Snackbar,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  Box,
  Typography,
} from "@mui/material";
import AddTask from "../components/AddTask";
import { Delete_All, Get_All } from "../basicfunction/allApiFunction";
import { Delete, Edit } from "@mui/icons-material";

const TaskList = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [task, setTask] = useState([]);
  const [editId, setEditId] = useState("");
  const [status, setStatus] = useState("");
  const [loader, setLoader] = useState(false);
  const [sort, setSort] = useState("");
  const [priority, setPriority] = useState("");

  //pagination
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [resultCount, setResultCount] = useState();

  //delete referece
  const [refDelete, setRefDelete] = useState(false);

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

  const columns = [
    { field: "title", headerName: "Title", width: 200 },
    { field: "description", headerName: "Description", width: 500 },
    { field: "priority", headerName: "Priority", width: 180 },
    { field: "status", headerName: "Status", width: 180 },
    { field: "duedate", headerName: "Due Date", width: 180 },
    {
      field: "actions",
      //   flex: 1,
      headerName: "Edit",
      minWidth: 30,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return <Edit onClick={(e) => editTask(e, params)} />;
      },
    },

    {
      field: "delete",
      //   flex: 1,
      headerName: "Delete",
      minWidth: 30,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return <Delete onClick={(e) => deleteTask(e, params.id)} />;
      },
    },
  ];

  const editTask = (e, params) => {
    e.stopPropagation();
    setEditId(params.id);
    setOpenDialog(true);
  };

  const deleteTask = async (e, id) => {
    e.stopPropagation();
    console.log("id", id);
    await Delete_All(`/api/task/${id}`)
      .then((res) => {
        if (res.status !== 200) {
          setSnackMsg({
            message: JSON.stringify(res?.message),
            msgColor: "red",
          });
          setOpen(true);
        } else {
          setRefDelete(true);
          setSnackMsg({
            message: JSON.stringify(res?.message),
            msgColor: "green",
          });
          setOpen(true);
        }
      })
      .catch((error) => {
        console.log("error: " + error);
      });
  };

  const getUsertask = async () => {
    setLoader(true);
    let addQuery = "";
    if (status) {
      addQuery = addQuery + `&status=${status}`;
    }

    if (sort) {
      addQuery = addQuery + `&sortkey=duedate&sortorder=${sort}`;
    }

    if (priority) {
      addQuery = addQuery + `&sortkey=priority&sortorder=${priority}`;
    }

    await Get_All(`/api/task?page=${page}&resultPerPage=${pageSize}${addQuery}`)
      .then((res) => {
        // console.log("response: " + JSON.stringify(res));
        setLoader(false);
        if (res.status !== 200) {
          setSnackMsg({
            message: JSON.stringify(res?.message),
            msgColor: "red",
          });
          setOpen(true);
        } else {
          setTask(res?.task);
          setResultCount(res?.taskCount);
        }
      })
      .catch((error) => {
        console.log("error: " + error);
        setLoader(false);
      });
  };

  const rows = [];
  task &&
    task.length > 0 &&
    task.map((item) =>
      rows.push({
        id: item?._id,
        title: item?.title?.charAt(0).toUpperCase() + item?.title?.slice(1) ?? "",
        description: item?.description?.charAt(0).toUpperCase() + item?.description?.slice(1) ?? "",
        priority:
          item?.priority === 1
            ? "High"
            : item?.priority === 2
            ? "Medium"
            : item?.priority === 3
            ? "Low"
            : "",
        status: item?.status?.charAt(0).toUpperCase() + item?.status?.slice(1) ?? "",
        duedate: new Date(item?.duedate).toLocaleDateString(),
      })
    );

  useEffect(() => {
    getUsertask()
  },[page,pageSize,openDialog, refDelete, status, sort,priority]);

  return (
    <>
      <Container maxWidth="lg  ">
        <>
          <Box
            sx={{
              marginTop: 5,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="h4" component="h1">
              ToDo List
            </Typography>
            <Box>
              <Button
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={() => {
                  setOpenDialog(true);
                  setEditId("");
                }}
              >
                Add Task
              </Button>
              <FormControl
                sx={{ mt: 3, mb: 2, ml: 2, minWidth: 120 }}
                size="small"
              >
                <InputLabel id="Status">Status</InputLabel>
                <Select
                  labelId="Status"
                  label="Status"
                  name="status"
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                  }}
                >
                  <MenuItem value="">
                    <em>All</em>
                  </MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="in progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>
              <FormControl
                sx={{ mt: 3, mb: 2, ml: 2, minWidth: 120 }}
                size="small"
              >
                <InputLabel id="Due Date">Due Date</InputLabel>
                <Select
                  labelId="Due Date"
                  label="Due Date"
                  name="sort"
                  value={sort}
                  onChange={(e) => {
                    setPriority("")
                    setPage(1)
                    setSort(e.target.value);
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="asc">Ascending</MenuItem>
                  <MenuItem value="desc">Descending</MenuItem>
                </Select>
              </FormControl>
              <FormControl
                sx={{ mt: 3, mb: 2, ml: 2, minWidth: 120 }}
                size="small"
              >
                <InputLabel id="Priority">Priority</InputLabel>
                <Select
                  labelId="Priority"
                  label="Priority"
                  name="priority"
                  value={priority}
                  onChange={(e) => {
                    setSort("")
                    setPage(1)
                    setPriority(e.target.value);
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="asc">Ascending</MenuItem>
                  <MenuItem value="desc">Descending</MenuItem>
                </Select>
              </FormControl>
            </Box>
            {loader ? (
              <Box
                style={{
                  height: "50vh",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CircularProgress />
              </Box>
            ) : (

             
              <div style={{ height: 450, width: "100%" }}>
              <DataGrid	
                  rows={rows}	
                  columns={columns}	
                  pagination	
                  rowsPerPageOptions={[]}	
                  page={page == 0 ? 0: page - 1}	
                  paginationMode="server"	
                  pageSize={pageSize}	
                  onPageChange={(newPage) => {	
                    setPage(newPage + 1);	
                  }}	
                  onPageSizeChange={(newPageSize) =>	
                    setPageSize(newPageSize)	
                  }	
                  disableColumnMenu={true}	
                  hideFooterSelectedRowCount={true}	
                
                  rowCount={resultCount ?? 0}	
              
                />
              </div>
            )}
          </Box>
          <div>
            {openDialog && (
              <AddTask
                modalClose={() => {
                  setOpenDialog(false);
                }}
                title="Add Task"
                id={editId ? editId : ""}
              />
            )}
          </div>
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
        </>
      </Container>
    </>
  );
};

export default TaskList;
