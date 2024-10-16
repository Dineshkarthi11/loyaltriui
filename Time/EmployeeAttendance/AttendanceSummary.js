import React, { useState } from "react";
import ProgressBarMulti from "../../Payroll/Dashboard/ProgressBarMulti";

const AttendanceSummary = ({
  data,
  progressitems,
  COLORS,
  shiftWiseFilter,
  selectedRow,
  setSelectedRow,
}) => {
  const [selectedProgress, setSelectedProgress] = useState(data[0] || {});

  const attendance = selectedProgress
    ? [
        {
          label: "Present",
          shiftname: selectedProgress.shiftname,
          percentage:
            selectedProgress.totalemployees !== 0
              ? (selectedProgress.Present / selectedProgress.totalemployees) *
                100
              : 0,
        },
        {
          label: "Absent",
          shiftname: selectedProgress.shiftname,
          percentage:
            selectedProgress.totalemployees !== 0
              ? (selectedProgress.Absent / selectedProgress.totalemployees) *
                100
              : 0,
        },
        {
          label: "Half Day",
          shiftname: selectedProgress.shiftname,
          percentage:
            selectedProgress.totalemployees !== 0
              ? (selectedProgress.HalfDay / selectedProgress.totalemployees) *
                100
              : 0,
        },
        {
          label: "Fine",
          shiftname: selectedProgress.shiftname,
          percentage:
            selectedProgress.totalemployees !== 0
              ? (selectedProgress.Fine / selectedProgress.totalemployees) * 100
              : 0,
        },
        {
          label: "Overtime",
          shiftname: selectedProgress.shiftname,
          percentage:
            selectedProgress.totalemployees !== 0
              ? (selectedProgress.Overtime / selectedProgress.totalemployees) *
                100
              : 0,
        },
        {
          label: "Paid Leave",
          shiftname: selectedProgress.shiftname,
          percentage:
            selectedProgress.totalemployees !== 0
              ? (selectedProgress.PaidLeave / selectedProgress.totalemployees) *
                100
              : 0,
        },
      ]
    : [];

  const handleSelectProgress = (id) => {
    const selected = data.find((item) => item.id === id);
    setSelectedProgress(selected);
  };
  return (
    <div className="flex flex-col">
      <div>
        <ProgressBarMulti
          categories={attendance}
          showPercentage={false}
          className="h-2.5"
          tooltip={true}
          // tooltipData={toolTipDAta}
          colors={COLORS}
        />
      </div>
      <div className="flex flex-col divide-y dark:divide-white/20 md:h-52 h-72  overflow-y-scroll scrollbar-none">
        {data?.map((each, index) => (
          <div
            key={index}
            className="w-full py-2.5"
            onClick={() => {
              handleSelectProgress(each.id);
              setSelectedRow(each.id);
              shiftWiseFilter(each.shiftname);
            }}
          >
            <div
              className={`${
                each.id === selectedRow && "bg-indigo-200"
              }  each-row px-2 py-1.5 hover:bg-[#F8F9FA] transition-all duration-300 dark:hover:bg-[#181d2d] rounded-md md:h-10 h-full cursor-pointer grid grid-cols-12 gap-3 md:gap-0 group items-center`}
            >
              <p className="text-[10px] my-auto 2xl:text-xs font-medium col-span-12 md:col-span-2">
                {each.shiftname && each.shiftname}
              </p>
              <p className="px-[9px] py-[3px] rounded-md borderb bg-[#F9F9F9] group-hover:bg-white dark:bg-opacity-40 dark:text-white group-hover:text-primary group-hover:border-white text-[10px] 2xl:text-xs col-span-12 md:col-span-4 w-fit vhcenter">
                Total Employees: {each.totalemployees}
              </p>
              <div className="grid grid-cols-6 gap-4 md:col-span-5 col-span-12 items-center">
                <p className="pblack font-semibold">
                  <span className="text-[#349C5E]">P</span>
                  <span className="ml-1">{each.Present}</span>
                </p>
                <p className="pblack font-semibold">
                  <span className="text-[#C82920]">A</span>
                  <span className="ml-1">{each.Absent}</span>
                </p>
                <p className="pblack font-semibold">
                  <span className="text-[#E68E02]">HD</span>
                  <span className="ml-1">{each.HalfDay}</span>
                </p>
                <p className="pblack font-semibold">
                  <span className="text-[#2980BB]">F</span>
                  <span className="ml-1">{each.Fine}</span>
                </p>
                <p className="pblack font-semibold">
                  <span className="text-[#B736DC]">OT</span>
                  <span className="ml-1">{each.Overtime}</span>
                </p>
                <p className="pblack font-semibold">
                  <span className="text-[#365DE0]">P</span>
                  <span className="ml-1">
                    {each.PaidLeave ? each.PaidLeave : "0"}
                  </span>
                </p>
              </div>
              <p className="px-[9px] py-[3px] rounded-md borderb bg-[#F9F9F9] group-hover:bg-white dark:bg-opacity-40 group-hover:text-primary group-hover:border-white text-xs 2xl:text-sm text-grey dark:text-white font-semibold md:col-span-1 col-span-12 w-fit float-right">
                {each.totalemployees === 0
                  ? "0%"
                  : ((each.Present / each.totalemployees) * 100).toFixed(0) +
                    "%"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendanceSummary;
