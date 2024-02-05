import React, { useMemo } from 'react';
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useSelector } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { themeSettings } from "theme";
import Layout from "scenes/layout";
import Dashboard from "scenes/dashboard";
import Overview from "scenes/overview";
import Grades from "scenes/grades";
import Content from "scenes/content";
import InstructorUsage from "scenes/instructor-usage";
import CourseContent from "scenes/instructor-usage";
import Login from "scenes/login/Login";  // Import the Login component

function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/login" replace />} />
            <Route path="login" element={<Login />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="overview" element={<Overview />} />
            <Route path="grades" element={<Grades />} />
            <Route path="content" element={<Content />} />
            <Route path="instructor-usage" element={<InstructorUsage />} />
            <Route path="course-content" element={<CourseContent />} />
            {/* Redirect to /dashboard if the path is not matched */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
