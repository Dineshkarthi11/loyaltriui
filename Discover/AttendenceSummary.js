import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import API, { action } from "../Api";
import DragCard from "./DragCard";
import { PiCalendarBlank } from "react-icons/pi";
import localStorageData from "../common/Functions/localStorageKeyValues";

export default function AttendenceSummary({ data }) {
  const { t } = useTranslation();
  const [employeeId, setEmployeeId] = useState(localStorageData.employeeId);
  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [AttendenceSummary, setAttendanceSummary] = useState();

  const getManagerAttendenceSummary = async () => {
    try {
      const result = await action(API.GET_MANAGER_ATTENDENCE_SUMMARY, {
        superiorEmployeeId: employeeId,
        companyId: companyId,
        summaryDate: "2024-05-03",
      });
      setAttendanceSummary(result.result);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getManagerAttendenceSummary();
  }, []);

  return (
    <DragCard
      icon={<PiCalendarBlank size={18} />}
      header={t("Attendence Summary")}
    >
      <div className="w-full  rounded-sm h-24 sm:w-full ">
        <div className="bg-white rounded-md borderb  p-4 flex dark:bg-black dark:text-white h-24">
          <div className="flex items-center w-1/5 sm:w-1/5">
            <div className="ml-4">
              <p className="para">{t("Present")}</p>
              <h1 className="h1 mt-4">
                <b>{AttendenceSummary?.present}</b>
              </h1>
            </div>
          </div>
          <div className="h-divider !border-gray-300 ml-12"></div>
          <div className="flex items-center w-1/5 sm:w-1/5">
            <div className="ml-4">
              <p className="para">{t("Leave")}</p>
              <h1 className="h1 mt-4">
                <b>{AttendenceSummary?.onLeave}</b>
              </h1>
            </div>
          </div>
          <div className="h-divider !border-gray-300 ml-12"></div>
          <div className="flex items-center w-1/5 sm:w-1/5">
            <div className="ml-4">
              <p className="para">{t("Absent")}</p>
              <h1 className="h1 mt-4">
                <b>{AttendenceSummary?.absent}</b>
              </h1>
            </div>
          </div>

          <div className="h-divider !border-gray-300 ml-12"></div>
          <div className="flex items-center w-1/5 sm:w-1/5">
            <div className="ml-4">
              <p className="para">{t("Employees")}</p>
              <h1 className="h1 mt-4">
                <b>{AttendenceSummary?.totalEmployees}</b>
              </h1>
            </div>
          </div>
        </div>
      </div>
    </DragCard>
  );
}
