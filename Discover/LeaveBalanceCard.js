import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

import { useTranslation } from "react-i18next";

import DragCard from "./DragCard";
import ButtonClick from "../common/Button";
import API, { action } from "../Api";
import { Link } from "react-router-dom";
import { NoData } from "../common/SVGFiles";
import CalendarImg from "../../assets/images/discover/CalenderImg.png";
import CapitalizeText from "../common/CapitalizeText";
import localStorageData from "../common/Functions/localStorageKeyValues";

export default function LeaveBalanceCard({ leaveData, change = () => {} }) {
  const { t } = useTranslation();
  const [employeeId, setEmployeeId] = useState(localStorageData.employeeId);
  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [employeeLeaves, setEmployeeLeaves] = useState([]);

  const COLORS = employeeLeaves.map((item) => item.color);

  const getEmployeeLeaves = async () => {
    const result = await action(API.DASHBOARD_EMPLOYEE_LEAVES, {
      id: employeeId,
      companyId: companyId,
    });
    setEmployeeLeaves(
      result?.result?.map((each) => ({
        name: each?.leaveType,
        value: parseFloat(each?.leaveBalance),
        totalLeaves: parseInt(each?.leaveCount),
        color: each?.colourCode,
      }))
    );
  };

  useEffect(() => {
    getEmployeeLeaves();
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    
    
    if (active && payload && payload.length) {
      // console.log(active, payload, label);
      return (
        <div className="p-2 text-[10px] bg-white rounded-md shadow-xl dark:text-white borderb dark:bg-dark1 dark:!border-dark3">
          {/* <p className="text-xs">{`Total Leaves: ${label}`}</p> */}
          {payload.map((entry, index) => (
            <div className="flex flex-col gap-0.5" key={index}>
              <div className="flex items-center gap-1.5">
                <div
                  className="w-2.5 h-2.5 rounded-sm"
                  style={{ backgroundColor: entry.payload.color }}
                />
                <div>{entry.payload.name}</div>
              </div>
              <p className="text-[10px]">{`Balance: `}<b>{entry.value}</b>{` days`}</p>
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <DragCard
      // icon={<PiCalendarX size={18} />}
      imageIcon={CalendarImg}
      header={t("Leave Balance")}
      className="h-full"
    >
      {employeeLeaves.length > 0 ? (
        <div className="flex flex-col">
          <div className="relative flex justify-center gap-4 h-44">
            <div style={{ width: "100%", height: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="gradient-0" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EC877A" />
                      <stop offset="95%" stopColor="#CB2E24" />
                    </linearGradient>
                  </defs>
                  <Pie
                    data={employeeLeaves}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    // outerRadius={70}
                    // fill="#8884d8"
                    paddingAngle={2.5}
                    dataKey="value"
                    cornerRadius={1}
                    className="border-none"
                    startAngle={-120}
                  >
                    {employeeLeaves?.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        // fill={
                        //   entry.value === maxValue
                        //     ? "url(#gradient-0)"
                        //     : COLORS[index % COLORS.length]
                        // }
                        // fill={
                        //   entry.value === maxValue
                        //     ? COLORS[index % COLORS.length]
                        //     : COLORS[index % COLORS.length]
                        // }
                        fill={COLORS[index % COLORS.length]}
                        className="border-none outline-none"
                        stroke="none"
                      />
                    ))}
                  </Pie>
                  <Legend
                    iconSize={15}
                    iconType="square"
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    wrapperStyle={{
                      // top: "48%",
                      // right: 0,
                      // transform: "translate(0, -50%)",
                      lineHeight: "24px",
                    }}
                    content={(props) => {
                      const { payload } = props;
                      return (
                        <div className="flex flex-col gap-2 dark:text-white">
                          <p className="font-medium text-opacity-50 2xl:text-xs text-grey dark:text-darkText">
                            Leave Summary
                          </p>
                          <ul className=" overflow-auto h-36 w-36 xss:w-64 sm:w-72 md:w-44 lg:w-52 xl:w-32 2xl:w-44 3xl:w-48 4xl:w-56 leading-[20px] zoomwidth">
                            {/* <ul className="w-full"> */}
                            {payload.map((entry, index) => (
                              <>
                                {index < 4 && (
                                  <li
                                    key={`legend-${index}`}
                                    className="flex items-center  justify-between gap-2 pblack py-1 leading-[20px]"
                                  >
                                    <div className="flex items-center gap-2 pblack">
                                      <svg className="overflow-hidden rounded-full size-3">
                                        <rect
                                          width={15}
                                          height={15}
                                          fill={entry.color}
                                        />
                                      </svg>
                                      <span className="text-[9px] lg:text-[9px] 2xl:text-sm 4xl:text-sm font-medium">
                                        {/* {entry.value?.charAt(0).toUpperCase() +
                                          entry.value?.slice(1)} */}
                                        <CapitalizeText text={entry.value} />
                                      </span>
                                    </div>
                                    <p className="text-[9px] lg:text-[9px] 2xl:text-sm 4xl:text-sm font-medium pr-2.5">
                                      <span className="text-grey dark:text-darkText">
                                        {entry.payload.value}/
                                        {entry.payload.totalLeaves}
                                      </span>
                                    </p>
                                  </li>
                                )}
                              </>
                            ))}
                          </ul>
                        </div>
                      );
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex justify-end w-full">
            <div className="flex items-center justify-end w-56 xss:w-64 sm:w-72 md:w-44 lg:w-56 xl:w-56 2xl:w-64 3xl:w-52 4xl:w-64">
              <Link to={`/myleaves`}>
                <ButtonClick buttonName="Request a Leave " />
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <NoData />
      )}
    </DragCard>
  );
}
