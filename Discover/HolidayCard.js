import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PiCalendarBlank, PiConfetti } from "react-icons/pi";
import DragCard from "./DragCard";
import API, { action } from "../Api";
import { NoData } from "../common/SVGFiles";
import HolidayImg from "../../assets/images/discover/HolidayImg.png";


export default function HolidayCard({ employeeDeatils, holiday = [] }) {
  const { t } = useTranslation();

  const holidayData = [
    {
      id: 1,
      name: "Eid al-Ftr",
      date: "Apr 9",
      day: "Thursday",
    },
    {
      id: 2,
      name: "Independence Day",
      date: "Aug 15",
      day: "Tuesday",
    },
    {
      id: 3,
      name: "Christmas",
      date: "Sep 10",
      day: "Wedesday",
    },
  ];

  return (
    <DragCard
      // icon={<PiCalendarBlank size={18} />}
      imageIcon={HolidayImg}
      header={t("Upcoming Holidays")}
    >
      <div className="flex flex-col gap-2 overflow-auto h-56 max-h-56 2xl:max-h-56 ">
        {holiday.length > 0 ? (
          <>
            {holiday.map((data, i) => (
              <div className="flex flex-col gap-3" key={i}>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full  size-7 bg-primaryalpha/5 text-primary dark:text-white vhcenter">
                      <PiConfetti />
                    </div>
                    <div className="font-medium pblack">
                      {data.name?.charAt(0).toUpperCase() + data.name?.slice(1)}
                    </div>
                  </div>

                  <div className="flex text-[9px] 2xl:text-xs text-black text-opacity-50 font-medium dark:text-white pr-2">
                    <span>{data.date}</span>,{" "}
                    <span>
                      {data.day?.charAt(0).toUpperCase() + data.day?.slice(1)}
                    </span>
                  </div>
                </div>
                {i !== holiday.length - 1 && <div className="v-divider"></div>}
              </div>
            ))}
          </>
        ) : (
          <NoData />
        )}
      </div>
    </DragCard>
  );
}
