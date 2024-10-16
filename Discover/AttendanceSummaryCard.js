import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PiCaretRight, PiClockCountdown, PiCoinsLight } from "react-icons/pi";
import DragCard from "./DragCard";
import API, { action } from "../Api";
import { NoData } from "../common/SVGFiles";
import { Link } from "react-router-dom";
import DateSliderPicker from "../common/DatePickerSlide";
import comboffImg from "../../assets/images/discover/comboffImg.png";
import ProgressBarMulti from "./ProgressBarMulti";
import ModalAnt from "../common/ModalAnt";
import Avatar from "../common/Avatar";
import ModalImg from "../../assets/images/save.svg";
import localStorageData from "../common/Functions/localStorageKeyValues";

export default function AttendanceSummaryCard() {
  const { t } = useTranslation();
  const [employeeId, setEmployeeId] = useState(localStorageData.employeeId);
  const [companyId, setCompanyId] = useState(localStorageData.employeeId);
  const [AttendenceSummary, setAttendanceSummary] = useState();
  const [summary, setSummary] = useState();
  const [monthAndyear, setMonthAndYear] = useState();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [upComingLeavesDetails, setUpComingLeaveDetails] = useState([]);

  const handleDateChange = (date, type) => {
    let dateValue = null;
    if (type === "datePicker") {
      dateValue = date;
    } else {
      dateValue = new Date(date).toISOString().slice(0, 10);
    }
    setMonthAndYear(dateValue);
    setSelectedDate(new Date(dateValue));
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
    try {
      const result = await action(API.GET_MANAGER_ATTENDENCE_SUMMARY, {
        superiorEmployeeId: employeeId,
        companyId: companyId,
        summaryDate: monthAndyear,
      });

      setSummary(result.result);
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
          label: "Half-Day",
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

  const upComingLeaves = async () => {
    try {
      const result = await action(API.UPCOMING_LEAVES_SEVEN_DAYS, {
        id: employeeId,
        companyId: companyId,
        isSevenDays: 1,
      });
      if (result.status === 200) {
        setUpComingLeaveDetails(result.result);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    upComingLeaves();
  }, []);

  return (
    <DragCard
      imageIcon={comboffImg}
      header={t("Attendance Summary")}
      className="h-full"
    >
      {Data.length > 0 ? (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs">
            <p>
              <span className="text-[10px] 2xl:text-xs text-grey dark:text-darkText">
                Total Employees
              </span>{" "}
              <span className="text-xs font-semibold 2xl:text-sm dark:text-white">
                {summary?.totalEmployees}
              </span>
            </p>
            <DateSliderPicker
              selectedDate={selectedDate}
              onDateChange={handleDateChange}
              mode={"day"}
              datepicker={false}
              dateFontSizeClass="text-xs lg:text-[10px] 2xl:text-xs"
              arrowFontSizeClass="text-xs lg:text-[10px] 2xl:text-xs"
              width="w-[120px]"
            />
          </div>
          <ProgressBarMulti
            categories={AttendenceSummary}
            showPercentage={false}
            className="h-3"
          />
          <div className="flex justify-between items-center bg-[#F8FAFC] dark:bg-dark2Soft px-2.5 text- py-3.5 borderb rounded-md">
            {AttendenceSummary?.map((category, index) => (
              <>
                <div
                  key={index}
                  className="flex flex-col items-center h-full gap-2 px-2 top-8"
                >
                  <p className="text-xs md:text-[10px] 2xl:text-xs font-normal leading-3 text-grey dark:text-darkText">
                    {category.label}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="relative flex size-2.5">
                      <span
                        className="absolute inline-flex w-full h-full rounded-full opacity-75"
                        style={{
                          backgroundColor: category.color,
                          opacity: 0.7,
                        }}
                      ></span>
                      <span
                        className="relative inline-flex rounded-full size-2.5"
                        style={{
                          backgroundColor: category.color,
                        }}
                      ></span>
                    </span>
                    <p className="text-sm font-semibold leading-3 lg:text-lg 2xl:text-xl dark:text-white">
                      {category.percentage}
                    </p>
                  </div>
                </div>
                {index < AttendenceSummary.length - 1 && (
                  <div className="v-divider !h-6"></div>
                )}
              </>
            ))}
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="rounded-[10px] p-2.5 flex items-center gap-3 bg-[#F8FAFC] dark:bg-dark2Soft">
              {/* <div className="bg-white rounded-lg size-10 borderb vhcenter dark:bg-slate-800">
                <PiCoinsLight className="text-lg 2xl:text-xl dark:text-white" />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xs lg:text-[10px] 2xl:text-xs text-slate-400">
                  Fine Hours
                </p>
                <p className="text-xs font-semibold 2xl:text-sm dark:text-white">
                  00h 00m
                </p>
              </div> */}
              <div
                className="flex flex-col gap-1 cursor-pointer"
                onClick={() => {
                  // upComingLeaves();
                  setOpen(!open);
                }}
              >
                <p className="text-xs lg:text-[10px] 2xl:text-xs text-slate-400 dark:text-darkText whitespace-nowrap">
                  Upcoming leaves in 7 days
                </p>
                <p className="flex items-center gap-1">
                  <span className="text-sm font-semibold 2xl:text-base dark:text-white">
                    {upComingLeavesDetails?.length}
                  </span>
                  <span className="text-xs lg:text-[10px] 2xl:text-xs text-primary">
                    employees
                  </span>
                </p>
              </div>
            </div>

            <Link
              to="/employee_attendance"
              className="flex items-center justify-end gap-1.5"
            >
              <p className="text-xs font-medium text-primary 2xl:text-sm whitespace-nowrap">
                View Details
              </p>
              {/* <MdOutlineArrowForwardIos className="p-1 border rounded-md size-5 dark:text-white" /> */}
              <PiCaretRight size={16} className="text-primary" />
            </Link>
          </div>
        </div>
      ) : (
        <NoData />
      )}

      <ModalAnt
        isVisible={open}
        onClose={() => setOpen(false)}
        showOkButton={false}
        showCancelButton={false}
        showTitle={false}
        centered={true}
        padding="8px"
        width="200"
      >
        <div className="flex flex-col gap-4  md:w-[445px] 2xl:w-[553px] ">
          <div className="flex flex-col items-center gap-2">
            <div className="p-3 overflow-hidden border-2 border-white rounded-full 2xl:size-14 size-12 bg-primaryalpha/10">
              <img
                src={ModalImg}
                alt="modalimg"
                className="object-cover object-center w-full h-full"
              />
            </div>
            <h2 className="h2">Upcoming leaves in 7 days</h2>
            <div className="w-4/6 m-auto">
              <p className="text-xs text-center text-gray-500 2xl:text-sm ">
                Review and manage employee leave requests efficiently. Ensure
                all leave applications are handled promptly and accurately to
                maintain smooth operations and employee satisfaction.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-1 p-2 ">
            <div className="grid grid-cols-5 gap-3 p-2 text-xs font-semibold 2xl:text-sm">
              <p className="col-span-2 ">Employee</p>
              <p>From Date</p>
              <p>To Date</p>
              <p>Status</p>
            </div>
            <div className="flex flex-col h-56 gap-2 overflow-scroll 2xl:h-96">
              {upComingLeavesDetails?.map((each, i) => (
                <div
                  key={i}
                  className="grid items-center grid-cols-5 gap-3 p-2 rounded-md bg-secondaryWhite "
                >
                  <div className="flex items-center col-span-2 gap-2 ">
                    <Avatar
                      image={each.profilePicture}
                      name={each.employeeName}
                    />
                    <div className="">
                      <p className=" text-md">{each.employeeName}</p>
                      <p className="text-xs ">Emp Code: {each.code}</p>
                    </div>
                  </div>
                  <div className="">{each.leaveDateFrom}</div>
                  <div className="">{each.leaveDateTo}</div>
                  <div className="text-yellow-500 ">{each.status}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ModalAnt>
    </DragCard>
  );
}
