import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DragCard from "./DragCard";
import API, { action } from "../Api";
import { NoData } from "../common/SVGFiles";
import ShiftImg from "../../assets/images/discover/Ushift.png";
import {
  PiAirplaneTilt,
  PiMoon,
  PiSun,
  PiSunHorizon,
  PiTimer,
} from "react-icons/pi";
import { format, parse } from "date-fns";
import localStorageData from "../common/Functions/localStorageKeyValues";

export default function UpcomingShiftsCard({ employeeDetails, Shifts = [] }) {
  const { t } = useTranslation();
  const [employeeId, setEmployeeId] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [upcomingShifts, setUpcomingShifts] = useState([]);

  useEffect(() => {
    setEmployeeId(localStorageData.employeeId);
    setCompanyId(localStorageData.companyId);
  }, []);

  const getUpcomingShiftByEmployee = async () => {
    try {
      const result = await action(API.GET_UPCOMING_SHIFT_BY_EMPLOYEE, {
        employeeId: employeeId,
        companyId: companyId,
        todayDate: new Date(),
      });
      if (result.status === 200) {
        setUpcomingShifts(
          result?.result.map((each, i) => ({
            id: i,
            name: each.shift,
            date: each.date,
            shiftTime: each.shiftTime,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching upcoming shifts", error);
    }
  };

  useEffect(() => {
    if (employeeId && companyId) {
      getUpcomingShiftByEmployee();
    }
  }, [employeeId, companyId]);

  return (
    <DragCard imageIcon={ShiftImg} header={t("Upcoming Shifts")}>
      <div className="flex flex-col h-56 gap-2 overflow-auto max-h-56 2xl:max-h-56 ">
        {upcomingShifts.length > 0 ? (
          upcomingShifts.map((data, i) => {
            // Assuming the date format is 'Fri,2024-09-06'
            const parsedDate = parse(
              data.date.split(",")[1],
              "yyyy-MM-dd",
              new Date()
            );
            // Format the date to "Sep 01 - Wednesday"
            const formattedDate = format(parsedDate, "MMM dd - EEEE");

            return (
              <div className="pr-1.5" key={i}>
                <div className="flex items-center justify-between gap-2 p-1.5 dark:border dark:border-dark3 rounded-[9px] bg-[#F4F5F7] dark:bg-dark2Soft">
                  <div className="flex items-center gap-3">
                    <div className="rounded-mdx size-12 2xl:size-[52px] flex vhcenter bg-white overflow-hidden p-3.5 dark:bg-dark3">
                      {data.name === "Off Day" ? (
                        <PiAirplaneTilt
                          size={25}
                          className="text-grey dark:text-darkText"
                        />
                      ) : data.name === "Night" ? (
                        <PiMoon size={25} className="text-primaryalpha" />
                      ) : (
                        <PiSun size={25} className="text-primaryalpha" />
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-[9px] 2xl:text-xs text-grey dark:text-darkText font-medium">
                        {formattedDate}
                      </p>
                      <p className="font-semibold capitalize pblack">
                        {data.name}
                      </p>
                    </div>
                  </div>
                  <div className="">
                    {data.shiftTime ? (
                      <p className="flex items-center text-[9px] 2xl:text-xs text-grey dark:text-darkText font-medium">
                        <PiTimer className="pr-1" size={16} />
                        <span>{data.shiftTime}</span>
                      </p>
                    ) : (
                      <p className="pr-3 italic font-normal text-[9px] 2xl:text-xs text-grey dark:text-darkText">
                        Day Off
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <NoData />
        )}
      </div>
    </DragCard>
  );
}
