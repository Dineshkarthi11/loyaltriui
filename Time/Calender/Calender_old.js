import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { PiCaretLeftBold, PiCaretRightBold } from "react-icons/pi";

import { GoDotFill } from "react-icons/go";
import ButtonClick from "../../common/Button";
import AddTaskAndEvents from "./AddTaskAndEvents";
import API, { action } from "../../Api";
import Heading from "../../common/Heading";
import localStorageData from "../../common/Functions/localStorageKeyValues";

export default function Calenderr() {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const [employeeId, setEmployeeId] = useState(localStorageData.employeeId);
  const [eventList, setEventList] = useState([]);

  // Set Monday as the first day of the week
  moment.updateLocale("en", {
    week: {
      dow: 1,
    },
  });

  const localizer = momentLocalizer(moment);

  const CustomEvent = ({ event }) => {
    const e = event.title;

    const eventStyle = {
      backgroundColor:
        e === "Present"
          ? "#ECFDF3"
          : e === "Week Off"
          ? "#F0F9FF"
          : e === "Holiday"
          ? "#f547a4"
          : "#FEF3F2",
      // Background color set to pink
      color:
        e === "Present"
          ? "#027A48"
          : e === "Week Off"
          ? "#026AA2"
          : e === "Holiday"
          ? "#f547a4"
          : "#f54e4e",
    };

    return (
      <div className="border-transparent rbc-event-bg-none h-full flex flex-col gap-1.5">
        <div className="flex justify-end h-full">
          {event.title === "Week Off" || event.title === "Holiday" ? (
            <p
              style={eventStyle}
              className="absolute flex items-center gap-1.5 px-1.5 py-0.5 rounded-full w-fit h-fit top-1 text-xs"
            >
              <GoDotFill />
              {event.title}
            </p>
          ) : (
            <p
              // style={eventStyle}
              className={`flex rounded-full border-1 absolute top-1 px-1 text-xs ${
                event.title === "Duty"
                  ? "text-[#027A48] bg-[#ECFDF3]"
                  : "text-[#F04438] bg-[#FEF3F2]"
              }`}
            >
              {event.title === "Duty"
                ? "P"
                : event.title === "Absent"
                ? "A"
                : null}
            </p>
          )}
        </div>

        {/* <div> */}
        {/* {event.title.slice(1).map((subTitle, index) => ( */}
        {event.title != "Absent" && event.title != "Holiday" ? (
          <div
            className={`px-2 p-0.5 gap-1.5 rounded text-xs flex items-center w-fit  ${
              event.value === "duty"
                ? "text-[#6A4BFC] bg-[#faf5ff]"
                : event.value === "holiday"
                ? "text-[#f547a4] bg-[#f8ddec]"
                : "text-[#ca8a04] bg-[#fefce8]"
            }`}
          >
            <GoDotFill />
            {event.title}
          </div>
        ) : null}
        {/* ))} */}
        {/* </div> */}

        {/* Late time */}
        {/* <div className="mt-1 text-orange-500 bg-yellow-100 rounded">
          {moment(event.start).format("HH:mm") !== "00:00"
            ? `${t("Latetime")}: ${moment(event.start).format("HH:mm")}`
            : ""}
        </div> */}

        {/* over time */}
        {/* <div className="mt-1 rounded text-pink bg-rose-200">
          {moment(event.end).format("HH:mm") !== "00:00"
            ? `${t("OverTime")}: ${moment(event.end).format("HH:mm")}`
            : ""}
        </div> */}

        {/* Add any additional data you want to display */}
      </div>
    );
  };

  const CustomToolbar = (toolbar) => {
    const goToBack = () => {
      return <span className="">{toolbar.onNavigate("PREV")}</span>;
    };

    const goToNext = () => {
      return <span className="">{toolbar.onNavigate("NEXT")}</span>;
    };

    const label = () => {
      const startDate = moment(toolbar.date).startOf("month");
      return (
        <span className="2xl:text-xl text-base font-bold ">
          {startDate.format("MMMM YYYY")}
        </span>
      );
    };

    return (
      <div className="flex items-center justify-between w-full px-3.5 py-4">
        <div className="flex items-center gap-3">
          <p className="rbc-toolbar-label">{label()}</p>
          <div className="flex items-center gap-2">
            <ButtonClick
              handleSubmit={goToBack}
              buttonName={<PiCaretLeftBold size={20} />}
              className="transition-all duration-300 hover:bg-primary hover:!text-white"
            ></ButtonClick>
            <ButtonClick
              handleSubmit={goToNext}
              buttonName={<PiCaretRightBold size={20} />}
              className="transition-all duration-300 hover:bg-primary hover:!text-white"
            ></ButtonClick>
          </div>
        </div>
        {/* 
        <ButtonClick buttonName={t("Filters")} icon={<LuListFilter />}>
          {t("Filters")}
          <LuListFilter style={{ marginLeft: "auto" }} />
        </ButtonClick> */}
      </div>
    );
  };

  const calendarDetails = async () => {
    const result = await action(API.GET_CALENDER_DEATILS, {
      employeeId: employeeId,
    });

    setEventList([
      ...result?.result?.duty?.map((each) => ({
        title: "Duty",
        value: "duty",
        start: new Date(each.date),
        end: new Date(each.date),
      })),
      ...result.result.Leaves?.map((each) => ({
        title: "Absent",
        value: "absent",
        start: new Date(each.date),
        end: new Date(each.date),
      })),
      ...result?.result?.offday?.map((each) => ({
        title: "Offday",

        start: new Date(each.date),
        end: new Date(each.date),
      })),
      ...result?.result?.holiday?.map((each) => ({
        title: each.status,
        value: "holiday",
        start: new Date(each.date),
        end: new Date(each.date),
      })),
      // ...result?.result?.unpaidLeave?.map((each) => ({
      //   title: each.status,
      //   value: "unpaidLeave",
      //   start: new Date(each.date),
      //   end: new Date(each.date),
      // })),
      // ...result?.result?.paidLeave?.map((each) => ({
      //   title: each.status,
      //   value: "paidLeave",
      //   start: new Date(each.date),
      //   end: new Date(each.date),
      // })),
    ]);
  };
  useEffect(() => {
    // console.log(new Date("2024-03-07"));
    calendarDetails();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading
          title={t("Calendar")}
          description={t(
            "Overall calendar view facilitates the identification of attendance and other work-related activities."
          )}
        />
        {/* <ButtonClick
          buttonName={t("Create_New_Event")}
          handleSubmit={() => {
            setShow(true);
            // console.log(true);
          }}
          BtnType="Add"
        /> */}
      </div>
      {/* <div className="px-2 py-1 bg-[#ff5758] rounded-md flex items-center text-white w-fit overflow-hidden">
        <p>00:23</p>
        <div>
          <div className="triangle"></div>
        </div>
      </div> */}

      <div className=" mt-6 overflow-hidden borderb rounded-2xl dark:text-white">
        <Calendar
          selectable
          defaultDate={new Date()}
          defaultView="month"
          localizer={localizer}
          events={eventList}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 700 }}
          components={{
            toolbar: CustomToolbar,
            event: CustomEvent,
          }}
        />
      </div>

      {show && (
        <AddTaskAndEvents
          open={show}
          close={() => {
            setShow(false);
          }}
        />
      )}
    </div>
  );
}
