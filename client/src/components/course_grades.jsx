import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Grid, List, ListItem, ListItemText } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Papa from 'papaparse';

const App = () => {
  const [facultyData, setFacultyData] = useState([]);
  const [studentData, setStudentData] = useState([]);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const fetchCSVData = async () => {
      try {
        const facultyResponse = await fetch('/data/faculty.csv');
        const facultyCSV = await facultyResponse.text();
        const parsedFacultyData = Papa.parse(facultyCSV, { header: true }).data;
        setFacultyData(parsedFacultyData);

        const studentResponse = await fetch('/data/student.csv');
        const studentCSV = await studentResponse.text();
        const parsedStudentData = Papa.parse(studentCSV, { header: true }).data;
        setStudentData(parsedStudentData);
      } catch (error) {
        console.error('Error fetching CSV data:', error);
      }
    };

    fetchCSVData();
  }, []);

  const handleInstructorSelect = (instructor) => {
    setSelectedInstructor(instructor);
  };

  const filteredInstructors = facultyData.filter(
    (instructor) =>
      instructor.PERSON_NAME.toLowerCase().includes(searchValue.toLowerCase()) ||
      instructor.PERSON_EMAIL.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <Autocomplete
            options={filteredInstructors}
            getOptionLabel={(option) => option.PERSON_NAME}
            renderInput={(params) => <TextField {...params} label="Search Instructors" variant="outlined" />}
            onChange={(event, newValue) => setSearchValue(newValue ? newValue.PERSON_NAME : '')}
          />
          <List>
            {filteredInstructors.map((instructor) => (
              <ListItem button key={instructor.PERSON_NAME} onClick={() => handleInstructorSelect(instructor)}>
                <ListItemText primary={instructor.PERSON_NAME} />
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item xs={8}>
          <h2>Instructor Information</h2>
          {selectedInstructor && (
            <div>
              <p>Name: {selectedInstructor.PERSON_NAME}</p>
              <p>Email: {selectedInstructor.PERSON_EMAIL}</p>
              <p>Course: {selectedInstructor.COURSE_NAME}</p>
            </div>
          )}
          <h2>Students</h2>
          <List>
            {studentData
              .filter((student) => student.COURSE_NAME === (selectedInstructor?.COURSE_NAME || ''))
              .map((student) => (
                <ListItem key={student.PERSON_NAME}>
                  <ListItemText
                    primary={student.PERSON_NAME}
                    secondary={`Course: ${student.COURSE_NAME}, Grade: ${student.SCORE}`}
                  />
                </ListItem>
              ))}
          </List>
        </Grid>
      </Grid>
    </Container>
  );
};

export default App;
