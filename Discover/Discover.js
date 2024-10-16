import React, { useEffect, useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import WavingHand from "../../assets/images/wavinghand.svg";

import MyFeeds from "./MyFeeds";
import WorkScheduleCard from "./WorkScheduleCard";
import LeaveBalanceCard from "./LeaveBalanceCard";
import WorkEntriesCard from "./WorkEntriesCard";
import AttendanceSummaryCard from "./AttendanceSummaryCard";
import RequestsCard from "./RequestsCard";
import TeamMemberCard from "./TeamMemberCard";
import DocumentCard from "./DocumentCard";
import HolidayCard from "./HolidayCard";

import API, { action } from "../Api";
import LeaveRequest from "../Time/MyLeave/LeaveRequest";
import Loader from "../common/Loader";
import UpcomingShiftsCard from "./UpcomingShiftsCard";
import DateAndTime from "./DateAndTime";
import ReportingTeamMemberCard from "./ReportingTeamMemberCard";
import MyAttendanceSummaryCard from "./MyAttendanceSummaryCard";
import localStorageData from "../common/Functions/localStorageKeyValues";

const layout = [
  { i: "workSchedule", x: 0, y: 0, w: 1, h: 1 },
  { i: "leaveBalance", x: 1, y: 0, w: 1, h: 1 },
  { i: "requests", x: 0, y: 1, w: 2, h: 1 },
  { i: "myAttendanceSummaryCard", x: 0, y: 2, w: 1, h: 1 },
  { i: "attendanceSummary", x: 1, y: 2, w: 1, h: 1 },
  { i: "workEntries", x: 0, y: 3, w: 1, h: 1 },
  { i: "upcomingShifts", x: 1, y: 3, w: 1, h: 1 },
  { i: "teamMembers", x: 0, y: 4, w: 1, h: 1 },
  { i: "reportingTeamMembers", x: 1, y: 4, w: 1, h: 1 },
  { i: "documents", x: 0, y: 5, w: 1, h: 1 },
  { i: "holidays", x: 1, y: 5, w: 1, h: 1 },
];

export default function Discover() {
  const ResponsiveGridLayout = WidthProvider(Responsive);

  const [employeeId, setEmployeeId] = useState(localStorageData.employeeId);
  const [companyId, setCompanyId] = useState(localStorageData.companyId);

  const [show, setShow] = useState(false);

  const [holidays, setHolidays] = useState([]);

  const [employeeList, setemployeeList] = useState([]);

  const [leaves, setLeaves] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [punchInReloadAttendance, setPunchInReloadAttendance] = useState(false);

  // Retrieve permissions from local storage
  useEffect(() => {
    const loginData = localStorageData.LoginData;
    if (
      loginData &&
      loginData.userData &&
      Array.isArray(loginData.userData.permissions)
    ) {
      setPermissions(loginData.userData.permissions);
    } else {
      setPermissions([]);
    }
  }, []);

  const getEmployee = async () => {
    try {
      const result = await action(API.GET_EMPLOYEE_ID_BASED_RECORDS, {
        id: employeeId,
      });
      setemployeeList(result.result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getEmployee();
  }, [companyId]);

  const getHolidays = async () => {
    const result = await action(API.DASHBOARD_EMPLOYEE_HOLIDAY, {
      id: employeeId,
      companyId: companyId,
    });
    if (result.status === 200)
      setHolidays(
        result?.result?.map((each, i) => ({
          id: i,
          name: each.holidayName,
          date: each.holidayDate,
          day: each.holidayType,
        }))
      );
  };

  useEffect(() => {
    if (employeeId && companyId) getHolidays();
  }, [companyId]);
  const getTimeOfDay = () => {
    const hours = new Date().getHours();

    if (hours >= 6 && hours < 12) {
      return "morning";
    } else if (hours >= 12 && hours < 18) {
      return "afternoon";
    } else if (hours >= 18 && hours < 24) {
      return "evening";
    } else {
      return "night"; // Optional
    }
  };
  const [timeOfDay, setTimeOfDay] = useState("");

  useEffect(() => {
    setTimeOfDay(getTimeOfDay());
  }, []);

  const textItems = [
    `Hello,  ${
      employeeList?.firstName + " " + employeeList?.lastName
    }, It's great to have you back.`,
    `Good ${timeOfDay},  ${
      employeeList?.firstName + " " + employeeList?.lastName
    }, Welcome back to your account.`,
    `Hey there,  ${
      employeeList?.firstName + " " + employeeList?.lastName
    }, Ready to dive back in?`,
    `Hi,  ${
      employeeList?.firstName + " " + employeeList?.lastName
    }, We hope you're having a fantastic day. Welcome back!`,
    `Greetings,  ${
      employeeList?.firstName + " " + employeeList?.lastName
    }, Your presence brightens our digital space once again.`,
    `Salutations,  ${
      employeeList?.firstName + " " + employeeList?.lastName
    }, Your return is always appreciated.`,
    `Hola,  ${
      employeeList?.firstName + " " + employeeList?.lastName
    }, We're thrilled to see you back in action.`,
    `Welcome back,  ${
      employeeList?.firstName + " " + employeeList?.lastName
    }, Your presence makes our virtual workplace better.`,
    `Bonjour,  ${
      employeeList?.firstName + " " + employeeList?.lastName
    }, We're delighted to have you back with us.`,
    `Hey,  ${
      employeeList?.firstName + " " + employeeList?.lastName
    }, Your login brings a smile to our virtual faces. Welcome back!`,
    `Hi,  ${
      employeeList?.firstName + " " + employeeList?.lastName
    }, Your return lights up our digital doorway. Welcome back!`,
    `Welcome,  ${
      employeeList?.firstName + " " + employeeList?.lastName
    }, Your presence here makes our day brighter.`,
    `Hey,  ${
      employeeList?.firstName + " " + employeeList?.lastName
    }, welcome back! We've been eagerly awaiting your return.`,
    `Good to see you again,  ${
      employeeList?.firstName + " " + employeeList?.lastName
    }, Ready to conquer the day?`,
    `Hello,  ${
      employeeList?.firstName + " " + employeeList?.lastName
    }, it's a pleasure to have you back in the loop.`,
    `Greetings,  ${
      employeeList?.firstName + " " + employeeList?.lastName
    }, Your login is a ray of sunshine on our screens.`,
    `Hey there,  ${
      employeeList?.firstName + " " + employeeList?.lastName
    }, We've missed your virtual presence. Welcome back!`,
    `Welcome back,  ${
      employeeList?.firstName + " " + employeeList?.lastName
    }, Your login is music to our digital ears.`,
    `Hi,  ${
      employeeList?.firstName + " " + employeeList?.lastName
    }, it's great to see you again! Let's make today amazing.`,
    `Hello again,  ${
      employeeList?.firstName + " " + employeeList?.lastName
    }, We're excited to have you back with us.`,
    `Greetings,  ${
      employeeList?.firstName + " " + employeeList?.lastName
    }, Your presence here adds a spark to our virtual community.`,
    `Hi,  ${
      employeeList?.firstName + " " + employeeList?.lastName
    }, Your return brings a sense of camaraderie to our digital workspace.`,
    `Welcome back,  ${
      employeeList?.firstName + " " + employeeList?.lastName
    }, We're all smiles seeing you here again.`,
    `Hello,  ${
      employeeList?.firstName + " " + employeeList?.lastName
    }, Your login brings a wave of positivity to our virtual world.`,
    `Hey,  ${
      employeeList?.firstName + " " + employeeList?.lastName
    }, welcome back! Let's make today even better together.`,
    `Good  ${timeOfDay},  ${
      employeeList?.firstName + " " + employeeList?.lastName
    }, Your login brightens our virtual day.`,
    `Hi there,  ${
      employeeList?.firstName + " " + employeeList?.lastName
    }, Your presence is a reminder of why our team shines.`,
    `Welcome,  ${
      employeeList?.firstName + " " + employeeList?.lastName
    }, Your login is a sign that today is going to be awesome.`,
    `Hello,  ${
      employeeList?.firstName + " " + employeeList?.lastName
    }, it's fantastic to see you back! Let's tackle our goals together.`,
    `Hey, ${
      employeeList?.firstName + " " + employeeList?.lastName
    }, Your return is like a breath of fresh air in our digital world.`,
    `Welcome back,  ${
      employeeList?.firstName + " " + employeeList?.lastName
    }, It's a joy to have you back in the fold.`,
    `Hello again,  ${
      employeeList?.firstName + " " + employeeList?.lastName
    }, Seeing you back brings a smile to our faces.`,
    `Hi there,  ${
      employeeList?.firstName + " " + employeeList?.lastName
    }, We're thrilled to have you return to us.`,
    `Welcome back,  ${
      employeeList?.firstName + " " + employeeList?.lastName
    }, Your presence here makes our day brighter.`,
    `Hey,  ${
      employeeList?.firstName + " " + employeeList?.lastName
    }, it's wonderful to see you back! Let's make great things happen.`,
    `Hello once more,  ${
      employeeList?.firstName + " " + employeeList?.lastName
    }, Your return is a welcome sight indeed.`,
    `Welcome back,  ${
      employeeList?.firstName + " " + employeeList?.lastName
    }, Your presence adds a special touch to our day.`,
    `Hey,  ${
      employeeList?.firstName + " " + employeeList?.lastName
    }, glad to have you back! Let's pick up where we left off.`,
    `Hi,  ${
      employeeList?.firstName + " " + employeeList?.lastName
    }, it's fantastic to see you again! Ready to dive back into action?`,
    `Welcome back,  ${
      employeeList?.firstName + " " + employeeList?.lastName
    }, Your return fills us with renewed energy and enthusiasm.`,
  ];

  const getRandomText = (items) => {
    const randomIndex = Math.floor(Math.random() * items.length);
    return items[randomIndex];
  };

  const [randomText, setRandomText] = useState("");

  useEffect(() => {
    setRandomText(getRandomText(textItems));
  }, []); // Empty dependency array means this runs once when the component mounts

  const handleChangeText = () => {
    setRandomText(getRandomText(textItems));
  };
  useEffect(() => {
    if (employeeList?.firstName && timeOfDay) handleChangeText();
  }, [employeeList?.firstName, timeOfDay]);

  const cardPermissions = {
    WorkScheduleCard: 48,
    LeaveBalanceCard: 49,
    AttendanceSummaryCard: 53,
    UpcomingShiftsCard: 59,
    TeamMemberCard: 60,
    DocumentCard: 62,
    HolidayCard: 63,
    MyFeeds: 64,
    ReportingTeamMemberCard: 61,
    MyAttendanceSummaryCard: 52,
    RequestsExcuses: 54,
    RequestsPunchApproval: 55,
    RequestsWorkFromHome: 56,
    RequestsLetterRequest: 57,
    RequestsLeaveRequest: 58,
    AllWorkEntries: 50,
    MyWorkEntries: 51,
  };

  const hasPermission = (permissionId) => permissions.includes(permissionId);

  return (
    <>
      {employeeList?.firstName ? (
        <div className="absolute top-0 left-0 grid grid-cols-12 bg-primaryalpha/5 dark:bg-[#1B1B1B] w-full overflow-auto scrollbar-none">
          <div className="flex flex-col xl:h-[92vh] zoomheight scrollbar-none overflow-y-auto overflow-x-hidden col-span-12 gap-4 py-6 px-4 pr-4 lg:px-6  xl:col-span-8 2xl:col-span-7">
            <div className="flex flex-col flex-wrap justify-between gap-6 xl:items-center xl:flex-row xl:gap-3">
              <div className="z-10 flex items-center gap-2">
                <div className="overflow-hidden border-2 border-white rounded-full shadow-xl dark:border-dark3 2xl:size-16 size-12 img-pro shrink-0">
                  {employeeList.profilePicture ? (
                    <img
                      className="object-cover object-center w-full h-full"
                      src={employeeList.profilePicture}
                      alt={
                        employeeList?.firstName + " " + employeeList?.lastName
                      }
                    />
                  ) : (
                    <p className="flex items-center justify-center object-cover h-full p-2 font-semibold text-primary bg-primaryLight ">
                      {employeeList?.firstName?.charAt(0).toUpperCase()}
                    </p>
                  )}
                </div>

                <div className="flex flex-col">
                  <p className="flex items-center gap-1 text-sm font-medium 2xl:text-base dark:text-darkText text-grey">
                    <img
                      src={WavingHand}
                      className="w-6 h-6"
                      alt="WavingHand"
                    />
                    {/* Welcome back, */}
                    {randomText.split(",")[0]}
                  </p>
                  <h1 className="h1">
                    {/* {employeeList?.firstName?.charAt(0).toUpperCase() +
                      employeeList?.firstName?.slice(1) +
                      " " +
                      employeeList?.lastName?.charAt(0).toUpperCase() +
                      employeeList?.lastName?.slice(1)} */}
                    {randomText.split(",")[1]?.charAt(2).toUpperCase() +
                      randomText.split(",")[1]?.slice(3)}
                  </h1>
                  <p className="text-xs font-medium 2xl:text-sm dark:text-darkText text-grey">
                    {/* <span className="text-primary">Happy {dayName}!, </span> */}
                    <span className="">
                      {/* Let's be productive today. */}
                      {randomText.split(",")[2]}
                    </span>
                  </p>
                </div>
              </div>

              <DateAndTime />
            </div>

            {/* 1st and 2nd box */}
            {/* 
            {parseInt(employeeList?.adminLevel) === 0 && (
              <div className="grid w-full grid-cols-12 gap-4 ">
                <div className="w-full col-span-12 md:col-span-6 xl:col-span-6 2xl:col-span-5 2xxl:col-span-6 3xl:col-span-6 4xl:col-span-6 zoomgrid">
                 
                </div>
                <div className="w-full col-span-12 md:col-span-6 xl:col-span-6 2xl:col-span-7 2xxl:col-span-6 3xl:col-span-6 4xl:col-span-6 zoomgrid">
                  <LeaveBalanceCard
                    leaveData={leaves}
                    change={() => {
                      setShow(true);
                    }}
                  />
                </div>
              </div>
            )} */}
            <div className="pb-2 zoom-moz10">
              <ResponsiveGridLayout
                className="layout "
                layouts={{ lg: layout }}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ xl: 3, lg: 2, md: 2, sm: 2, xs: 2, xxs: 1 }}
                rowHeight={290}
                isResizable={false}
                isDraggable={true}
                useDragHandle={true}
                draggableHandle=".react-grid-dragHandle"
                containerPadding={[0, 0]}
                margin={[10, 10]}
                maxRows={4}
                compactType="vertical"
                useCSSTransforms={true}
              >
                {parseInt(employeeList?.adminLevel) === 0 &&
                  hasPermission(cardPermissions.WorkScheduleCard) && (
                    <div key="workSchedule">
                      <WorkScheduleCard
                        employeeDeatils={employeeList}
                        refereshFun={() => {
                          console.log("result");
                          setPunchInReloadAttendance(true);
                        }}
                      />
                    </div>
                  )}

                {parseInt(employeeList?.adminLevel) === 0 &&
                  hasPermission(cardPermissions.LeaveBalanceCard) && (
                    <div key="leaveBalance">
                      <LeaveBalanceCard
                        leaveData={leaves}
                        change={() => {
                          setShow(true);
                        }}
                      />
                    </div>
                  )}
                {hasPermission(cardPermissions.MyAttendanceSummaryCard) && (
                  <div key="myAttendanceSummaryCard">
                    <MyAttendanceSummaryCard
                      reloadData={punchInReloadAttendance}
                    />
                  </div>
                )}
                {hasPermission(cardPermissions.AttendanceSummaryCard) && (
                  <div key="attendanceSummary">
                    <AttendanceSummaryCard />
                  </div>
                )}
                {(hasPermission(cardPermissions.RequestsExcuses) ||
                  hasPermission(cardPermissions.RequestsPunchApproval) ||
                  hasPermission(cardPermissions.RequestsWorkFromHome) ||
                  hasPermission(cardPermissions.RequestsLetterRequest) ||
                  hasPermission(cardPermissions.RequestsLeaveRequest)) && (
                  <div key="requests">
                    <RequestsCard />
                  </div>
                )}
                {(hasPermission(cardPermissions.AllWorkEntries) ||
                  hasPermission(cardPermissions.MyWorkEntries)) && (
                  <div key="workEntries">
                    <WorkEntriesCard employeeId={employeeId} />
                  </div>
                )}
                {hasPermission(cardPermissions.UpcomingShiftsCard) && (
                  <div key="upcomingShifts">
                    <UpcomingShiftsCard />
                  </div>
                )}
                {hasPermission(cardPermissions.TeamMemberCard) && (
                  <div key="teamMembers">
                    <TeamMemberCard />
                  </div>
                )}
                {hasPermission(cardPermissions.ReportingTeamMemberCard) && (
                  <div key="reportingTeamMembers">
                    <ReportingTeamMemberCard employeeId={employeeId} />
                  </div>
                )}
                {hasPermission(cardPermissions.DocumentCard) && (
                  <div key="documents">
                    <DocumentCard employeeDeatils={employeeList} />
                  </div>
                )}
                {hasPermission(cardPermissions.HolidayCard) && (
                  <div key="holidays">
                    <HolidayCard
                      employeeDeatils={employeeList}
                      holiday={holidays}
                    />
                  </div>
                )}
              </ResponsiveGridLayout>
            </div>
          </div>

          <div className="h-full col-span-12 xl:overflow-auto xl:col-span-4 2xl:col-span-5">
            {hasPermission(cardPermissions.MyFeeds) && (
              <MyFeeds employeeData={employeeList} />
            )}
          </div>

          {show === true && (
            <LeaveRequest
              open={show}
              close={() => {
                // setLeaveId(null);
                // setUpdateId(null);
                setShow(false);
              }}
              employeeId={employeeId}
              // updateId={updateId}
              // refresh={() => {
              //   getMyLeave();
              // }}
              // leaveId={leaveId}
            />
          )}
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
}
