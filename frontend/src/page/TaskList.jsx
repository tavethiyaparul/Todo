import React, { useEffect, useState } from "react";
import { DataGrid, GridDeleteIcon } from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";
import Skeleton from "@mui/material/Skeleton";
import {
  Button,
  Container,
  MenuItem,
  Grid,
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

  //pagination
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
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
    // { field: "id", headerName: "ID", minWidth: 120, flex:0 },
    { field: "title", headerName: "Title", width: 150 },
    { field: "description", headerName: "Description", width: 200 },
    { field: "priority", headerName: "Priority", width: 120 },
    { field: "status", headerName: "Status", width: 120 },
    { field: "duedate", headerName: "Due Date", width: 150 },
    {
      field: "actions",
      flex: 1,
      headerName: "Actions",
      minWidth: 30,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return <Edit onClick={(e) => editTask(e, params)} />;
      },
    },

    {
      field: "delete",
      flex: 1,
      headerName: "Delete",
      minWidth: 30,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return <Delete onClick={(e) => deleteTask(e, params.id)} />;
      },
    },
  ];

  const handlePageChange = (params) => {
    setPage(params.page);
  };

  const handlePageSizeChange = (params) => {
    setPage(0);
    setPageSize(params.pageSize);
  };

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
        if (res.status != 200) {
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
    await Get_All(`/api/task?page=${page}&resultPerPage=${pageSize}${addQuery}`)
      .then((res) => {
        // console.log("response: " + JSON.stringify(res));
        setLoader(false);
        if (res.status != 200) {
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

  const handleSortModelChange = async (sortModel) => {
    // Call the API to fetch sorted data based on sortModel
    // Pass the sort model to your API endpoint to perform server-side sorting

    // Example API call
    await Get_All(
      `/api/task?sortkey=${sortModel[0]?.field}&sortorder=${sortModel[0]?.sort}`
    )
      .then((data) => {
        setTask(data.task);
        // Set the sorted data in your component state or update your data source
      })
      .catch((error) => {
        // Handle error
      });
  };

  const rows = [];
  task &&
    task.length > 0 &&
    task.map((item) =>
      rows.push({
        id: item?._id,
        title: item?.title ?? "",
        description: item?.description ?? "",
        priority:
          item?.priority === 1
            ? "high"
            : item?.priority === 2
            ? "medium"
            : item?.priority === 3
            ? "low"
            : "",
        status: item?.status ?? "",
        duedate: new Date(item?.duedate).toLocaleDateString(),
      })
    );

  useEffect(() => {
    getUsertask();
  }, [openDialog, refDelete, status]);

  return (
    <>
      <Container maxWidth="lg  ">
        {loader ? (
          <Box>
            <Skeleton />
            <Skeleton animation="wave" />
            <Skeleton animation={true} />
          </Box>
        ) : (
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
                  onClick={() => setOpenDialog(true)}
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
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="in progress">In Progress</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <div style={{ height: 450, width: "100%" }}>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  onSortMode={handleSortModelChange}
                  pagination
                  page={page}
                  pageSize={pageSize}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                  rowCount={resultCount ?? 0}
                  // getRowHeight={() => "auto"}
                  // rowHeight={80}
                />
              </div>
              <div>
                {openDialog && (
                  <AddTask
                    modalClose={() => {
                      setOpenDialog(false);
                    }}
                    modalaction={() => {
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
            </Box>
          </>
        )}
      </Container>
    </>
  );
};

export default TaskList;
