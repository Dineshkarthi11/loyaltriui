import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Label,
  Tooltip,
} from "recharts";

const COLORS = [
  "#349C5E",
  "#C82920",
  "#E68E02",
  "#2980BB",
  "#B736DC",
  "#365DE0",
];

const CustomLegend = ({ data }) => {
  return (
    <div className="flex justify-around gap-3 items-center w-[290px] mx-auto mb-2">
      {data.map((entry, index) => (
        <div
          key={`item-${index}`}
          style={{
            display: "inline-block",
            margin: "0 10px",
            // transform: "translate(0, -30%)",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: "10px",
              height: "10px",
              backgroundColor: COLORS[index % COLORS.length],
              marginRight: "5px",
              borderRadius: "50%",
            }}
          />
          <span className="para !font-normal">{entry.name}</span>

          <p>
            <span className="h2">{entry.value}</span>{" "}
            <span className="pblack !text-primary">
              {entry.value > 1 ? "Employees" : "Employee"}
            </span>
          </p>
          <p>
            <span
              className="para font-normal"
              style={{ color: COLORS[index % COLORS.length] }}
            >
              {entry.percentage}%
            </span>
            <span className="para !font-normal ml-0.5">
              {entry.name == "Present" ? "attendance" : "absent"}
            </span>
          </p>
        </div>
      ))}
    </div>
  );
};
export const HalfPieChart = ({ dataArray = [] }) => {
  const data = [
    {
      name: "Present",
      value: dataArray.result?.present,
      percentage: (
        (dataArray.result?.present / dataArray.result?.totalEmployees) *
        100
      ).toFixed(2),
    },
    {
      name: "Absent",
      value: dataArray.result?.absent,
      percentage: (
        (dataArray.result?.absent / dataArray.result?.totalEmployees) *
        100
      ).toFixed(2),
    },
  ];
  // Example Array
  // const data = [
  //   { name: "Present", value: 400, percentage: 90 },
  //   { name: "Absent", value: 50, percentage: 10 },
  // ];
  const theme = useSelector((state) => state.layout.mode);
  // console.log(dataArray);
  const getTotalSources = () => {
    let total = 0;
    data.forEach((item) => (total += item.value));
    return total;
  };
  const totalSources = getTotalSources();
  const renderCustomLabel = (props) => {
    const { cx, cy } = props;
    return (
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="middle"
        className="-translate-y-10"
      >
        <tspan
          fill={theme === "dark" ? "white" : "#667085"}
          fontSize="10"
          fontWeight="normal"
        >
          Total Employees
        </tspan>
        <tspan
          x={cx}
          dy="20"
          fill={theme === "dark" ? "white" : "black"}
          fontSize="28"
          fontWeight="bold"
        >
          {dataArray.result?.totalEmployees}
          {/* {totalSources} */}
        </tspan>
      </text>
    );
  };

  return (
    <div className="flex flex-col gap-0 h-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <defs>
            <filter
              id="shadow"
              x="-0.000976562"
              y="0.368896"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="9.72656" />
              <feGaussianBlur stdDeviation="14.5898" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.214965 0 0 0 0 0.629167 0 0 0 0 0.429207 0 0 0 0.32 0"
                result="effect1_dropShadow_7302_32608"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_7302_32608"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_7302_32608"
                result="shape"
              />
            </filter>
          </defs>
          <Pie
            data={data}
            cx="50%"
            cy="95%"
            paddingAngle={0}
            startAngle={180}
            endAngle={0}
            innerRadius={100}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            label={renderCustomLabel}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke="none"
                filter="url(#shadow)"
              />
            ))}
            {/* <Label content={renderCustomLabel} position="center" /> */}
          </Pie>
          {/* <Tooltip /> */}
        </PieChart>
      </ResponsiveContainer>
      <CustomLegend data={data} />
    </div>
  );
};
