import React, { useEffect, useState } from "react";
import { Calendar } from "antd";
import { RxDragHandleDots2 } from "react-icons/rx";
import AddTaskAndEvents from "./AddTaskAndEvents";
import API, { action } from "../../Api";
import localStorageData from "../../common/Functions/localStorageKeyValues";
export default function Calender() {
  const [show, setShow] = useState(false);
  const [employeeId, setEmployeeId] = useState(localStorageData.employeeId);
  const getListData = (value) => {
    let listData;
    switch (value.date()) {
      case 8:
        listData = [
          {
            type: "warning",
            content: "This is warning event.",
          },
          {
            type: "success",
            content: "This is usual event.",
          },
        ];
        break;
      case 10:
        listData = [
          {
            type: "warning",
            content: " warning event.",
            style:
              " test-xs  border rounded-md text-primary  border-primary  bg-primaryLight",
          },
          {
            type: "success",
            content: "This is usual event.",
          },
          {
            type: "error",
            content: "This is error event.",
          },
        ];
        break;
      case 15:
        listData = [
          {
            type: "warning",
            content: "This is warning event",
          },
          {
            type: "success",
            content: "This is very long usual event......",
          },
          {
            type: "error",
            content: "This is error event 1.",
          },
          {
            type: "error",
            content: "This is error event 2.",
          },
          {
            type: "error",
            content: "This is error event 3.",
          },
          {
            type: "error",
            content: "This is error event 4.",
          },
        ];
        break;
      default:
    }
    return listData || [];
  };
  const getMonthData = (value) => {
    if (value.month() === 8) {
      return 1394;
    }
  };
  const monthCellRender = (value) => {
    const num = getMonthData(value);
    return num ? (
      <div
        className="notes-month"
        onClick={() => {
          console.log("jksdhnsjkdnhsjkdnh");
        }}
      >
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null;
  };
  const dateCellRender = (value) => {
    const listData = getListData(value);
    const day = value.day();
    if (day === 0 || day === 6) {
      return (
        <>
          {/* {value.date()} */}
          <ul className="">
            {listData.map((item) => (
              <li
                key={item.content}
                onClick={() => {
                  setShow(true);
                  console.log("kkkkkkkkkkkkkkkkkkkkk");
                }}
                className={`${item.style} test-xs flex items-center py-0.5`}
              >
                {/* <Badge status={item.type} text={item.content} /> */}
                <RxDragHandleDots2 />
                <p className=" text-[10px]">{item.content}</p>
              </li>
            ))}
          </ul>
        </>
      );
    }
  };
  // const dateCellRender = (value) => {
  //   const day = value.day();
  //   const listData = getListData(value);

  //   if (day === 0 || day === 6) {
  //     return (
  //       <div className="ant-calendar-date ant-calendar-date-full ant-calendar-date-saturday-sunday">
  //         {value.date()}
  //         <ul className="events">
  //           {listData.map((item) => (
  //             <li key={item.content}>
  //               <Badge status={item.type} text={item.content} />
  //             </li>
  //           ))}
  //         </ul>
  //       </div>
  //     );
  //   }
  //   return value.date();
  // };
  const cellRender = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    if (info.type === "month") return monthCellRender(current);
    return info.originNode;
  };
  const calendarDetails = async () => {
    const result = await action(API.GET_CALENDER_DEATILS, {
      employeeId: employeeId,
    });
    console.log(result);
  };
  useEffect(() => {
    calendarDetails();
  }, []);

  return (
    <div>
      <Calendar cellRender={cellRender} />;
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
