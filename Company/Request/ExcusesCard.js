import React, { useState } from "react";
import { PiClock, PiLineSegments } from "react-icons/pi";
import { RxDotFilled } from "react-icons/rx";
import { PiSignIn, PiSignOut } from "react-icons/pi";
import CheckBoxInput from "../../common/CheckBoxInput";
import Loader from "../../common/Loader";

export default function ExcusesCard({
  data,
  ButtonClick = () => {},
  selectCheckBoxChange = () => {},
  statusSelectedChange = () => {},
}) {
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const handleIndividualChange = (employeeId) => {
    const isSelected = selectedEmployees.includes(employeeId);
    if (isSelected) {
      setSelectedEmployees(selectedEmployees.filter((id) => id !== employeeId));
    } else {
      setSelectedEmployees([...selectedEmployees, employeeId]);
    }
  };

  return (
    <>
      {data?.employees.length > 0 ? (
        data?.employees?.map((each, index) => (
          <div
            className={` px-3.5 py-2.5 relative ${
              data?.employees.length > 0 && "borderb"
            } rounded-lg w-full bg-white dark:bg-[#131827] grid grid-cols-10 gap-4 items-center`}
            key={index}
          >
            <div className="flex flex-col gap-4 col-span-12 md:col-span-2">
              <div className="flex items-center gap-3">
                <div
                  className={`size-8 overflow-hidden rounded-full 2xl:size-10 shrink-0 bg-primaryalpha/10 vhcenter`}
                >
                  {each.profilePicture ? (
                    <img
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
                      each.employeeName?.slice(1)}
                  </p>
                  <p className="pblack !text-grey">
                    {"Emp Code : " + each.code}
                  </p>
                </div>
              </div>
              <p className="px-1.5 py-0.5 h-fit flex gap-0.5 items-center font-medium w-fit leading-[15px] bg-gray-100 text-[#344054] dark:bg-gray-600/30 dark:text-gray-300 rounded-full text-[10px] lg:text-[8px] 2xl:text-[10px]">
                <RxDotFilled size={14} />
                {each.shiftName ? each.shiftName : "General Shift Scheme"}
              </p>
            </div>
            <div className=" flex-col flex col-span-12 gap-3.5 md:col-span-8">
              <div className="flex flex-col lg:flex-row justify-between gap-[18px] col-span-10 sm:col-span-5 lg:col-span-3">
                <div className="flex items-center gap-2 xs:gap-[18px] flex-wrap">
                  <div className="flex items-center gap-1">
                    <PiSignIn size={16} className="text-grey" />
                    <p className="text-[10px] leading-[18px] 2xl:text-xs font-medium text-grey">
                      Check In
                    </p>
                    <p className="text-xs lg:text-[10px] 2xl:text-xs leading-[20px] font-semibold dark:text-white space-x-1 vhcenter gap-1">
                      {each.firstCheckInTime
                        ? each.firstCheckInTime
                        : "00h 00m"}
                    </p>
                  </div>
                  <div className="v-divider !h-2/3 hidden sm:block"></div>
                  <div className="flex items-center gap-1">
                    <PiSignOut size={16} className="text-grey" />
                    <p className="text-[10px] leading-[18px] 2xl:text-xs font-medium text-grey">
                      Check Out
                    </p>
                    <p className="text-xs lg:text-[10px] 2xl:text-xs leading-[20px] font-semibold dark:text-white space-x-1 vhcenter gap-1">
                      {each.lastCheckOutTime
                        ? each.lastCheckOutTime
                        : "00h 00m"}
                    </p>
                  </div>
                  <div className="v-divider !h-2/3 hidden sm:block"></div>
                  <div className="flex items-center gap-1">
                    <PiClock size={16} className="text-grey" />
                    <p className="text-[10px] leading-[18px] 2xl:text-xs font-medium text-grey">
                      Total Hours
                    </p>
                    <p className="text-xs lg:text-[10px] 2xl:text-xs  leading-[20px] font-semibold dark:text-white space-x-1 vhcenter gap-1">
                      {each.totalWorkHours ? each.totalWorkHours : "00h 00m"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="divider-h" />
              <div className="flex flex-wrap gap-4">
                {each.status.map((item, i) => (
                  <button
                    className={`borderb h-8 2xl:h-10 transition-all duration-300 min-w-[170px] xl:w-auto p-[3px] text-[10px] 2xl:text-sm rounded-md text-start leading-6 flex items-center font-semibold  bg-white dark:bg-dark gap-4`}
                    style={{
                      color: item.color,
                    }}
                    // onClick={() => {
                    //   ButtonClick(true, item, item.id);
                    // }}
                  >
                    <div
                      className="rounded px-2 py-1  h-full vhcenter"
                      style={{
                        backgroundColor: `${item.color}20`,
                      }}
                    >
                      <p className={`text-sm lg:text-xs 2xl:text-sm`}>
                        {item.deductionDetails}
                      </p>
                    </div>
                    <p>{item.timeDifference}</p>
                    <CheckBoxInput
                      value={item.statusSelected}
                      change={(e) => {
                        console.log("ppppppppppppppppppp");
                        ButtonClick(e, item, item.id);

                        statusSelectedChange(item.id, e === 1 ? true : false);
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="absolute right-3 top-3">
              <CheckBoxInput
                titleRight="Select"
                value={each.selected}
                change={(e) => {
                  console.log("dddddddddddddddddddddd");

                  selectCheckBoxChange(each.id, e === 1 ? true : false);
                }}
                // value={selectedEmployees.includes(each.employeeId)}
                // change={() => handleIndividualChange(each.employeeId)}
              />
            </div>
          </div>
        ))
      ) : (
        <Loader />
      )}
    </>
  );
}
