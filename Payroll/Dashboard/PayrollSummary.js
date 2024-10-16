import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PiChartLineBold } from "react-icons/pi";
import { lightenColor } from "../../common/lightenColor";
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
import DragCard from "../../common/DragCard";
import DateSelect from "../../common/DateSelect";
import PAYROLLAPI, { Payrollaction } from "../../PayRollApi";
import dayjs from "dayjs";

const PayrollSummary = React.memo(() => {
  const [color, setColor] = useState(
    localStorage.getItem("mainColor") || "#6A4BFC"
  );
  const theme = localStorage.getItem("theme");
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [companyId, setCompanyId] = useState(localStorage.getItem("companyId"));

  const [currentMonthYear, setCurrentMonthYear] = useState(
    dayjs().format("YYYY")
  );

  useEffect(() => {
    fetchDataForPayrollSummary();
  }, [currentMonthYear]);

  const fetchDataForPayrollSummary = async () => {
    try {
      const response = await Payrollaction(
        PAYROLLAPI.GET_PAYROLL_DETAILS_FOR_PAYROLL_SUMMARY_IN_DASHBOARD,
        {
          companyId: companyId,
          year: currentMonthYear,
        }
      );
      if (response.status === 200 && response.result) {
        const transformedData = transformData(response.result);
        setData(transformedData);
        // console.log(transformedData, "transformed dataa for pyroll summaryy");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const transformData = (apiData) => {
    const monthNames = [
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
    ];
    const shortMonthNames = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];
    return monthNames.map((month, index) => {
      const monthData = apiData[month] || {};
      const totalDeduction =
        parseFloat(monthData.totalDeduction || 0) +
        parseFloat(monthData.totalDeductionsAdjustment || 0);
      const totalEarnings =
        parseFloat(monthData.totalErnings || 0) +
        parseFloat(monthData.totalAdditionsAdjustment || 0) +
        parseFloat(monthData.totalWorkExpense || 0) +
        parseFloat(monthData.totalAllowances || 0);
      return {
        month: shortMonthNames[index],
        Deduction: totalDeduction,
        Earnings: totalEarnings,
        total: totalDeduction + totalEarnings,
      };
    });
  };

  // Calculate the maximum total value in the data
  const maxTotal = Math.max(...data.map((item) => item.total), 0);

  // console.log(maxTotal, "maxtotal valuee");

  // Formatter function to add 'k' symbol to Y-axis ticks, if hasAnyValue is 0 then do not show the yaxis.
  const hasAnyValue = data?.some(item =>
    item?.Deduction !== 0 || item?.Earnings !== 0 || item?.total !== 0
  );
  const yAxisTickFormatter = (value) =>
    hasAnyValue ? `${value / 1000} k` : "";

  // value > 0 ? `${Math.floor(value / 1000)}K` : "";

  // Adjust the domain of Y-axis to reflect the maximum total value
  const yDomain = [0, Math.ceil(maxTotal / 10000) * 10000];

  // Formatter function to round total values for labels
  const labelFormatter = (value) =>
    value > 0 ? `${Math.floor(value / 1000)} K` : "";

  const lighterColor = lightenColor(color, 0.2);
  const lighterColor2 = lightenColor(color, 0.6);
  const lighterColor3 = lightenColor(color, 0.65);

  const handleDateChange = (date) => {
    const formattedDate = dayjs(date).format("YYYY");
    setCurrentMonthYear(formattedDate);
  };

  return (
    <DragCard
      icon={<PiChartLineBold size={18} />}
      header={t("Payroll_Summary")}
    >
      <div className="flex flex-col h-[450px] gap-3">
        <div className="flex justify-end w-full">
          <DateSelect
            change={handleDateChange}
            pickerType="year"
            placeholder="Year"
            dateFormat="YYYY"
            className="w-24"
            value={currentMonthYear}
          />
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width="100%"
            height={280}
            data={data}
            margin={{ top: 0, bottom: 5 }}
          >
            <Legend
              verticalAlign="bottom"
              align="center"
              iconType="circle"
              fontSize="10px"
              stroke="#ffffff"
              wrapperStyle={{
                color: theme === "dark" ? "#FFFFFF" : "#000000",
              }}
            />

            <defs>
              <linearGradient id="gradient1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={`${color}`} />
                <stop offset="100%" stopColor={`${lighterColor}`} />
              </linearGradient>
              <linearGradient id="gradient2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={`${lighterColor2}`} />
                <stop offset="100%" stopColor={`${lighterColor3}`} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 0"
              horizontal={true}
              vertical={false}
              stroke={theme === "dark" ? "#FFFFFF1a" : "#F3F3F3"}
            />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10 }}
            />
            <YAxis
              domain={yDomain}
              tickCount={8}
              tickFormatter={yAxisTickFormatter}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10 }}
            />
            {/* <Tooltip content={<CustomTooltip />} /> */}

            <Bar
              dataKey="Deduction"
              name="Deduction"
              stackId="a"
              fill={`url(#gradient1)`}
              barSize={32}
              className="rounded bar-primary"
              radius={[0, 0, 4, 4]}
            >
              {/* <LabelList dataKey="total" position="top" formatter={labelFormatter} /> */}
            </Bar>

            <Bar
              dataKey="Earnings"
              name="Earnings"
              stackId="a"
              fill={`url(#gradient2)`}
              barSize={32}
              className="rounded"
              radius={[4, 4, 0, 0]}
            >
              <LabelList
                dataKey="total"
                position="top"
                formatter={labelFormatter}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DragCard>
  );
});

export default PayrollSummary;
