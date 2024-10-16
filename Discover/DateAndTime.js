import React from "react";
import useCurrentDateTime from "../common/CurrentDateTime";
import { PiCalendarBlank, PiClock } from "react-icons/pi";


const DateAndTime = () => {
  const { currentDate, currentTime } = useCurrentDateTime();


  return (
    <div className="flex items-center sm:flex-row flex-col gap-3 bg-white dark:bg-dark2 divide-y sm:divide-y-0  sm:divide-x dark:divide-x-0 group rounded-xl p-2.5 w-fit">
      <div className="grid items-center justify-between grid-cols-2 gap-3 divide-x dark:divide-x-0">
        <div className="flex items-center gap-1.5 col-span-1">
          <div className="text-sm rounded-full shrink-0 vhcenter size-8 bg-primaryalpha/5 dark:bg-dark3 text-primaryalpha dark:text-[#AEAEAE]">
            <PiCalendarBlank />
          </div>
          <div className="flex flex-col">
            <p className="text-xs font-semibold text-black/50 dark:text-darkText">
              Date
            </p>
            <p className="font-semibold pblack">{currentDate}</p>
          </div>
        </div>
        <div className="flex items-center w-36 gap-1.5 pl-3 col-span-1">
          <div className="text-sm rounded-full shrink-0 vhcenter size-8 bg-primaryalpha/5 dark:bg-dark3 text-primaryalpha dark:text-[#AEAEAE]">
            <PiClock />
          </div>
          <div className="flex flex-col">
            <p className="text-xs font-semibold text-black/50 dark:text-darkText">
              Time
            </p>
            <p className="font-semibold pblack">{currentTime}</p>
          </div>
        </div>
      </div>

      {/* <div className="w-full pt-3 pl-3 sm:pt-0 sm:w-auto vhcenter">
        <Dropdown
          options={items}
          className="w-full text-sm"
          icon="true"
          value="Customize Widgets"
        />
        <MultiSelectDropDown
          icon={<PiDiamondsFour />}
          className="2xl:h-10"
          options={options}
          onChange={handleDropdownChange}
        />
      </div>
      <div className="flex items-center justify-center w-8 h-8 text-lg transition-all duration-300 border rounded-full 2xl:w-16 2xl:h-16 border-secondaryWhite dark:border-secondaryDark dark:text-white">
        <PiDiamondsFour />
      </div>
      <div>
        <p className="text-xs font-semibold text-black 2xl:text-sm dark:text-white">
          Customize Widgets
        </p>
      </div> */}
    </div>
  );
};

export default DateAndTime;
