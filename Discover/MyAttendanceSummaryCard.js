import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { PiCaretRight, PiClockCountdown, PiCoinsLight } from "react-icons/pi";
import DragCard from "./DragCard";
import API, { action } from "../Api";
import { NoData } from "../common/SVGFiles";
import { Link } from "react-router-dom";
import DateSliderPicker from "../common/DatePickerSlide";
import myAttendance from "../../assets/images/discover/my attendance.png";
import ProgressBarMulti from "./ProgressBarMulti";
import localStorageData from "../common/Functions/localStorageKeyValues";

export default function MyAttendanceSummaryCard({ reloadData = false }) {
  const { t } = useTranslation();
  const [employeeId, setEmployeeId] = useState(localStorageData.employeeId);
  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [AttendenceSummary, setAttendanceSummary] = useState();
  const [monthAndyear, setMonthAndYear] = useState();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (date) => {
    const formattedDate = date.toISOString().slice(0, 7);
    setMonthAndYear(formattedDate);
    setSelectedDate(new Date(formattedDate));
  };

  const Data = [
    {
      id: 1,
      icon: (
        <PiClockCountdown className="p-2 border border-gray-300 rounded-lg size-9" />
      ),
      sub: "Overtime",
      time: "00h 0m",
      sub2: "Daily Work Enties",
      count: 2,
      msg: "Work entries added",
    },
    {
      id: 2,
      icon: (
        <PiCoinsLight className="p-2 border border-gray-300 rounded-lg size-9" />
      ),
      sub: "Fine Hours",
      time: "00h 0m",
      sub2: "Upcomming leaves in 7 days",
      count: 0,
      msg: "employees",
    },
  ];

  const getManagerAttendenceSummary = async () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");

    const formattedDate = `${year}-${month}`;

    try {
      const result = await action(API.GET_EMPLOYEE_ATTENDENCE_SUMMARY, {
        employeeId: employeeId,
        companyId: companyId,
        summaryDate: formattedDate,
      });
      setAttendanceSummary([
        {
          label: "Present",
          // percentage: 60,
          percentage: result.result.present,
          color: "#4EBD63",
          borderColor: "#b9d9b4",
        },
        {
          label: "Absent",
          // percentage: 20,
          percentage: result.result.absent,
          color: "#DC474C",
          borderColor: "#f2b3a0",
        },
        {
          label: "On Leave",
          // percentage: 10,
          percentage: result.result.onLeave,
          color: "#FFA629",
          borderColor: "#f7e1b7",
        },
        {
          label: "Half Day",
          // percentage: 5,
          percentage: result.result.halfDay || 0,
          color: "#D1D1D1",
          borderColor: "#bdbbbb",
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getManagerAttendenceSummary();
  }, [monthAndyear]);

  // if checkIn time render this function to change present count
  useMemo(() => {
    if (reloadData) getManagerAttendenceSummary();
  }, [reloadData]);
  return (
    <DragCard
      imageIcon={myAttendance}
      header={t("My Attendance Summary")}
      className="h-full shadow-lg"
    >
      {Data.length > 0 ? (
        <div className="flex flex-col h-full gap-2">
          <div className="flex items-center justify-between text-xs">
            <DateSliderPicker
              selectedDate={selectedDate}
              onDateChange={handleDateChange}
              mode={"month"}
              datepicker={false}
              dateFontSizeClass="text-xs lg:text-[10px] 2xl:text-xs"
              arrowFontSizeClass="text-xs lg:text-[10px] 2xl:text-xs"
              width="w-[100px]"
            />
            <Link
              to="/myattendance"
              className="flex items-center justify-end gap-1.5"
            >
              <p className="text-xs font-medium text-primary 2xl:text-sm">
                View Details
              </p>
              <PiCaretRight size={16} className="text-primary" />
            </Link>
          </div>
          <ProgressBarMulti
            categories={AttendenceSummary}
            showPercentage={false}
            className="h-3"
          />
          <div className="flex flex-col justify-between gap-1.5 h-full">
            {AttendenceSummary?.map((category, index) => (
              <>
                <div
                  key={index}
                  className="2xl:px-3.5 px-3 2xl:py-2.5 py-2 borderb rounded-lg w-full bg-white dark:bg-dark2Soft flex justify-between gap-3 items-center"
                >
                  <div className="flex items-center h-full gap-2">
                    <span className="relative flex size-2">
                      <span
                        className="absolute inline-flex w-full h-full rounded-full opacity-75 "
                        style={{
                          backgroundColor: category.color,
                          opacity: 0.7,
                        }}
                      ></span>
                      <span
                        className="relative inline-flex rounded-full size-2"
                        style={{
                          backgroundColor: category.color,
                        }}
                      ></span>
                    </span>
                    <p className="text-xs font-semibold 2xl:text-xs lg:text-xxs dark:text-white">
                      {category.label}
                    </p>
                  </div>
                  <p className="text-xs font-medium 2xl:text-xs lg:text-xxs dark:text-white">
                    {category.percentage}
                  </p>
                </div>
              </>
            ))}
          </div>
        </div>
      ) : (
        <NoData />
      )}
    </DragCard>
  );
}
