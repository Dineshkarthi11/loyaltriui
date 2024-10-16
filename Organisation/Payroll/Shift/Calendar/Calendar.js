/* eslint-disable array-callback-return */
import React, { useEffect, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import dropimg from "../../../../../assets/images/drop.png";
import { PiDotsSixVerticalBold, PiDotsThree, PiTrash } from "react-icons/pi";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { useDispatch } from "react-redux";
import { calendarDetails } from "../../../../../Redux/slice";
import { useTranslation } from "react-i18next";
import ButtonDropdown from "../../../../common/ButtonDropdown";
import { daysOfWeek, weekDays, weekOfMonth } from "../../../../data";

const Calendar = ({
  dropValue,
  error = "",
  updateData = [],
  update = false,
}) => {
  const { t } = useTranslation();
  const [updateValue, setUpdateValue] = useState();
  const [calendarData, setCalendarData] = useState(
    Array.from({ length: 35 }, () => { })
  );
  const dispatch = useDispatch();

  const [, drop] = useDrop({
    accept: "DRAGGABLE_ITEM",
    // drop: (item) => {
    //   console.log(item, "item");
    // },
  });

  // useEffect(() => {
  //   console.log(calendarData, "calendarDatacalendarData");
  //   setUpdateValue({ ...updateData.tbl_shiftSchemeDetails });
  //   // dispatch(calendarDetails({ ...updateData.tbl_shiftSchemeDetails }));
  // }, [updateData]);

  const handleDrop = (data) => {
    const { id, value } = data;
    // console.log(data);

    setCalendarData((prevData) => {
      // console.log(prevData);
      const newData = [...prevData];
      newData[data.id] = { ...data };
      dispatch(calendarDetails(newData));

      return newData;
    });
  };

  // useEffect(() => {
  //   updateData?.filter((item) =>
  //     handleDrop({
  //       shift: item.title,
  //       shiftId: item.shiftId,
  //       week: item.value.week,
  //       dayId: item.value.dayId,
  //     })
  //   );
  //   // handleDrop(result);
  // }, [update]);

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
                  {/* {i === 0 && (
                    <FormInput
                      type="checkbox"
                      value="all"
                      change={(e) => {
                        setSelectAll(e);
                        console.log(e);
                      }}
                    />
                  )} */}
                  <h3 className="text_flex text-sm mb-0 p-1">{week.title}</h3>
                </div>
              </div>
            ))}
          </div>
          {/* <div className="flex flex-wrap w-full h-[106px]  " ref={drop}> */}
          <div className=" grid grid-cols-7 w-full  " ref={drop}>
            {/* {weekDays.map((day, i) => (
              // <div key={i} className=" w-[106px] h-[106px] ">
              <div key={i} className=" ">
                <Day
                  key={day.id}
                  day={day.value}
                  value={day.value}
                  dropValue={dropValue}
                  dropChange={(e) => {
                    // console.log([{ ...e }]);
                    handleDrop({ id: i, ...e }, i);
                    // handleDrop({ ...e }, i);
                  }}
                  error={error}
                  updateData={updateData}
                  updateValue={updateValue}
                  update={update}
                />
              </div>
            ))} */}

            {!update
              ? weekDays.map((day, i) => (
                // <div key={i} className=" w-[106px] h-[106px] ">
                <div key={i} className=" ">
                  <Day
                    key={day.id}
                    day={day.value}
                    value={day.value}
                    dropValue={dropValue}
                    dropChange={(e, isDrop) => {
                      if (isDrop) handleDrop({ id: i, ...e }, i);
                      handleDrop({ ...e }, i);
                    }}
                    error={error}
                    updateData={updateData}
                    updateValue={updateValue}
                    update={update}
                  />
                </div>
              ))
              : updateData.map((day, i) => (
                // <div key={i} className=" w-[106px] h-[106px] ">
                <div key={i} className=" ">
                  <Day
                    key={day.id}
                    day={day.value}
                    value={day.value}
                    dropValue={dropValue}
                    dropChange={(e, isdrop) => {
                      handleDrop({ id: i, ...e }, i);
                      if (isdrop === false) {
                        e.map((each, i) =>
                          handleDrop({
                            id: i,
                            shift: each.title,
                            shiftId: each.shiftId,
                            week: each.value?.week,
                            dayId: each.value?.dayId,
                            color: each.value?.color || null,
                          })
                        );
                      } else {
                        handleDrop({ id: i, ...e }, i);
                      }
                    }}
                    error={error}
                    updateData={updateData}
                    updateValue={updateValue}
                    update={update}
                    title={day.title}
                    data={day}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Day = ({
  day,
  className,
  dropValue = [],
  dropChange = () => { },
  error = "",
  updateData = [],
  update = false,
  updateValue = [],
  title = "",
  data = {},
}) => {
  const [dropdata, setDropdata] = useState();
  const [dropdataValue, setDropdataValue] = useState();
  const [droppedItems, setDroppedItems] = useState({});
  const [droppedDataColor, setDroppedDataColor] = useState();
  const [updatedData, setUpdatedData] = useState()

  const [{ isDragging }, drag] = useDrag({
    type: "DRAGGABLE_ITEM",
    item: dropdata ? dropdata[0] : data,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    // drag: (item) => {
    //   console.log(item);
    // },
  });

  useEffect(() => {
    if (update) setDropdataValue(day);

    dropChange(updateData, false);
  }, [update]);
  useEffect(() => {
    const colorData = dropdata?.map((each) => {
      return each.color;
    });
    setDroppedDataColor(colorData);
  }, [dropdata]);

  const [, drop] = useDrop({
    accept: "DRAGGABLE_ITEM",
    drop: (item) => {
      console.log("calendarDetails", item);

      dropValue?.map((each) => {
        if (each.label === item.title) {
          setDropdata([
            {
              title: item.title,
              color: each.color,
              value: day,
              shift: each.value,
            },
          ]);

          if (dropdata === undefined || dropdata?.title !== item.title) {
            dropChange(
              {
                shift: item.title,
                shiftId: item.shift,
                color: item.color,
                ...day,
              },
              true
            );
          }
        }
      });
      setDropdataValue(day);
    },
  });

  const items = [
    {
      key: "1",
      label: "Remove",
    },
    // {
    //   key: "2",
    //   label: "Edit",
    // },
  ];
  console.log(updatedData, "vllllll");

  return (
    <div
      style={{
        flex: 1,
        // border: "1px solid #eee",
      }}
      ref={drop}
      className=""
    >
      <div
        className={`borderb ${className} h-[106px] p-1 flex justify-center items-center`}
        style={{
          opacity: isDragging ? 0.5 : 1,
          cursor: "move",
          // padding: "8px",
          // border: "1px solid #000",
          // backgroundColor: "#eee",
          // marginBottom: "8px",
        }}
        ref={drag}
      >
        {dropdataValue !== day && !update ? (
          <div
            className={`${error ? " border-red-500" : ""
              } border-dashed borderb rounded-md h-full w-full flex justify-center items-center`}
          >
            <div className=" text-center">
              <div className="p-2 w-8  mx-auto rounded-full bg-[#E2E2E2]">
                <img
                  src={dropimg}
                  alt=""
                  className="w-8  flex justify-center"
                />
              </div>
              {/* <h3 className="mb-0">{day}</h3> */}
              <p className="mb-0 text-[10px] opacity-50 font-semibold">
                Drop here
              </p>
              {error && (
                <p className="mb-0 text-[7px] opacity-50 font-semibold text-red-600 ">
                  {error}
                </p>
              )}
            </div>
          </div>
        ) : dropdata ? (
          dropdata?.map((data) =>
            weekDays.map(
              (each, i) =>
                parseInt(each.value.dayId) === parseInt(data.value.dayId) &&
                parseInt(each.value.week) === parseInt(data.value.week) && (
                  <div
                    className={`relative rounded-lg h-full w-full flex bg-[${data?.color === droppedDataColor && droppedDataColor
                      }] border overflow-hidden`}
                    style={{
                      // backgroundColor: data.color,
                      backgroundColor: `${data.color}15`,
                      color: data.color,
                      borderColor: `${data.color}30`,
                    }}
                    key={i}
                  >
                    {/* {console.log(data)} */}

                    <div
                      className="vhcenter py-3 border-r"
                      style={{
                        borderColor: `${data.color}30`,
                      }}
                    >
                      <PiDotsSixVerticalBold className="text-xl" />
                    </div>
                    <div className=" vhcenter p-3 overflow-hidden">
                      <p
                        className="  truncate text-sm font-medium"
                        title={data.title}
                      >
                        {data.title}
                      </p>
                    </div>
                    <div className={
                      "absolute top-1 right-1 p-0 bg-transparent rounded-lg hover:bg-[#F4F4F4] w-fit h-fit"
                    }>
                      <PiTrash
                        onClick={(e) => {
                          const { week, dayId } = data;

                          // Reset dropdata when "Remove" is selected
                          setDropdata(null);

                          dropChange([], false); // Update the parent component with empty data to reflect removal

                          setDroppedItems((prevItems) => {
                            const updatedItems = { ...prevItems };
                            delete updatedItems[`${week}-${dayId}`];
                            return updatedItems;
                          });
                        }}
                        className="text-[20px] p-1 font-medium cursor-pointer opacity-70 dark:bg-dark"
                        style={{ color: `${data.color}` }}
                      />
                    </div>
                    {/* <ButtonDropdown
                      // onSelect={(e) => {
                      //   const { week, dayId } = data;

                      //   setDropdata((prevData) => {
                      //     const updatedData = prevData.map((item) => {
                      //       if (item === null) return item;

                      //       if (item?.week === week && item?.dayId === dayId) {
                      //         return {
                      //           ...item,
                      //           title: "",
                      //           color: "",
                      //           value: {
                      //             week: week,
                      //             dayId: dayId,
                      //           },
                      //           shift: "",
                      //         };
                      //       }
                      //       return item;
                      //     });
                      //     setUpdatedData(updatedData?.map((item) => item.title))
                      //     console.log(updatedData, "updated data");
                      //     return updatedData; // Return the updated array
                      //   });
                      //   // };
                      //   // onselect(data);
                      // }}
                      onSelect={(e) => {
                        const { week, dayId } = data;

                        // Reset dropdata when "Remove" is selected
                        setDropdata(null);

                        dropChange([], false); // Update the parent component with empty data to reflect removal

                        setDroppedItems((prevItems) => {
                          const updatedItems = { ...prevItems };
                          delete updatedItems[`${week}-${dayId}`];
                          return updatedItems;
                        });
                      }}
                      className={
                        "absolute top-1 right-1 p-0 bg-transparent w-fit h-fit"
                      }
                      BtnType="text"
                      items={items}
                      buttonName={
                        <PiTrash
                          onClick={(e) => {
                            const { week, dayId } = data;

                            // Reset dropdata when "Remove" is selected
                            setDropdata(null);

                            dropChange([], false); // Update the parent component with empty data to reflect removal

                            setDroppedItems((prevItems) => {
                              const updatedItems = { ...prevItems };
                              delete updatedItems[`${week}-${dayId}`];
                              return updatedItems;
                            });
                          }}
                          className="text-xl"
                          style={{ color: `${data.color}` }}
                        />
                      }
                    /> */}
                  </div>
                )
            )
          )
        ) : update ? (
          // updateData.map((data, i) => (
          <div
            className={`relative rounded-lg h-full w-full flex bg-[${"data?.color === droppedDataColor && droppedDataColor"}] border overflow-hidden`}
            style={{
              // backgroundColor: data.color,
              backgroundColor: `${data.color}15`,
              color: data.color,
              borderColor: `${data.color}30`,
            }}
            key={"i"}
          >
            {/* {console.log(data)} */}

            <div
              className="vhcenter py-3 border-r"
              style={{
                borderColor: `${data.color}30`,
              }}
            >
              <PiDotsSixVerticalBold className="text-xl" />
            </div>
            <div className=" vhcenter p-3 overflow-hidden">
              <p className="  truncate text-sm font-medium" title={data.title}>
                {data.title}
              </p>
            </div>
            <div className={
              "absolute top-1 right-1 p-0 bg-transparent rounded-lg hover:bg-[#F4F4F4] w-fit h-fit"
            }>
              <PiTrash
                
                className="text-[20px] p-1 font-medium cursor-pointer opacity-70 dark:bg-dark"
                style={{ color: `${data.color}` }}
              />
            </div>
            {/* <ButtonDropdown
              // onSelect={(e) => console.log(e)}
              className={
                "absolute top-1 right-1 p-0 bg-transparent w-fit h-fit"
              }
              BtnType="text"
              items={items}
              buttonName={
                <PiTrash
                  className="text-[20px] p-1 font-medium cursor-pointer opacity-70 dark:bg-dark"
                  style={{ color: `${data.color}` }}
                />
              }
            /> */}
          </div>
        ) : (
          // <div
          //   className={`relative rounded-md h-full w-full bg-[${
          //     ""
          //     // updateData[day.dayId]?.color === droppedDataColor && droppedDataColor
          //   }] border-l-[2.5px] border-l-[${
          //     // data?.color
          //     ""
          //   }] bg-opacity-10 flex pl-[10px] justify-start items-start pt-2 `}
          //   style={{
          //     // backgroundColor: data.color,
          //     // color: data.color,
          //     // borderColor: data.color,
          //     color: "#000",
          //     borderColor: "#000",
          //   }}
          // >
          //   {/* {console.log(data, "data")} */}
          //   <div className="">
          //     <PiDotsSixVerticalBold className="text-[15px] font-semibold" />
          //     <h3 className="mb-0 text-xs 2xl:text-[16px] font-medium px-1  ">
          //       {titile}
          //     </h3>
          //     <div className="p-1">
          //       <HiOutlineDotsVertical
          //         className={` absolute right-1 bottom-1  p-1 rounded-full text-white text-xl`}
          //         style={
          //           {
          //             // backgroundColor: data.color,
          //           }
          //         }
          //       />
          //     </div>
          //   </div>
          // </div>
          <div
            className={`${error ? " border-red-500" : ""
              } border-dashed borderb rounded-md h-full w-full flex justify-center items-center`}
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
                Drop here
              </p>
              {error && (
                <p className="mb-0 text-[7px] opacity-50 font-semibold text-red-600 ">
                  {error}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;
