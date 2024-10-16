import React, { useState } from "react";
import { PiClock, PiLineSegments } from "react-icons/pi";
import { RxDotFilled } from "react-icons/rx";
import { employeeAttendenceButtonList } from "../../data";
import EmployeeTimeline from "./EmployeeTimeline";
import { PiSignIn, PiSignOut } from "react-icons/pi";
import { motion } from "framer-motion";

const AttendanceCard = ({ data, ButtonClick = () => {}, payoutStatus }) => {
  const [attendenceDetailsId, setAttendenceDetailsId] = useState();
  const [open, setOpen] = useState(false);
  const [employeeDeatils, setEmployeeDeatils] = useState({});

  const handleViewAttendance = (id, details) => {
    setAttendenceDetailsId(id);
    setOpen(true);
    setEmployeeDeatils(details);
  };

  return (
    <>
      {data?.map((each, index) => (
        <div
          className=" px-3.5 py-2.5 borderb rounded-lg w-full bg-[#F9FAFB] dark:bg-[#131827] grid grid-cols-10 gap-4"
          key={index}
        >
          <div className="flex flex-col gap-4 col-span-10 sm:col-span-2">
            <div className="flex items-center gap-3">
              <div
                className={`size-8 overflow-hidden rounded-full 2xl:size-10 shrink-0 bg-primaryalpha/10 vhcenter`}
              >
                {each.profilePicture ? (
                  <img
                    // src={record.logo}
                    src={each.profilePicture}
                    className="object-cover object-center w-full h-full"
                    alt="Profile"
                  />
                ) : (
                  <p className="font-semibold text-primary text-xs 2xl:text-sm">
                    {each.employeeName?.charAt(0).toUpperCase()}
                  </p>
                )}
              </div>
              <div className="flex flex-col">
                <p className="pblack font-semibold">
                  {each.employeeName?.charAt(0).toUpperCase() +
                    each.employeeName?.slice(1)}{" "}
                </p>
                <p className="pblack !text-grey">{each.designation}</p>
              </div>
            </div>
            <p className="px-1.5 py-0.5 h-fit flex gap-1 items-center font-medium w-fit bg-gray-100 text-gray-700 rounded-full text-[9px] 2xl:text-[11px]">
              <RxDotFilled size={14} />
              {each.shiftName ? each.shiftName : "No Shift"}
            </p>
          </div>
          <div className=" flex-col flex col-span-10 gap-3.5 sm:col-span-8">
            <div className="flex flex-col lg:flex-row justify-between gap-[18px] col-span-10 sm:col-span-5 lg:col-span-3">
              <div className="flex items-center gap-2 xs:gap-[18px] justify-between flex-wrap">
                <div className="flex items-center gap-1">
                  <PiSignIn size={16} className="text-grey" />
                  <p className="text-[10px] leading-[18px] 2xl:text-xs font-medium text-grey">
                    Check In
                  </p>
                  <p className="text-xs 2xl:text-sm leading-[20px] font-semibold dark:text-white space-x-1 vhcenter gap-1">
                    {each.firstCheckInTime ? each.firstCheckInTime : "00h 00m"}
                  </p>
                </div>
                <div className="v-divider !h-2/3 hidden sm:block"></div>
                <div className="flex items-center gap-1">
                  <PiSignOut size={16} className="text-grey" />
                  <p className="text-[10px] leading-[18px] 2xl:text-xs font-medium text-grey">
                    Check Out
                  </p>
                  <p className="text-xs 2xl:text-sm leading-[20px] font-semibold dark:text-white space-x-1 vhcenter gap-1">
                    {each.lastCheckOutTime ? each.lastCheckOutTime : "00h 00m"}
                  </p>
                </div>
                <div className="v-divider !h-2/3 hidden sm:block"></div>
                <div className="flex items-center gap-1">
                  <PiClock size={16} className="text-grey" />
                  <p className="text-[10px] leading-[18px] 2xl:text-xs font-medium text-grey">
                    Total Hours
                  </p>
                  <p className="text-xs 2xl:text-sm  leading-[20px] font-semibold dark:text-white space-x-1 vhcenter gap-1">
                    {each.totalWorkHours ? each.totalWorkHours : "00h 00m"}
                  </p>
                </div>
              </div>
              <p
                className="hover:text-primary cursor-pointer text-[10px] hover:underline 2xl:text-xs font-medium !leading-[24px] flex items-center gap-1"
                onClick={() =>
                  handleViewAttendance(each.employeeDailyAttendanceId, each)
                }
              >
                <PiLineSegments /> View attendance log
              </p>
            </div>
            <div className="divider-h" />
            <div
              className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 col-span-10 lg:col-span-4 `}
            >
              {employeeAttendenceButtonList.map((item, i) => (
                <button
                  key={i}
                  onClick={() => {
                    // (((each.status === "Absent" || each.status === "Leave Approved") && (item.value !== "fine" && item.value !== "overTime")) || (each.status !== "Absent" && each.status !== "Leave Approved")) && ButtonClick(
                    ((each.status === "Absent" &&
                      parseInt(each.isHalfDay) === 1 &&
                      (item.value !== "fine" || item.value !== "overTime")) ||
                      (each.status === "Absent" &&
                        item.value !== "fine" &&
                        item.value !== "overTime") ||
                      (each.status === "Present" &&
                        item.value !== "paidLeave") ||
                      (each.status === "OverTime" &&
                        (item.value !== "fine" ||
                          item.value !== "paidLeave")) ||
                      (each.status === "Off Day" && item.value === "present") ||
                      parseInt(each.isHalfDay) === 1) &&
                      parseInt(payoutStatus) !== 1 &&
                      ButtonClick(
                        true,
                        item.value,
                        each.employeeDailyAttendanceId
                      );
                  }}
                  className={` ${
                    parseInt(each.isFineToRegularize) === 1 &&
                    item.title === "Fine"
                      ? `text-[#C82920] bg-red-100`
                      : item.title === "Absent" &&
                        each.status === "Absent" &&
                        parseInt(each.isPunchApproved) === 0
                      ? `bg-[${item.bg}] text-[#fff] !border-[${item.border}]`
                      : parseInt(each.isHalfDay) === 1 &&
                        (item.value === "halfDay" ||
                          (each.status === "Present" &&
                            item.value === "present") ||
                          (item.title === "Absent" &&
                            each.status === "Absent") ||
                          item.value === "paidLeave")
                      ? `bg-[${item.bg}] text-[#fff] !border-[${item.border}]`
                      : each.status === item.title &&
                        parseInt(each.isPunchApproved) === 1
                      ? `bg-[${item.bg}] text-[#fff] !border-[${item.border}]`
                      : each.status === item.title &&
                        parseInt(each.isPunchApproved) === 0 &&
                        item.title !== "Absent"
                      ? `text-[${item.bg}]`
                      : (each.status === "Off Day" ||
                          each.status === "On Leave" ||
                          parseInt(each.isHoliday) === 1) &&
                        item.value === "paidLeave"
                      ? `bg-[${item.bg}] text-[#fff] !border-[${item.border}]`
                      : ((each.status === "Leave Approved" ||
                          parseInt(each.isLeave) === 1) &&
                          item.value === "paidLeave") ||
                        (each.extraHours &&
                          item.value === "overTime" &&
                          each.status === "Present" &&
                          each.employeeOvertimeDataId &&
                          each.isOvertimeApproved)
                      ? `bg-[${item.bg}] text-[#fff] !border-[${item.border}]`
                      : each.extraHours &&
                        item.value === "overTime" &&
                        each.status === "Present" &&
                        each.employeeOvertimeDataId &&
                        !each.isOvertimeApproved
                      ? `bg-[${item.bg}] text-[#fff] !border-[${item.border}]`
                      : "bg-white dark:bg-[#4b4b4b5e] text-grey"
                  } ${
                    (each.status === "Absent" &&
                      parseInt(each.isHalfDay) !== 1 &&
                      (item.value === "fine" || item.value === "overTime")) ||
                    (each.status === "Present" &&
                      item.value === "paidLeave" &&
                      parseInt(each.isHalfDay) !== 1) ||
                    (each.status === "OverTime" &&
                      (item.value === "fine" || item.value === "paidLeave"))
                      ? "cursor-not-allowed"
                      : parseInt(each.isHalfDay) === 1
                      ? " cursor-pointer"
                      : (each.status === "Leave Approved" ||
                          parseInt(each.isLeave) === 1 ||
                          each.status === "On Leave" ||
                          (each.status === "Off Day" &&
                            item.value !== "present") ||
                          parseInt(each.isHoliday) === 1) &&
                        "cursor-not-allowed"
                  } ${
                    parseInt(payoutStatus) === 1 && " cursor-not-allowed"
                  }   borderb h-8 2xl:h-10 transition-all duration-300 w-full xl:w-auto  4xl:w-[160px] p-[3px] text-[10px] 2xl:text-sm rounded-md text-start leading-6 flex items-center relative`}
                >
                  <div
                    className={` ${
                      ((each.status === item.title &&
                        parseInt(each.isPunchApproved) === 1) ||
                        (parseInt(each.isFineToRegularize) === 1 &&
                          item.title === "Fine") ||
                        ((each.status === "Off Day" ||
                          each.status === "On Leave") &&
                          item.value === "paidLeave") ||
                        parseInt(each.isHoliday) === 1 ||
                        (item.title === "Absent" &&
                          parseInt(each.isPunchApproved) === 0) ||
                        ((each.status === "Leave Approved" ||
                          parseInt(each.isLeave) === 1) &&
                          item.value === "paidLeave") ||
                        (each.extraHours &&
                          item.value === "overTime" &&
                          each.status === "Present" &&
                          each.employeeOvertimeDataId) ||
                        (parseInt(each.isHalfDay) === 1 &&
                          (item.value === "halfDay" ||
                            item.value === "paidLeave"))) &&
                      "bg-transparent"
                    } w-8 h-full bg-[#E2E2E2] vhcenter rounded text-[10px] 2xl:text-xs font-medium`}
                  >
                    {/* {item.shortLeter} */}
                    {parseInt(each.isLeave) === 1 &&
                    parseInt(each.isPaidLeave) === 0 &&
                    item.value === "paidLeave"
                      ? "UL"
                      : parseInt(each.isLeave) === 1 &&
                        parseInt(each.isPaidLeave) === 1 &&
                        item.value === "paidLeave"
                      ? "PL"
                      : item.value === "paidLeave" &&
                        each.status !== "Present" &&
                        each.status !== "Absent"
                      ? each.status
                          ?.split(" ")
                          ?.map((each) => each.charAt(0))
                          .join("")
                          .toUpperCase()
                      : item.shortLeter}
                  </div>
                  <div
                    className={`${
                      (each.status === item.title &&
                        parseInt(each.isPunchApproved) === 1) ||
                      (parseInt(each.isFineToRegularize) === 1 &&
                        item.title === "Fine") ||
                      ((each.status === "Off Day" ||
                        each.status === "On Leave") &&
                        item.value === "paidLeave") ||
                      parseInt(each.isHoliday) === 1 ||
                      (item.title === "Absent" &&
                        parseInt(each.isPunchApproved) === 0) ||
                      ((each.status === "Leave Approved" ||
                        parseInt(each.isLeave) === 1) &&
                        item.value === "paidLeave") ||
                      (each.extraHours &&
                        item.value === "overTime" &&
                        each.status === "Present" &&
                        each.employeeOvertimeDataId) ||
                      (parseInt(each.isHalfDay) === 1 &&
                        (item.value === "halfDay" ||
                          item.value === "paidLeave"))
                        ? "v-divider h-6"
                        : "hidden"
                    } `}
                  />
                  <div className="flex justify-between items-center">
                    {item.title && item.title !== "Fine" && (
                      <span className="ml-1.5 whitespace-nowrap">
                        {(each.status === "Off Day" ||
                          each.status === "On Leave") &&
                        item.value === "paidLeave"
                          ? each.status
                          : each.extraHours &&
                            item.value === "overTime" &&
                            each.status === "Present" &&
                            each.employeeOvertimeDataId
                          ? each.extraHours
                          : each.isMissPunch && item.value === "present"
                          ? "Miss punch"
                          : parseInt(each.isHoliday) === 1 &&
                            item.value === "paidLeave"
                          ? each.status?.charAt(0).toUpperCase() +
                            each.status?.slice(1)
                          : parseInt(each.isLeave) === 1 &&
                            parseInt(each.isPaidLeave) === 0 &&
                            item.value === "paidLeave"
                          ? "Unpaid Leave"
                          : parseInt(each.isLeave) === 1 &&
                            parseInt(each.isPaidLeave) === 1 &&
                            item.value === "paidLeave"
                          ? "Paid Leave"
                          : item.value === "paidLeave" &&
                            each.status !== "Present" &&
                            each.status !== "Absent"
                          ? each.status
                          : item.title}
                      </span>
                    )}
                    {item.title === "Fine" ? (
                      <>
                        <span className="ml-1.5 text-red">
                          {each.totalHoursToRegularize}
                        </span>
                        {parseInt(each.isFineToRegularize) === 1 &&
                        item.title === "Fine" ? (
                          <div
                            className={
                              "absolute grid grid-rows-3 items-center justify-between  top-0 right-[2px] h-full"
                            }
                          >
                            <div className=" bg-orange-500  rounded-[2px] text-white  text-[8px] leading-none flex items-center h-full p-[1px] lg:p-0.5 ">
                              {parseInt(each.requestsCount) || 0}
                            </div>
                            <div className=" bg-green-600  rounded-[2px] text-white  text-[8px] leading-none flex items-center h-full p-[1px] lg:p-0.5">
                              {parseInt(each.pardonedCount) || 0}
                            </div>
                            <div className=" bg-red-600  rounded-[2px] text-white  text-[8px] leading-none flex items-center h-full p-[1px] lg:p-0.5">
                              {parseInt(each.finedCount) || 0}
                            </div>
                          </div>
                        ) : null}
                      </>
                    ) : null}
                  </div>
                </button>
              ))}

              {/* <button
              onClick={() => {
                ButtonClick();
              }}
              className={`  ${
                each.status === "Half Day"
                  ? "bg-[#faefde] text-[#E68E02] !border-[#FFDCA4]"
                  : "bg-white text-grey"
              } borderb transition-all duration-300 w-full xl:w-[130px] 2xl:w-[160px] p-[3px] text-[10px] 2xl:text-sm rounded-md text-start leading-6 flex items-center gap-3`}
            >
              <div
                className={` ${
                  each.status === "Half Day" && "bg-transparent"
                }  w-7 h-full bg-[#E2E2E2] vhcenter rounded text-[10px] 2xl:text-xs font-medium`}
              >
                HD
              </div>
              <span>Halfday</span>
            </button>
            <button
              onClick={() => {
                ButtonClick();
              }}
              className={` ${
                each.status === "Absent"
                  ? "bg-[#C82920] text-white !border-[#C82920]"
                  : "bg-white text-grey"
              } borderb transition-all duration-300 w-full xl:w-[130px] 2xl:w-[160px] p-[3px] text-[10px] 2xl:text-sm rounded-md text-start leading-6 flex items-center gap-3`}
            >
              <div
                className={` ${
                  each.status === "Absent" && "bg-transparent"
                }  w-7 h-full bg-[#E2E2E2] vhcenter rounded text-[10px] 2xl:text-xs font-medium`}
              >
                A
              </div>
              <span>Absent</span>
            </button>
            <button
              onClick={() => {
                ButtonClick();
              }}
              className={`${
                each.status === "Fine"
                  ? "bg-[#dcecf7] text-[#2980BB] !border-[#C2E6FF]"
                  : "bg-white text-grey"
              } borderb transition-all duration-300 w-full xl:w-[130px] 2xl:w-[160px] p-[3px] text-[10px] 2xl:text-sm rounded-md text-start leading-6 flex items-center gap-3`}
            >
              <div
                className={` ${
                  each.status === "Fine" && "bg-transparent"
                }  w-7 h-full bg-[#E2E2E2] vhcenter rounded text-[10px] 2xl:text-xs font-medium`}
              >
                F
              </div>
              <span>Fine</span>
            </button>
            <button
              onClick={() => {
                ButtonClick();
              }}
              className={`${
                each.status === "Overtime"
                  ? "bg-[#f8effc] text-[#B736DC] !border-[#F8DEFF]"
                  : "bg-white text-grey"
              } borderb transition-all duration-300 w-full xl:w-[130px] 2xl:w-[160px] p-[3px] text-[10px] 2xl:text-sm rounded-md text-start leading-6 flex items-center gap-3`}
            >
              <div
                className={` ${
                  each.status === "Overtime" && "bg-transparent"
                }  w-7 h-full bg-[#E2E2E2] vhcenter rounded text-[10px] 2xl:text-xs font-medium`}
              >
                OT
              </div>
              <span>Overtime</span>
            </button>
            <button
              onClick={() => {
                ButtonClick();
              }}
              className={`${
                each.status === "Paid Leave"
                  ? "bg-[#d4ddfb] text-[#365DE0] !border-[#A0B6FF]"
                  : "bg-white text-grey"
              } borderb transition-all duration-300 w-full xl:w-[130px] 2xl:w-[160px] p-[3px] text-[10px] 2xl:text-sm rounded-md text-start leading-6 flex items-center gap-3`}
            >
              <div
                className={` ${
                  each.status === "Paid Leave" && "bg-transparent"
                }  w-7 h-full bg-[#E2E2E2] vhcenter rounded text-[10px] 2xl:text-xs font-medium`}
              >
                PL
              </div>
              <span>Paid Leave</span>
            </button> */}
            </div>
          </div>
        </div>
      ))}
      {open && (
        <EmployeeTimeline
          open={open}
          close={() => {
            setOpen(false);
          }}
          attendanceId={attendenceDetailsId}
          employeeId={employeeDeatils.employeeId}
          // refresh={() => {
          //   getEmployeeAttendence();
          // }}
          // employeeDetails={employeeDetails}
        />
      )}
    </>
  );
};

export default AttendanceCard;
