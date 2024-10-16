import React, { useEffect, useMemo, useState } from "react";
import { daysOfWeek, weekDays, weekOfMonth } from "../../../../data";
import dropimg from "../../../../../assets/images/drop.png";
import { PiDotsSixVerticalBold, PiDotsThree } from "react-icons/pi";
import ButtonDropdown from "../../../../common/ButtonDropdown";
import { useDispatch } from "react-redux";
import { calendarDetails } from "../../../../../Redux/slice";

export default function OffDaySetCalendar({ updateData }) {
  const dispatch = useDispatch();

  const [weekDaysData, setWeekDaysData] = useState(weekDays);

  useMemo(() => {
    if (updateData.length > 0) {
      setWeekDaysData(
        updateData?.map((day) => day.shiftId ? {
          ...day,
          shift: {
            title: day.title || null,
            color: day.color || null,
            value: day.shiftId || null,
          },
        } : day)
      );
      dispatch(
        calendarDetails(updateData?.map((each, i) => ({
          color: each.color,
          dayId: each.dayId,
          id: i + 1,
          shift: each.title,
          shiftId: each.value,
          week: each.week,
        }))))
    }
  }, [updateData]);


  return (
    <div className="dark:text-white">
      <div className=" overflow-auto borderb  rounded-[10px]">
        {/* <div className="flex  ">
          <h2 className=" px-[20px] py-[10px] text-sm font-medium mb-0">
            {t("Shift_Template")}
          </h2>
        </div> */}
        {/* <div className=" pl-[23px] flex justify-start items-center border-t-2"> */}
        <div className=" pl-8  grid grid-cols-7 justify-center items-center bg-[#F9FAFD] dark:bg-zinc-800">
          {daysOfWeek.map((day, i) => (
            <h3
              key={i}
              className="w-full text-sm font-medium h-10 mb-0 py-2 flex justify-center items-center"
            >
              {day}
            </h3>
          ))}
        </div>

        <div className=" flex">
          <div className=" grid grid-rows-4  ">
            {weekOfMonth?.map((week, i) => (
              <div
                key={i}
                className=" flex justify-start items-center w-8 h-[106px]  borderb   my-auto "
              >
                <div className="">
                  <h3 className="text_flex text-sm mb-0 p-1">{week.title}</h3>
                </div>
              </div>
            ))}
          </div>
          {/* <div className="flex flex-wrap w-full h-[106px]  " ref={drop}> */}
          <div className=" grid grid-cols-7 w-full  ">
            {weekDaysData?.map((day, i) => (
              // <div key={i} className=" w-[106px] h-[106px] ">
              <div key={i} className=" cursor-pointer">
                <div
                  style={{
                    flex: 1,
                    // border: "1px solid #eee",
                  }}
                  className=""
                >
                  <div
                    className={`borderb    h-[106px]   p-1 flex justify-center items-center`}
                  >
                    {day?.shift ? (
                      <div
                        className={`relative rounded-lg h-full w-full flex bg-[${day.shift?.color}] border overflow-hidden`}
                        style={{
                          // backgroundColor: data.color,
                          backgroundColor: `${day.shift?.color}15`,
                          color: day.shift?.color,
                          borderColor: `${day.shift?.color}30`,
                        }}
                        key={i}
                      >
                        {/* {console.log(data)} */}

                        <div
                          className="vhcenter py-3 border-r"
                          style={{
                            borderColor: `${day.shift?.color}30`,
                          }}
                        >
                          <PiDotsSixVerticalBold className="text-xl" />
                        </div>
                        <div className=" vhcenter p-3 overflow-hidden">
                          <p
                            className="  truncate text-sm font-medium"
                            title={day.shift?.title}
                          >
                            {day.shift?.title}
                          </p>
                        </div>

                        <ButtonDropdown
                          onSelect={(e) => {
                            setWeekDaysData((prevData) =>
                              prevData?.map((each) => {
                                if (
                                  day.value?.week === each.value?.week &&
                                  day.value?.dayId === each.value?.dayId
                                ) {
                                  delete each.shift;
                                }
                                return each;
                              })
                            );
                          }}
                          className={
                            "absolute top-1 right-1 p-0 bg-transparent w-fit h-fit"
                          }
                          BtnType="text"
                          items={[
                            {
                              key: "remove",
                              label: "Remove",
                            },
                            // {
                            //     key: "2",
                            //     label: "Edit",
                            // },
                          ]}
                          buttonName={
                            <PiDotsThree
                              className="text-xl"
                              style={{ color: `${day.shift?.color}` }}
                            />
                          }
                        />
                      </div>
                    ) : (
                      <div
                        className={`${" border-red-500"} border-dashed borderb rounded-md h-full w-full flex justify-center items-center`}
                        onClick={() => {
                          dispatch(
                            calendarDetails(
                              weekDaysData?.map((each) =>
                                day.value.week === each.value.week &&
                                day.value.dayId === each.value.dayId
                                  ? {
                                      color: "#667085",
                                      dayId: day.value.dayId,
                                      id: i + 1,
                                      shift: "Off Day",
                                      shiftId: "0",
                                      week: day.value.week,
                                      //   ...each,
                                      //   shift: {
                                      //     title: "Off Day",
                                      //     color: "#667085",
                                      //     value: "0",
                                      //   },
                                    }
                                  : {
                                      color: each.shift?.color,
                                      dayId: each.value.dayId,
                                      id: each.id,
                                      shift: each.shift?.title,
                                      shiftId: each.shift?.value,
                                      week: each.value.week,
                                    }
                              )
                            )
                          );

                          setWeekDaysData((prevData) =>
                            prevData?.map((each) =>
                              day.value.week === each.value.week &&
                              day.value.dayId === each.value.dayId
                                ? {
                                    ...each,
                                    shift: {
                                      title: "Off Day",
                                      color: "#667085",
                                      value: "0",
                                    },
                                  }
                                : each
                            )
                          );
                        }}
                      >
                        <div className=" text-center">
                          <div className="p-2 w-8  mx-auto rounded-full bg-[#E2E2E2]">
                            <img
                              src={dropimg}
                              alt=""
                              className="w-8  flex justify-center  "
                            />
                          </div>
                          {/* <h3 className="mb-0">{day}</h3> */}
                          <p className="mb-0 text-[10px] opacity-50 font-semibold">
                            Mark as Off Day
                          </p>
                          {/* {error && (
                                                    <p className="mb-0 text-[7px] opacity-50 font-semibold text-red-600 ">
                                                        {error}
                                                    </p>
                                                )} */}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
