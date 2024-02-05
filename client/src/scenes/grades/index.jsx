import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  Button,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";

const CourseDataPage = () => {
  const [courseData, setCourseData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [studentData, setStudentData] = useState([]);
  const [selectedCourseCode, setSelectedCourseCode] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingStudent, setLoadingStudent] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [completionStatus, setCompletionStatus] = useState({});
  const [completionStatusLoaded, setCompletionStatusLoaded] = useState(false);

  // Function to load course data either from cache or server
  const loadCourseData = async () => {
    setLoading(true);
    const cachedData = localStorage.getItem('courseData');
    if (cachedData) {
      setCourseData(JSON.parse(cachedData));
      setLoading(false);
    } else {
      try {
        const response = await axios.get("http://localhost:5000/api/coursedata");
        localStorage.setItem('courseData', JSON.stringify(response.data));
        setCourseData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching course data:", error);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadCourseData();
  }, []);

  // Function to load completion status either from cache or server
  const loadCompletionStatus = async (courses) => {
    const cachedStatus = localStorage.getItem('completionStatus');
    if (cachedStatus && JSON.parse(cachedStatus).length === courses.length) {
      setCompletionStatus(JSON.parse(cachedStatus));
      setCompletionStatusLoaded(true);
    } else {
      const statusTemp = {};
      await Promise.all(
        courses.map(async (course) => {
          try {
            const response = await axios.get(`http://localhost:5000/api/grade-final/byCourseCode/${course.Code}`);
            const allGraded = response.data.every(
              (student) => student["M1 Grade"] && student["M2 Grade"] && student["M3 Grade"]
            );
            statusTemp[course.Code] = allGraded ? "Complete" : "Incomplete";
          } catch (error) {
            console.error("Error fetching completion status:", error);
            statusTemp[course.Code] = "Incomplete";
          }
        })
      );
      localStorage.setItem('completionStatus', JSON.stringify(statusTemp));
      setCompletionStatus(statusTemp);
      setCompletionStatusLoaded(true);
    }
  };

  // Trigger loading completion status when course data is loaded
  useEffect(() => {
    if (courseData.length > 0 && !completionStatusLoaded) {
      loadCompletionStatus(courseData);
    }
  }, [courseData, completionStatusLoaded]);

  useEffect(() => {
    const filtered = courseData.filter(
      (course) =>
        course.Code.toLowerCase().includes(searchInput.toLowerCase()) ||
        course.Title.toLowerCase().includes(searchInput.toLowerCase())
    );
    setFilteredData(filtered);
    setPage(0);
  }, [searchInput, courseData]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleShowStudents = async (courseCode) => {
    setSelectedCourseCode(courseCode);
    setLoadingStudent(true);
    
    // Check for cached student data first
    const cachedStudentData = sessionStorage.getItem(`studentData-${courseCode}`);
    if (cachedStudentData) {
      setStudentData(JSON.parse(cachedStudentData));
      setLoadingStudent(false);
    } else {
      // If not in cache, fetch from server
      try {
        const response = await axios.get(`http://localhost:5000/api/grade-final/byCourseCode/${courseCode}`);
        sessionStorage.setItem(`studentData-${courseCode}`, JSON.stringify(response.data));
        setStudentData(response.data);
        setLoadingStudent(false);
      } catch (error) {
        console.error("Error fetching student data:", error);
        setLoadingStudent(false);
      }
    }
  };
  

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <Typography variant="h4" m="20px">
        Grade Post Status
      </Typography>
      <Typography variant="h6" m="20px">
        This features presents the M1, M2, and M3 grades of CCIS students based on the course, term, and year level.
      </Typography>
      <TextField
        fullWidth
        label="Search by Code or Title"
        variant="outlined"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        sx={{ mb: 2 }}
      />
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer sx={{ maxHeight: 500 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell>Code</TableCell>
                  <TableCell>Section</TableCell>
                  <TableCell>Mode</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Instructor</TableCell>
                  <TableCell>Show Students</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((data) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={data._id}>
                      <TableCell>{data.Code}</TableCell>
                      <TableCell>{data.Sec}</TableCell>
                      <TableCell>{data.Mode}</TableCell>
                      <TableCell>{data.Title}</TableCell>
                      <TableCell>{data.Instructor}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleShowStudents(data.Code)}
                        >
                          Show Students
                        </Button>
                      </TableCell>
                      <TableCell style={{ fontWeight: 'bold', color: completionStatus[data.Code] === 'Complete' ? 'green' : 'red' }}>
                        {completionStatus[data.Code]}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={filteredData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
      {selectedCourseCode && (
        loadingStudent ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer sx={{ maxHeight: 500, mt: 4 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell>Student Name</TableCell>
                  <TableCell>Course Name</TableCell>
                  <TableCell>Course Code</TableCell>
                  <TableCell>Program</TableCell>
                  <TableCell>Year Level</TableCell>
                  <TableCell>Term</TableCell>
                  <TableCell>M1 Grade</TableCell>
                  <TableCell>M2 Grade</TableCell>
                  <TableCell>M3 Grade</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {studentData.map((student) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={student._id}>
                    <TableCell>{student.STUDENTNAME}</TableCell>
                    <TableCell>{student.COURSENAME}</TableCell>
                    <TableCell>{student.COURSECODE}</TableCell>
                    <TableCell>{student.PROGRAM}</TableCell>
                    <TableCell>{student.YEARLEVEL}</TableCell>
                    <TableCell>{student.TERM}</TableCell>
                    <TableCell>{student["M1 Grade"]}</TableCell>
                    <TableCell>{student["M2 Grade"]}</TableCell>
                    <TableCell>{student["M3 Grade"]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )
      )}
    </Paper>
  );
};

export default CourseDataPage;
