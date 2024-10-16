import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ButtonClick from "../../common/Button";
import FlexCol from "../../common/FlexCol";
import Regularize from "./Regularize";
import API, { action } from "../../Api";
import Heading from "../../common/Heading";
import { PiDeviceMobileCamera, PiFingerprint } from "react-icons/pi";
import { NoData } from "../../common/SVGFiles";
import RegularizeDetails from "./RegularizeDetails";
import DateSliderPicker from "../../common/DatePickerSlide";
import EmployeeTimeline from "../EmployeeAttendance/EmployeeTimeline";
import { useNotification } from "../../../Context/Notifications/Notification";
import SearchBox from "../../common/SearchBox";
import CustomSkeleton from "../../common/CustomSkeleton";
import { checkEmployeeMonthPayout } from "../../common/Functions/commonFunction";
import localStorageData from "../../common/Functions/localStorageKeyValues";

export default function MyAttendanceProfile({ path, employee = null }) {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);
  const [openApplied, setOpenApplied] = useState(false);
  const [openBtnName, setOpenBtnName] = useState(false);

  const [selectedMethod, setSelectedMethod] = useState(false);
  const [attendenceDetailsId, setAttendenceDetailsId] = useState();
  const [attendenceEmployeeId, setAttendenceEmployeeId] = useState();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [updateId, setUpdateId] = useState();
  const [filterkey, setFilterKey] = useState("all");

  const [myAttendence, setMyAttendence] = useState([]);
  const [myAttendenceFilter, setMyAttendenceFilter] = useState([]);
  const [dateSearch, setDateSearch] = useState("");

  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [employeeId, setEmployeeId] = useState(
    employee || localStorageData.employeeId
  );
  const [monthAndyear, setMonthAndYear] = useState(null);
  const [attendenceSummary, setAttendenceSummary] = useState([]);
  const [payoutStatus, setPayoutStatus] = useState(0);

  useEffect(() => {
    if (employee) setEmployeeId(employee);
    setCompanyId(localStorageData.companyId);
  }, [employee]);

  const { showNotification } = useNotification();

  const openNotification = (type, title, description) => {
    showNotification({
      placement: "top",
      message: title,
      description: description,
      type: type,
    });
  };
  useMemo(() => {
    setDateSearch("");

    setMyAttendence(
      filterkey !== "all"
        ? myAttendenceFilter?.filter(
            (each) =>
              (each.status?.toLowerCase() === filterkey ||
                (filterkey === "leave" &&
                  parseInt(each.isLeave) === 1 &&
                  parseInt(each.isPaidLeave) === 1) ||
                (filterkey === "absent" &&
                  (parseInt(each.isLeave) === 1 &&
                  parseInt(each.isPaidLeave) === 0 &&
                  parseInt(each.isOffDay) === 0 )&&
                  parseInt(each.isHoliday) === 0 &&
                  parseInt(each.isHalfDay) === 0) ||
                (filterkey === "fine" &&
                  (parseInt(each.isRegularizationNeeded) !== 0 ||
                    parseInt(each.isFine) === 1 ||
                    parseInt(each.isExcused) === 1)) ||
                (filterkey === "halfDay" && parseInt(each.isHalfDay) === 1) ||
                (filterkey === "overTime" && parseInt(each.isOverTime) === 1) ||
                // &&
                // each.employeeOvertimeDataId
                (parseInt(each.isOffDay) === 1 && filterkey === "offDay") ||
                (parseInt(each.isHoliday) === 1 && filterkey === "offDay")) && {
                ...each,
              }
          )
        : myAttendenceFilter
    );
  }, [filterkey]);

  const employeeMonthPayout = async () => {
    try {
      const result = await checkEmployeeMonthPayout(employeeId, monthAndyear);
      if (result.status === 200) {
        setPayoutStatus(result.result.payoutStatus);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    employeeMonthPayout();
  }, []);

  const getMyAttendence = async () => {
    try {
      const result = await action(API.GET_MY_ATTENDENCE, {
        employeeId: employeeId,
        neededYearAndMonth: monthAndyear || null,
        companyId: companyId,
      });
      if (result.status === 200) {
        setMyAttendence(result.result);
        setMyAttendenceFilter(result.result);
        setDateSearch("");
      }
    } catch (error) {
      openNotification("error", "Failed..", error.code);
    }
  };

  const getAttendenceSummary = async () => {
    try {
      const result = await action(API.GET_EMPLOYEE_ATTENDENCE_SUMMARY, {
        companyId: companyId,
        employeeId: employeeId,
        neededYearAndMonth: monthAndyear || null,
      });

      setAttendenceSummary([
        {
          label: "All",
          percentage: result.result?.allCount,
          color: "#6a4bfc",
          value: "all",
        },
        {
          label: "Present",
          percentage: result.result?.presentForAttendance,
          color: "#349C5E",
          value: "present",
        },

        {
          label: "Half-Day",
          percentage: result.result?.halfdayForAttendance,
          color: "#E68E02",
          value: "halfDay",
        },

        {
          label: "Off Day / Holiday",
          percentage: result.result?.offDays + result.result?.holiDayCount,
          color: "#f547a4",
          value: "offDay",
        },
        {
          label: "Paid Leave",
          percentage: result.result?.onLeave,
          color: "#365DE0",
          value: "leave",
        },

        {
          label: "Unpaid Leave",
          percentage: result.result?.absenttForAttendance,
          color: "#C82920",
          value: "absent",
        },
        {
          label: "Overtime",
          color: "#B736DC",
          percentage:
            Number(result.result?.overTime?.approvedOverTimeCount) +
            Number(result.result?.overTime?.pendingOverTimeCount),
          custom: true,
          fields: (
            <div className="flex flex-col items-end justify-center gap-2">
              <p className="text-xs lg:text-[10px] 2xl:text-xs whitespace-nowrap">
                <span className="text-[#9A9A9A]">Approved: </span>{" "}
                <span className="font-semibold">
                  {" "}
                  {result.result?.overTime?.approvedOverTimeHours || "00h 00m"}
                </span>
              </p>
              <p className="text-xs lg:text-[10px] 2xl:text-xs whitespace-nowrap">
                <span className="text-[#9A9A9A]">Pending: </span>{" "}
                <span className="font-semibold">
                  {result.result?.overTime?.pendingOverTimeHours || "00h 00m"}
                </span>
              </p>
            </div>
          ),
          value: "overTime",
        },
        {
          label: "Fine",
          percentage:
            Number(result.result?.fine?.finedCount) +
            Number(result.result?.fine?.pardonedFineCount),
          custom: true,
          color: "#2980BB",
          fields: (
            <div className="flex flex-col items-end justify-center gap-2">
              <p className="text-xs lg:text-[10px] 2xl:text-xs whitespace-nowrap">
                <span className="text-[#9A9A9A]">Pardon: </span>{" "}
                <span className="font-semibold">
                  {" "}
                  {result.result?.fine?.pardonedHours || "00h 00m"}
                </span>
              </p>
              <p className="text-xs lg:text-[10px] 2xl:text-xs whitespace-nowrap">
                <span className="text-[#9A9A9A]">Fine: </span>{" "}
                <span className="font-semibold">
                  {result.result?.fine?.finedHours || "00h 00m"}
                </span>
              </p>
            </div>
          ),
          value: "fine",
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMyAttendence();
    getAttendenceSummary();
  }, [monthAndyear, employeeId]);

  const dateFormater = (data) => {
    const date = data === undefined ? new Date() : data;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");

    const formattedDate = `${year}-${month}`;
    return formattedDate;
  };
  const handleDateChange = (date, type) => {
    let dateValue = null;
    setDateSearch(""); // If the date is changed the search box value is set to empty
    setFilterKey("all"); //If the date is changed the filter value is set to all field
    if (type === "datePicker") {
      dateValue = date;
    } else {
      dateValue = dateFormater(date);
    }
    setMonthAndYear(dateValue);
    setSelectedDate(new Date(dateValue));
  };
  const AttendanceItem = ({ entry, filterkey, setFilterKey }) => (
    <div
      className={`p-2.5 borderb cursor-pointer rounded-lg grid grid-cols-2 sm:flex gap-2.5 bg-white dark:bg-dark ${
        entry.custom && "!p-1.5"
      }`}
      onClick={() => setFilterKey(entry.value)}
      style={{
        borderColor: filterkey === entry.value && entry.color,
      }}
    >
      <div
        className={`flex flex-col justify-center gap-1.5 w-full ${
          entry.custom &&
          "!py-1.5 !px-2.5 w-fit rounded-md bg-secondaryWhite dark:bg-secondaryDark items-center justify-center"
        }`}
      >
        <span className="text-xs lg:text-[10px] 2xl:text-xs font-medium">
          {entry.label}
        </span>
        <p className="flex items-center gap-2">
          <span className="relative flex size-2.5">
            <span
              className="absolute inline-flex w-full h-full rounded-full opacity-75"
              style={{
                backgroundColor: entry.color,
                opacity: 0.7,
              }}
            ></span>
            <span
              className="relative inline-flex rounded-full size-2.5"
              style={{
                backgroundColor: entry.color,
              }}
            ></span>
          </span>
          <span className="text-base font-semibold lg:text-sm 2xl:text-base">
            {entry.percentage || 0}
          </span>
        </p>
      </div>
      {entry.custom && entry.fields}
    </div>
  );

  const filteredAttendence = dateSearch
    ? myAttendence.filter((item) => {
        return item.date.includes(dateSearch);
      })
    : myAttendence;
  const [header, setHeader] = useState([
    {
      id: 2,
      title: "Date",
      value: "date",
    },
    { id: 1, title: "Shift Name", value: "shiftname" },
    {
      id: 2,
      title: "Status",
      value: "status",
    },
    {
      id: 2,
      title: "Check In",
      value: "checkin",
    },
    {
      id: 2,
      title: "Check Out",
      value: "checkout",
    },
    {
      id: 2,
      title: "Hours Worked",
      value: "hoursworked",
    },
    {
      id: 2,
      title: "Extra Hours",
      value: "extrahoursworked",
    },
  ]);

  return (
    <FlexCol>
      <div className="flex flex-col justify-between gap-4 md:items-center md:flex-row ">
        {path === "employeeProfile" ? (
          <Heading
            title={t("Attendance")}
            // description={t(
            //   "Provides employees with insights into their attendance, late arrivals, and adherence to work-related policies."
            // )}
          />
        ) : path === "myProfile" ? (
          <Heading
            title={t("My Attendance")}
            // description={t(
            //   "Provides employees with insights into their attendance, late arrivals, and adherence to work-related policies."
            // )}
          />
        ) : (
          <Heading
            title={t("My Attendance")}
            description={t(
              "Provides employees with insights into their attendance, late arrivals, and adherence to work-related policies."
            )}
          />
        )}

        <div className="flex flex-col gap-4 md:items-center md:flex-row">
          <DateSliderPicker
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            mode={"month"}
          />
          <SearchBox
            placeholder="Search"
            data={myAttendence}
            value={dateSearch}
            change={(value) => {
              setDateSearch(value);
            }}
          />
        </div>
      </div>

      {attendenceSummary?.length > 0 ? (
        <div className="flex flex-col justify-between gap-8 md:flex-row ">
          <div className="grid flex-grow grid-cols-2 gap-2 2xl:gap-3 sm:grid-cols-3 xl:grid-cols-6 3xl:grid-cols-7">
            {[...attendenceSummary.slice(0, 6)].map((entry, index) => (
              <AttendanceItem
                key={index}
                entry={entry}
                filterkey={filterkey}
                setFilterKey={setFilterKey}
              />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-2 2xl:gap3 sm:grid-cols-2">
            {attendenceSummary.slice(6).map((entry, index) => (
              <AttendanceItem
                key={index + 6}
                entry={entry}
                filterkey={filterkey}
                setFilterKey={setFilterKey}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-between gap-2 md:flex-row">
          <div className="grid flex-grow grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6 3xl:grid-cols-7">
            <CustomSkeleton avatar={{ size: 36, shape: "square" }} rows={1} />
            <CustomSkeleton avatar={{ size: 36, shape: "square" }} rows={1} />
            <CustomSkeleton avatar={{ size: 36, shape: "square" }} rows={1} />
            <CustomSkeleton avatar={{ size: 36, shape: "square" }} rows={1} />
            <CustomSkeleton avatar={{ size: 36, shape: "square" }} rows={1} />
            <CustomSkeleton avatar={{ size: 36, shape: "square" }} rows={1} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:w-[35%]">
            <CustomSkeleton avatar={{ size: 36, shape: "square" }} rows={1} />
            <CustomSkeleton avatar={{ size: 36, shape: "square" }} rows={1} />
          </div>
        </div>
      )}
      <div className="w-full overflow-hidden border-none sm:border-solid responsiveTable borderb sm:!border rounded-xl">
        <table className="flex flex-row flex-no-wrap w-full">
          <thead className="text-gray-500">
            {/* Do not remove this table header loop, as it ensures responsiveness on mobile devices */}
            {filteredAttendence.map((item, index) => (
              <tr
                key={index}
                className="flex flex-col mb-2 text-xs xl:text-[9px] 2xl:text-xs rounded-l-lg sm:border-none border-l border-t border-b border-black/10 dark:border-white/20 flex-no wrap sm:table-row sm:rounded-none sm:mb-0 bg-primaryalpha/10 dark:bg-white/20 sm:bg-transparent dark:sm:bg-transparent sm:sticky sm:top-0 sm:bg-[#FBFBFB] sm:dark:bg-slate-800 text-gray-500 rounded-s-xl overflow-hidden sm:overflow-visible"
              >
                {header.map((column) => (
                  <th
                    key={column.id}
                    className="h-[50px] sm:h-auto p-3 font-normal text-left"
                  >
                    {column.title}
                  </th>
                ))}
                <th className="p-3 h-[50px] sm:h-auto font-normal text-left">
                  Action
                </th>
              </tr>
            ))}
          </thead>
          <tbody className="justify-center flex-1 sm:flex-none">
            {filteredAttendence.length > 0 ? (
              filteredAttendence.map((item, index) => (
                <tr
                  key={index}
                  className={` ${
                    parseInt(item.isOffDay) === 1 &&
                    (item.firstCheckInTime || item.lastCheckOutTime) &&
                    "font-medium text-[#318BDE] bg-[#EBF7FF] dark:bg-[#318BDE]/30 py-3 px-4 rounded-lg"
                  }  flex flex-col text-xs xl:text-[9px] 2xl:text-sm cursor-pointer dark:text-white mb-2 flex-no wrap sm:table-row sm:mb-0 hover:bg-slate-600/5 sm:border-t border-black dark:border-white border-opacity-10 dark:border-opacity-20 sm:border-r-0 sm:border-b-0 border-r border-t border-b border-black/10 dark:border-white/20 rounded-e-xl sm:rounded-none overflow-hidden sm:overflow-visible`}
                  onClick={() => {
                    setOpen(true);
                    setAttendenceDetailsId(item.employeeDailyAttendanceId);
                    setAttendenceEmployeeId(item.employeeId);
                  }}
                >
                  <td className="p-3 h-[50px] sm:h-auto">
                    <div className="flex flex-col gap-1.5">
                      {item.date}
                      {item.offday && (
                        <p className="font-medium text-[#318BDE] bg-[#EBF7FF] dark:bg-[#318BDE]/30 px-2.5 py-0.5 rounded-full w-fit leading-[20px]">
                          {item.offday}
                        </p>
                      )}
                    </div>
                  </td>
                  {parseInt(item.isOffDay) === 1 &&
                  !item.firstCheckInTime &&
                  !item.lastCheckOutTime ? (
                    <td colSpan="7" className="p-3 h-[350px] sm:h-auto">
                      <p className="font-medium text-[#318BDE] bg-[#EBF7FF] dark:bg-[#318BDE]/30 py-3 px-4 rounded-lg">
                        Off day
                      </p>
                    </td>
                  ) : (
                    <>
                      <td className="p-3 h-[50px] sm:h-auto truncate">
                        {item.shiftName ? (
                          <p className="font-medium text-gray-700 px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-600/30 dark:text-gray-300 w-fit leading-[20px]">
                            {item.shiftName}
                          </p>
                        ) : parseInt(item.isOffDay) === 1 &&
                          (item.firstCheckInTime || item.lastCheckOutTime) ? (
                          "Off Day"
                        ) : (
                          "--"
                        )}
                      </td>
                      <td className="p-3 h-[50px] sm:h-auto truncate">
                        {item.status ? (
                          <div className="flex gap-2 ">
                            <p
                              className={`font-medium px-2.5 py-0.5 rounded-full  w-fit leading-[20px] ${
                                item.status === "Present"
                                  ? " text-green-700  bg-green-100 dark:bg-green-600/30 dark:text-green-300"
                                  : parseInt(item.isHalfDay) === 1
                                  ? "text-[#E68E02]  bg-orange-100 dark:bg-orange-600/30 dark:text-orange-300"
                                  : parseInt(item.isHoliday) === 1
                                  ? "text-[#f547a4]  bg-[#f547a4]/10 dark:bg-[#f547a4]/20 dark:text-[#f547a4]"
                                  : parseInt(item.isLeave) === 1 &&
                                    parseInt(item.isPaidLeave) === 1
                                  ? "text-blue-700  bg-blue-100 dark:bg-blue-600/30 dark:text-blue-300"
                                  : " text-red-700  bg-red-100 dark:bg-red-600/30 dark:text-red-300"
                              }`}
                            >
                              {parseInt(item.isHalfDay) === 1
                                ? "Half-Day"
                                : // : parseInt(item.isLeave) === 1
                                // ? item.leaveType || item.status
                                parseInt(item.isLeave) === 1 &&
                                  parseInt(item.isPaidLeave) === 1
                                ? "Paid Leave"
                                : parseInt(item.isLeave) === 1 &&
                                  parseInt(item.isPaidLeave) === 0 &&
                                  parseInt(item.isHoliday) === 0
                                ? "Unpaid Leave"
                                : item.status.charAt(0).toUpperCase() +
                                  item.status.slice(1)}
                            </p>
                            {parseInt(item.isHalfDay) === 1 &&
                            parseInt(item.isLeave) === 1 ? (
                              <p
                                className={`font-medium px-2.5 py-0.5 rounded-full  w-fit leading-[20px] text-blue-700  bg-blue-100 dark:bg-blue-600/30 dark:text-blue-300`}
                              >
                                {item.leaveType || "Leave Approved"}
                              </p>
                            ) : null}
                          </div>
                        ) : (
                          "--"
                        )}
                      </td>
                      <td className="p-3 h-[50px] sm:h-auto truncate">
                        {item.firstCheckInTime ? (
                          <div className="flex items-center gap-1">
                            {item.punchtype === "mobile" ? (
                              <PiDeviceMobileCamera
                                size={18}
                                className="opacity-50 dark:text-white"
                              />
                            ) : (
                              <PiFingerprint
                                size={18}
                                className="opacity-50 dark:text-white"
                              />
                            )}
                            {item.firstCheckInTime}
                          </div>
                        ) : (
                          "--"
                        )}
                      </td>
                      <td className="p-3 h-[50px] sm:h-auto truncate">
                        {item.lastCheckOutTime ? (
                          <div className="flex items-center gap-1">
                            {item.punchtype === "mobile" ? (
                              <PiDeviceMobileCamera
                                size={18}
                                className="opacity-50 dark:text-white"
                              />
                            ) : (
                              <PiFingerprint
                                size={18}
                                className="opacity-50 dark:text-white"
                              />
                            )}
                            {item.lastCheckOutTime}
                          </div>
                        ) : (
                          "--"
                        )}
                      </td>
                      <td className="p-3 h-[50px] sm:h-auto truncate">
                        <div className="flex items-center gap-2">
                          {item.totalWorkHours !== "0m"
                            ? item.totalWorkHours
                            : "--"}
                          {item.hoursWorkedMessage ? (
                            <p className="font-medium text-orange-700 px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-600/30 dark:text-orange-300 w-fit leading-[20px]">
                              {item.hoursWorkedMessage}
                            </p>
                          ) : (
                            ""
                          )}
                        </div>
                      </td>
                      <td className="p-3 h-[50px] sm:h-auto truncate">
                        {item.extraHours || "--"}
                      </td>

                      <td className="flex items-center justify-start gap-2 p-2 h-[50px] truncate">
                        {parseInt(item.isRegularizationNeeded) === 1 ? (
                          <ButtonClick
                            buttonName="Regularize"
                            handleSubmit={() => {
                              setOpen(false);
                              setShow(true);
                              setUpdateId(item.employeeDailyAttendanceId);
                            }}
                            className={
                              "bg-red-100 text-red-600 border-red-200 shadow-md"
                            }
                            disabled={
                              parseInt(payoutStatus) === 1 ? true : false
                            }
                          />
                        ) : parseInt(item.isRegularizationNeeded) === 2 ? (
                          <ButtonClick
                            buttonName="Partially Requested "
                            handleSubmit={() => {
                              setOpen(false);
                              setShow(true);
                              setUpdateId(item.employeeDailyAttendanceId);
                            }}
                            className={
                              "bg-orange-100 text-orange-600 border-orange-200 shadow-md"
                            }
                            disabled={
                              parseInt(payoutStatus) === 1 ? true : false
                            }
                          />
                        ) : (
                          parseInt(item.isRegularizationNeeded) === 3 && (
                            <ButtonClick
                              buttonName="Requested"
                              handleSubmit={() => {
                                setOpen(false);
                                setShow(true);
                                setUpdateId(item.employeeDailyAttendanceId);
                              }}
                              className={
                                "bg-yellow-100 text-yellow-600 border-yellow-200 shadow-md"
                              }
                              disabled={
                                parseInt(payoutStatus) === 1 ? true : false
                              }
                            />
                          )
                        )}
                        {parseInt(item.isExcused) === 1 && (
                          <ButtonClick
                            buttonName="Pardoned"
                            handleSubmit={() => {
                              setOpen(false);
                              setOpenApplied(true);
                              setOpenBtnName("Approved");
                              setSelectedMethod("isExcused");
                              setUpdateId(item.employeeDailyAttendanceId);
                            }}
                            className={
                              "bg-green-100 text-green-600 border-green-200 shadow-md"
                            }
                            disabled={
                              parseInt(payoutStatus) === 1 ? true : false
                            }
                          />
                        )}
                        {parseInt(item.isFine) === 1 && (
                          <ButtonClick
                            buttonName="Applied Fine"
                            handleSubmit={() => {
                              setOpen(false);
                              setOpenApplied(true);
                              setOpenBtnName("Fine");
                              setSelectedMethod("isFine");
                              setUpdateId(item.employeeDailyAttendanceId);
                            }}
                            className={
                              "bg-red-100 text-red-600 border-red-200 shadow-md"
                            }
                            disabled={
                              parseInt(payoutStatus) === 1 ? true : false
                            }
                          />
                        )}
                      </td>
                    </>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={header.length + 1} className="p-3">
                  <div className="flex items-center justify-center h-full">
                    <NoData />
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {show === true && updateId && (
        <Regularize
          open={show}
          close={() => {
            getMyAttendence();
            setOpen(false);

            setShow(false);
          }}
          employeeId={employeeId}
          updateId={updateId}
        />
      )}
      {open && !show && !openApplied && (
        <EmployeeTimeline
          open={open}
          close={() => {
            setOpen(false);
          }}
          attendanceId={attendenceDetailsId}
          employeeId={attendenceEmployeeId}
        />
      )}
      {openApplied && (
        <RegularizeDetails
          open={openApplied}
          close={() => {
            setOpen(false);
            setOpenApplied(false);
          }}
          updateId={updateId}
          selectedMethod={selectedMethod}
          Heading={openBtnName}
        />
      )}
    </FlexCol>
  );
}
