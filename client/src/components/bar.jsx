// BarChart.js
import React from "react";
import { ResponsiveBar } from "@nivo/bar";

const BarChart = ({ students }) => {
  const data = students.map((student) => ({
    student: student.name,
    module1: student.modules[0].passingRate,
    module2: student.modules[1].passingRate,
    module3: student.modules[2].passingRate,
  }));

  return (
    <div style={{ height: "400px" }}>
      <ResponsiveBar
        data={data}
        keys={["module1", "module2", "module3"]}
        indexBy="student"
        margin={{ top: 10, right: 30, bottom: 50, left: 60 }}
        padding={0.3}
        groupMode="stacked"
        layout="vertical"
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
        }}
      />
    </div>
  );
};

export default BarChart;
