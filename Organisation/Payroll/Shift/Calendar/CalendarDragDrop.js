import React, { useEffect, useState } from "react";
import DraggableItem from "./DraggableItem";
import Calendar from "./Calendar";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { HiPlus } from "react-icons/hi2";
import { useTranslation } from "react-i18next";

const CalendarDragDrop = ({
  shift = [],
  error = "",
  updateData = [],
  update = false,
  addShift = () => {},
}) => {
  const { t } = useTranslation();
  const [dragData, setDragData] = useState([]);

  // useEffect(() => {
  //   console.log(shift, "shift");
  // }, [shift]);

  // const [shiftsGenerate, setShiftsGenerate] = useState(name);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className=" py-[24px] dark:text-white">
        <p className=" text-sm 2xl:text-base font-semibold">
          {t("Calender_discription")}
        </p>
        <div className="flex flex-wrap justify-start gap-4 pt-[16px]">
          {shift && (
            <>
              {shift?.map((each, i) => (
                <DraggableItem
                  title={each.label}
                  color={each.color}
                  text={each.color}
                  shift={each.value}
                  key={i}
                />
              ))}
            </>
          )}
          <div
            className=" flex items-center cursor-pointer"
            onClick={() => {
              setDragData([
                ...dragData,
                {
                  title: "Off Day2",
                  color: "#F6F6F6",
                  text: "#626262",
                },
              ]);
              // shiftsGenerate.push({
              //   title: "Off Day2",
              //   color: "#F6F6F6",
              //   text: "#626262",
              // });
              // console.log(shiftsGenerate);
              addShift(true);
            }}
          >
            <HiPlus className=" bg-gray-100 dark:text-dark rounded-full p-1 text-2xl " />
            <p className="mb-0 pl-[8px] tex-[12px] font-semibold">
              {t("Calender_Add_Button")}
            </p>
          </div>
        </div>
      </div>
      <div className=" overflow-y-auto">
        <Calendar
          dropValue={shift}
          error={error}
          updateData={updateData}
          update={update}
        />
      </div>
    </DndProvider>
  );
};

export default CalendarDragDrop;
