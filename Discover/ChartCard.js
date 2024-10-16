import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { PiChartLineBold } from "react-icons/pi";
import DragCard from "./DragCard";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";

export default function ChartCard() {
  const [color, setColor] = useState(
    localStorage.getItem("mainColor") || "#6A4BFC"
  );
  const theme = localStorage.getItem("theme");
  const { t } = useTranslation();
  const data = [
    { month: "JAN", voluntary: 40, involuntary: 24 },
    { month: "FEB", voluntary: 30, involuntary: 13.98 },
    { month: "MAR", voluntary: 20, involuntary: 80 },
    { month: "APR", voluntary: 27.8, involuntary: 39.08 },
    { month: "MAY", voluntary: 18.9, involuntary: 48 },
    { month: "JUN", voluntary: 23.9, involuntary: 38 },
    { month: "JUL", voluntary: 34.9, involuntary: 43 },
    { month: "AUG", voluntary: 22.5, involuntary: 29.5 },
    { month: "SEP", voluntary: 15.6, involuntary: 50.2 },
    { month: "OCT", voluntary: 28.7, involuntary: 17.3 },
    { month: "NOV", voluntary: 19.3, involuntary: 43.6 },
    { month: "DEC", voluntary: 32.1, involuntary: 26.8 },
  ];

  // Calculate total of voluntary and involuntary for each data point
  const dataWithTotal = data.map(({ month, voluntary, involuntary }) => ({
    month,
    voluntary,
    involuntary,
    total: voluntary + involuntary,
  }));

  // Formatter function to add '%' symbol to Y-axis ticks
  const yAxisTickFormatter = (value) => `${value}%`;

  // Formatter function to round total values for labels
  const labelFormatter = (value) => `${Math.round(value)}%`;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 text-white bg-gray-800 rounded">
          <p className="text-xs">{`Month: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-xs">
              {`${entry.dataKey}: ${entry.value}%`}
            </p>
          ))}
        </div>
      );
    }

    return null;
  };
// Function to generate a lighter shade of a color
const lightenColor = (color, factor) => {
  // Remove '#' from the beginning of the color string
  color = color.slice(1);

  // Parse the hex color to RGB
  let r = parseInt(color.substr(0, 2), 16);
  let g = parseInt(color.substr(2, 2), 16);
  let b = parseInt(color.substr(4, 2), 16);

  // Scale each RGB component towards 255 (white)
  r = Math.round(r + (255 - r) * factor);
  g = Math.round(g + (255 - g) * factor);
  b = Math.round(b + (255 - b) * factor);

  // Convert the RGB values back to hex
  let newColor =
    "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");

  return newColor;
};

// const lighterColor = lightenColor(primaryColor, 0.94); // Adjust the percentage as needed
// console.log(lighterColor); // Output the resulting color

  const lighterColor = lightenColor(color, 0.2);
  const lighterColor2 = lightenColor(color, 0.6);
  const lighterColor3 = lightenColor(color, 0.65);
  return (
    <DragCard icon={<PiChartLineBold size={18} />} header={t("Turnover Rates")}>
      <div className="flex flex-col h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={dataWithTotal}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
            
          >
            <defs>
              {/* Define the first gradient for the first bar */}
              <linearGradient id="gradient1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={`${color}`} />
                <stop offset="100%" stopColor={`${lighterColor}`} />
              </linearGradient>
              {/* Define the second gradient for the second bar */}
              <linearGradient id="gradient2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={`${lighterColor2}`} />
                <stop offset="100%" stopColor={`${lighterColor3}`} />
              </linearGradient>
            </defs>

            {/* <CartesianGrid strokeDasharray="3 3" /> */}
            <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={false} />

            <XAxis dataKey="month" axisLine={false} tickLine={false}  tick={{ fontSize: 10 }} />
            <YAxis
              ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
              domain={[0, 100]}
              tickFormatter={yAxisTickFormatter}
              axisLine={false}
              tickLine={false} 
              tick={{ fontSize: 10 }}
            />
            {/* <Tooltip content={<CustomTooltip />} /> */}
            <Legend className="dark:text-white" wrapperStyle={{ 
                color: theme === "dark" ? "#FFFFFF" : "#000000",
               }}/>

            {/* First Bar with Gradient Fill */}
            <Bar
              dataKey="voluntary"
              name="Voluntary"
              stackId="a"
              fill={`url(#gradient1)`}
              barSize={32}
              className="rounded bar-primary"
              radius={[0, 0, 4, 4]} // Border radius: top-left, top-right, bottom-right, bottom-left
            >
              {/* Display total at the top of the bar */}
              {/* <LabelList
                dataKey="total"
                position="top"
                formatter={labelFormatter}
                fontSize={10}
              /> */}
            </Bar>

            {/* Second Bar with Different Gradient Fill */}
            <Bar
              dataKey="involuntary"
              name="Involuntary"
              stackId="a"
              fill={`url(#gradient2)`}
              barSize={32}
              className="rounded"
              radius={[4, 4, 0, 0]} // Border radius: top-left, top-right, bottom-right, bottom-left
            >
              {/* Display total at the top of the bar */}
              <LabelList
                dataKey="total"
                position="top"
                formatter={labelFormatter}
                fontSize={10}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DragCard>
  );
}
