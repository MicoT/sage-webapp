import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  IconButton,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { ResponsiveBar } from "@nivo/bar";

const studentData = [
  {
    name: "John Smith",
    completion: 75,
  },
  {
    name: "Emma White",
    completion: 60,
  },
  {
    name: "Sarah Wilson",
    completion: 90,
  },
  {
    name: "Michael Johnson",
    completion: 40,
  },
  {
    name: "James Brown",
    completion: 85,
  },
  // Add more student data
];

const CompletionRatePage = () => {
  const [search, setSearch] = useState("");
  const filteredData = studentData.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box m="1.5rem 2.5rem">
      <Typography variant="h4">Student Completion Rate</Typography>
      <Paper elevation={3} style={{ padding: "20px", marginBottom: "20px" }}>
        <TextField
          fullWidth
          label="Search for a student"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            endAdornment: (
              <IconButton
                edge="end"
                color="primary"
                onClick={() => setSearch("")}
              >
                <SearchIcon />
              </IconButton>
            ),
          }}
        />
      </Paper>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box width="70%">
          <ResponsiveBar
            data={filteredData}
            keys={["completion"]}
            indexBy="name"
            margin={{ top: 20, right: 30, bottom: 60, left: 40 }}
            padding={0.3}
            layout="horizontal"
            colors={{ scheme: "nivo" }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Completion (%)",
              legendPosition: "middle",
              legendOffset: -40,
            }}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
          />
        </Box>
        <Box width="25%">
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student Name</TableCell>
                  <TableCell>Completion Rate (%)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((student, index) => (
                  <TableRow key={index}>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.completion}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default CompletionRatePage;
