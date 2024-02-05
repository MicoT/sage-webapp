// ContentTable.js
import { format } from "date-fns";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  CircularProgress,
  Box,
  TablePagination,
  Typography,
  IconButton,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
const cache = {};
const ContentTable = () => {
  const [contents, setContents] = useState([]);
  const [filteredContents, setFilteredContents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      const cacheKey = "contentData";
      if (cache[cacheKey]) {
        console.log("Loading data from cache");
        setContents(cache[cacheKey]);
        setFilteredContents(cache[cacheKey]);
        setIsLoading(false);
      } else {
        setIsLoading(true);
        try {
          const response = await axios.get("http://localhost:5000/api/content");
          const groupedContent = groupContentByCourse(response.data);
          cache[cacheKey] = groupedContent; // Cache the data
          setContents(groupedContent);
          setFilteredContents(groupedContent);
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching data: ", error);
          setIsLoading(false);
        }
      }
    };
    fetchData();
  }, []);

  const groupContentByCourse = (data) => {
    const groupedContent = data.reduce((acc, content) => {
      const courseName = content.COURSE_NAME;
      if (!acc[courseName]) {
        acc[courseName] = [];
      }
      acc[courseName].push(content);
      return acc;
    }, {});

    return Object.keys(groupedContent).map((courseName) => {
      return {
        COURSE_NAME: courseName,
        CONTENTS: groupedContent[courseName],
        LAST_NAME: groupedContent[courseName][0].LAST_NAME,
        FIRST_NAME: groupedContent[courseName][0].FIRST_NAME,
        _id: groupedContent[courseName][0]._id,
      };
    });
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    const filteredData = contents.filter(
      (groupedItem) =>
        groupedItem.LAST_NAME.toLowerCase().includes(
          event.target.value.toLowerCase()
        ) ||
        groupedItem.FIRST_NAME.toLowerCase().includes(
          event.target.value.toLowerCase()
        )
    );
    setFilteredContents(filteredData);
    setPage(0);
  };

  const getMostRecentRowInserted = (contentsArray) => {
    const mostRecent = contentsArray.reduce((latest, content) => {
      const currentInsertedTime = new Date(content.ROW_INSERTED_TIME);
      return latest > currentInsertedTime ? latest : currentInsertedTime;
    }, new Date(0)); // Start from epoch time
    return mostRecent;
  };

  const handleClickOpen = (content) => {
    setDialogContent(content);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <Typography variant="h4" m="20px">
        Instructor Content
      </Typography>
      <Typography variant="h6" m="20px">
        This feature shows the content posting of each instructor in their
        respective courses as well as other activities they do in their
        Blackboard.
      </Typography>
      <Box sx={{ display: "flex", padding: 2 }}>
        <TextField
          fullWidth
          label="Search by Name"
          variant="outlined"
          onChange={handleSearch}
          value={searchTerm}
          InputProps={{
            endAdornment: (
              <IconButton>
                <SearchIcon />
              </IconButton>
            ),
          }}
        />
      </Box>
      <TableContainer component={Paper}>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <Typography marginRight="20px">Please Wait</Typography>
            <CircularProgress />
          </Box>
        ) : (
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>Last Name</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Course Name</TableCell>
                <TableCell>Most Recent Post</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {filteredContents
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((groupedItem) => {
                const mostRecentTime = getMostRecentRowInserted(groupedItem.CONTENTS);
                return (
                  <TableRow key={groupedItem._id.$oid}>
                    <TableCell>{groupedItem.LAST_NAME}</TableCell>
                    <TableCell>{groupedItem.FIRST_NAME}</TableCell>
                    <TableCell>{groupedItem.COURSE_NAME}</TableCell>
                    <TableCell>{format(mostRecentTime, "PPpp")}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleClickOpen(groupedItem)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
          </Table>
        )}
        {!isLoading && (
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={filteredContents.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </TableContainer>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Content Details</DialogTitle>
        <DialogContent>
          {dialogContent && (
            <DialogContentText>
              <Typography variant="h6" gutterBottom>
                Course Name: {dialogContent.COURSE_NAME}
              </Typography>
              {dialogContent.CONTENTS.map((content, index) => (
                <Box key={index} sx={{ marginBottom: 2 }}>
                  <Typography variant="body1">
                    Course Item Name: {content.COURSE_ITEM_NAME}
                  </Typography>
                  <Typography variant="body1">
                    Item Type: {content.ITEM_TYPE}
                  </Typography>
                  <Typography variant="body1">
                    Row Inserted Time: {content.ROW_INSERTED_TIME}
                  </Typography>
                </Box>
              ))}
            </DialogContentText>
          )}
        </DialogContent>
      </Dialog>
    </Paper>
  );
};

export default ContentTable;
