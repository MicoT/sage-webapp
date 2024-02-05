import FlexBetween from "components/FlexBetween";
import Header from "components/Header";
import GaugeChart from "react-gauge-chart";
import React, { useState, useEffect } from "react"; // Import useState hook
import Select from "@mui/material/Select"; // Import Select component
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import {
  Box,
  Typography,
  useMediaQuery,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import StatBox from "components/StatBox";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const [selectedYear, setSelectedYear] = useState("1st Year");
  const [passFailData, setPassFailData] = useState([]);
  const [lineGraphData, setLineGraphData] = useState({
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [],
  });
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/student-instructor")
      .then((response) => {
        const fetchedData = response.data;
        processLineGraphData(fetchedData);
      })
      .catch((error) => {
        console.error("Error fetching student-instructor data: ", error);
      });
  }, []);

  const processLineGraphData = (data) => {
    const programData = data.reduce((acc, item) => {
      const program = item.PROGRAM;
      if (!acc[program]) {
        acc[program] = { total: 0, counts: Array(12).fill(0) };
      }
      acc[program].total++;
      // Loop through each month and add the value to the corresponding month
      for (let i = 1; i <= 12; i++) {
        acc[program].counts[i - 1] += item[`MONTH_${i}`];
      }
      return acc;
    }, {});

    // Calculate average for each month for each program
    const datasets = Object.keys(programData).map((program, idx) => {
      const color = `rgba(${150 + idx * 30}, ${100 + idx * 25}, ${
        200 - idx * 20
      }, 0.5)`; // Generate a color for each dataset
      const label =
        program === "CCIS" ? "CCIS INSTRUCTORS" : `${program} Program`; // If program is CCIS, use "CCIS INSTRUCTORS" as label
      return {
        label: label,
        data: programData[program].counts.map(
          (count) => count / programData[program].total
        ),
        fill: false,
        borderColor: color,
        tension: 0.1,
      };
    });

    setLineGraphData((prevData) => ({
      ...prevData,
      datasets,
    }));
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/grade-final")
      .then((response) => {
        const fetchedData = response.data;
        processGradesData(fetchedData);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, [selectedYear]);

  const data = [
    { id: "CS", value: 209 }, // Replace with actual number of CS students
    { id: "IS", value: 74 }, // Replace with actual number of IS students
    { id: "EMC", value: 60 }, // Replace with actual number of EMC students
  ];
  const renderTableRows = () => {
    return passFailData.map((data) => (
      <TableRow key={data.courseCode}>
        <TableCell>{data.courseCode}</TableCell>
        <TableCell>{data.passPercent.toFixed(2)}%</TableCell>
        <TableCell>{data.failPercent.toFixed(2)}%</TableCell>
      </TableRow>
    ));
  };

  const programData = {
    CS: {
      "1st Year": 89.24,
      "2nd Year": 92.29,
      "3rd Year": 95.48,
      "4th Year": 100,
    },
    EMC: {
      "1st Year": 93.93,
      "2nd Year": 94.47,
      "3rd Year": 93.33,
      "4th Year": 66.67,
    },
    IS: {
      "1st Year": 94.96,
      "2nd Year": 94.56,
      "3rd Year": 97.52,
      "4th Year": 100,
    },
  };

  const gaugeData = [
    { id: "CS", value: programData.CS[selectedYear] / 100, color: "#85cd50" },
    { id: "IS", value: programData.IS[selectedYear] / 100, color: "#ff7043" },
    { id: "EMC", value: programData.EMC[selectedYear] / 100, color: "#ffc658" },
  ];

  const totalStudents = data.reduce((total, course) => total + course.value, 0);

  const pieData = {
    labels: data.map((course) => course.id),
    datasets: [
      {
        label: "Number of Students",
        data: data.map((course) => (course.value / totalStudents) * 100), // Convert to percentage
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
        ],
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: "white", // Change legend labels to white
        },
      },
    },
  };

  const baroptions = {
    indexAxis: 'x', // Changed from 'y' to 'x' to switch to vertical bars
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: 'white', // Keep legend labels white
        },
      },
    },
    scales: {
      y: {
        ticks: {
          color: 'white', // Keep y-axis labels white
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)', // Optional: change grid line colors
        },
      },
      x: {
        ticks: {
          color: 'white', // Keep x-axis labels white
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)', // Optional: change grid line colors
        },
      },
    },
  };
  
  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "white", // Change legend labels to white
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "white", // Change x-axis labels to white
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)", // Optional: change grid line colors
        },
      },
      y: {
        ticks: {
          color: "white", // Change y-axis labels to white
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)", // Optional: change grid line colors
        },
      },
    },
  };
  const processGradesData = (grades) => {
    const results = grades.reduce((acc, grade) => {
      if (grade.YEARLEVEL === selectedYear && grade.COURSECODE) {
        const key = grade.COURSECODE;
        const passCondition = [
          "1",
          "1.25",
          "1.5",
          "1.75",
          "2",
          "2.25",
          "2.5",
          "2.75",
          "3",
          "P",
        ];
        const failCondition = ["INC", "IP", "ABS", "F", "C"];
        if (!acc[key]) {
          acc[key] = { pass: 0, fail: 0, total: 0 };
        }
        acc[key].total++;
        if (
          passCondition.includes(grade["M1 Grade"]) &&
          passCondition.includes(grade["M2 Grade"]) &&
          passCondition.includes(grade["M3 Grade"])
        ) {
          acc[key].pass++;
        } else if (
          failCondition.some(
            (cond) =>
              grade["M1 Grade"] === cond ||
              grade["M2 Grade"] === cond ||
              grade["M3 Grade"] === cond
          )
        ) {
          acc[key].fail++;
        }
      }
      return acc;
    }, {});

    // Convert counts to percentages and update state
    const processedData = Object.keys(results).map((key) => {
      const passPercent = (results[key].pass / results[key].total) * 100;
      const failPercent = 100 - passPercent; // Calculate failPercent as the remaining percentage
      return {
        courseCode: key,
        total: results[key].total,
        passPercent: passPercent,
        failPercent: failPercent,
      };
    });

    setPassFailData(processedData);
  };

  // Bar chart data based on processed data
  const barChartData = {
    labels: passFailData.map((item) => item.courseCode),
    datasets: [
      {
        label: 'Pass',
        data: passFailData.map((item) => item.passPercent),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Fail',
        data: passFailData.map((item) => item.failPercent),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };
  

  const yearLevelSelector = (
    <Select
      value={selectedYear}
      onChange={(e) => setSelectedYear(e.target.value)}
      displayEmpty
      inputProps={{ "aria-label": "Without label" }}
    >
      <MenuItem value="1st Year">1st Year 2022-2023</MenuItem>
      <MenuItem value="2nd Year">2nd Year 2022-2023</MenuItem>
      <MenuItem value="3rd Year">3rd Year 2022-2023</MenuItem>
      <MenuItem value="4th Year">4th Year 2022-2023</MenuItem>
    </Select>
  );
  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
        <Header title="DASHBOARD" subtitle="Welcome to the CCIS Dashboard" />
        <Box>
          {/* <Button
            sx={{
              backgroundColor: theme.palette.secondary.light,
              color: theme.palette.background.alt,
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            Download Reports
          </Button> */}
        </Box>
      </FlexBetween>
      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns="repeat(6, 2fr)"
        gridAutoRows="160px"
        gap="20px"
        sx={{
          "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" },
        }}
        paddingBottom="10px"
      >
        <StatBox
          title="Computer Science"
          value={data[0].value}
          description="Students"
        />
        <StatBox
          title="Information System"
          value={data[1].value}
          description="Students"
        />
        <StatBox
          title="Entertainment Multimedia Computing"
          value={data[2].value}
          description="Students"
        />
      </Box>
      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns="repeat(3, 2fr)"
        gridAutoRows="350px"
        gap="20px"
        sx={{
          "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" },
        }}
        padding="10px"
        backgroundColor="black"
        borderRadius="20px"
      >
        <Typography variant="body1" component="p">
          <Box component="span" fontWeight="bold">
            Population Count
          </Box>
          <Box component="span">
            &nbsp;— The population count, red represents CS students, blue
            represents IS students, and yellow represents EMC students. The
            population count is based on the total population of students per
            year level and program during the school year 2022-2023.
          </Box>
        </Typography>

        <Box
          sx={{
            height: 380,
            width: "100%",
            marginLeft: "10px",
            padding: "20px",
          }}
        >
          <Doughnut data={pieData} options={doughnutOptions} />
        </Box>
      </Box>
      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns="repeat(3, 4fr)"
        gap="10px"
        backgroundColor="black"
        borderRadius="20px"
        padding="10px"
      >
        <Typography variant="h6" component="p" fontWeight="bold">
          Passing Rate Per Year Level
        </Typography>
        <Typography variant="h6" component="p" marginBottom="20px">
          The passing rates for each year level was calculated based on the
          number of students who successfully passed their courses compared to
          the total number of students in that year level. The passing rates for
          specific courses within each year level was calculated, and then these
          rates were aggregated to determine the overall passing rate for the
          entire year level.
        </Typography>
        <Typography></Typography>
        {gaugeData.map((data) => (
          <Box
            key={data.id}
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <Typography variant="h5" component="p" sx={{ mb: 1 }}>
              {data.id} Program
            </Typography>
            <GaugeChart
              id={`${data.id}-gauge-chart`}
              nrOfLevels={1}
              colors={[data.color]}
              arcWidth={0.1}
              percent={data.value}
              animate={false}
            />
            <Typography variant="h6" component="p">
              {data.value * 100}%
            </Typography>
          </Box>
        ))}
        <Box>
          <Typography variant="h6" component="p" sx={{ mb: 2 }}>
            Select Year
          </Typography>
          <Select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
          >
            <MenuItem value="1st Year">1st Year 2022-2023</MenuItem>
            <MenuItem value="2nd Year">2nd Year 2022-2023</MenuItem>
            <MenuItem value="3rd Year">3rd Year 2022-2023</MenuItem>
            <MenuItem value="4th Year">4th Year 2022-2023</MenuItem>
          </Select>
        </Box>
      </Box>
      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns="repeat(1fr, 60px)"
        gap="100px"
        backgroundColor="black"
        borderRadius="20px"
        padding="20px"
      >
        <Box sx={{ height: "100%", width: "auto", mt: 4, overflowY: "auto" }}>
          <Typography variant="h6" component="p" fontWeight="bold">
            Student Performance Per Course
          </Typography>
          <Typography variant="h6" component="p" marginBottom="20px">
            The Student Performance per course was calculated by determining the
            total number of students that passed the course divided by the total
            number of students in that subject, and multiplying the result by
            100.
          </Typography>
          <Bar data={barChartData} options={baroptions} />
          
        </Box>
          {/* <TableContainer component={Paper} sx={{ height: '40%', width: '100%', }}>
          <Table aria-label="pass fail table">
            <TableHead>
              <TableRow>
                <TableCell>Course Code</TableCell>
                <TableCell>Pass %</TableCell>
                <TableCell>Fail %</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{renderTableRows()}</TableBody>
          </Table>
        </TableContainer> */}
        {yearLevelSelector}
      </Box>
      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns="repeat(1, 1fr)"
        gap="100px"
        backgroundColor="black"
        borderRadius="20px"
        padding="30px"
        marginBottom="10px"
      >
        <Box sx={{ height: "100%", width: "90%" }}>
          <Typography variant="h6" component="p" fontWeight="bold">
            Student and Instructor Engagement
          </Typography>
          <Typography variant="h6" component="p" marginBottom="20px">
          The Line graph showcases the usage activity of the students and instructors during the school year 2022-2023. The duration of their Blackboard can be seen in terms of months.
          </Typography>
          <Line options={lineOptions} data={lineGraphData} />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
