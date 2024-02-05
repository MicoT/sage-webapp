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
  Box,
  Button,
  TablePagination,
  CircularProgress,
  Typography,
} from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Registering the chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StudentActivityTable = () => {
  const [activities, setActivities] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [expandedRows, setExpandedRows] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          "http://localhost:5000/api/student-activities"
        );
        setActivities(response.data);
      } catch (error) {
        console.error("Error fetching student activities", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const groupedActivities = activities.reduce((acc, activity) => {
    const key = activity.LAST_NAME + activity.FIRST_NAME;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(activity);
    return acc;
  }, {});

  const uniqueNames = Object.values(groupedActivities)
    .map((group) => group[0])
    .filter(
      (activity) =>
        activity.LAST_NAME.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.FIRST_NAME.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleExpandClick = (personId) => {
    setExpandedRows((prevExpandedRows) => ({
      ...prevExpandedRows,
      [personId]: !prevExpandedRows[personId],
    }));
  };

  const getChartData = (personId) => {
    const studentDetails =
      groupedActivities[
        activities.find((activity) => activity.PERSON_ID === personId)
          .LAST_NAME +
          activities.find((activity) => activity.PERSON_ID === personId)
            .FIRST_NAME
      ];

    if (!studentDetails) {
      return {
        labels: [],
        datasets: [],
      };
    }

    // Sorting student details by month (Ensure the month is treated as an integer for sorting)
    const sortedDetails = studentDetails.sort(
      (a, b) => parseInt(a.MONTH) - parseInt(b.MONTH)
    );

    const chartData = {
      labels: sortedDetails.map((detail) => `Month: ${detail.MONTH}`),
      datasets: [
        {
          label: "Duration in Minutes",
          data: sortedDetails.map((detail) => detail.DURATION_MINUTES),
          fill: false,
          backgroundColor: "rgb(75, 192, 192)",
          borderColor: "rgba(75, 192, 192, 0.2)",
        },
      ],
    };

    return chartData;
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" mb="10px">
        Students Usage Activity
      </Typography>
      <Typography variant="h6" mb="20px">
        This features presents the time CCIS students spent on using Blackboard
        during the school year 2022-2023. You can view each individual student's
        session times per month with a line graph visualization.
      </Typography>
      <TextField
        fullWidth
        label="Search by Last Name or First Name"
        variant="outlined"
        onChange={handleSearch}
        sx={{ marginBottom: 2 }}
      />
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "300px",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Last Name</TableCell>
                  <TableCell>First Name</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {uniqueNames
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((activity) => (
                    <React.Fragment key={activity.PERSON_ID}>
                      <TableRow>
                        <TableCell>{activity.LAST_NAME}</TableCell>
                        <TableCell>{activity.FIRST_NAME}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            onClick={() =>
                              handleExpandClick(activity.PERSON_ID)
                            }
                          >
                            {expandedRows[activity.PERSON_ID] ? "Hide" : "Show"}{" "}
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                      {expandedRows[activity.PERSON_ID] && (
                        <>
                          {groupedActivities[
                            activity.LAST_NAME + activity.FIRST_NAME
                          ].map((detail) => (
                            <TableRow key={detail.PERSON_ID + detail.MONTH}>
                              <TableCell />
                              <TableCell>Month: {detail.MONTH}</TableCell>
                              <TableCell>
                                Duration: {detail.DURATION_MINUTES}
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow>
                            <TableCell colSpan={3}>
                              <Line data={getChartData(activity.PERSON_ID)} />
                            </TableCell>
                          </TableRow>
                        </>
                      )}
                    </React.Fragment>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={uniqueNames.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
    </Box>
  );
};

export default StudentActivityTable;
